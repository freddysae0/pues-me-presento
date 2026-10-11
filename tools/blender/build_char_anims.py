"""Post-process: author extra gesture clips on the character rig and add them to every public/assets/char_*.glb.

Run:  blender -b --python tools/blender/build_char_anims.py [-- char_name ...]
      (or `npm.cmd run assets char_anims`, after `characters`)

Own keyframe authoring, no external animation source (licence: same as the project). For each GLB:
  1. Import it (armature + skinned body + optional static props), drop the importer's bone-shape Icosphere.
  2. Read the idle reference pose (first frame of 'idle', the pose the meshes were modelled in).
  3. For each clip in CLIPS, evaluate the keyed pose parameters every frame (periodic Catmull-Rom, so every clip
     loops cleanly), solve FK + 2-bone IK (arms toward wrist targets, legs planted on the idle foot positions),
     convert the armature-space matrices to bone-local quaternions and write them as a new action.
     Clips already present (previous run) are deleted first: the script is idempotent.
  4. Re-export with the same glTF settings as build_characters.py (idle/walk/run/jump are kept).
  5. Contact sheet art/previews/char_anims.png (rows = clips, columns = 4 phases) from the protagonist.

Authoring space (Blender, Z up): the character looks -Y, its left side is +X.
  Euler channels are degrees about the *armature* axes, applied on top of the parent's delta (FK):
    X+ = tilt forward (head nod down, spine bend), Z+ = turn toward the character's left, Y = roll/abduction
    (LeftArm Y- raises the arm sideways, LeftShoulder Y- lifts the shoulder).
  'L.ik' / 'R.ik' = wrist position (idle-reference armature space, carried along with UpperChest),
  'L.pole' = elbow hint direction, 'L.hdir' = hand direction. 'hips' = HipsCtrl offset in metres (feet stay planted).
  sym=True mirrors every L/Left channel to the right side unless the right one is given.
"""
import bpy, sys, json, struct, math
from pathlib import Path
from mathutils import Vector, Matrix, Quaternion, Euler

sys.path.insert(0, str(Path(__file__).resolve().parent))
from kit_common import OUT, PREVIEW  # paths only

FPS = 24
SIDES = {'L': 'Left', 'R': 'Right'}

# ---------------------------------------------------------------- clip definitions ---------------------------
def k(f, **ch):
    return (f, ch)

