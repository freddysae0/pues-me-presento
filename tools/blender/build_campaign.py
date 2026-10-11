"""Campaign & stationery kit ("CAMPAÑA Y PAPELERÍA" row of docs/reference/asset-kit-sheet.png).

Run: blender -b --python tools/blender/build_campaign.py
Front faces -Y. Floor props: origin at ground contact centre. Wall props (posters, map, street sign):
origin at the centre of the back face (y = 0), body extends towards -Y.
Party-dependent surfaces use MAT_tint_party (white, recoloured in game) and MAT_label_<key> planes
for runtime DynamicTexture text. All parties / rivals are fictional; no real faces or names.
"""
import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from kit_common import *
from kit_common import _finish_obj

reset_scene()

_prism = Asset.prism
def _prism_fixed(self, *args, **kw):
    # kit_common.prism winds caps inward for counter-clockwise profiles; recalculate outward normals.
    o = _prism(self, *args, **kw)
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    return o
Asset.prism = _prism_fixed



def txt(a, s, loc, size, m, rot=(90, 0, 0), align='CENTER', bold=.045, res=1):
    """Flat, faux-bold text mesh facing -Y (rot 90,0,0) or +Z (rot 0,0,0).
    Own helper instead of Asset.text(): kit_common.text() resets the rotation before applying it (rot is lost,
    text always lies flat) and has no weight control. Bundled Blender font only (no system fonts)."""
    bpy.ops.object.text_add(location=loc)
    o = bpy.context.object
    o.data.body = s; o.data.size = size; o.data.extrude = 0
    o.data.offset = size * bold                      # thickens strokes: chunkier, more legible lettering
    o.data.align_x = align; o.data.align_y = 'CENTER'; o.data.resolution_u = res
    o.data.space_line = .9
    bpy.ops.object.convert(target='MESH')
    o = bpy.context.object
    o.rotation_euler = [math.radians(r) for r in rot]
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True); o.select_set(False)
    # glyph fills come out with mixed winding: make every face look out of its surface
    want = Vector((0, -1, 0)) if rot[0] == 90 else Vector((0, 0, 1))
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=size * .002)
    for f in bm.faces:
        if f.normal.dot(want) < 0: f.normal_flip()
    bm.to_mesh(o.data); bm.free()
    return a.add(_finish_obj(o, m))


def slab(a, pts, thick, m):
    """Thin solid from a planar quad/triangle list of 3D points, offset +-thick/2 along the face normal."""
    v = [Vector(p) for p in pts]
    n = (v[1] - v[0]).cross(v[2] - v[0]).normalized() * thick / 2
    verts = [tuple(p - n) for p in v] + [tuple(p + n) for p in v]
    k = len(v)
    faces = [list(range(k)), list(range(k, 2 * k))] + [[i, (i + 1) % k, k + (i + 1) % k, k + i] for i in range(k)]
    o = a.poly(verts, faces, m)
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    return o


def heart(a, x, z, s, y, m, depth=.01):
    """Small heart prism facing -Y, centred on (x, z)."""
    pts = []
    for i in range(16):
        t = math.pi * 2 * i / 16
        hx = 16 * math.sin(t) ** 3
        hz = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((x + hx / 34 * s, z + hz / 34 * s))
    return a.prism(pts[::-1], depth, (0, y, 0), m)


def star(a, x, z, r, y, m, depth=.02):
    pts = []
    for i in range(10):
        t = math.pi / 2 + math.pi * i / 5
        rr = r if i % 2 == 0 else r * .45
        pts.append((x + rr * math.cos(t), z + rr * math.sin(t)))
    return a.prism(pts, depth, (0, y, 0), m)


def silhouette(a, cx, cz, s, y, body='navy', head='charcoal'):
    """Generic anonymous bust icon (no face): round head + shoulders, on the -Y side of plane y."""
    a.cyl(.11 * s, .008, (cx, y - .004, cz + .09 * s), head, verts=12, rot=(90, 0, 0))
    prof = [(cx - .22 * s, cz - .22 * s), (cx + .22 * s, cz - .22 * s), (cx + .2 * s, cz - .08 * s),
            (cx + .12 * s, cz - .02 * s), (cx - .12 * s, cz - .02 * s), (cx - .2 * s, cz - .08 * s)]
    a.prism(prof, .008, (0, y - .004, 0), body)


