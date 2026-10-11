"""Chibi low-poly characters on the Babylon_101 rig (art/source/babylon101_character.glb).

Run:  blender -b --python tools/blender/build_characters.py

Pipeline
  1. Import the source GLB, keep armature 'Root' + actions idle/run/jump, delete its mesh (and stray Icosphere).
  2. Scale the rig x0.5 (source ~3.7 u tall -> ~1.85 m), apply, and scale the only location channel (HipsCtrl) to match.
  3. Derive 'walk' from 'run': 1.45x slower, rotations/locations at 55% amplitude around a mean pose pulled 50% toward
     idle, hips re-grounded so the toes never dip below the idle contact height.
  4. Every character = rigid low-poly pieces, each bound 100% to one bone. Pieces are modelled in the *idle reference
     pose* (action idle, frame 1: standing, arms down) and moved into rest space with  rest_b @ pose_b^-1, so idle looks
     exactly as modelled. Hand props are pieces of the Hand bone; cart/dog are unskinned children of the armature.
  5. One GLB per character in public/assets/ (skin + animations idle/walk/run/jump), art/characters.blend,
     previews art/previews/characters.png (idle) and characters_run.png (run).

Orientation: the rig looks -Y in Blender (verified: left arm on +X, toes on -Y) = +Z in Babylon after the glTF
handedness conversion. Feet on z=0 in idle/walk/run, origin between the feet. No extra rotation needed in Babylon.

Source rig: github.com/Babylon-Projects/Babylon_101 branch 17_Rigged_Animations (no licence file found in that repo).
"""
import bpy, math, sys, json, struct, re
from pathlib import Path
from mathutils import Vector, Matrix, Quaternion, Euler
from mathutils.bvhtree import BVHTree

sys.path.insert(0, str(Path(__file__).resolve().parent))
from kit_common import ROOT, OUT, ART, PREVIEW  # paths only; character palette lives here

SRC = ROOT / 'art' / 'source' / 'babylon101_character.glb'
SCALE = .5
REF_FRAME = 1           # idle frame used as modelling pose
WALK_STRETCH, WALK_AMP = 1.45, .55

# ---------------------------------------------------------------- palette (sRGB hex -> linear) ---------------
HEX = {
    'skin_light': 'f3c9a6', 'skin_mid': 'dca078', 'skin_tan': 'b97a50', 'skin_dark': '7c4f32',
    'hair_brown': '5e3a20', 'hair_dark': '33221a', 'hair_black': '1b1614', 'hair_blond': 'd9ae5f',
    'hair_grey': 'b9b8b2', 'hair_white': 'e9e7e1', 'hair_red': '9a4420',
    'eye': '1e1a1a', 'white': 'f5f2ea', 'mouth': '7c2f2a', 'cream': 'efe2c4', 'paper': 'f7f2e2',
    'tint_party': '3fa65a',            # default party green; game recolours MAT_tint_party
    'denim': '41618c', 'denim_dark': '2d3f5f', 'khaki': 'b39a6c', 'brown': '6e4a2e', 'brown_dark': '4a3020',
    'grey_suit': '6c7079', 'grey': '8d9096', 'grey_light': 'c8c9cc', 'charcoal': '35373c', 'navy': '263252',
    'black': '1c1c1f', 'shoe_white': 'ece7dc', 'shoe_brown': '6b4428', 'shoe_black': '242426',
    'lola': 'c77657', 'dani': '789bad', 'nico': 'b8a45b', 'marisa': '8d779c',
    'red': 'c8322b', 'red_dark': '8a2420', 'yellow': 'f1c232', 'orange': 'e9822e', 'green': '2f7a46',
    'olive': '7d7a3e', 'teal': '2f8a8c', 'mustard': 'd9a53a', 'maroon': '7a2e3a', 'sky': '86b6dc', 'pink': 'e59aa5',
    'straw': 'e2c98a', 'metal': '9ea2aa', 'plastic': '2b2c30', 'screen': '8fd0e6', 'beige': 'd8c7a6',
}

# Party colours come from the game data (src/data/parties.js) so the 3D rivals match HUD, posters and portraits.
def party_colors(pid):
    src = (ROOT / 'src' / 'data' / 'parties.js').read_text(encoding='utf-8')
    block = src[src.index(f"id: '{pid}'"):]
    return [re.search(rf"{k}: '#([0-9a-fA-F]{{6}})'", block).group(1).lower() for k in ('color', 'color2')]
HEX['fox'], HEX['fox2'] = party_colors('fox')

def lin(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c)

_mats = {}
def mat(key):
    if key in _mats: return _mats[key]
    col = lin(HEX[key])
    m = bpy.data.materials.new(f'MAT_{key}')
    m.diffuse_color = (*col, 1)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*col, 1)
    b.inputs['Roughness'].default_value = .85
    b.inputs['Metallic'].default_value = 0
    _mats[key] = m
    return m

# ---------------------------------------------------------------- primitive geometry (local) ----------------
def g_rbox(cuts=1, rnd=.35):
    # The six face grids share their border vertices (welded by integer grid key) so the box is ONE closed
    # manifold. With six loose patches, recalc_face_normals guessed each patch's side on its own and flipped
    # some of them inward: invisible under backface culling (back of the head showed the face from inside).
    n = cuts + 1; V = []; F = []; idx = {}
    def vid(key):
        if key not in idx:
            idx[key] = len(V); V.append(Vector([-1 + 2 * k / n for k in key]))
        return idx[key]
    for axis in range(3):
        u, v = [(1, 2), (2, 0), (0, 1)][axis]
        for s in (-1, 1):
            G = {}
            for i in range(n + 1):
                for j in range(n + 1):
                    k = [0, 0, 0]; k[axis] = n if s > 0 else 0; k[u] = i; k[v] = j
                    G[i, j] = vid(tuple(k))
            for i in range(n):
                for j in range(n):
                    f = [G[i, j], G[i + 1, j], G[i + 1, j + 1], G[i, j + 1]]
                    F.append(f if s > 0 else f[::-1])
    V = [x.lerp(x.normalized(), rnd) * .5 for x in V]  # unit box (-.5..5) when rnd=0
    if rnd:  # renormalise so the box keeps its nominal extents
        m = [max(abs(x[k]) for x in V) for k in range(3)]
        V = [Vector((x.x / m[0] * .5, x.y / m[1] * .5, x.z / m[2] * .5)) for x in V]
    return V, F