CLIPS = {
    # Both arms in a big V, pumping twice per second with a knee dip; asymmetric so it does not look mirrored.
    'cheer_arms': dict(length=24, keys=[
        k(0,  hips=(0, 0, 0), UpperChest=(-8, 0, 0), Head=(-14, 0, 4),
              **{'L.ik': (.40, -.02, 1.58), 'R.ik': (-.42, -.04, 1.55), 'L.pole': (1, .4, -.2), 'R.pole': (-1, .4, -.2),
                 'L.hdir': (.3, -.1, 1), 'R.hdir': (-.3, -.1, 1)}),
        k(6,  hips=(0, 0, -.05), UpperChest=(2, 0, -3), Head=(-4, 0, -4),
              **{'L.ik': (.46, -.06, 1.40), 'R.ik': (-.44, -.02, 1.46), 'L.hdir': (.6, -.2, 1), 'R.hdir': (-.5, -.1, 1)}),
        k(12, hips=(0, 0, 0), UpperChest=(-10, 0, 3), Head=(-16, 0, -5),
              **{'L.ik': (.38, -.04, 1.60), 'R.ik': (-.40, -.02, 1.57), 'L.hdir': (.2, -.1, 1), 'R.hdir': (-.3, -.1, 1)}),
        k(18, hips=(0, 0, -.045), UpperChest=(0, 0, 4), Head=(-4, 0, 6),
              **{'L.ik': (.45, -.03, 1.45), 'R.ik': (-.47, -.06, 1.40), 'L.hdir': (.5, -.1, 1), 'R.hdir': (-.6, -.2, 1)}),
    ]),
    # Two claps per second in front of the chest, body bouncing on each clap.
    'clap': dict(length=24, sym=True, keys=[
        k(0,  hips=(0, 0, -.03), UpperChest=(6, 0, 0), Head=(8, 0, 0),
              **{'L.ik': (.075, -.27, .98), 'L.pole': (1, .5, -.9), 'L.hdir': (-.35, -.5, .8)}),
        k(6,  hips=(0, 0, 0), UpperChest=(-2, 0, 0), Head=(-6, 0, 0),
              **{'L.ik': (.24, -.22, 1.03), 'L.hdir': (.15, -.6, .8)}),
        k(12, hips=(0, 0, -.03), UpperChest=(6, 0, 0), Head=(8, 0, 0),
              **{'L.ik': (.075, -.27, .98), 'L.hdir': (-.35, -.5, .8)}),
        k(18, hips=(0, 0, 0), UpperChest=(-2, 0, 0), Head=(-6, 0, 0),
              **{'L.ik': (.24, -.22, 1.03), 'L.hdir': (.15, -.6, .8)}),
    ]),
    # Right hand up next to the head waving side to side, body counter-leaning.
    'wave': dict(length=32, keys=[
        k(0,  hips=(-.015, 0, 0), Spine=(0, -3, 0), UpperChest=(0, -5, -6), Head=(-4, 8, -6),
              **{'R.ik': (-.48, -.10, 1.36), 'R.pole': (-1, .3, -.7), 'R.hdir': (-.8, -.15, 1)}),
        k(8,  **{'R.ik': (-.43, -.13, 1.42), 'R.hdir': (0, -.2, 1)}, Head=(-2, 12, -8)),
        k(16, **{'R.ik': (-.48, -.10, 1.36), 'R.hdir': (-.8, -.15, 1)}, Head=(-4, 8, -6)),
        k(24, **{'R.ik': (-.43, -.13, 1.42), 'R.hdir': (0, -.2, 1)}, Head=(-2, 12, -8)),
    ]),
    # Explaining: both hands forward palms up, alternating beats, head emphasising.
    'talk_gesture_a': dict(length=48, keys=[
        k(0,  UpperChest=(4, 0, 0), Head=(4, 0, 0),
              **{'L.ik': (.24, -.24, .90), 'R.ik': (-.22, -.20, .86), 'L.pole': (1, .4, -1), 'R.pole': (-1, .4, -1),
                 'L.hdir': (.5, -1, .2), 'R.hdir': (-.4, -1, .1)}),
        k(10, UpperChest=(0, 0, 8), Head=(-6, 0, 10),
              **{'L.ik': (.30, -.28, 1.0), 'R.ik': (-.20, -.16, .84), 'L.hdir': (.7, -1, .5), 'R.hdir': (-.3, -1, 0)}),
        k(20, UpperChest=(6, 0, 2), Head=(10, 0, 2),
              **{'L.ik': (.20, -.22, .88), 'R.ik': (-.24, -.22, .90), 'L.hdir': (.4, -1, .1), 'R.hdir': (-.5, -1, .2)}),
        k(32, UpperChest=(0, 0, -8), Head=(-4, 0, -12),
              **{'L.ik': (.22, -.18, .86), 'R.ik': (-.30, -.30, 1.0), 'L.hdir': (.3, -1, 0), 'R.hdir': (-.7, -1, .5)}),
        k(40, UpperChest=(5, 0, -2), Head=(8, 0, -3),
              **{'L.ik': (.25, -.24, .92), 'R.ik': (-.23, -.22, .88), 'L.hdir': (.5, -1, .2), 'R.hdir': (-.4, -1, .1)}),
    ]),
    # Making a point: right hand chops twice, left hand rests on the belly, head turns to the audience.
    'talk_gesture_b': dict(length=56, keys=[
        k(0,  UpperChest=(0, 0, 6), Head=(0, 0, 10),
              **{'R.ik': (-.26, -.24, 1.14), 'R.pole': (-1, .3, -.8), 'R.hdir': (-.1, -.5, 1),
                 'L.ik': (.12, -.20, .80), 'L.pole': (1, .3, -1), 'L.hdir': (-1, -.4, 0)}),
        k(8,  UpperChest=(8, 0, 2), Head=(14, 0, 4), **{'R.ik': (-.20, -.30, .90), 'R.hdir': (0, -1, -.1)}),
        k(16, UpperChest=(0, 0, 4), Head=(0, 0, 6), **{'R.ik': (-.26, -.26, 1.12), 'R.hdir': (-.1, -.5, 1)}),
        k(24, UpperChest=(8, 0, 0), Head=(12, 0, 0), **{'R.ik': (-.20, -.30, .90), 'R.hdir': (0, -1, -.1)}),
        k(36, UpperChest=(0, 0, -6), Head=(-4, 0, -14), **{'R.ik': (-.30, -.20, .92), 'R.hdir': (-.6, -1, .3)}),
        k(46, UpperChest=(2, 0, -2), Head=(4, 0, -4), **{'R.ik': (-.28, -.22, 1.02), 'R.hdir': (-.3, -.8, .6)}),
    ]),
    # Double nod of agreement.
    'nod': dict(length=28, keys=[
        k(0,  Neck=(0, 0, 0), Head=(-4, 0, 0), UpperChest=(0, 0, 0)),
        k(6,  Neck=(8, 0, 0), Head=(20, 0, 0), UpperChest=(3, 0, 0)),
        k(12, Neck=(0, 0, 0), Head=(-6, 0, 0), UpperChest=(0, 0, 0)),
        k(18, Neck=(6, 0, 0), Head=(16, 0, 0), UpperChest=(2, 0, 0)),
        k(23, Neck=(0, 0, 0), Head=(-4, 0, 0), UpperChest=(0, 0, 0)),
    ]),
    # "Who knows": shoulders up, forearms out, palms up, head tilted; holds and relaxes.
    'shrug': dict(length=40, sym=True, keys=[
        k(0,  LeftShoulder=(0, 0, 0), Head=(0, 0, 0), UpperChest=(0, 0, 0),
              **{'L.ik': (.27, -.08, .70), 'L.pole': (1, .6, -.6), 'L.hdir': (.3, -.4, -1)}),
        k(9,  LeftShoulder=(0, -26, 0), RightShoulder=(0, 26, 0), Head=(-4, -16, 6), UpperChest=(-4, 0, 0), hips=(0, 0, .015),
              **{'L.ik': (.42, -.20, .90), 'L.hdir': (1, -.5, .25)}),
        k(27, LeftShoulder=(0, -22, 0), RightShoulder=(0, 22, 0), Head=(-2, -12, 4), UpperChest=(-3, 0, 0), hips=(0, 0, .01),
              **{'L.ik': (.41, -.19, .89), 'L.hdir': (1, -.5, .2)}),
        k(34, LeftShoulder=(0, 0, 0), RightShoulder=(0, 0, 0), Head=(0, 0, 0), UpperChest=(0, 0, 0), hips=(0, 0, 0),
              **{'L.ik': (.27, -.08, .72), 'L.hdir': (.3, -.4, -1)}),
    ]),
    # Arms crossed, slumped, shaking the head.
    'disappointed': dict(length=48, keys=[
        k(0,  hips=(0, .01, -.01), Spine=(4, 0, 0), UpperChest=(6, 0, 0), Neck=(6, 0, 0), Head=(10, 0, 0),
              **{'L.ik': (-.10, -.21, .99), 'R.ik': (.11, -.17, .93), 'L.pole': (1, .3, -.5), 'R.pole': (-1, .3, -.5),
                 'L.hdir': (-1, -.1, .25), 'R.hdir': (1, -.1, .35)}),
        k(8,  Head=(10, 0, 24), UpperChest=(6, 0, 3)),
        k(16, Head=(10, 0, -24), UpperChest=(6, 0, -3)),
        k(24, Head=(10, 0, 20), UpperChest=(6, 0, 3)),
        k(32, Head=(12, 0, -16), UpperChest=(7, 0, -2)),
        k(40, Head=(12, 0, 0), UpperChest=(7, 0, 0)),
    ]),
    # Thumbs down: both fists forward-low shaking, leaning in.
    'boo': dict(length=24, sym=True, keys=[
        k(0,  hips=(0, -.015, -.025), Spine=(6, 0, 0), UpperChest=(10, 0, 0), Head=(6, 0, -12),
              **{'L.ik': (.17, -.36, .98), 'L.pole': (1, .2, -.8), 'L.hdir': (.15, -.4, -1),
                 'R.ik': (-.19, -.33, .80), 'R.hdir': (-.15, -.4, -1)}),
        k(6,  Head=(10, 0, 12), **{'L.ik': (.19, -.33, .80), 'R.ik': (-.17, -.36, .98)}),
        k(12, Head=(6, 0, -12), **{'L.ik': (.17, -.36, .98), 'R.ik': (-.19, -.33, .80)}),
        k(18, Head=(10, 0, 12), **{'L.ik': (.19, -.33, .80), 'R.ik': (-.17, -.36, .98)}),
    ]),
    # Looks left, holds, looks right, holds, back. Used as an occasional idle variation.
    'idle_look': dict(length=72, keys=[
        k(0,  Head=(0, 0, 0), Neck=(0, 0, 0), UpperChest=(0, 0, 0)),
        k(10, Head=(-4, 0, 30), Neck=(0, 0, 10), UpperChest=(0, 0, 8)),
        k(26, Head=(-6, 4, 34), Neck=(0, 0, 10), UpperChest=(0, 0, 8)),
        k(38, Head=(2, 0, -30), Neck=(0, 0, -10), UpperChest=(0, 0, -8)),
        k(54, Head=(4, -4, -34), Neck=(0, 0, -10), UpperChest=(0, 0, -8)),
        k(64, Head=(0, 0, 0), Neck=(0, 0, 0), UpperChest=(0, 0, 0)),
    ]),
}