def post_pair(a, half, h, m='wood', r=.04, foot=True):
    for s in (-1, 1):
        a.box((r * 2, r * 2, h), (s * half, 0, h / 2), m, bevel=.008)
        if foot:
            a.box((.12, .32, .05), (s * half, 0, .025), 'wood_dark', bevel=.01)


# ---------------------------------------------------------------------------------------------------------
# 1 Folder "PARTIDO DEL BARRIO" (lying flat, reads from the front/top)
a = Asset('prop_folder_01')
a.box((.25, .33, .012), (0, 0, .006), 'ochre', bevel=.003)                    # back cover
a.box((.235, .315, .022), (.004, 0, .023), 'paper')                            # sheets
a.box((.25, .33, .012), (0, 0, .04), 'ochre', bevel=.003)                     # front cover
a.box((.03, .33, .05), (-.127, 0, .023), 'terracotta', bevel=.004)            # spine
a.box((.12, .055, .002), (.01, .06, .047), 'paper')                            # title plate
txt(a, 'PARTIDO\nDEL BARRIO', (.01, .06, .049), .019, 'terracotta_dark', rot=(0, 0, 0), bold=.02)
a.box((.05, .004, .02), (.06, -.166, .03), 'red')                              # elastic tab
a.finish()

# 2 Poster "MAÑANA LO ARREGLO" with a little pot (wall)
a = Asset('prop_poster_flat_01')
W, H = .6, .85
a.box((W, .008, H), (0, -.004, 0), 'cream', bevel=.002)
a.box((W - .06, .002, H - .06), (0, -.009, 0), 'paper')
txt(a, 'MAÑANA\nLO ARREGLO', (0, -.0115, .26), .085, 'red_dark')
a.prism([(-.075, -.23), (.075, -.23), (.09, -.12), (-.09, -.12)], .03, (0, -.025, 0), 'terracotta')   # pot (relief)
a.box((.2, .035, .03), (0, -.027, -.105), 'terracotta_dark')
a.ico(.09, (0, -.03, -.02), 'leaf', scale=(1.1, .3, .9))
a.ico(.055, (-.09, -.03, .02), 'leaf_dark', scale=(1, .3, 1))
a.ico(.055, (.09, -.03, .03), 'leaf_dark', scale=(1, .3, 1))
for x in (-.27, .27):
    a.cyl(.012, .006, (x, -.012, .39), 'grey', verts=6, rot=(90, 0, 0))     # pins
a.finish()


# 3/4 Campaign poster (party tint + party name label + anonymous candidate icon)
def campaign_poster(name, tilt=0.0, peel=False):
    a = Asset(name)
    W, H = .6, .85
    a.box((W, .008, H), (0, -.004, 0), 'tint_party', bevel=.002)
    a.label('party_name', (W - .08, .16), (0, -.0095, .3))
    a.box((W - .12, .002, .5), (0, -.009, -.08), 'paper')                    # portrait zone
    silhouette(a, 0, -.18, 1.1, -.01)
    a.box((W - .12, .002, .06), (0, -.009, -.37), 'mustard')                  # slogan strip
    if peel:
        # lower right corner peeled away from the wall, showing the white back
        slab(a, [(W / 2 - .17, -.012, -H / 2), (W / 2, -.012, -H / 2 + .17), (W / 2 - .19, -.08, -H / 2 + .19)], .004, 'white')
        slab(a, [(W / 2 - .17, -.0095, -H / 2), (W / 2, -.0095, -H / 2), (W / 2, -.0095, -H / 2 + .17)], .002, 'stone_dark')
        a.box((.07, .003, .025), (-.24, -.011, .4), 'sand', rot=(0, 30, 0))   # tape
    if tilt:
        for o in a.parts['body']['objs']:
            o.select_set(True)
            o.rotation_euler = (0, math.radians(tilt), 0)
            bpy.context.view_layer.objects.active = o
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
            o.select_set(False)
    a.finish()


campaign_poster('prop_poster_campaign_01')
campaign_poster('prop_poster_campaign_02', tilt=-9, peel=True)

