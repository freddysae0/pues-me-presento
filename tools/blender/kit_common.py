"""Shared helpers for the asset kit. Blender 5.x, metres, Z up, built around world origin.

Usage in a category script (run with blender --background --python <script>):

    import sys; from pathlib import Path; sys.path.insert(0, str(Path(__file__).parent))
    from kit_common import *
    reset_scene()
    a = Asset('prop_sofa_01')
    a.box((2, .9, .45), (0, 0, .25), 'terracotta', bevel=.04)
    a.part('lid', pivot=(0, .1, .8))      # following shapes go to a child node pivoting there
    a.box(...)
    a.finish()                            # joins parts, flat shades, sets origins
    export_all('interior')                # GLBs to public/assets/, art/interior.blend, preview sheet

Conventions (docs/ART.md): origin = ground contact centre (props) or hinge (moving parts),
character looks -Y in Blender (= +Z in Babylon after glTF conversion), roughness >= .8,
shared MAT_<name> palette, no textures, transparency only where it matters.
"""
import bpy, bmesh, math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'assets'
ART = ROOT / 'art'
PREVIEW = ROOT / 'art' / 'previews'

# Saturated Portal Knights / "Plaza de lo de siempre" palette (linear-ish sRGB values 0..1).
PALETTE = {
    # neutrals
    'white': (.92, .90, .86), 'cream': (.93, .84, .66), 'paper': (.96, .93, .84), 'black': (.06, .06, .07),
    'charcoal': (.16, .16, .18), 'grey': (.45, .46, .48), 'grey_light': (.70, .70, .70), 'stone': (.62, .60, .55),
    'stone_dark': (.40, .39, .37), 'concrete': (.66, .64, .60), 'asphalt': (.22, .22, .24),
    # warm
    'terracotta': (.75, .32, .18), 'terracotta_dark': (.52, .21, .12), 'brick': (.66, .30, .20), 'red': (.80, .14, .12),
    'red_dark': (.50, .08, .08), 'orange': (.95, .50, .12), 'ochre': (.88, .62, .26), 'mustard': (.93, .73, .18),
    'yellow': (.98, .84, .20), 'sand': (.90, .76, .52), 'peach': (.96, .72, .55), 'pink': (.92, .52, .58),
    # woods
    'wood_light': (.78, .55, .32), 'wood': (.58, .36, .18), 'wood_dark': (.36, .20, .10),
    # cool
    'green': (.20, .58, .30), 'green_dark': (.10, .36, .22), 'campaign_green': (.09, .42, .32), 'leaf': (.30, .66, .26),
    'leaf_dark': (.15, .45, .18), 'mint': (.55, .85, .70), 'teal': (.12, .52, .55), 'sky': (.45, .70, .92),
    'blue': (.18, .40, .78), 'navy': (.10, .14, .32), 'slate': (.30, .40, .50), 'purple': (.48, .30, .62),
    # skin / hair (characters)
    'skin_1': (.98, .80, .66), 'skin_2': (.88, .64, .48), 'skin_3': (.66, .44, .30), 'skin_4': (.42, .27, .18),
    'hair_brown': (.36, .22, .12), 'hair_black': (.08, .07, .07), 'hair_blond': (.88, .70, .38), 'hair_grey': (.78, .78, .78),
    'hair_red': (.62, .24, .10),
    # metals / special
    'metal': (.62, .64, .68), 'metal_dark': (.28, .29, .32), 'gold': (.90, .70, .25),
}
EMISSIVE = {'screen': (.35, .75, .95), 'screen_dark': (.05, .08, .12), 'lamp': (1.0, .86, .55), 'led_red': (1.0, .10, .08)}
TRANSPARENT = {'glass': ((.75, .90, .95), .35), 'ballot_glass': ((.85, .93, .97), .30)}

_mats = {}

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = 'METRIC'
    _mats.clear()
    _assets.clear()

def mat(name):
    """Palette material by key ('wood'), or a tinting slot 'tint_<x>' (white base, game recolours it)."""
    if name in _mats:
        return _mats[name]
    m = bpy.data.materials.new(f'MAT_{name}')
    alpha, emit = 1.0, None
    if name in PALETTE: col = PALETTE[name]
    elif name in EMISSIVE: col = EMISSIVE[name]; emit = col
    elif name in TRANSPARENT: col, alpha = TRANSPARENT[name]
    elif name.startswith('tint_') or name.startswith('label_'): col = (.95, .95, .95)
    else: raise KeyError(f'unknown palette colour {name!r}; add it to PALETTE')
    m.diffuse_color = (*col, alpha)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*col, 1)
    b.inputs['Roughness'].default_value = .85
    b.inputs['Metallic'].default_value = 0
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = 1.0
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
    _mats[name] = m
    return m