# ---------------------------------------------------------------- helpers ------------------------------------
def fcurves(a):
    for l in a.layers:
        for s in l.strips:
            for cb in s.channelbags:
                yield from cb.fcurves

def mirror_name(ch):
    if ch.startswith('L.'): return 'R.' + ch[2:]
    if ch.startswith('Left'): return 'Right' + ch[4:]
    return None

def mirror_value(ch, v):
    if ch.endswith(('.ik', '.pole', '.hdir')) or ch == 'hips': return (-v[0], v[1], v[2])
    return (v[0], -v[1], -v[2])  # euler about X kept, Y/Z flipped by the X mirror

def expand(clip):
    """Per-channel list of (frame, value): sym mirroring + carry-forward of missing keys."""
    keys = clip['keys']
    if clip.get('sym'):
        for _, ch in keys:
            for name in list(ch):
                m = mirror_name(name)
                if m and m not in ch: ch[m] = mirror_value(name, ch[name])
    chans = {}
    for f, ch in keys:
        for name, v in ch.items(): chans.setdefault(name, []).append((f, Vector(v)))
    return chans

def sample(track, t, length):
    """Periodic Catmull-Rom through (frame, value) keys of one channel."""
    if len(track) == 1: return track[0][1].copy()
    fr = [f for f, _ in track]; vs = [v for _, v in track]; n = len(track)
    t = t % length
    i = max(j for j in range(n) if fr[j] <= t) if t >= fr[0] else n - 1
    f0 = fr[i]; f1 = fr[(i + 1) % n] + (length if i == n - 1 else 0)
    if t < f0: t += length
    u = (t - f0) / (f1 - f0)
    p0, p1, p2, p3 = vs[(i - 1) % n], vs[i], vs[(i + 1) % n], vs[(i + 2) % n]
    return .5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u ** 3)