# 5 Fictional rival poster: "VOTA" + rival name label, generic suit silhouette
a = Asset('prop_poster_rival_01')
W, H = .6, .85
a.box((W, .008, H), (0, -.004, 0), 'red', bevel=.002)
a.box((W - .06, .002, H - .06), (0, -.009, 0), 'white')
a.box((W - .06, .002, .16), (0, -.0095, .31), 'red')
txt(a, 'VOTA', (0, -.012, .31), .11, 'white')
silhouette(a, 0, -.02, 1.0, -.01, body='navy', head='slate')
a.box((.04, .004, .1), (0, -.019, -.06), 'red')                                 # tie
a.label('rival_name', (W - .12, .13), (0, -.0105, -.3))
a.finish()


# 6 Bed-sheet banner "VECINAS Y VECINOS" between two poles
def sheet_banner(name, w, h, top, cloth, words, colors, hearts=True, label=None):
    a = Asset(name)
    half = w / 2 + .08
    post_pair(a, half, top + .15)
    zc = top - h / 2
    # cloth with a slight sag: two halves slightly rotated
    a.prism([(-w / 2, zc - h / 2), (w / 2, zc - h / 2), (w / 2, zc + h / 2), (0, zc + h / 2 - .06), (-w / 2, zc + h / 2)],
            .02, (0, 0, 0), cloth)
    for s in (-1, 1):
        a.cyl(.012, .14, (s * (w / 2 + .04), 0, zc + h / 2 - .02), 'cream', verts=4, rot=(0, 90, 0))      # ties
        a.cyl(.012, .14, (s * (w / 2 + .04), 0, zc - h / 2 + .04), 'cream', verts=4, rot=(0, 90, 0))
    lh = (h - .12) / len(words)
    for i, (wd, c) in enumerate(zip(words, colors)):
        z = zc + (len(words) - 1) * lh / 2 - i * lh
        txt(a, wd, (0, -.015, z), lh * .78, c)
    if hearts:
        heart(a, -w / 2 + .14, zc + h / 2 - .14, .14, -.012, 'red')
        heart(a, w / 2 - .14, zc + h / 2 - .14, .14, -.012, 'red')
    return a, zc


a, _ = sheet_banner('prop_banner_01', 2.6, 1.0, 2.2, 'paper', ['VECINAS', 'Y VECINOS'], ['navy', 'navy'])
a.finish()

# 7 Campaign backdrop ~6 x 3 m, tint_party, replaces the 'campaign-backdrop' box in the plaza
a = Asset('prop_campaign_backdrop_01')
BW, BH, Z0 = 6.0, 2.8, .2
a.box((BW, .1, BH), (0, 0, Z0 + BH / 2), 'tint_party', bevel=.02)
a.box((BW + .1, .14, .12), (0, 0, Z0 + BH + .04), 'charcoal', bevel=.02)        # top rail
a.box((BW + .1, .14, .12), (0, 0, Z0 - .02), 'charcoal', bevel=.02)            # bottom rail
for x in (-BW / 2 - .02, BW / 2 + .02):
    a.box((.12, .14, BH + .2), (x, 0, Z0 + BH / 2), 'charcoal', bevel=.02)
for x in (-BW / 2 + .2, 0, BW / 2 - .2):                                        # rear A-frame feet
    a.box((.1, 1.1, .08), (x, .45, .04), 'metal_dark', bevel=.01)
    a.box((.07, .07, 1.7), (x, .45, .82), 'metal_dark', rot=(-32, 0, 0))
a.box((BW - .4, .02, .14), (0, -.055, Z0 + BH - .25), 'white')                    # trim stripes
a.box((BW - .4, .02, .14), (0, -.055, Z0 + .3), 'white')
a.label('party_name', (4.2, .95), (0, -.07, Z0 + BH / 2 + .25))
for k in range(13):                                                                    # bunting along the top
    x = -BW / 2 + .25 + k * (BW - .5) / 12
    a.prism([(x - .17, Z0 + BH - .02), (x + .17, Z0 + BH - .02), (x, Z0 + BH - .32)], .01, (0, -.07, 0),
            ['red', 'yellow', 'blue'][k % 3])
a.label('party_slogan', (3.4, .32), (0, -.07, Z0 + .75))
a.finish()