def _finish_obj(o, m, bevel=0.0):
    o.data.materials.clear(); o.data.materials.append(mat(m) if isinstance(m, str) else m)
    if bevel > 0:
        bpy.context.view_layer.objects.active = o
        mod = o.modifiers.new('bevel', 'BEVEL'); mod.width = bevel; mod.segments = 1; mod.limit_method = 'ANGLE'
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return o

def _apply(o, rot):
    o.rotation_euler = [math.radians(r) for r in rot]
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    o.select_set(False)

_assets = []

class Asset:
    """Collects primitive shapes; parts become child nodes with their own pivot (doors, lids, screens)."""
    def __init__(self, name, category=None):
        self.name, self.category = name, category
        self.parts = {'body': {'pivot': (0, 0, 0), 'objs': []}}
        self.current = 'body'
        self.meta = {}
        _assets.append(self)

    def part(self, name, pivot=(0, 0, 0)):
        self.parts.setdefault(name, {'pivot': pivot, 'objs': []}); self.current = name; return self

    def add(self, o):
        self.parts[self.current]['objs'].append(o); return o

    def box(self, size, loc, m, rot=(0, 0, 0), bevel=0.0):
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
        o = bpy.context.object; o.scale = size; _apply(o, rot)
        return self.add(_finish_obj(o, m, bevel))

    def cyl(self, r, h, loc, m, verts=8, rot=(0, 0, 0), r2=None, bevel=0.0):
        """Cylinder (or truncated cone when r2 given) centred at loc, axis Z before rot."""
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=loc)
        o = bpy.context.object; _apply(o, rot)
        return self.add(_finish_obj(o, m, bevel))

    def cone(self, r, h, loc, m, verts=8, rot=(0, 0, 0)):
        return self.cyl(r, h, loc, m, verts, rot, r2=0)

    def ico(self, r, loc, m, sub=1, scale=(1, 1, 1), rot=(0, 0, 0)):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=loc)
        o = bpy.context.object; o.scale = scale; _apply(o, rot)
        return self.add(_finish_obj(o, m))

    def sphere(self, r, loc, m, seg=8, rings=6, scale=(1, 1, 1), rot=(0, 0, 0)):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=r, location=loc)
        o = bpy.context.object; o.scale = scale; _apply(o, rot)
        return self.add(_finish_obj(o, m))

    def torus(self, R, r, loc, m, major=12, minor=4, rot=(0, 0, 0)):
        bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=major, minor_segments=minor, location=loc)
        o = bpy.context.object; _apply(o, rot)
        return self.add(_finish_obj(o, m))

    def poly(self, verts, faces, m, loc=(0, 0, 0)):
        """Arbitrary mesh from vertex/face lists."""
        me = bpy.data.meshes.new('poly'); me.from_pydata(verts, [], faces); me.update()
        o = bpy.data.objects.new('poly', me); o.location = loc; bpy.context.collection.objects.link(o)
        bpy.context.view_layer.objects.active = o; o.select_set(True)
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True); o.select_set(False)
        return self.add(_finish_obj(o, m))

    def prism(self, profile, depth, loc, m, rot=(0, 0, 0)):
        """Extrude a 2D XZ profile [(x,z),...] (convex or simple polygon) along Y by depth, centred."""
        n = len(profile); d = depth / 2
        verts = [(x, -d, z) for x, z in profile] + [(x, d, z) for x, z in profile]
        faces = [list(range(n))[::-1], list(range(n, 2 * n))] + [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
        o = self.poly(verts, faces, m, loc)
        bm = bmesh.new(); bm.from_mesh(o.data)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
        if any(rot): _apply(o, rot)
        return o

    def text(self, s, loc, size, m, rot=(90, 0, 0), depth=.01, align='CENTER'):
        """Low-res extruded text mesh; default faces -Y (front). Keep strings short."""
        bpy.ops.object.text_add(location=loc)
        o = bpy.context.object; o.data.body = s; o.data.size = size; o.data.extrude = depth
        o.data.align_x = align; o.data.align_y = 'CENTER'; o.data.resolution_u = 2
        bpy.ops.object.convert(target='MESH')
        o = bpy.context.object; _apply(o, rot)
        return self.add(_finish_obj(o, m))

    def label(self, key, size, loc, rot=(90, 0, 0)):
        """Blank plane with material MAT_label_<key> for runtime DynamicTexture text (party name, results)."""
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
        o = bpy.context.object; o.scale = (size[0], size[1], 1); _apply(o, rot)
        return self.add(_finish_obj(o, f'label_{key}'))

    def mirror_x(self, fn):
        """Call fn(sign) for sign in (-1, 1)."""
        for s in (-1, 1): fn(s)

    def finish(self):
        """Join each part into one mesh, origin at its pivot, children under an empty root named after the asset."""
        root = bpy.data.objects.new(self.name, None); bpy.context.collection.objects.link(root)
        root.empty_display_size = .2
        self.root = root
        for pname, p in self.parts.items():
            objs = p['objs']
            if not objs: continue
            bpy.ops.object.select_all(action='DESELECT')
            for o in objs: o.select_set(True)
            bpy.context.view_layer.objects.active = objs[0]
            if len(objs) > 1: bpy.ops.object.join()
            o = bpy.context.object
            o.name = f'{self.name}_{pname}'
            o.data.name = o.name
            # flat shading
            for poly in o.data.polygons: poly.use_smooth = False
            # merge duplicate materials into slots
            bpy.context.scene.cursor.location = p['pivot']
            bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
            o.parent = root
            o.location = p['pivot']
        bpy.context.scene.cursor.location = (0, 0, 0)
        return root

def dims(asset):
    """World-space bounding box size of an asset root (after finish)."""
    pts = []
    for c in asset.root.children:
        pts += [c.matrix_world @ Vector(v) for v in c.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return hi - lo, lo, hi

def export_all(category, preview=True, columns=6):
    """Export every finished asset as public/assets/<name>.glb, save art/<category>.blend, render art/previews/<category>.png."""
    OUT.mkdir(parents=True, exist_ok=True); ART.mkdir(exist_ok=True); PREVIEW.mkdir(parents=True, exist_ok=True)
    report = []
    for a in _assets:
        if not hasattr(a, 'root'): a.finish()
        bpy.ops.object.select_all(action='DESELECT')
        a.root.select_set(True)
        for c in a.root.children_recursive: c.select_set(True)
        path = OUT / f'{a.name}.glb'
        bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB', use_selection=True, export_yup=True,
                                  export_apply=True, export_animations=False)
        size, lo, hi = dims(a)
        tris = sum(sum(len(p.vertices) - 2 for p in c.data.polygons) for c in a.root.children if c.type == 'MESH')
        report.append(f'{a.name}: {size.x:.2f} x {size.y:.2f} x {size.z:.2f} m, {tris} tris, {path.stat().st_size // 1024} KB')
    bpy.ops.wm.save_as_mainfile(filepath=str(ART / f'{category}.blend'))
    print('\n'.join(['== KIT REPORT ' + category] + report))
    if preview: render_preview(category, columns)

def render_preview(category, columns=6, tile=360):
    """Contact sheet: each asset rendered alone and framed to its own tile (isometric ortho, workbench flat colours)."""
    import numpy as np
    from mathutils import Euler
    roots = [a.root for a in _assets]
    sc = bpy.context.scene
    cam_data = bpy.data.cameras.new('cam'); cam_data.type = 'ORTHO'
    cam = bpy.data.objects.new('cam', cam_data); bpy.context.collection.objects.link(cam)
    cam.rotation_euler = Euler((math.radians(60), 0, math.radians(30)))
    forward = cam.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    sc.camera = cam
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.display.shading.light = 'STUDIO'; sc.display.shading.color_type = 'MATERIAL'
    sc.display.shading.show_shadows = False; sc.display.shading.show_cavity = True
    sc.render.resolution_x = sc.render.resolution_y = tile; sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.world = bpy.data.worlds.new('w'); sc.world.color = (.15, .15, .17)
    sc.view_settings.view_transform = 'Standard'
    sc.render.image_settings.file_format = 'PNG'
    rows = (len(roots) + columns - 1) // columns
    sheet = np.zeros((rows * tile, columns * tile, 4), dtype=np.float32)
    tmp = PREVIEW / f'_{category}_tile.png'
    def show(root, on):
        for c in [root, *root.children_recursive]: c.hide_render = not on
    for r in roots: show(r, False)
    for i, a in enumerate(_assets):
        show(a.root, True)
        size, lo, hi = dims(a)
        centre = (lo + hi) / 2
        cam_data.ortho_scale = max(size.length * 1.05, .1)
        cam.location = centre - forward * (size.length + 10)
        cam_data.clip_end = size.length * 2 + 30
        sc.render.filepath = str(tmp)
        bpy.ops.render.render(write_still=True)
        img = bpy.data.images.load(str(tmp)); px = np.array(img.pixels[:], dtype=np.float32).reshape(tile, tile, 4)
        bpy.data.images.remove(img)
        r, c = i // columns, i % columns
        y0 = (rows - 1 - r) * tile  # Blender pixel rows go bottom-up
        if i == 0: sheet[:] = px[0, 0]
        sheet[y0:y0 + tile, c * tile:(c + 1) * tile] = px
        show(a.root, False)
    for r in roots: show(r, True)
    out = bpy.data.images.new(f'sheet_{category}', columns * tile, rows * tile, alpha=True)
    out.pixels = sheet.ravel(); out.filepath_raw = str(PREVIEW / f'{category}.png'); out.file_format = 'PNG'; out.save()
    tmp.unlink(missing_ok=True)
    print('preview', PREVIEW / f'{category}.png', '(tile order = asset definition order, row-major)')