def eq(v):
    return Euler([math.radians(x) for x in v], 'XYZ').to_quaternion()

# ---------------------------------------------------------------- pose solver --------------------------------
class Solver:
    def __init__(self, arm):
        self.arm = arm
        ad = arm.animation_data
        for t in ad.nla_tracks: t.mute = True
        idle = bpy.data.actions['idle']; ad.action = idle; ad.action_slot = idle.slots[0]
        bpy.context.scene.frame_set(int(idle.frame_range[0]))
        bpy.context.view_layer.update()
        self.order = []
        def walk(b):
            self.order.append(b.name)
            for c in b.children: walk(c)
        for b in arm.data.bones:
            if not b.parent: walk(b)
        self.parent = {b.name: (b.parent.name if b.parent else None) for b in arm.data.bones}
        self.R = {b.name: b.matrix_local.copy() for b in arm.data.bones}
        self.M = {pb.name: pb.matrix.copy() for pb in arm.pose.bones}
        self.H = {n: m.translation.copy() for n, m in self.M.items()}
        self.Rot = {n: m.to_quaternion() for n, m in self.M.items()}
        self.basis = {pb.name: (pb.location.copy(), pb.rotation_quaternion.copy()) for pb in arm.pose.bones}
        ad.action = None

    def ik(self, S, T, l1, l2, pole):
        d = T - S; dist = min(max(d.length, 1e-4), (l1 + l2) * .999); dn = d.normalized()
        a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist); h = math.sqrt(max(0, l1 * l1 - a * a))
        perp = pole - dn * pole.dot(dn)
        if perp.length < 1e-5: perp = Vector((0, -1, 0)) - dn * (-dn.y)
        E = S + dn * a + perp.normalized() * h
        return E, S + dn * dist

    def solve(self, P):
        """P: channel -> Vector. Returns {bone: armature-space 4x4}."""
        H0, par = self.H, self.parent
        D = {b: (eq(P[b]) if b in P else Quaternion()) for b in self.order}
        W, H = {}, {}
        uc = 'UpperChest'
        def carry(v):  # idle-reference point carried with UpperChest
            return H[uc] + W[uc] @ (Vector(v) - H0[uc])
        override = {}
        for b in self.order:
            p = par[b]
            if p is None:
                H[b] = H0[b] + P.get('hips', Vector()); W[b] = D[b]
            else:
                H[b] = H0[b] if b in override and override[b][0] is not None else H[p] + W[p] @ (H0[b] - H0[p])
                W[b] = override[b][1] if b in override else W[p] @ D[b]
            # arms
            for s, side in SIDES.items():
                if b == f'{side}Arm' and f'{s}.ik' in P:
                    fore, hand = f'{side}ForeArm', f'{side}Hand'
                    l1 = (H0[fore] - H0[b]).length; l2 = (H0[hand] - H0[fore]).length
                    T = carry(P[f'{s}.ik'])
                    pole = W[uc] @ P.get(f'{s}.pole', Vector((1 if s == 'L' else -1, .3, -.6)))
                    E, Tr = self.ik(H[b], T, l1, l2, pole)
                    W[b] = (W[p] @ (H0[fore] - H0[b])).rotation_difference(E - H[b]) @ W[p]
                    Wf = (W[b] @ (H0[hand] - H0[fore])).rotation_difference(Tr - E) @ W[b]
                    override[fore] = (None, Wf)
                    if f'{s}.hdir' in P:
                        hd = W[uc] @ P[f'{s}.hdir']
                        ref_dir = self.hand_dir[side]
                        override[hand] = (None, (Wf @ ref_dir).rotation_difference(hd) @ Wf)
                # legs: planted on the idle foot position, feet keep their idle orientation
                if b == f'{side}UpLeg':
                    leg, foot, toes = f'{side}Leg', f'{side}Foot', f'{side}Toes'
                    l1 = (H0[leg] - H0[b]).length; l2 = (H0[foot] - H0[leg]).length
                    mid = (H0[b] + H0[foot]) / 2; ax = (H0[foot] - H0[b]).normalized()
                    pole = (H0[leg] - mid); pole = pole - ax * pole.dot(ax)
                    E, Tr = self.ik(H[b], H0[foot], l1, l2, pole)
                    W[b] = (W[p] @ (H0[leg] - H0[b])).rotation_difference(E - H[b]) @ W[p]
                    override[leg] = (None, (W[b] @ (H0[foot] - H0[leg])).rotation_difference(Tr - E) @ W[b])
                    override[foot] = (None, D[foot])
        return {b: Matrix.Translation(H[b]) @ (W[b] @ self.Rot[b]).to_matrix().to_4x4() for b in self.order}

    def to_basis(self, M):
        out = {}
        for b in self.order:
            p = self.parent[b]
            if p is None: B = self.R[b].inverted() @ M[b]
            else: B = (self.R[p].inverted() @ self.R[b]).inverted() @ M[p].inverted() @ M[b]
            out[b] = (B.to_translation(), B.to_quaternion())
        return out