def g_cyl(r0, r1, z0, z1, n=8):
    V = [Vector((r0 * math.cos(2 * math.pi * i / n), r0 * math.sin(2 * math.pi * i / n), z0)) for i in range(n)]
    V += [Vector((r1 * math.cos(2 * math.pi * i / n), r1 * math.sin(2 * math.pi * i / n), z1)) for i in range(n)]
    F = [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    F += [list(range(n))[::-1], list(range(n, 2 * n))]
    return V, F

def g_sph(seg=8, rings=5):
    V = [Vector((0, 0, -1))]
    for r in range(1, rings):
        th = -math.pi / 2 + math.pi * r / rings
        for s in range(seg):
            ph = 2 * math.pi * s / seg
            V.append(Vector((math.cos(th) * math.cos(ph), math.cos(th) * math.sin(ph), math.sin(th))))
    V.append(Vector((0, 0, 1))); top = len(V) - 1; F = []
    for s in range(seg): F.append([0, 1 + (s + 1) % seg, 1 + s])
    for r in range(rings - 2):
        a = 1 + r * seg; b = a + seg
        for s in range(seg):
            F.append([a + s, a + (s + 1) % seg, b + (s + 1) % seg, b + s])
    a = 1 + (rings - 2) * seg
    for s in range(seg): F.append([a + s, a + (s + 1) % seg, top])
    return V, F

def g_torus(R, r, maj=10, mn=4):
    V = []; F = []
    for i in range(maj):
        a = 2 * math.pi * i / maj
        for j in range(mn):
            b = 2 * math.pi * j / mn
            V.append(Vector(((R + r * math.cos(b)) * math.cos(a), (R + r * math.cos(b)) * math.sin(a), r * math.sin(b))))
    for i in range(maj):
        for j in range(mn):
            a = i * mn + j; b = ((i + 1) % maj) * mn + j; c = ((i + 1) % maj) * mn + (j + 1) % mn; d = i * mn + (j + 1) % mn
            F.append([a, b, c, d])
    return V, F

def g_prism(profile, depth):
    """XZ profile extruded along Y (centred)."""
    n = len(profile); d = depth / 2
    V = [Vector((x, -d, z)) for x, z in profile] + [Vector((x, d, z)) for x, z in profile]
    F = [list(range(n)), list(range(n, 2 * n))[::-1]] + [[i, n + i, n + (i + 1) % n, (i + 1) % n] for i in range(n)]
    return V, F

def TRS(loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
    S = Matrix.Diagonal((*scale, 1))
    R = Euler([math.radians(a) for a in rot]).to_matrix().to_4x4()
    return Matrix.Translation(loc) @ R @ S

# ---------------------------------------------------------------- rig template ------------------------------
class Rig:
    def __init__(self):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        sc = bpy.context.scene; sc.render.fps = 24
        bpy.ops.import_scene.gltf(filepath=str(SRC))
        arm = bpy.data.objects['Root']
        for o in list(bpy.data.objects):
            if o is not arm: bpy.data.objects.remove(o, do_unlink=True)
        for t in list(arm.animation_data.nla_tracks): arm.animation_data.nla_tracks.remove(t)
        # scale x0.5 and apply; only HipsCtrl has location keys -> scale them too
        bpy.context.view_layer.objects.active = arm; arm.select_set(True)
        arm.scale = (SCALE,) * 3
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        for a in bpy.data.actions:
            for fc in fcurves(a):
                if fc.data_path.endswith('location'):
                    for k in fc.keyframe_points:
                        for p in (k.co, k.handle_left, k.handle_right): p[1] *= SCALE
        self.arm = arm
        self.prune(arm)
        self.make_walk()
        for a in bpy.data.actions: a.use_fake_user = True
        self.set_action(arm, 'idle'); sc.frame_set(REF_FRAME)
        self.P = {pb.name: pb.matrix.copy() for pb in arm.pose.bones}
        self.T = {pb.name: pb.tail.copy() for pb in arm.pose.bones}
        self.R = {b.name: b.matrix_local.copy() for b in arm.data.bones}
        self.C = {n: self.R[n] @ self.P[n].inverted() for n in self.P}
        hips = self.P['Hips'].translation
        print(f'[rig] ref idle: Hips z={hips.z:.3f}, Head z={self.P["Head"].translation.z:.3f}')

    @staticmethod
    def prune(arm):
        """Drop IK/roll controls (no constraints survive the glTF import), fingers and *_end leaves: halves the GLB."""
        keep = lambda n: n == 'HipsCtrl' or not any(k in n for k in ('Ctrl', 'Roll', 'IK', 'Index', 'Thumb', '_end'))
        bpy.context.view_layer.objects.active = arm
        bpy.ops.object.mode_set(mode='EDIT')
        for eb in list(arm.data.edit_bones):
            if not keep(eb.name): arm.data.edit_bones.remove(eb)
        bpy.ops.object.mode_set(mode='OBJECT')
        for a in bpy.data.actions:
            for l in a.layers:
                for st in l.strips:
                    for cb in st.channelbags:
                        for fc in list(cb.fcurves):
                            if '"' in fc.data_path and not keep(fc.data_path.split('"')[1]): cb.fcurves.remove(fc)
        print('[rig] bones kept:', len(arm.data.bones))

    @staticmethod
    def set_action(arm, name):
        ad = arm.animation_data or arm.animation_data_create()
        a = bpy.data.actions[name]; ad.action = a
        if a.slots: ad.action_slot = a.slots[0]

    def head(self, b): return self.P[b].translation.copy()
    def tail(self, b): return self.T[b].copy()

    def make_walk(self):
        run, idle = bpy.data.actions['run'], bpy.data.actions['idle']
        walk = run.copy(); walk.name = 'walk'
        fr = {(fc.data_path, fc.array_index): fc for fc in fcurves(run)}
        fi = {(fc.data_path, fc.array_index): fc for fc in fcurves(idle)}
        r0, r1 = run.frame_range; K = 32
        times = [r0 + (r1 - r0) * j / K for j in range(K + 1)]
        w0 = r0; wspan = (r1 - r0) * WALK_STRETCH
        out = {}
        paths = {p for p, _ in fr}
        for p in paths:
            if p.endswith('rotation_quaternion'):
                qs = [Quaternion([fr[(p, i)].evaluate(t) for i in range(4)]) for t in times]
                for q in qs[1:]:
                    if q.dot(qs[0]) < 0: q.negate()
                mean = Quaternion((sum(q.w for q in qs), sum(q.x for q in qs), sum(q.y for q in qs), sum(q.z for q in qs))).normalized()
                qi = Quaternion([fi[(p, i)].evaluate(REF_FRAME) if (p, i) in fi else (1, 0, 0, 0)[i] for i in range(4)])
                if qi.dot(mean) < 0: qi.negate()
                base = mean.slerp(qi, .5)
                vals = []
                for q in qs:
                    dev = mean.inverted() @ q
                    vals.append(base @ Quaternion().slerp(dev, WALK_AMP))
                for i in range(4): out[(p, i)] = [v[i] for v in vals]
            elif p.endswith('location'):
                for i in range(3):
                    s = [fr[(p, i)].evaluate(t) for t in times]; m = sum(s) / len(s)
                    li = fi[(p, i)].evaluate(REF_FRAME) if (p, i) in fi else 0
                    out[(p, i)] = [(m + li) / 2 + (v - m) * WALK_AMP for v in s]
            else:
                for i in range(3):
                    if (p, i) in fr: out[(p, i)] = [fr[(p, i)].evaluate(t) for t in times]
        def write(o):
            for fc in fcurves(walk):
                key = (fc.data_path, fc.array_index)
                if key not in o: continue
                fc.keyframe_points.clear(); fc.keyframe_points.add(K + 1)
                for j, v in enumerate(o[key]):
                    k = fc.keyframe_points[j]; k.co = (w0 + wspan * j / K, v); k.interpolation = 'LINEAR'
                fc.update()
        write(out)
        # re-ground: lowest toe in walk == lowest toe in idle reference
        arm = self.arm; sc = bpy.context.scene
        def low(action, frames):
            self.set_action(arm, action); lo = 9
            for f in frames:
                sc.frame_set(int(f), subframe=f - int(f))
                for b in ('LeftToes', 'RightToes', 'LeftFoot', 'RightFoot'):
                    lo = min(lo, arm.pose.bones[b].head.z)
            return lo
        ref = low('idle', [REF_FRAME])
        wl = low('walk', [w0 + wspan * j / K for j in range(K + 1)])
        d = ref - wl
        R = arm.data.bones['HipsCtrl'].matrix_local.to_3x3().inverted() @ Vector((0, 0, d))
        p = 'pose.bones["HipsCtrl"].location'
        for i in range(3): out[(p, i)] = [v + R[i] for v in out[(p, i)]]
        write(out)
        print(f'[walk] {K + 1} keys over {wspan:.1f} frames ({wspan / 24:.2f} s), regrounded by {d:+.3f} m')

def fcurves(a):
    for l in a.layers:
        for s in l.strips:
            for cb in s.channelbags:
                yield from cb.fcurves

# ---------------------------------------------------------------- character builder -------------------------
BODY = {
    #      head centre             head size (W, D, H)   torso scale  hunch(deg)
    'A': dict(hc=(.02, .06, 1.53), hs=(.64, .56, .58), tw=1.0, td=1.0, hunch=0, belly=1.0),
    'S': dict(hc=(.02, .06, 1.53), hs=(.62, .55, .58), tw=.92, td=.95, hunch=0, belly=.95),   # slim adult
    'R': dict(hc=(.02, .05, 1.54), hs=(.66, .57, .58), tw=1.18, td=1.12, hunch=0, belly=1.35),  # robust
    'B': dict(hc=(.02, .01, 1.44), hs=(.58, .52, .54), tw=1.02, td=1.05, hunch=14, belly=1.1),  # elderly, shorter
}

class Char:
    def __init__(self, rig, name, body='A', skin='skin_light'):
        self.rig, self.name, self.b, self.skin = rig, name, BODY[body], skin
        self.body = body
        self.pieces = []   # (verts world-ref, faces, mat, bone or None)
        self.head_bvh = None

    # generic adders (geometry in world reference pose)
    def add(self, geo, M, m, bone):
        V, F = geo
        if M.to_3x3().determinant() < 0: F = [f[::-1] for f in F]   # mirrored transform: keep outward winding
        self.pieces.append(([M @ v for v in V], F, m, bone)); return self.pieces[-1]
    def rbox(self, size, loc, m, bone, rot=(0, 0, 0), rnd=.35, cuts=1):
        return self.add(g_rbox(cuts, rnd), TRS(loc, rot, size), m, bone)
    def box(self, size, loc, m, bone, rot=(0, 0, 0)):
        return self.rbox(size, loc, m, bone, rot, 0, 0)
    def cyl(self, r, h, loc, m, bone, rot=(0, 0, 0), r2=None, n=8, scale=(1, 1, 1)):
        return self.add(g_cyl(r, r if r2 is None else r2, -h / 2, h / 2, n), TRS(loc, rot, scale), m, bone)
    def sph(self, r, loc, m, bone, scale=(1, 1, 1), rot=(0, 0, 0), seg=8, rings=5):
        return self.add(g_sph(seg, rings), TRS(loc, rot, [r * s for s in scale]), m, bone)
    def torus(self, R, r, loc, m, bone, rot=(0, 0, 0), maj=10, mn=4):
        return self.add(g_torus(R, r, maj, mn), TRS(loc, rot), m, bone)
    def prism(self, prof, depth, loc, m, bone, rot=(0, 0, 0)):
        return self.add(g_prism(prof, depth), TRS(loc, rot), m, bone)
    def seg(self, bone, r0, r1, m, e0=.03, e1=.03, n=7, sx=1.0, a=None, b=None):
        """Tapered cylinder along a bone (ref pose) from head-e0 to tail+e1."""
        A = self.rig.head(bone) if a is None else Vector(a); B = self.rig.tail(bone) if b is None else Vector(b)
        d = (B - A); L = d.length; d.normalize()
        M = Matrix.Translation(A) @ d.to_track_quat('Z', 'Y').to_matrix().to_4x4() @ Matrix.Diagonal((sx, 1, 1, 1))
        return self.add(g_cyl(r0, r1, -e0, L + e1, n), M, m, bone)
    def joint(self, bone, r, m, at='head'):
        p = self.rig.head(bone) if at == 'head' else self.rig.tail(bone)
        return self.sph(r, p, m, bone, seg=7, rings=4)
    def onbone(self, bone, loc=(0, 0, 0), rot=(0, 0, 0)):
        """World-ref matrix of a frame expressed in the bone's posed local space (Y along the bone)."""
        return self.rig.P[bone] @ TRS(loc, rot)

    # ---------------- body
    def build_body(self, top='tee', top_col='white', sleeves='short', legs='trousers', leg_col='denim',
                   shoes='shoe_white', under=None, skirt_col=None):
        b, sk = self.b, self.skin
        tw, td = b['tw'], b['td']
        hunch = b['hunch']
        sleeve_col = top_col
        # pelvis / hips
        pel_col = skirt_col or leg_col
        self.rbox((.34 * tw, .25 * td, .2), (.01, .02, .65), pel_col, 'Hips', rnd=.4)
        # belly + chest
        self.rbox((.35 * tw, .26 * td * b['belly'], .24), (.015, .04 - .02 * (b['belly'] - 1), .82), top_col, 'Spine', rnd=.45)
        cz = 1.04; cy = .07 + (.03 if hunch else 0)
        self.rbox((.37 * tw, .27 * td, .33), (.02, cy, cz + .015), top_col, 'UpperChest', rot=(-hunch, 0, 0), rnd=.45)
        # neck
        self.seg('Neck', .08, .075, sk, e0=.0, e1=.02, n=7)
        # arms
        for s in ('Left', 'Right'):
            self.joint(f'{s}Arm', .07 * min(tw, 1.1), sleeve_col)
            fore_col = sleeve_col if sleeves == 'long' else sk
            if sleeves == 'short':
                ah, at = self.rig.head(f'{s}Arm'), self.rig.tail(f'{s}Arm')
                self.seg(f'{s}Arm', .07, .066, sleeve_col, e0=.02, e1=.0, a=ah, b=ah.lerp(at, .55))
                self.seg(f'{s}Arm', .052, .05, sk, e0=.0, e1=.03, a=ah.lerp(at, .5), b=at)
            else:
                self.seg(f'{s}Arm', .066, .056, sleeve_col, e0=.02, e1=.03)
            self.joint(f'{s}ForeArm', .053, fore_col)
            self.seg(f'{s}ForeArm', .052, .045, fore_col, e0=.0, e1=.0)
            if sleeves == 'long':
                self.seg(f'{s}ForeArm', .056, .056, fore_col, e0=-.17, e1=.0, n=7)  # cuff
            # mitten hand: in hand-bone space, Y along the bone (pointing down in idle)
            self.add(g_rbox(1, .5), self.onbone(f'{s}Hand', (0, .035, 0)) @ Matrix.Diagonal((.10, .12, .09, 1)), sk, f'{s}Hand')
            # legs
            thigh_col = leg_col if legs in ('trousers', 'shorts') else ('skin' if False else sk)
            shin_col = leg_col if legs == 'trousers' else sk
            if legs == 'tights': thigh_col = shin_col = leg_col
            self.seg(f'{s}UpLeg', .078, .07, thigh_col, e0=.05, e1=.02)
            self.joint(f'{s}Leg', .066, shin_col)
            self.seg(f'{s}Leg', .066, .056, shin_col, e0=.0, e1=.0)
            # shoe: from heel to toe tip on the ground, bound to Foot
            ank = self.rig.head(f'{s}Foot'); tip = self.rig.tail(f'{s}Toes')
            fwd = Vector((tip.x - ank.x, tip.y - ank.y, 0)); L = fwd.length + .07; fwd.normalize()
            ctr = Vector((ank.x, ank.y, 0)) + fwd * (L / 2 - .065)
            yaw = math.degrees(math.atan2(fwd.x, -fwd.y))
            self.rbox((.13, L, .11), (ctr.x, ctr.y, .055), shoes, f'{s}Foot', rot=(0, 0, yaw), rnd=.35)
            self.seg(f'{s}Leg', .05, .05, sk if legs != 'trousers' else leg_col, a=self.rig.tail(f'{s}Leg'), b=ank + Vector((0, 0, .05)), e0=.0, e1=.0, n=6)
        # skirt
        if legs == 'skirt':
            self.cyl(.175 * tw, .26, (.01, .03, .6), skirt_col, 'Hips', r2=.225 * tw, rot=(180, 0, 0), n=10, scale=(1, .85, 1))

    # ---------------- head + face
    def build_head(self, eyes='normal', brows=True, mouth='smile', blush=False):
        (cx, cy, cz), (W, D, H) = self.b['hc'], self.b['hs']
        p = self.rbox((W, D, H), (cx, cy, cz), self.skin, 'Head', rnd=.68, cuts=2)
        self.skull_idx = len(self.pieces) - 1
        self.head_bvh = BVHTree.FromPolygons(p[0], p[1])
        # ears
        for sx in (-1, 1):
            self.rbox((.06, .08, .11), (cx + sx * (W / 2 - .01), cy + .02, cz - .05), self.skin, 'Head', rnd=.5)
        # nose
        pt, n = self.face(cx, cz - .10)
        self.rbox((.07, .06, .06), pt + n * .015, self.skin, 'Head', rnd=.5)
        # eyes
        for sx in (-1, 1):
            pt, n = self.face(cx + sx * .12, cz - .035)
            q = self.face_rot(n)
            if eyes == 'closed':
                self.add(g_rbox(0, 0), Matrix.Translation(pt) @ q @ Matrix.Diagonal((.07, .02, .018, 1)), 'eye', 'Head')
            else:
                self.add(g_rbox(1, .45), Matrix.Translation(pt) @ q @ Matrix.Diagonal((.068, .03, .092, 1)), 'eye', 'Head')
                self.add(g_rbox(0, 0), Matrix.Translation(pt + n * .012 + Vector((.012 * -sx * 0 + .014, 0, .02))) @ q @ Matrix.Diagonal((.024, .012, .024, 1)), 'white', 'Head')
            if brows:
                pt, n = self.face(cx + sx * .125, cz + .055)
                self.add(g_rbox(0, 0), Matrix.Translation(pt) @ q @ TRS(rot=(0, sx * 8, 0)) @ Matrix.Diagonal((.10, .025, .022, 1)), self.hair_col, 'Head')
        # mouth
        if mouth:
            pt, n = self.face(cx, cz - .165)
            q = self.face_rot(n)
            if mouth == 'smile':
                for sx in (-1, 0, 1):
                    self.add(g_rbox(0, 0), Matrix.Translation(pt + Vector((sx * .03, 0, abs(sx) * .008))) @ q @ TRS(rot=(0, -sx * 18, 0)) @ Matrix.Diagonal((.035, .02, .016, 1)), 'mouth', 'Head')
            else:
                self.add(g_rbox(0, 0), Matrix.Translation(pt) @ q @ Matrix.Diagonal((.07, .02, .016, 1)), 'mouth', 'Head')
        if blush:
            for sx in (-1, 1):
                pt, n = self.face(cx + sx * .2, cz - .11)
                self.add(g_rbox(0, 0), Matrix.Translation(pt) @ self.face_rot(n) @ Matrix.Diagonal((.06, .012, .03, 1)), 'pink', 'Head')

    def face(self, x, z, y=None):
        """Point on the front of the head (ray toward +Y) and its normal."""
        cy = self.b['hc'][1]
        hit = self.head_bvh.ray_cast(Vector((x, cy - 2, z)), Vector((0, 1, 0)))
        if hit[0] is None: return Vector((x, cy - self.b['hs'][1] / 2, z)), Vector((0, -1, 0))
        return hit[0], hit[1]

    @staticmethod
    def face_rot(n):
        return n.to_track_quat('-Y', 'Z').to_matrix().to_4x4()

    # ---------------- hair styles
    # Hair and cap domes are homothetic copies of the skull (same g_rbox(2, .68), scaled about the head centre)
    # trimmed with planes. Scaling about an interior point keeps every skull point >= (S-1) x its distance to the
    # centre inside the shell, so no skull facet can poke through (it did with independent rounded boxes, reading
    # as skin 'eyes/nose' or a V on the back of the head). Everything is on the Head bone: poses can't change it.
    HAIR_S, HAT_S = 1.14, 1.18

    def shell(self, S, col, keep=(), check=None):
        """Skull scaled by S, keeping the half-spaces (point, normal) in `keep`; cut openings are capped (the caps
        lie inside the skull). `check` = half-spaces delimiting the skull region that must stay covered."""
        import bmesh
        (cx, cy, cz), (W, D, H) = self.b['hc'], self.b['hs']
        V, F = g_rbox(2, .68); M = TRS((cx, cy, cz), (0, 0, 0), (W * S, D * S, H * S))
        bm = bmesh.new(); bv = [bm.verts.new(M @ v) for v in V]
        for f in F: bm.faces.new([bv[i] for i in f])
        for co, no in keep:
            bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=Vector(co),
                                   plane_no=Vector(no), clear_inner=True)
            bmesh.ops.holes_fill(bm, edges=bm.edges[:], sides=0)
        bm.verts.index_update()
        V2 = [v.co.copy() for v in bm.verts]; F2 = [[v.index for v in f.verts] for f in bm.faces]
        if check is not None:   # minimum clearance between the covered skull region and the shell surface
            tree = BVHTree.FromBMesh(bm); sk = self.pieces[self.skull_idx][0]; m = 9
            for q in sk:
                if all((q - Vector(co)).dot(Vector(no)) >= 0 for co, no in check):
                    m = min(m, (tree.find_nearest(q)[0] - q).length)
            self.clearance = min(getattr(self, 'clearance', 9), m)
        bm.free()
        return self.add((V2, F2), Matrix.Identity(4), col, 'Head')

    def hair(self, style, col, hat=None):
        self.hair_col = col
        (cx, cy, cz), (W, D, H) = self.b['hc'], self.b['hs']
        S = self.HAIR_S; top = cz + H / 2
        sc = lambda x, y, z: (cx + (x - cx) * S, cy + (y - cy) * S, cz + (z - cz) * S)   # old offsets -> new shell
        ye = cy + .065          # back/side hair starts behind the ears
        nape = cz - .19         # bottom of the back hair: skin below reads as the nape
        cap_lo = cz + .085      # front hairline above the brows
        zhi = {'cap': cz + .08, 'cap_back': cz + .08, 'beret': cz + .19, 'sunhat': cz + .19}.get(hat)
        self.hair_zhi, self.hair_first = zhi, len(self.pieces)
        hz = lambda p, h: (p[0], p[1], min(p[2], zhi - h)) if zhi else p     # extras stay below the hat
        up, down, back = (0, 0, 1), (0, 0, -1), (0, 1, 0)
        lid = [((0, 0, zhi), down)] if zhi else []
        lidc = [((0, 0, zhi - .03), down)] if zhi else []     # clearance is checked away from the cut faces
        if style in ('short', 'spiky', 'ponytail', 'bun', 'curly', 'long', 'slick', 'bob'):
            # crown: everything above the front hairline
            self.shell(S, col, [((0, 0, cap_lo), up)] + lid, check=[((0, 0, cap_lo + .03), up)] + lidc)
            # back and sides behind the ears, down to the nape
            self.shell(S, col, [((0, ye, 0), back), ((0, 0, nape), up)] + lid,
                       check=[((0, ye + .03, 0), back), ((0, 0, nape + .03), up)] + lidc)
        if style == 'spiky' and not zhi:
            for x, y, rx, ry in ((-.16, -.18, -25, -15), (-.03, -.21, -30, 0), (.1, -.2, -28, 12), (.2, -.12, -15, 25), (0, -.05, -12, 0)):
                self.cyl(.075, .16, sc(cx + x, cy + y, top + .02), col, 'Head', r2=.005, rot=(rx, ry, 0), n=5)
        if style == 'slick':
            if not zhi: self.rbox((W * .9, .14, .07), sc(cx + .03, cy - D * .4, top - .02), col, 'Head', rot=(-20, 0, -6), rnd=.5)
        if style in ('short', 'curly', 'bun'):
            self.rbox((W * .7, .12, .08), hz(sc(cx - .06, cy - D * .44, cz + .135), .07), col, 'Head', rot=(-25, 0, 10), rnd=.5)
        if style == 'ponytail':
            self.rbox((W * .8, .12, .08), hz(sc(cx + .04, cy - D * .44, cz + .14), .07), col, 'Head', rot=(-25, 0, -8), rnd=.5)
            self.sph(.06, hz(sc(cx, cy + D / 2 + .03, cz + .12), .07), 'red', 'Head')
            self.sph(.13, hz(sc(cx, cy + D / 2 + .1, cz - .04), .2), col, 'Head', scale=(.7, .8, 1.5), rot=(20, 0, 0))
        if style == 'bun' and not zhi:
            self.sph(.14, sc(cx, cy + .14, top + .07), col, 'Head', scale=(1, 1, .85))
        if style == 'curly' and not zhi:
            for i in range(7):
                a = math.radians(-90 + i * 30)
                self.sph(.09, sc(cx + math.sin(a) * W * .45, cy + .05, top - .02 - abs(math.sin(a)) * .12), col, 'Head', seg=6, rings=4)
        if style in ('long', 'bob'):
            ln = 1.2 if style == 'long' else .75
            hw = W * S / 2 + .012; yb = cy + D * S / 2 + .02          # just outside the shell
            zt = cz + H * .5 + .05; zb = zt - H * ln                       # panel top/bottom
            zt2 = min(zt, zhi - .005) if zhi else zt                         # under a hat: stop below the brim/dome
            self.rbox((2 * hw, yb - (cy + .08), zt2 - zb), (cx, (yb + cy + .08) / 2, (zt2 + zb) / 2), col, 'Head', rnd=.45 if not zhi else .3, cuts=2)
            sb = cz + H * .5 - H * ln * .9
            st2 = min(cz + H * .5, zhi - .005) if zhi else cz + H * .5
            for sx in (-1, 1):
                self.rbox((.09, D * .75, st2 - sb), (cx + sx * (hw - .03), cy + .02, (st2 + sb) / 2), col, 'Head', rnd=.45 if not zhi else .3)
            self.rbox((W * .75, .12, .09), hz(sc(cx + .07, cy - D * .44, cz + .14), .07), col, 'Head', rot=(-25, 0, -12), rnd=.5)
        if style == 'bald':  # band of hair round the back, bald crown (skin above it is the intended crown)
            self.shell(S, col, [((0, ye, 0), back), ((0, 0, nape), up), ((0, 0, cz + .1), down)],
                       check=[((0, ye + .03, 0), back), ((0, 0, nape + .03), up), ((0, 0, cz + .07), down)])
        if style == 'under_hat':  # only nape and sides visible below the hat
            self.shell(S, col, [((0, ye, 0), back), ((0, 0, nape), up)] + (lid or [((0, 0, cz + .1), down)]),
                       check=[((0, ye + .03, 0), back), ((0, 0, nape + .03), up)] + (lidc or [((0, 0, cz + .07), down)]))

    # ---------------- headwear & face accessories
    def headwear(self, kind, col='red', col2=None):
        (cx, cy, cz), (W, D, H) = self.b['hc'], self.b['hs']
        top = cz + H / 2
        if kind in ('cap', 'cap_back'):
            S = self.HAT_S   # dome = skull scaled by S above the band (see shell())
            self.shell(S, col, [((0, 0, cz + .06), (0, 0, 1))], check=[((0, 0, cz + .09), (0, 0, 1))])
            self.box((W * S + .01, D * S + .01, .035), (cx, cy, cz + .075), col2 or col, 'Head')   # band
            sgn = -1 if kind == 'cap' else 1
            self.rbox((W * .8, .3, .035), (cx, cy + sgn * (D * S / 2 + .08), cz + .08), col, 'Head', rot=(sgn * -10, 0, 0), rnd=.35)
            self.sph(.03, (cx, cy, cz + H * S / 2 + .01), col2 or col, 'Head', seg=6, rings=3)
        elif kind == 'sunhat':   # crown = skull dome x1.2 (contains the x1.14 hair cut at cz+.19), brim, ribbon
            S = 1.2
            self.shell(S, col, [((0, 0, cz + .18), (0, 0, 1))], check=[((0, 0, cz + .21), (0, 0, 1))])
            self.cyl(W * .88, .025, (cx, cy, cz + .2), col, 'Head', n=14)
            self.shell(S + .025, col2 or 'red', [((0, 0, cz + .212), (0, 0, 1)), ((0, 0, cz + .25), (0, 0, -1))])
        elif kind == 'beret':    # dome x1.18 over the hair (cut at cz+.19) + a flat, tilted puff on top
            S = HAT = self.HAT_S
            self.shell(S, col, [((0, 0, cz + .17), (0, 0, 1))], check=[((0, 0, cz + .2), (0, 0, 1))])
            self.sph(W * .6, (cx - .03, cy, cz + H * S / 2 - .03), col, 'Head', scale=(1, 1, .22), rot=(0, -8, 0), seg=10, rings=5)
            self.cyl(.015, .05, (cx - .03, cy, cz + H * S / 2 + .05), col, 'Head', n=5)
        elif kind == 'headphones':
            R = W * self.HAIR_S / 2 + .04
            Rz = H * self.HAIR_S / 2 + .07
            for i in range(11):
                a = math.radians(-90 + i * 18)
                self.box((.1, .07, .04), (cx + math.sin(a) * R, cy + .03, cz + .0 + math.cos(a) * Rz), col, 'Head', rot=(0, math.degrees(a), 0))
            for sx in (-1, 1):
                self.cyl(.085, .07, (cx + sx * (W * self.HAIR_S / 2 + .015), cy + .03, cz - .03), col2 or 'plastic', 'Head', rot=(0, 90, 0), n=10)

    def glasses(self, col='plastic', sun=False):
        (cx, cy, cz), _ = self.b['hc'], self.b['hs']
        pts = []
        for sx in (-1, 1):
            pt, n = self.face(cx + sx * .12, cz - .035)
            q = self.face_rot(n); pts.append(pt)
            if sun:
                self.add(g_rbox(1, .3), Matrix.Translation(pt + n * .03) @ q @ Matrix.Diagonal((.15, .025, .1, 1)), 'black', 'Head')
            else:
                self.add(g_torus(.068, .013, 10, 3), Matrix.Translation(pt + n * .032) @ q @ TRS(rot=(90, 0, 0)), col, 'Head')
            # temple arm toward the ear
            self.box((.016, .2, .016), (cx + sx * (self.b['hs'][0] / 2 - .015), pt.y + .1, pt.z + .01), col if not sun else 'black', 'Head')
        mid = (pts[0] + pts[1]) / 2
        self.box((.08, .02, .018), (mid.x, mid.y - .035, mid.z + .015), col if not sun else 'black', 'Head')

    def facial_hair(self, kind, col):
        (cx, cy, cz), (W, D, H) = self.b['hc'], self.b['hs']
        if kind in ('mustache', 'beard'):
            pt, n = self.face(cx, cz - .135)
            q = self.face_rot(n)
            for sx in (-1, 1):
                self.add(g_rbox(1, .5), Matrix.Translation(pt + n * .02 + Vector((sx * .05, 0, 0))) @ q @ TRS(rot=(0, sx * 14, 0)) @ Matrix.Diagonal((.12, .05, .06, 1)), col, 'Head')
        if kind == 'beard':
            pt, n = self.face(cx, cz - .22)
            self.rbox((W * .74, .16, .16), (cx, pt.y + .04, cz - .225), col, 'Head', rnd=.6)
            for sx in (-1, 1):
                self.rbox((.08, D * .45, .22), (cx + sx * (W / 2 - .02), cy - .06, cz - .14), col, 'Head', rnd=.5)

    # ---------------- outfit details (front of torso is -Y)
    def front_y(self, z):
        return {'chest': .07 - .27 * self.b['td'] / 2, 'belly': .04 - .26 * self.b['td'] * self.b['belly'] / 2}[z]

    def garment(self, kind, col, col2=None):
        tw, td = self.b['tw'], self.b['td']
        fc, fb = self.front_y('chest'), self.front_y('belly')
        hunch = self.b['hunch']; cy = .07 + (.03 if hunch else 0)
        if kind == 'collar':
            for sx in (-1, 1):
                self.prism([(0, 0), (sx * .09, .0), (sx * .02, -.07)], .02, (.02 + sx * .015, fc + .005, 1.18), col, 'UpperChest')
        if kind == 'badge':
            self.box((.08, .015, .07), (.08, fc - .002, 1.06), col, 'UpperChest')
        if kind == 'vest':
            self.rbox((.40 * tw, .30 * td, .31), (.02, cy, 1.04), col, 'UpperChest', rot=(-hunch, 0, 0), rnd=.45)
            self.rbox((.38 * tw, .29 * td, .2), (.015, .04, .84), col, 'Spine', rnd=.45)
            self.box((.08, .02, .5), (.02, fc - .012, .95), col2 or 'white', 'UpperChest')
            for z in (.86, 1.02):
                self.box((.39 * tw, .31 * td, .03), (.02, cy if z > .95 else .04, z), 'grey_light', 'UpperChest' if z > .95 else 'Spine')
        if kind == 'cardigan':
            self.box((.07, .02, .42), (.02, fc - .005, .98), col2 or 'cream', 'UpperChest')
            for z in (.88, .98, 1.08):
                self.sph(.016, (.06, fc - .02, z), 'white', 'UpperChest', seg=5, rings=3)
        if kind == 'apron':
            self.box((.28, .02, .2), (.02, fc - .012, 1.04), col, 'UpperChest')
            self.box((.36 * tw, .02, .26), (.015, fb - .02 * self.b['belly'], .82), col, 'Spine')
            fp = .02 - .25 * td / 2 - .015
            self.box((.38 * tw, .02, .3), (.01, fp, .57), col, 'Hips')
            self.box((.36 * tw, .025, .02), (.01, fp - .005, .69), 'white', 'Hips')
            self.box((.12, .02, .07), (.08, fp - .01, .54), col2 or 'green', 'Hips')
        if kind in ('suit', 'blazer'):
            # shirt V and lapels over the chest; jacket hem over the hips
            self.prism([(-.075, .1), (.075, .1), (0, -.13)], .02, (.02, fc - .01, 1.08), col2 or 'white', 'UpperChest')
            for sx in (-1, 1):
                self.prism([(0, .12), (sx * .06, .12), (sx * .02, -.16)], .02, (.02 + sx * .06, fc - .018, 1.06), col, 'UpperChest')
            self.rbox((.37 * tw, .28 * td, .14), (.015, .03, .69), col, 'Hips', rnd=.4)
            self.sph(.016, (.03, fb - .01, .8), 'plastic', 'Spine', seg=5, rings=3)
        if kind == 'tie':
            self.box((.05, .02, .19), (.02, fc - .022, 1.0), col, 'UpperChest')
            self.box((.06, .025, .045), (.02, fc - .022, 1.12), col, 'UpperChest')
        if kind == 'hoodie':
            self.rbox((.34, .14, .16), (.02, cy + .17, 1.17), col, 'UpperChest', rnd=.5)
            self.box((.24 * tw, .025, .1), (.015, fb - .005, .78), col2 or col, 'Spine')
            for sx in (-1, 1):
                self.box((.015, .015, .15), (.02 + sx * .05, fc - .015, 1.08), 'white', 'UpperChest')
        if kind == 'backpack':
            big = col2 == 'big'
            sz = (.38, .32, .42) if big else (.3, .16, .32)
            self.rbox(sz, (.02, cy + .135 * td + sz[1] / 2, 1.0), col, 'UpperChest', rnd=.25 if big else .45)
            if big:
                self.box((.39, .33, .03), (.02, cy + .135 * td + sz[1] / 2, 1.1), 'red', 'UpperChest')
            for sx in (-1, 1):
                self.box((.04, .29 * td, .05), (.02 + sx * .1, cy, 1.17), 'plastic', 'UpperChest')
                self.box((.04, .02, .22), (.02 + sx * .1, fc - .008, 1.05), 'plastic', 'UpperChest')
        if kind == 'wristbands':
            # two-colour bracelet on each wrist (col / col2 / col), just above the mitten
            for s in ('Left', 'Right'):
                h, t = self.rig.head(f'{s}ForeArm'), self.rig.tail(f'{s}ForeArm')
                for i, c in enumerate((col, col2 or col, col)):
                    self.seg(f'{s}ForeArm', .064, .064, c, e0=.0, e1=.0, a=t.lerp(h, .2 - i * .035), b=t.lerp(h, .165 - i * .035), n=8)
        if kind == 'boots':
            # riding boots: tall shaft over the shin with a turned-down cuff (the shoe itself comes from `shoes`)
            for s in ('Left', 'Right'):
                kn, an = self.rig.head(f'{s}Leg'), self.rig.head(f'{s}Foot')
                self.seg(f'{s}Leg', .074, .066, col, e0=.0, e1=.0, a=kn.lerp(an, .12), b=an + Vector((0, 0, .04)), n=8)
                self.seg(f'{s}Leg', .082, .08, col2 or col, e0=.0, e1=.0, a=kn.lerp(an, .08), b=kn.lerp(an, .2), n=8)
        if kind == 'lanyard':
            for sx in (-1, 1):
                self.box((.02, .02, .2), (.02 + sx * .05, fc - .008, 1.08), col, 'UpperChest', rot=(0, sx * 15, 0))
            self.box((.08, .015, .1), (.02, fc - .015, .95), 'white', 'UpperChest')
            self.box((.06, .016, .02), (.02, fc - .017, .98), col, 'UpperChest')

    # ---------------- props
    def hand_ctr(self, side):
        return self.onbone(f'{side}Hand', (0, .04, 0)).translation

    def prop(self, kind, side='Right'):
        h = self.hand_ctr(side); bone = f'{side}Hand'; sx = 1 if side == 'Left' else -1
        if kind == 'phone':
            self.box((.075, .02, .14), h + Vector((0, -.07, .03)), 'plastic', bone, rot=(-15, 0, 0))
            self.box((.062, .01, .115), h + Vector((0, -.083, .03)), 'screen', bone, rot=(-15, 0, 0))
        if kind == 'calculator':
            c = h + Vector((0, -.08, .03))
            self.box((.11, .03, .15), c, 'cream', bone, rot=(-15, 0, 0))
            self.box((.08, .01, .035), c + Vector((0, -.017, .04)), 'screen', bone, rot=(-15, 0, 0))
            for i in range(3):
                for j in range(2):
                    self.box((.02, .01, .015), c + Vector((-.025 + i * .025, -.016, -.005 - j * .03)), 'plastic', bone, rot=(-15, 0, 0))
        if kind == 'megaphone':
            c = h + Vector((0, -.06, .07))
            self.cyl(.04, .25, c + Vector((0, -.1, 0)), 'white', bone, r2=.11, rot=(90, 0, 0), n=10)
            self.cyl(.112, .03, c + Vector((0, -.235, 0)), 'red', bone, rot=(90, 0, 0), n=10)
            self.box((.035, .05, .11), c + Vector((0, 0, -.06)), 'plastic', bone)
        if kind == 'mic':
            c = h + Vector((0, -.05, .05))
            self.cyl(.022, .17, c + Vector((0, 0, .03)), 'plastic', bone, n=6)
            self.sph(.048, c + Vector((0, 0, .14)), 'metal', bone, seg=7, rings=4)
            self.box((.06, .06, .04), c + Vector((0, 0, .08)), 'red', bone)
        if kind == 'cards':
            self.box((.1, .02, .14), h + Vector((0, -.06, .02)), 'paper', bone, rot=(-20, 0, 0))
        if kind == 'notebook':
            self.box((.12, .025, .16), h + Vector((0, -.06, .03)), 'paper', bone, rot=(-20, 0, 0))
            self.box((.125, .02, .02), h + Vector((0, -.06, .1)), 'red', bone, rot=(-20, 0, 0))
        if kind == 'bag':   # handbag hanging from the forearm
            fa = f'{side}ForeArm'; e = self.rig.tail(fa).lerp(self.rig.head(fa), .3)
            self.torus(.06, .012, e + Vector((sx * .02, 0, -.0)), 'brown_dark', fa, rot=(0, 90, 0), maj=8, mn=3)
            self.rbox((.08, .22, .17), e + Vector((sx * .07, 0, -.12)), 'brown', fa, rnd=.3)
            self.box((.085, .1, .02), e + Vector((sx * .07, 0, -.06)), 'brown_dark', fa)
        if kind == 'tvcamera':   # on the right shoulder, outside the head
            c = Vector((-.43, -.02, 1.22))
            self.rbox((.17, .4, .2), c, 'plastic', 'UpperChest', rnd=.2)
            self.cyl(.07, .14, c + Vector((0, -.26, 0)), 'charcoal', 'UpperChest', rot=(90, 0, 0), n=10)
            self.cyl(.06, .02, c + Vector((0, -.335, 0)), 'screen', 'UpperChest', rot=(90, 0, 0), n=10)
            self.box((.05, .22, .05), c + Vector((0, -.03, .13)), 'charcoal', 'UpperChest')
            self.box((.03, .08, .06), c + Vector((.1, .12, .03)), 'charcoal', 'UpperChest')
            self.box((.12, .25, .04), c + Vector((.1, 0, -.11)), 'plastic', 'UpperChest')  # shoulder pad
            # right forearm raised? (animation keeps it down) -> grip strap reaching to the hand side
        if kind == 'cart':   # static, unskinned
            base = Vector((-.42, -.18, 0))
            for x in (-.1, .1):
                for y in (-.08, .08):
                    self.cyl(.045, .03, base + Vector((x, y, .045)), 'plastic', None, rot=(0, 90, 0), n=8)
            self.rbox((.26, .22, .4), base + Vector((0, 0, .32)), 'navy', None, rnd=.25)
            self.box((.27, .23, .04), base + Vector((0, 0, .53)), 'red', None)
            self.box((.02, .02, .55), base + Vector((0, .13, .45)), 'metal', None, rot=(-12, 0, 0))
            self.cyl(.018, .2, base + Vector((0, .19, .72)), 'plastic', None, rot=(0, 90, 0), n=6)
        if kind == 'dog':    # small white dog, static, unskinned
            d = Vector((.45, -.12, 0))
            self.rbox((.16, .3, .16), d + Vector((0, 0, .2)), 'white', None, rnd=.6)
            self.rbox((.17, .16, .15), d + Vector((0, -.18, .32)), 'white', None, rnd=.6)
            self.rbox((.07, .07, .05), d + Vector((0, -.27, .3)), 'white', None, rnd=.5)
            self.sph(.018, d + Vector((0, -.305, .31)), 'eye', None, seg=5, rings=3)
            for sx in (-1, 1):
                self.rbox((.05, .03, .08), d + Vector((sx * .07, -.16, .38)), 'beige', None, rot=(0, sx * 25, 0), rnd=.5)
                self.box((.02, .01, .02), d + Vector((sx * .04, -.258, .345)), 'eye', None)
                for y in (-.09, .09):
                    self.cyl(.03, .12, d + Vector((sx * .05, y, .06)), 'white', None, n=6)
            self.cyl(.02, .12, d + Vector((0, .17, .29)), 'white', None, rot=(-40, 0, 0), n=5)
            self.box((.18, .02, .03), d + Vector((0, -.12, .26)), 'red', None, rot=(0, 0, 0))

    # ---------------- assemble into a skinned object under a copy of the rig
    def finish(self, collection):
        arm = self.rig.arm.copy(); arm.data = self.rig.arm.data.copy(); arm.name = self.name; arm.data.name = self.name + '_rig'
        collection.objects.link(arm)
        Rig.set_action(arm, 'idle')
        mats = []; V = []; F = []; FM = []; groups = {}
        sV = []; sF = []; sFM = []; smats = []
        for verts, faces, m, bone in self.pieces:
            if bone is None:
                base = len(sV); sV += verts; sF += [[base + i for i in f] for f in faces]
                if m not in smats: smats.append(m)
                sFM += [smats.index(m)] * len(faces); continue
            C = self.rig.C[bone]
            if C.to_3x3().determinant() < 0: faces = [f[::-1] for f in faces]
            base = len(V); V += [C @ v for v in verts]
            F += [[base + i for i in f] for f in faces]
            if m not in mats: mats.append(m)
            FM += [mats.index(m)] * len(faces)
            groups.setdefault(bone, []).extend(range(base, base + len(verts)))
        me = bpy.data.meshes.new(self.name + '_body'); me.from_pydata(V, [], F); me.validate()
        for m in mats: me.materials.append(mat(m))
        for p, mi in zip(me.polygons, FM): p.material_index = mi
        ob = bpy.data.objects.new(self.name + '_body', me); collection.objects.link(ob)
        recalc_normals(ob)
        for bone, idx in groups.items():
            vg = ob.vertex_groups.new(name=bone); vg.add(idx, 1.0, 'REPLACE')
        ob.parent = arm
        mod = ob.modifiers.new('Armature', 'ARMATURE'); mod.object = arm
        self.arm, self.mesh, self.static = arm, ob, None
        if sV:
            sm = bpy.data.meshes.new(self.name + '_props'); sm.from_pydata(sV, [], sF); sm.validate()
            for m in smats: sm.materials.append(mat(m))
            for p, mi in zip(sm.polygons, sFM): p.material_index = mi
            so = bpy.data.objects.new(self.name + '_props', sm); collection.objects.link(so); so.parent = arm
            recalc_normals(so); self.static = so
        return arm

    def tris(self):
        return sum(len(p.vertices) - 2 for o in (self.mesh, self.static) if o for p in o.data.polygons)

def recalc_normals(ob):
    """Make every piece face outward and check it: each loose part must be closed with positive signed volume
    (the game renders with backface culling, so an open or inverted part shows the inside of the model)."""
    import bmesh
    bm = bmesh.new(); bm.from_mesh(ob.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.faces.ensure_lookup_table()
    seen = set(); open_parts = inverted = 0
    for f0 in bm.faces:
        if f0.index in seen: continue
        part, stack = [], [f0]; seen.add(f0.index)
        while stack:
            f = stack.pop(); part.append(f)
            for e in f.edges:
                for g in e.link_faces:
                    if g.index not in seen: seen.add(g.index); stack.append(g)
        if any(not e.is_manifold for f in part for e in f.edges): open_parts += 1; continue
        vol = 0.0
        for f in part:
            vs = [v.co for v in f.verts]
            for i in range(1, len(vs) - 1): vol += vs[0].dot(vs[i].cross(vs[i + 1]))
        if vol < 0:
            inverted += 1
            for f in part: f.normal_flip()
    bm.to_mesh(ob.data); bm.free()
    for p in ob.data.polygons: p.use_smooth = False
    if open_parts or inverted: print(f'[normals] {ob.name}: open parts={open_parts}, inverted parts fixed={inverted}')

# ---------------------------------------------------------------- character specs ---------------------------
def make(rig, name, body='A', skin='skin_light', hair=('short', 'hair_brown'), top='tee', top_col='white',
         sleeves='short', legs='trousers', leg_col='denim', shoes='shoe_white', skirt_col=None,
         hat=None, glasses=None, facial=None, garments=(), props=(), mouth='smile', blush=False):
    c = Char(rig, name, body, skin)
    c.build_body(top, top_col, sleeves, legs, leg_col, shoes, skirt_col=skirt_col)
    c.hair_col = hair[1]
    c.build_head(mouth=None if facial == 'beard' else mouth, blush=blush)
    c.hair(hair[0], hair[1], hat[0] if hat else None)
    c.hair_last = len(c.pieces)
    if hat: c.headwear(*hat)
    if glasses: c.glasses(*glasses) if isinstance(glasses, tuple) else c.glasses(glasses)
    if facial: c.facial_hair(facial, hair[1] if len(hair) < 3 else hair[2])
    for g in garments: c.garment(*g)
    for p in props: c.prop(*p) if isinstance(p, tuple) else c.prop(p)
    over = 0
    if getattr(c, 'hair_zhi', None):
        hp = c.pieces[c.hair_first:c.hair_last]
        over = sum(1 for V, F, m, b in hp for v in V if v.z > c.hair_zhi + 1e-4)
    print(f'[hair] {name}: min skull clearance under hair/hat {getattr(c, "clearance", 9):.3f} m, hair verts above hat cut: {over}')
    return c

CAST = [
    dict(name='char_protagonist_01', hair=('spiky', 'hair_brown'), top_col='tint_party', leg_col='denim',
         garments=[('badge', 'white')]),
    dict(name='char_lola_01', body='S', hair=('ponytail', 'hair_dark'), top_col='lola', sleeves='long',
         leg_col='denim_dark', glasses='red_dark', garments=[('collar', 'white')], props=[('calculator', 'Left')], blush=True),
    dict(name='char_dani_01', skin='skin_mid', hair=('curly', 'hair_black'), top_col='red', sleeves='long', leg_col='denim',
         hat=('headphones', 'dani', 'plastic'), garments=[('hoodie', 'red', 'red_dark')], props=[('phone', 'Right')]),
    dict(name='char_nico_01', skin='skin_mid', hair=('under_hat', 'hair_dark'), top_col='white', leg_col='denim',
         hat=('cap', 'charcoal', 'nico'), garments=[('vest', 'nico', 'white')], props=[('megaphone', 'Right')], shoes='shoe_brown'),
    dict(name='char_marisa_01', body='B', hair=('bun', 'hair_grey'), top_col='marisa', sleeves='long', legs='skirt',
         leg_col='skin_light', skirt_col='maroon', shoes='shoe_brown', glasses='plastic',
         garments=[('cardigan', 'marisa', 'cream')], props=[('bag', 'Left')], blush=True),
    dict(name='char_paco_01', body='R', skin='skin_tan', hair=('bald', 'hair_dark'), top_col='white', leg_col='charcoal',
         shoes='shoe_black', facial='mustache', garments=[('apron', 'green', 'white')]),
    dict(name='char_neighbor_01', body='B', skin='skin_light', hair=('bald', 'hair_white'), top_col='khaki', sleeves='long',
         leg_col='brown', shoes='shoe_brown', glasses='plastic', facial='mustache', garments=[('collar', 'white')]),
    dict(name='char_neighbor_02', body='S', skin='skin_mid', hair=('bob', 'hair_brown'), top_col='mustard', sleeves='long',
         leg_col='denim', glasses='brown_dark', garments=[('cardigan', 'mustard', 'white')], blush=True),
    dict(name='char_neighbor_03', skin='skin_light', hair=('short', 'hair_grey', 'hair_grey'), top_col='denim', sleeves='long',
         leg_col='khaki', shoes='shoe_brown', glasses='plastic', facial='beard', garments=[('collar', 'white')]),
    dict(name='char_neighbor_04', body='S', skin='skin_dark', hair=('long', 'hair_black'), top_col='teal', legs='skirt',
         leg_col='skin_dark', skirt_col='navy', shoes='shoe_white', blush=True),
    dict(name='char_neighbor_cart_01', body='B', hair=('bun', 'hair_white'), top_col='olive', sleeves='long', legs='skirt',
         leg_col='skin_light', skirt_col='brown', shoes='shoe_brown', glasses='plastic',
         garments=[('cardigan', 'olive', 'cream')], props=['cart', 'dog'], blush=True),
    dict(name='char_courier_01', skin='skin_mid', hair=('under_hat', 'hair_dark'), top_col='red', leg_col='charcoal',
         hat=('cap', 'red', 'red'), garments=[('backpack', 'yellow', 'big')], shoes='shoe_black'),
    dict(name='char_student_01', skin='skin_light', hair=('short', 'hair_blond'), top_col='navy', sleeves='long', leg_col='denim',
         garments=[('collar', 'white'), ('backpack', 'orange')], props=[('notebook', 'Left')]),
    dict(name='char_terrace_01', skin='skin_tan', hair=('slick', 'hair_black'), top_col='charcoal', leg_col='khaki',
         glasses=('black', True), garments=[('collar', 'white')], shoes='shoe_brown'),
    dict(name='char_terrace_02', body='S', skin='skin_light', hair=('long', 'hair_red'), top_col='red', leg_col='white',
         hat=('sunhat', 'straw', 'navy'), glasses=('black', True), blush=True),
    dict(name='char_terrace_03', body='B', skin='skin_light', hair=('under_hat', 'hair_white'), top_col='brown', sleeves='long',
         leg_col='charcoal', shoes='shoe_black', hat=('beret', 'black'), facial='mustache', garments=[('cardigan', 'brown', 'white')]),
    dict(name='char_rival_a_01', skin='skin_light', hair=('slick', 'hair_dark'), top_col='grey_suit', sleeves='long',
         leg_col='grey_suit', shoes='shoe_black', mouth='flat', garments=[('suit', 'grey_suit', 'white'), ('tie', 'navy')]),
    dict(name='char_rival_b_01', body='S', skin='skin_mid', hair=('long', 'hair_brown'), top_col='navy', sleeves='long',
         leg_col='navy', shoes='shoe_black', glasses='plastic', garments=[('blazer', 'navy', 'white')]),
    # Fox (src/data/parties.js): Covadonga del Muro, quilted green vest, rolled sleeves, riding boots, red-yellow bracelets.
    dict(name='char_rival_c_01', body='S', skin='skin_light', hair=('ponytail', 'hair_blond'), top_col='white', sleeves='long',
         leg_col='beige', shoes='brown_dark', mouth='flat',
         garments=[('vest', 'fox', 'fox2'), ('collar', 'white'), ('wristbands', 'red', 'yellow'), ('boots', 'brown_dark', 'brown')]),
    dict(name='char_moderator_01', body='S', skin='skin_light', hair=('bob', 'hair_dark'), top_col='cream', sleeves='long',
         legs='skirt', leg_col='skin_light', skirt_col='charcoal', shoes='shoe_black', garments=[('blazer', 'cream', 'sky')],
         props=[('cards', 'Right')], blush=True),
    dict(name='char_camera_op_01', skin='skin_mid', hair=('under_hat', 'hair_dark', 'hair_dark'), top_col='grey', leg_col='charcoal',
         shoes='shoe_black', hat=('cap_back', 'black', 'black'), facial='beard', props=['tvcamera']),
    dict(name='char_journalist_01', body='S', skin='skin_tan', hair=('curly', 'hair_dark'), top_col='white', sleeves='long',
         leg_col='navy', shoes='shoe_black', garments=[('lanyard', 'red')], props=[('mic', 'Right'), ('notebook', 'Left')], blush=True),
]

# ---------------------------------------------------------------- export / preview ---------------------------
def export(c):
    bpy.ops.object.select_all(action='DESELECT')
    for o in (c.arm, c.mesh, c.static):
        if o: o.select_set(True)
    bpy.context.view_layer.objects.active = c.arm
    path = OUT / f'{c.name}.glb'
    bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB', use_selection=True, export_yup=True,
                              export_apply=False, export_animations=True, export_animation_mode='ACTIONS',
                              export_skins=True, export_morph=False, export_force_sampling=True,
                              export_optimize_animation_size=True, export_reset_pose_bones=True,
                              export_rest_position_armature=True)
    return path

def glb_summary(path):
    data = path.read_bytes(); ln = struct.unpack('<I', data[12:16])[0]
    j = json.loads(data[20:20 + ln])
    return [a['name'] for a in j.get('animations', [])], len(j.get('skins', [])), len(j.get('meshes', []))

def bbox(objs, depsgraph):
    pts = []
    for o in objs:
        if not o: continue
        e = o.evaluated_get(depsgraph); m = e.to_mesh()
        pts += [o.matrix_world @ v.co for v in m.vertices]; e.to_mesh_clear()
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi

def render(chars, action, frame, fname, spacing=1.0, cols=7, row_h=2.3):
    """Contact sheet: grid of characters (rows stacked in Z), ortho camera, 20 deg yaw, workbench flat colours."""
    sc = bpy.context.scene
    n = len(chars); cols = min(cols, n); rows = (n + cols - 1) // cols
    for i, c in enumerate(chars):
        c.arm.location = ((i % cols - (cols - 1) / 2) * spacing, 0, -(i // cols) * row_h)
        Rig.set_action(c.arm, action)
    sc.frame_set(frame)
    cam = bpy.data.objects.get('preview_cam')
    if not cam:
        cd = bpy.data.cameras.new('preview_cam'); cd.type = 'ORTHO'
        cam = bpy.data.objects.new('preview_cam', cd); bpy.context.scene.collection.objects.link(cam)
    w, h = cols * spacing + .4, rows * row_h
    cam.data.ortho_scale = max(w, h)
    cam.rotation_euler = (math.radians(90), 0, math.radians(-20))
    fwd = cam.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    cam.location = Vector((0, 0, 1.0 - (rows - 1) * row_h / 2)) - fwd * 30
    sc.camera = cam
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.display.shading.light = 'STUDIO'; sc.display.shading.color_type = 'MATERIAL'
    sc.display.shading.show_shadows = False; sc.display.shading.show_cavity = True
    sc.display.shading.show_backface_culling = True   # same as Babylon: inverted/open faces must show up here
    sc.render.resolution_x = 2100 if w >= h else int(2100 * w / h)
    sc.render.resolution_y = int(2100 * h / w) if w >= h else 2100
    sc.world = sc.world or bpy.data.worlds.new('w'); sc.world.color = (.15, .15, .17)
    sc.view_settings.view_transform = 'Standard'
    sc.render.filepath = str(PREVIEW / fname)
    bpy.ops.render.render(write_still=True)
    for c in chars: c.arm.location = (0, 0, 0)
    print('[preview]', sc.render.filepath)

def main():
    rig = Rig()
    tpl = rig.arm
    coll = bpy.data.collections.new('characters'); bpy.context.scene.collection.children.link(coll)
    only = [a for a in sys.argv[sys.argv.index('--') + 1:]] if '--' in sys.argv else []
    chars = []
    for spec in CAST:
        if only and spec['name'] not in only: continue
        c = make(rig, **spec); c.finish(coll); chars.append(c)
    bpy.data.objects.remove(tpl, do_unlink=True)
    OUT.mkdir(parents=True, exist_ok=True); PREVIEW.mkdir(parents=True, exist_ok=True)
    report = []
    sc = bpy.context.scene
    for c in chars:
        p = export(c)
        anims, skins, meshes = glb_summary(p)
        Rig.set_action(c.arm, 'idle'); sc.frame_set(REF_FRAME)
        lo, hi = bbox([c.mesh], bpy.context.evaluated_depsgraph_get())
        report.append(f'{c.name}: {hi.x - lo.x:.2f} x {hi.y - lo.y:.2f} x {hi.z - lo.z:.2f} m (z {lo.z:+.3f}..{hi.z:.2f}), '
                      f'{c.tris()} tris, anims={anims}, skins={skins}, meshes={meshes}, {p.stat().st_size // 1024} KB')
    render(chars, 'idle', 200, 'characters.png')
    render(chars, 'run', 6, 'characters_run.png')
    for c in chars: Rig.set_action(c.arm, 'idle')
    sc.frame_set(REF_FRAME)
    if not only:
        bpy.ops.wm.save_as_mainfile(filepath=str(ART / 'characters.blend'))
    print('\n'.join(['== CHARACTER REPORT'] + report))

main()