# 8 Blank flag on a pole (tint_party)
a = Asset('prop_flag_blank_01')
a.cyl(.16, .08, (0, 0, .04), 'metal_dark', verts=8)
a.cyl(.022, 2.5, (0, 0, 1.29), 'metal', verts=6)
a.ico(.045, (0, 0, 2.56), 'gold')
FZ = 2.42
slab(a, [(0.03, 0, FZ), (.55, -.07, FZ + .03), (.55, -.07, FZ - .62), (0.03, 0, FZ - .65)], .012, 'tint_party')
slab(a, [(.55, -.07, FZ + .03), (1.1, .02, FZ - .02), (1.1, .02, FZ - .67), (.55, -.07, FZ - .62)], .012, 'tint_party')
a.finish()

# 9 Flyer stack
a = Asset('prop_flyer_stack_01')
for i, (dx, dy, rz) in enumerate([(0, 0, 0), (.01, -.005, 4), (-.008, .006, -5), (.004, .002, 9)]):
    z = .008 + i * .012
    a.box((.15, .21, .012 if i < 3 else .004), (dx, dy, z), 'paper', rot=(0, 0, rz))
a.box((.15, .05, .002), (.004, .072, .036), 'red', rot=(0, 0, 9))
for k in range(4):
    a.box((.11, .008, .001), (.004 - .002 * k, .02 - k * .03, .0365), 'grey_light', rot=(0, 0, 9))
a.box((.06, .06, .001), (.03, -.07, .0365), 'campaign_green', rot=(0, 0, 9))
a.finish()

# 10 Paper ream (two reams, wrapped)
a = Asset('prop_paper_ream_01')
for i, rz in enumerate((0, 7)):
    z = .03 + i * .06
    a.box((.3, .21, .055), (0, 0, z), 'white', rot=(0, 0, rz), bevel=.004)
    a.box((.12, .215, .057), (0, 0, z), 'blue', rot=(0, 0, rz))
    a.box((.304, .04, .057), (0, 0, z), 'sky', rot=(0, 0, rz))
a.finish()

# 11 Sticky notes
a = Asset('prop_sticky_notes_01')
for (x, y, n, rz, c) in [(0, 0, 5, 0, 'yellow'), (.09, .03, 3, 12, 'pink'), (-.05, .08, 4, -8, 'mint'), (.06, -.07, 2, 25, 'orange')]:
    a.box((.076, .076, .004 * n), (x, y, .002 * n), c, rot=(0, 0, rz))
for (x, y, rz, c) in [(-.1, -.05, 30, 'yellow'), (.15, -.02, -15, 'pink')]:
    a.box((.076, .076, .002), (x, y, .001), c, rot=(0, 0, rz))
a.finish()

# 12 Invoice pile
a = Asset('prop_invoice_pile_01')
for i, (dx, dy, rz) in enumerate([(0, 0, 0), (.02, .01, -7), (-.015, -.01, 6), (.01, .015, -14), (0, 0, 4)]):
    a.box((.21, .29, .006), (dx, dy, .003 + i * .007), 'paper' if i % 2 else 'white', rot=(0, 0, rz))
top = .035 + .002
txt(a, 'FACTURA', (-.01, .09, top), .03, 'charcoal', rot=(0, 0, 4), bold=.02)
for k in range(5):
    a.box((.14, .007, .001), (.0 + .003 * k, .04 - k * .028, top - .0015), 'grey_light', rot=(0, 0, 4))
a.cyl(.03, .002, (.06, -.09, top), 'red', verts=10)                                # stamp
a.box((.03, .06, .004), (.11, .12, .04), 'metal', rot=(0, 0, 4))                  # clip
a.finish()

# 13 Cash box (treasury), lid hinged at the back
a = Asset('prop_cashbox_01')
a.box((.36, .26, .11), (0, 0, .055), 'campaign_green', bevel=.008)
a.box((.05, .01, .04), (0, -.133, .085), 'gold', bevel=.003)                   # lock
a.cyl(.007, .012, (0, -.14, .085), 'black', verts=6, rot=(90, 0, 0))
a.part('lid', pivot=(0, .13, .11))
a.box((.37, .27, .035), (0, 0, .127), 'campaign_green', bevel=.008)
a.box((.12, .02, .015), (0, 0, .152), 'black', bevel=.004)                     # handle grip
for x in (-.06, .06):
    a.box((.012, .012, .025), (x, 0, .152), 'metal_dark')
a.finish()