GLITCH = 0.5  # rad between consecutive 24 fps keys: no authored motion turns a bone that fast
def deglitch(qs, label):
    """Replace short runs where the solver flipped a twist (rotation_difference near 180 deg) with a slerp
    between the good frames on either side. Without this a wave pops for a few frames mid-gesture."""
    n, fixed, i = len(qs), 0, 1
    while i < n:
        if qs[i - 1].rotation_difference(qs[i]).angle > GLITCH:
            for j in range(i + 1, min(n, i + 8)):
                if qs[i - 1].rotation_difference(qs[j]).angle <= GLITCH:  # the pose came back: it was a spike
                    for k in range(i, j):
                        qs[k] = qs[i - 1].slerp(qs[j], (k - i + 1) / (j - i + 1))
                    fixed += j - i; i = j; break
        i += 1
    if fixed: print(f'deglitch {label}: {fixed} frames')
    return fixed

def build_action(arm, solver, name, clip):
    old = bpy.data.actions.get(name)
    if old: bpy.data.actions.remove(old)
    chans = expand(clip); L = clip['length']
    frames = list(range(L + 1))
    data = {b: ([], []) for b in solver.order}
    for f in frames:
        P = {ch: sample(tr, f, L) for ch, tr in chans.items()}
        for ch in list(P):
            if ch.endswith(('.pole', '.hdir')): P[ch] = P[ch].normalized()
        for b, (loc, q) in solver.to_basis(solver.solve(P)).items():
            qs = data[b][1]
            if qs and q.dot(qs[-1]) < 0: q.negate()
            data[b][0].append(loc); qs.append(q)
    for b in solver.order: deglitch(data[b][1], f'{name}/{b}')
    act = bpy.data.actions.new(name); act.use_fake_user = True
    slot = act.slots.new(id_type='OBJECT', name=arm.name)
    strip = act.layers.new('Layer').strips.new(type='KEYFRAME')
    cb = strip.channelbag(slot, ensure=True)
    def write(path, idx, vals):
        fc = cb.fcurves.new(path, index=idx); fc.keyframe_points.add(len(vals))
        co = []
        for f, v in zip(frames, vals): co += [f, v]
        fc.keyframe_points.foreach_set('co', co)
        for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
        fc.update()
    for b in solver.order:
        locs, qs = data[b]
        for i in range(4): write(f'pose.bones["{b}"].rotation_quaternion', i, [q[i] for q in qs])
        if solver.parent[b] is None:
            for i in range(3): write(f'pose.bones["{b}"].location', i, [v[i] for v in locs])
    return act