# 14 Marisa's notebook "PROMESAS de Marisa"
a = Asset('prop_marisa_notebook_01')
a.box((.2, .27, .016), (0, 0, .008), 'paper', bevel=.002)
a.box((.21, .275, .004), (.003, 0, .018), 'white', bevel=.001)                 # cover
txt(a, 'PROMESAS', (.012, .06, .0205), .028, 'navy', rot=(0, 0, 0), bold=.02)
txt(a, 'de Marisa', (.012, .025, .0205), .022, 'purple', rot=(0, 0, 0), bold=.02)
heart(a, .012, -.04, .05, 0, 'red', depth=.002)
a.parts['body']['objs'][-1].rotation_euler = (math.radians(-90), 0, 0)
o = a.parts['body']['objs'][-1]
bpy.context.view_layer.objects.active = o; o.select_set(True)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False); o.select_set(False)
o.location = (0, 0, .0215)
for k in range(7):
    a.cyl(.011, .006, (-.1, .1 - k * .033, .012), 'metal', verts=5, rot=(90, 0, 0))   # spiral rings
a.finish()

# 15 Neighbourhood map with pins (wall)
a = Asset('prop_neighborhood_map_01')
MW, MH = 1.2, .85
a.box((MW, .03, MH), (0, -.015, 0), 'wood', bevel=.006)
a.box((MW - .08, .004, MH - .08), (0, -.032, 0), 'cream')
a.box((.3, .002, .22), (-.3, -.035, .15), 'leaf')                                  # park
a.box((.22, .002, .18), (.33, -.035, -.2), 'sky')                                  # pond
for (x, z, w, h, r) in [(0, .0, 1.1, .03, 0), (0, .0, .03, .76, 0), (-.25, -.18, .55, .025, 12),
                        (.28, .12, .5, .025, -20), (.38, .02, .025, .6, 0), (-.42, 0, .025, .7, 0)]:
    a.box((w, .002, h), (x, -.0355, z), 'white', rot=(0, r, 0))
for (x, z, c) in [(-.32, .2, 'red'), (.1, .22, 'blue'), (.3, -.1, 'red'), (-.15, -.25, 'yellow'),
                  (.18, -.3, 'blue'), (-.4, -.1, 'yellow'), (.42, .3, 'red')]:
    a.cyl(.004, .05, (x, -.06, z), 'metal', verts=4, rot=(90, 0, 0))
    a.ico(.018, (x, -.088, z), c)
a.box((.002, .002, .002), (0, -.002, 0), 'wood')
a.finish()


# 16 / 17 Free-standing boards on legs
def board_on_legs(name, w, h, top, header, header_size):
    a = Asset(name)
    zc = top - h / 2
    post_pair(a, w / 2 + .02, top + .05, m='wood_dark', r=.035)
    a.box((w + .1, .06, h + .1), (0, 0, zc), 'wood', bevel=.01)
    a.box((w, .01, h), (0, -.031, zc), 'wood_light')
    a.box((w * .8, .04, .24), (0, -.02, top + .16), 'cream', bevel=.008)
    txt(a, header, (0, -.042, top + .16), header_size, 'terracotta_dark')
    return a, zc


a, zc = board_on_legs('prop_noticeboard_01', 1.3, .95, 1.85, 'PLAZA DE' + chr(10) + 'LO DE SIEMPRE', .085)
for (x, z, w, h, c, r) in [(-.42, .2, .28, .36, 'paper', -4), (-.05, .25, .24, .3, 'yellow', 3),
                           (.35, .18, .3, .4, 'white', -2), (-.3, -.23, .32, .26, 'sky', 5),
                           (.08, -.18, .22, .3, 'paper', -6), (.45, -.25, .2, .2, 'pink', 8)]:
    a.box((w, .004, h), (x, -.038, zc + z), c, rot=(0, r, 0))
    a.ico(.014, (x, -.046, zc + z + h / 2 - .03), 'red')
for k in range(3):
    a.box((.18, .002, .015), (-.42, -.041, zc + .28 - k * .06), 'grey', rot=(0, -4, 0))
silhouette(a, .35, zc + .13, .5, -.04, body='terracotta', head='charcoal')
a.finish()

a, zc = board_on_legs('prop_finalboard_map_01', 1.3, .95, 1.85, 'CAPÍTULO FINAL', .12)
a.box((1.18, .004, .83), (0, -.038, zc), 'cream')
a.box((.3, .002, .2), (-.35, -.041, zc + .2), 'leaf')
a.box((.25, .002, .15), (.36, -.041, zc - .25), 'sky')
for (x, z, w, h, r) in [(0, 0, 1.1, .03, 0), (0, 0, .03, .78, 0), (-.2, -.2, .6, .025, 15), (.3, .15, .55, .025, -25)]:
    a.box((w, .002, h), (x, -.042, zc + z), 'white', rot=(0, r, 0))