# ---------------------------------------------------------------- per-GLB pipeline ---------------------------
EXPORT = dict(export_format='GLB', use_selection=True, export_yup=True, export_apply=False, export_animations=True,
              export_animation_mode='ACTIONS', export_skins=True, export_morph=False, export_force_sampling=True,
              export_optimize_animation_size=True, export_reset_pose_bones=True, export_rest_position_armature=True)

def load(path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.render.fps = FPS
    bpy.ops.import_scene.gltf(filepath=str(path))
    arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    for o in list(bpy.data.objects):
        if o.type == 'MESH' and o.parent is None: bpy.data.objects.remove(o, do_unlink=True)  # bone-shape Icosphere
    for pb in arm.pose.bones: pb.custom_shape = None
    return arm

def process(path):
    arm = load(path)
    solver = Solver(arm)
    solver.hand_dir = {side: (solver.M[f'{side}Hand'] @ Vector((0, 1, 0)) - solver.H[f'{side}Hand']).normalized()
                       for side in SIDES.values()}
    # sanity: the zero pose must reproduce the idle reference basis
    zero = solver.to_basis(solver.solve({}))
    err = max(1 - abs(zero[b][1].dot(solver.basis[b][1])) for b in solver.order)
    assert err < 1e-5, f'zero pose mismatch {err}'
    ad = arm.animation_data
    for t in list(ad.nla_tracks):
        if t.name in CLIPS: ad.nla_tracks.remove(t)
    for name, clip in CLIPS.items():
        act = build_action(arm, solver, name, clip)
        tr = ad.nla_tracks.new(); tr.name = name; tr.mute = True
        tr.strips.new(name, 0, act)
    ad.action = None
    bpy.ops.object.select_all(action='DESELECT')
    arm.select_set(True)
    for c in arm.children: c.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.export_scene.gltf(filepath=str(path), **EXPORT)
    return glb_summary(path)

def glb_summary(path):
    data = path.read_bytes(); ln = struct.unpack('<I', data[12:16])[0]
    j = json.loads(data[20:20 + ln])
    return [a['name'] for a in j.get('animations', [])], len(j.get('skins', [])), len(j.get('meshes', [])), len(data) // 1024

# ---------------------------------------------------------------- preview ------------------------------------
def preview(path, cols=4, spacing=1.15, row_h=2.25, per_block=5):
    arm = load(path)
    kids = list(arm.children)
    names = list(CLIPS)
    blocks = (len(names) + per_block - 1) // per_block; bw = cols * spacing + .6
    bx = lambda r: (r // per_block - (blocks - 1) / 2) * bw
    sc = bpy.context.scene; SF = 500
    for r, name in enumerate(names):
        L = CLIPS[name]['length']
        for c in range(cols):
            a2 = arm.copy(); sc.collection.objects.link(a2)
            for ch in kids:
                k2 = ch.copy(); sc.collection.objects.link(k2); k2.parent = a2
                for m in k2.modifiers:
                    if m.type == 'ARMATURE': m.object = a2
            a2.location = (bx(r) + (c - (cols - 1) / 2) * spacing, 0, -(r % per_block) * row_h)
            ad = a2.animation_data
            ad.action = None
            for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
            tr = ad.nla_tracks.new(); f = round(L * c / cols)
            tr.strips.new(name, SF - f, bpy.data.actions[name])
        txt = bpy.data.curves.new(f'lbl_{name}', 'FONT'); txt.body = f'{name}  ({L / FPS:.2f} s)'; txt.size = .22
        to = bpy.data.objects.new(f'lbl_{name}', txt); sc.collection.objects.link(to)
        to.location = (bx(r) - (cols / 2) * spacing - .1, -.5, -(r % per_block) * row_h + 1.95); to.rotation_euler = (math.radians(90), 0, 0)
    for o in [arm] + kids: o.hide_render = True
    sc.frame_set(SF)
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam)
    rows = min(per_block, len(names)); w = blocks * bw; h = rows * row_h
    cd.ortho_scale = max(w, h)
    cam.rotation_euler = (math.radians(90), 0, math.radians(-14))
    fwd = cam.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    cam.location = Vector((0, 0, 1.0 - (rows - 1) * row_h / 2)) - fwd * 30
    sc.camera = cam
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.display.shading.light = 'STUDIO'; sc.display.shading.color_type = 'MATERIAL'
    sc.display.shading.show_cavity = True
    sc.render.resolution_x = 2400; sc.render.resolution_y = int(2400 * h / w)
    sc.world = bpy.data.worlds.new('w'); sc.world.color = (.15, .15, .17)
    sc.view_settings.view_transform = 'Standard'
    PREVIEW.mkdir(parents=True, exist_ok=True)
    sc.render.filepath = str(PREVIEW / 'char_anims.png')
    bpy.ops.render.render(write_still=True)
    print('[preview]', sc.render.filepath)

def main():
    only = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    paths = sorted(OUT.glob('char_*.glb'))
    if only: paths = [p for p in paths if p.stem in only]
    report = []
    for p in paths:
        anims, skins, meshes, kb = process(p)
        report.append(f'{p.stem}: anims={anims}, skins={skins}, meshes={meshes}, {kb} KB')
    prot = OUT / 'char_protagonist_01.glb'
    if prot.exists(): preview(prot)
    print('\n'.join(['== CHAR ANIMS REPORT', 'clips: ' + ', '.join(f'{n} {c["length"] / FPS:.2f}s' for n, c in CLIPS.items())] + report))

main()