route = [(-.48, -.3), (-.2, -.1), (.05, .05), (.3, .0), (.45, .28)]
for (x0, z0), (x1, z1) in zip(route, route[1:]):
    L = math.hypot(x1 - x0, z1 - z0); ang = math.degrees(math.atan2(z1 - z0, x1 - x0))
    a.box((L, .002, .02), ((x0 + x1) / 2, -.0435, zc + (z0 + z1) / 2), 'red', rot=(0, -ang, 0))
for (x, z), c in zip(route, ['blue', 'yellow', 'blue', 'yellow', 'red']):
    a.cyl(.004, .05, (x, -.06, zc + z), 'metal', verts=4, rot=(90, 0, 0))
    a.ico(.02, (x, -.088, zc + z), c)
star(a, .45, zc + .28, .06, -.05, 'gold')
a.finish()

# 18 HQ sign "SEDE PROVISIONAL"
a = Asset('prop_sign_hq_01')
post_pair(a, .55, 1.45, m='wood_dark', r=.035)
a.box((1.25, .05, .55), (0, 0, 1.15), 'white', bevel=.012)
a.box((1.17, .01, .47), (0, -.026, 1.15), 'paper')
txt(a, 'SEDE', (0, -.033, 1.25), .15, 'navy')
txt(a, 'provisional', (0, -.033, 1.04), .12, 'campaign_green')
a.finish()

# 19 Hall banner "HOY: DEMOCRACIA"
a, zc = sheet_banner('env_hall_sign_01', 2.8, 1.0, 2.3, 'paper', ['HOY:', 'DEMOCRACIA'], ['red', 'navy'], hearts=False)
star(a, -1.18, zc + .3, .1, -.014, 'gold')
star(a, 1.18, zc + .3, .1, -.014, 'gold')
a.finish()

# 20 Blue street plaque (wall)
a = Asset('prop_street_sign_01')
a.box((.62, .02, .34), (0, -.01, 0), 'white', bevel=.006)
a.box((.58, .006, .3), (0, -.022, 0), 'blue')
txt(a, 'Plaza de', (0, -.0265, .055), .085, 'white')
txt(a, 'lo de siempre', (0, -.0265, -.055), .075, 'white')
for x in (-.27, .27):
    a.cyl(.01, .008, (x, -.026, 0), 'metal', verts=6, rot=(90, 0, 0))
a.finish()


# 21-23 Cardboard boxes
def carton(name, sx, sy, sz, open_flaps=False):
    a = Asset(name)
    a.box((sx, sy, sz), (0, 0, sz / 2), 'wood_light', bevel=.006)
    if open_flaps:
        a.box((sx - .02, sy - .02, .01), (0, 0, sz - .01), 'wood')                   # darker inside
        for s in (-1, 1):
            a.box((sx, .006, sy * .45), (0, s * (sy / 2 + sy * .17), sz + sy * .17), 'wood_light', rot=(s * 50, 0, 0))
        a.box((.006, sy * .9, sx * .35), (-sx / 2 - sx * .08, 0, sz + sx * .1), 'wood_light', rot=(0, 30, 0))
    else:
        a.box((sx + .002, .002, sz * .02 + .001), (0, 0, sz + .001), 'wood')           # flap seam
        a.box((.07 if sx > .4 else .05, sy + .004, .003), (0, 0, sz + .001), 'sand')   # tape over top
        a.box((.07 if sx > .4 else .05, .003, sz * .3), (0, -sy / 2 - .001, sz - sz * .15), 'sand')
    a.box((sx * .3, .003, sz * .2), (sx * .2, -sy / 2 - .002, sz * .4), 'white')       # shipping label
    a.box((sx * .12, .003, .012), (-sx * .25, -sy / 2 - .002, sz * .6), 'charcoal')    # "this way up" mark
    a.finish()


carton('prop_cardboard_box_01', .32, .24, .22)
carton('prop_cardboard_box_02', .5, .38, .36)
carton('prop_cardboard_box_03', .7, .5, .55, open_flaps=True)

# 24 Paint kit: tin + roller
a = Asset('prop_paint_kit_01')
a.cyl(.1, .2, (-.08, 0, .1), 'metal', verts=12)
a.cyl(.101, .1, (-.08, 0, .1), 'red', verts=12)
a.box((.07, .005, .04), (-.08, -.1, .1), 'white')
a.cyl(.098, .012, (-.08, 0, .206), 'metal_dark', verts=12)
a.cyl(.04, .03, (-.04, -.05, .215), 'campaign_green', verts=8)                    # spilled drip on lid
a.torus(.1, .004, (-.08, 0, .19), 'metal_dark', major=10, minor=3, rot=(90, 0, 0))   # bail handle
a.cyl(.04, .18, (.12, -.02, .04), 'campaign_green', verts=8, rot=(90, 0, 0))      # roller sleeve (axis Y)
a.cyl(.006, .06, (.12, -.115, .04), 'metal', verts=4, rot=(90, 0, 0))
a.cyl(.006, .12, (.18, -.145, .04), 'metal', verts=4, rot=(0, 90, 0))
a.cyl(.018, .16, (.31, -.145, .04), 'yellow', verts=6, rot=(0, 90, 0))           # handle
a.finish()

# 25 Cable mess: coil + power strip
a = Asset('prop_cable_mess_01')
for k, (r, dx) in enumerate([(.13, 0), (.12, .015), (.11, -.01)]):
    a.torus(r, .008, (dx, .02 * k, .009 + .012 * k), 'black', major=14, minor=3)
a.box((.32, .07, .04), (.25, -.15, .02), 'white', rot=(0, 0, 15), bevel=.008)
for k in range(4):
    x = .16 + k * .065
    a.cyl(.016, .004, (x * math.cos(math.radians(15)) + .01, -.15 + (x - .25) * math.sin(math.radians(15)), .041),
          'charcoal', verts=8)
a.box((.012, .012, .012), (.42, -.105, .022), 'red')                               # switch
a.cyl(.007, .2, (.08, -.13, .007), 'black', verts=4, rot=(0, 90, -40))           # cable link coil-strip
a.finish()

# 26 Ballot box (translucent, slotted lid, ballots inside)
a = Asset('prop_ballot_box_01')
BX, BY, BZ = .46, .36, .42
a.box((BX + .02, BY + .02, .03), (0, 0, .015), 'white', bevel=.006)
for (x, y, rz) in [(-.1, -.05, 20), (.08, .06, -35), (0, 0, 70), (.12, -.08, 10), (-.08, .09, -10)]:
    a.box((.1, .14, .004), (x, y, .04 + abs(x) * .3), 'white', rot=(8, -12, rz))
a.box((.16, .1, .004), (-.05, .02, .07), 'sand', rot=(-15, 10, 30))               # envelope
a.box((.12, .16, .004), (.06, -.02, .1), 'paper', rot=(20, 10, -50))
a.box((BX, BY, BZ), (0, 0, .03 + BZ / 2), 'ballot_glass')
for x in (-1, 1):                                                                    # white edge posts
    for y in (-1, 1):
        a.box((.025, .025, BZ), (x * BX / 2, y * BY / 2, .03 + BZ / 2), 'white')
ZT = .03 + BZ
a.box((BX + .03, BY * .5 - .02, .03), (0, -(BY * .25 + .01), ZT + .015), 'white', bevel=.005)
a.box((BX + .03, BY * .5 - .02, .03), (0, BY * .25 + .01, ZT + .015), 'white', bevel=.005)
for s in (-1, 1):
    a.box((.07, .045, .03), (s * (BX / 2 - .02), 0, ZT + .015), 'white')
a.box((BX - .1, .044, .006), (0, 0, ZT + .003), 'charcoal')                        # slot (dark)
a.box((.14, .002, .05), (0, -BY / 2 - .002, .03 + BZ - .06), 'navy')               # seal sticker
a.finish()

# 27 Ballot paper + envelope
a = Asset('prop_ballot_paper_01')
a.box((.16, .11, .006), (-.03, 0, .003), 'sand', rot=(0, 0, -8))                  # envelope
a.poly([(-.11, -.05, .0065), (.05, -.05, .0065), (-.03, .0, .0065)], [[0, 1, 2]], 'ochre', loc=(0, 0, 0))
a.box((.1, .16, .002), (.07, .03, .008), 'white', rot=(0, 0, 12))
for k in range(4):
    a.box((.06, .006, .0005), (.074 - k * .004, .07 - k * .03, .0093), 'grey_light', rot=(0, 0, 12))
    a.box((.012, .012, .0005), (.03 - k * .006, .065 - k * .03, .0093), 'charcoal', rot=(0, 0, 12))
a.finish()

# 28 Count table: white folding table with ballot stacks
a = Asset('prop_count_table_01')
TW, TD, TH = 1.8, .75, .74
a.box((TW, TD, .04), (0, 0, TH - .02), 'white', bevel=.01)
a.box((TW - .1, TD - .1, .04), (0, 0, TH - .06), 'grey_light')
for s in (-1, 1):
    for y in (-1, 1):
        a.cyl(.018, TH - .06, (s * (TW / 2 - .15), y * (TD / 2 - .08), (TH - .06) / 2), 'metal_dark', verts=6,
              rot=(y * 6, 0, 0))
    a.cyl(.012, TD - .16, (s * (TW / 2 - .15), 0, .25), 'metal_dark', verts=6, rot=(90, 0, 0))
for (x, y, n, rz, band) in [(-.6, .05, 6, 5, 'red'), (-.3, -.1, 9, -4, 'blue'), (0, .1, 4, 12, None),
                            (.32, -.05, 11, -8, 'yellow'), (.62, .12, 7, 3, 'campaign_green')]:
    h = .012 * n
    a.box((.21, .28, h), (x, y, TH + h / 2), 'white', rot=(0, 0, rz), bevel=.004)
    if band:
        a.box((.05, .284, h * .7), (x, y, TH + h / 2), band, rot=(0, 0, rz))
a.box((.16, .1, .004), (.0, -.25, TH + .002), 'sand', rot=(0, 0, -20))
a.box((.1, .14, .002), (-.35, -.27, TH + .001), 'white', rot=(0, 0, 30))
a.finish()

# 29 Victory banner (tintable, party name label, gold stars)
a = Asset('prop_victory_banner_01')
post_pair(a, 1.6, 2.6, m='metal', r=.035)
a.prism([(-1.5, 1.55), (1.5, 1.55), (1.5, 2.45), (0, 2.38), (-1.5, 2.45)], .02, (0, 0, 0), 'tint_party')
a.box((3.0, .03, .06), (0, -.002, 2.45), 'gold')
a.box((3.0, .03, .06), (0, -.002, 1.55), 'gold')
a.box((2.5, .012, .36), (0, -.014, 2.18), 'cream')
txt(a, 'VICTORIA', (0, -.022, 2.18), .3, 'red')
a.label('party_name', (2.2, .3), (0, -.0125, 1.8))
for x in (-1.3, 1.3):
    star(a, x, 2.0, .14, -.015, 'gold')
for k in range(7):                                                                  # bunting
    x = -1.4 + k * .466
    a.prism([(x - .1, 2.59), (x + .1, 2.59), (x, 2.42)], .01, (0, 0, 0), ['red', 'yellow', 'blue'][k % 3])
a.box((3.2, .01, .01), (0, 0, 2.595), 'charcoal')
a.finish()

# 30 Balloon cluster
a = Asset('prop_balloon_cluster_01')
a.cyl(.06, .05, (0, 0, .025), 'charcoal', verts=8)                                 # weight
for (x, y, z, c) in [(-.18, .02, 1.65, 'red'), (.16, -.04, 1.7, 'yellow'), (0, .08, 1.9, 'blue'),
                     (-.05, -.12, 1.52, 'yellow'), (.22, .1, 1.5, 'red'), (-.25, .12, 1.88, 'blue')]:
    a.sphere(.15, (x, y, z), c, seg=8, rings=6, scale=(1, 1, 1.18))
    a.cone(.025, .04, (x, y, z - .19), c, verts=6)
    zb = z - .21
    L = math.sqrt(x * x + y * y + (zb - .05) ** 2)
    o = a.cyl(.003, L, ((x) / 2, y / 2, (zb + .05) / 2), 'white', verts=3)
    d = Vector((x, y, zb - .05)).normalized()
    o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d)
    o.location = (x / 2, y / 2, (zb + .05) / 2)
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False); o.select_set(False)
a.finish()

export_all('campaign')
