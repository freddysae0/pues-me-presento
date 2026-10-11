"""Estructura y entorno: suelos, paredes, puertas, ventanas, fachadas de la plaza, tiendas y escenario.

blender -b --python tools/blender/build_structure.py

Convenciones locales (además de docs/ART.md):
- Fachadas/tiendas: módulo plano, cara frontal del muro en y=0 mirando -Y, muro hacia +Y (0.4 m),
  origen en el centro inferior de la cara frontal. Detalles sobresalen hacia -Y. Edificios y comercios de la plaza
  tienen además volumen completo hacia +Y (body(): ~7 m, bakery 3.4 m, ayuntamiento 9 m) con laterales,
  trasera y cubierta; mantener el ancho de fachada para que encajen canto con canto en world.js.
- Suelos (tarima, losas): superficie pisable en z=0, grosor hacia abajo.
- Piezas móviles: part() con pivote en bisagra (puertas) o eje superior (persiana).
"""
import sys, math, random
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import bpy
from mathutils import Vector, Matrix
import kit_common as kc
from kit_common import *

reset_scene()
R = random.Random(7)

# --- local workarounds for kit_common bugs (do not edit kit_common.py) ---
# 1) Asset.text ignores `rot` (rotation reset to 0 before transform_apply) -> text lay flat on XY.
# 2) Asset.prism with counter-clockwise profiles leaves inverted cap normals.
import bmesh

def _text_fixed(self, s, loc, size, m, rot=(90, 0, 0), depth=.01, align='CENTER'):
    bpy.ops.object.text_add(location=loc)
    o = bpy.context.object; o.data.body = s; o.data.size = size; o.data.extrude = depth
    o.data.align_x = align; o.data.align_y = 'CENTER'; o.data.resolution_u = 2
    bpy.ops.object.convert(target='MESH')
    o = bpy.context.object
    kc._apply(o, rot)
    return self.add(kc._finish_obj(o, m))

_prism_orig = Asset.prism
def _prism_fixed(self, profile, depth, loc, m, rot=(0, 0, 0)):
    o = _prism_orig(self, profile, depth, loc, m, rot)
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(o.data); bm.free(); o.data.update()
    return o

Asset.text = _text_fixed
Asset.prism = _prism_fixed


# ---------------------------------------------------------------- helpers
def mark(a):
    return len(a.parts[a.current]['objs'])

def xform(a, start, angle=0.0, offset=(0, 0, 0)):
    """Rotate (about Z through origin) and move every object added to the current part since `start`."""
    rot = Matrix.Rotation(math.radians(angle), 4, 'Z')
    for o in a.parts[a.current]['objs'][start:]:
        o.location = (rot @ o.location) + Vector(offset)
        o.rotation_euler.z += math.radians(angle)

def window(a, x, z0, w=1.0, h=1.6, frame='white', shutter='green', sill='stone', blind=True, wings=True, y=0.0):
    zc = z0 + h / 2
    a.box((w + .16, .08, h + .14), (x, y - .02, zc), frame)
    a.box((w, .04, h), (x, y - .07, zc), 'slate')
    a.box((.05, .03, h), (x, y - .1, zc), frame)
    a.box((w, .03, .05), (x, y - .1, z0 + h * .62), frame)
    if blind:
        a.box((w + .04, .05, h * .3), (x, y - .12, z0 + h - h * .15), shutter)
    if wings:
        for s in (-1, 1):
            a.box((w * .48, .05, h + .04), (x + s * (w / 2 + .08 + w * .24), y - .03, zc), shutter)
    a.box((w + .32, .24, .08), (x, y - .1, z0 - .04), sill)

def balcony(a, x, z0, w, rail='metal_dark', slab='stone'):
    bw = w + .5
    a.box((bw, .62, .1), (x, -.31, z0 - .05), slab, bevel=.02)
    a.box((bw, .05, .05), (x, -.6, z0 + .95), rail)
    a.box((bw, .04, .04), (x, -.6, z0 + .12), rail)
    for s in (-1, 1):
        a.box((.04, .6, .05), (x + s * bw / 2, -.3, z0 + .95), rail)
        a.box((.04, .04, .95), (x + s * bw / 2, -.6, z0 + .47), rail)
    n = int(bw / .19)
    for i in range(1, n):
        a.box((.025, .025, .85), (x - bw / 2 + i * bw / n, -.6, z0 + .52), rail)

def awning(a, x, z_top, w, d, drop, cols, n=None, valance=.28, y0=0.0):
    """Sloped striped awning attached to the wall at z_top, projecting to -Y by d."""
    n = n or max(2, int(w / .3))
    ang = math.degrees(math.atan2(drop, d))
    L = math.hypot(d, drop)
    sw = w / n
    for i in range(n):
        c = cols[i % len(cols)]
        cx = x - w / 2 + sw * (i + .5)
        a.box((sw, L, .05), (cx, y0 - d / 2, z_top - drop / 2), c, rot=(ang, 0, 0))
        # scalloped valance: a pointed flap per stripe
        a.prism([(-sw / 2, 0), (sw / 2, 0), (sw / 2, -valance * .6), (0, -valance), (-sw / 2, -valance * .6)], .04,
                (cx, y0 - d - .01, z_top - drop), c)
    for s in (-1, 1):  # side arms
        a.box((.03, L, .03), (x + s * w / 2, y0 - d / 2, z_top - drop / 2 - .05), 'metal_dark', rot=(ang, 0, 0))

def flower_box(a, x, z, w, flowers=('red', 'pink')):
    a.box((w, .22, .18), (x, -.2, z + .09), 'terracotta', bevel=.015)
    a.box((w - .05, .18, .12), (x, -.2, z + .22), 'leaf_dark')
    k = max(2, int(w / .22))
    for i in range(k):
        a.ico(.07, (x - w / 2 + .1 + i * (w - .2) / max(1, k - 1), -.24, z + .3), flowers[i % len(flowers)])

def pot_plant(a, x, y, z, r=.16, leaf='leaf', pot='terracotta'):
    a.cyl(r, r * 1.5, (x, y, z + r * .75), pot, verts=8, r2=r * .75)
    a.ico(r * 1.35, (x, y, z + r * 1.5 + r * .9), leaf, scale=(1, 1, .9))

def sign(a, s, x, z, w, h, board='cream', ink='wood_dark', size=None, trim='wood_dark', y=0.0):
    a.box((w + .1, .1, h + .1), (x, y - .06, z), trim, bevel=.02)
    a.box((w, .06, h), (x, y - .12, z), board)
    a.text(s, (x, y - .16, z), size or h * .55, ink, depth=.015)

def tree(a, x, y, h=4.0, r=1.3):
    a.cyl(.13, h * .55, (x, y, h * .275), 'wood', verts=6, r2=.09)
    a.ico(r, (x, y, h * .62), 'leaf', scale=(1, 1, .85))
    a.ico(r * .7, (x + r * .5, y - .2, h * .5), 'leaf_dark')
    a.ico(r * .65, (x - r * .55, y + .1, h * .78), 'leaf')

def building_shell(a, w, floors, wall, band, trim='cream', roof='terracotta', gh=3.6, fh=3.0, roof_pitch=False):
    """Front facade slab only; the volume behind it (sides, rear, roof) comes from body()."""
    H = gh + fh * floors
    a.box((w, .4, H), (0, .2, H / 2), wall, bevel=.03)
    a.box((w + .04, .07, gh), (0, -.02, gh / 2), band)                          # planta baja
    a.box((w + .1, .14, .45), (0, -.05, .22), 'stone_dark')                       # zócalo
    for s in (-1, 1):                                                            # pilastras de esquina
        a.box((.32, .1, H - gh), (s * (w / 2 - .14), -.03, gh + (H - gh) / 2), trim)
    for f in range(floors):                                                      # impostas
        a.box((w + .12, .2, .14), (0, -.06, gh + f * fh), trim)
    a.box((w + .3, .6, .3), (0, -.05, H + .1), trim, bevel=.03)                   # cornisa
    if roof_pitch:
        a.prism([(-.75, H + .25), (.45, H + .25), (.45, H + 1.0)], w + .4, (0, 0, 0), roof, rot=(0, 0, 90))
        a.box((w + .42, .12, .1), (0, -.72, H + .28), 'terracotta_dark')
    return H

# ---------------------------------------------------------------- volumen de edificio
# Todo edificio/comercio de la plaza es un bloque cerrado: la fachada (y=0, mira -Y) se conserva y body()
# añade el cuerpo hacia +Y (fondo D), laterales con ventanas o medianera, fachada trasera y cubierta.
def side_window(a, sx, y, z0, w=.9, h=1.5, frame='white', shutter='green', sill='stone', wings=True):
    """Ventana en un muro lateral cuya cara exterior está en x=sx (mira hacia el signo de sx)."""
    s = 1 if sx > 0 else -1
    zc = z0 + h / 2
    a.box((.08, w + .16, h + .14), (sx + s * .02, y, zc), frame)
    a.box((.04, w, h), (sx + s * .07, y, zc), 'slate')
    a.box((.03, .05, h), (sx + s * .1, y, zc), frame)
    if wings:
        for t in (-1, 1):
            a.box((.05, w * .48, h + .04), (sx + s * .03, y + t * (w / 2 + .08 + w * .24), zc), shutter)
    a.box((.24, w + .3, .08), (sx + s * .1, y, z0 - .04), sill)

def rear_window(a, x, yb, z0, w=.9, h=1.4, frame='white', blind=None):
    """Ventana sencilla en la fachada trasera (cara en y=yb, mira +Y)."""
    zc = z0 + h / 2
    a.box((w + .14, .06, h + .14), (x, yb + .02, zc), frame)
    a.box((w, .04, h), (x, yb + .05, zc), 'slate')
    if blind:
        a.box((w + .02, .05, h * .45), (x, yb + .07, z0 + h - h * .22), blind)
    a.box((w + .24, .18, .07), (x, yb + .08, z0 - .03), 'stone')

def chimney(a, x, y, zb, top, col='brick', cap='stone_dark'):
    a.box((.55, .55, top - zb), (x, y, (zb + top) / 2), col)
    a.box((.75, .75, .12), (x, y, top + .06), cap)
    a.box((.22, .22, .3), (x - .1, y, top + .27), 'terracotta_dark')
    a.box((.22, .22, .22), (x + .14, y + .05, top + .23), 'terracotta_dark')

def antenna(a, x, y, zb, h=2.2):
    a.cyl(.03, h, (x, y, zb + h / 2), 'metal_dark', verts=4)
    for k, L in enumerate((1.0, .75, .5)):
        a.box((L, .03, .03), (x, y, zb + h - .15 - k * .32), 'metal_dark')
    a.box((.04, .5, .03), (x, y, zb + h - .15), 'metal_dark')

def water_tank(a, x, y, zb):
    for dx in (-.4, .4):
        for dy in (-.4, .4):
            a.box((.07, .07, .5), (x + dx, y + dy, zb + .25), 'metal_dark')
    a.box((1.0, 1.0, .06), (x, y, zb + .53), 'metal_dark')
    a.cyl(.58, 1.1, (x, y, zb + 1.11), 'white', verts=10)
    a.cyl(.62, .08, (x, y, zb + 1.7), 'grey_light', verts=10)

def body(a, w, H, D=7.0, wall='ochre', trim='cream', band=None, gh=3.6, fh=3.0, floors=3, sides=('win', 'win'),
         roof='gable', roof_col='terracotta', frame='white', shutter='green', chimneys=(), antennas=(), tanks=(),
         ad=None, ridge=.55, eave=.55, win_w=.9, win_h=1.5, rear_door=True, side_ground=True, med_col='sand'):
    """Volume behind a facade of width w and height H. sides = (lado -X, lado +X): 'win' | 'med' | 'none'.
    roof 'gable' (caballete paralelo a la fachada) o 'flat' (azotea con pretil). Devuelve función altura de cubierta."""
    y0 = .2                                                   # empieza dentro del muro de fachada (sin z-fighting)
    a.box((w - .02, D - y0, H), (0, (D + y0) / 2, H / 2), wall)
    if band:                                                  # planta baja envolvente
        a.box((w + .04, D - y0 + .04, gh), (0, (D + y0) / 2 + .02, gh / 2), band)
    a.box((w + .1, D - y0 + .1, .45), (0, (D + y0) / 2 + .05, .22), 'stone_dark')          # zócalo
    for f in range(floors):                                   # impostas en laterales y trasera
        a.box((w + .12, D - y0 + .12, .14), (0, (D + y0) / 2 + .06, gh + f * fh), trim)
    a.box((w + .3, D - y0 + .3, .3), (0, (D + y0) / 2 + .15, H + .1), trim)                # cornisa perimetral
    for s in (-1, 1):                                         # cantoneras traseras
        a.box((.3, .3, H - .45), (s * (w / 2 - .1), D - .1, .45 + (H - .45) / 2), trim)
    # laterales
    ny = max(1, int((D - .8) / 2.4))
    ys = [y0 + (D - y0) * (i + .5) / ny for i in range(ny)]
    for s, kind in zip((-1, 1), sides):
        sx = s * (w / 2 - .01)
        if kind == 'win':
            for f in range(floors):
                for y in ys:
                    side_window(a, sx, y, gh + f * fh + (fh - win_h) * .55, w=win_w, h=win_h, frame=frame, shutter=shutter)
            if side_ground:
                side_window(a, sx, ys[-1], 1.1, w=win_w, h=1.3, frame=frame, shutter=shutter, wings=False)
        elif kind == 'med':                                   # medianera: revoco con parches, ventanucos, bajante
            a.box((.04, D - y0 - .6, H - gh - .3), (sx + s * .02, (D + y0) / 2, gh + (H - gh) / 2), med_col)
            for (py, pz, sy, sz, c) in ((.3, .35, .35, .25, 'stone'), (.65, .7, .25, .2, 'concrete'), (.2, .8, .2, .15, wall)):
                a.box((.03, (D - y0) * sy, (H - gh) * sz), (sx + s * .05, y0 + (D - y0) * py, gh + (H - gh) * pz), c)
            for f in range(floors):
                a.box((.06, .45, .45), (sx + s * .04, D - 1.2, gh + f * fh + 1.6), 'slate')
            a.cyl(.08, H - .3, (sx + s * .12, D - .5, (H - .3) / 2 + .15), 'grey', verts=6)
            if ad:                                            # anuncio antiguo pintado
                txt, board, ink = ad
                zc = gh + (H - gh) * .55
                bw = min(D - 1.6, 4.6)
                a.box((.03, bw, 1.5), (sx + s * .07, D * .45, zc), board)
                a.text(txt, (sx + s * .09, D * .45, zc), .42, ink, rot=(90, 0, 90 * s), depth=.01)
    # trasera
    yb = D
    nx = max(1, int(w / 2.4))
    xs = [-w / 2 + w * (i + .5) / nx for i in range(nx)]
    for f in range(floors):
        for x in xs:
            rear_window(a, x, yb, gh + f * fh + (fh - win_h) * .55, w=win_w * .9, h=win_h * .9, frame=frame,
                        blind=shutter if (f + int(x * 3)) % 2 else None)
    if rear_door:
        a.box((1.1, .08, 2.2), (xs[0], yb + .04, 1.1), 'wood_dark')
        a.box((1.3, .1, .12), (xs[0], yb + .06, 2.26), trim)
    for x in xs[1:] or xs:
        rear_window(a, x + (.0 if len(xs) > 1 else .9), yb, 1.2, w=.8, h=1.1, frame=frame)
    # cubierta
    top = H + .25
    if roof == 'gable':
        rh = (D / 2) * ridge
        th = math.atan2(rh, D / 2)
        a.prism([(y0, top - .02), (D, top - .02), (D / 2 + y0 / 2, top + rh - .05)], w - .1, (0, 0, 0), wall, rot=(0, 0, 90))
        L = math.hypot(D / 2 + eave, (D / 2 + eave) * math.tan(th))
        for side in (-1, 1):                                  # faldones
            ye, ze = (-eave if side < 0 else D + eave), top - eave * math.tan(th)   # alero
            yr, zr = D / 2, top + rh
            cy, cz = (ye + yr) / 2, (ze + zr) / 2
            ang = math.degrees(th) * (1 if side < 0 else -1)
            nn = (-math.sin(math.radians(ang)), math.cos(math.radians(ang)))
            a.box((w + .5, L, .16), (0, cy + nn[0] * .08, cz + nn[1] * .08), 'terracotta_dark', rot=(ang, 0, 0))
            k = int((w + .4) / .42)
            for i in range(k):                                # tejas árabes: canales en la pendiente
                x = -(w + .4) / 2 + (i + .5) * (w + .4) / k
                a.box((.22, L - .05, .1), (x, cy + nn[0] * .2, cz + nn[1] * .2), roof_col, rot=(ang, 0, 0))
            a.box((w + .52, .1, .14), (0, ye, ze - .02), 'terracotta_dark')          # canalón
        a.box((w + .6, .36, .22), (0, D / 2, top + rh + .12), 'terracotta_dark')                  # cumbrera
        def roof_z(y): return top + rh * max(0.0, 1 - abs(y - D / 2) / (D / 2))
    else:                                                     # azotea con pretil
        a.box((w - .3, D - .3, .06), (0, D / 2 + .1, top + .03), 'concrete')
        for s in (-1, 1):
            a.box((.2, D - .3, .8), (s * (w / 2 - .05), D / 2 + .1, top + .4), wall)
            a.box((.28, D - .3, .08), (s * (w / 2 - .05), D / 2 + .1, top + .84), trim)
        a.box((w - .1, .2, .8), (0, D - .05, top + .4), wall)
        a.box((w - .1, .28, .08), (0, D - .05, top + .84), trim)
        a.box((w - .1, .2, .6), (0, .2, top + .3), wall)
        def roof_z(y): return top
    for (fx, fy) in chimneys:
        x, y = fx * w / 2, fy * D
        zb = roof_z(y) - .3
        chimney(a, x, y, zb, max(zb + 1.2, (top + (D / 2) * ridge + .7) if roof == 'gable' else zb + 1.4))
    for (fx, fy) in antennas:
        antenna(a, fx * w / 2, fy * D, roof_z(fy * D) - .1)
    for (fx, fy) in tanks:
        water_tank(a, fx * w / 2, fy * D, roof_z(fy * D))
    return roof_z

def upper_floors(a, w, base, floors, wall, trim='white', fh=3.0, frame='white', shutter='green', kind='plain', nwin=2,
                 win_w=.9, win_h=1.6, flowers=('red', 'pink')):
    """Plantas sobre un comercio: muro de fachada, impostas, pilastras, ventanas y cornisa. Devuelve H."""
    H = base + floors * fh
    a.box((w, .4, H - base), (0, .2, base + (H - base) / 2), wall)
    for s in (-1, 1):
        a.box((.26, .1, H - base), (s * (w / 2 - .12), -.03, base + (H - base) / 2), trim)
    for f in range(1, floors):
        a.box((w + .12, .2, .14), (0, -.06, base + f * fh), trim)
    a.box((w + .3, .6, .3), (0, -.05, H + .1), trim, bevel=.03)
    xs = [-w / 2 + w * (i + .5) / nwin for i in range(nwin)]
    for f in range(floors):
        z = base + f * fh + (fh - win_h) * .5
        for i, x in enumerate(xs):
            if kind == 'balcony' and f == 0:
                window(a, x, z - .25, w=win_w, h=win_h + .35, frame=frame, shutter=shutter, blind=False)
                balcony(a, x, z - .25, win_w)
            else:
                window(a, x, z, w=win_w, h=win_h, frame=frame, shutter=shutter, wings=(kind != 'closed'),
                       blind=True)
                if kind in ('flowers', 'balcony'):
                    flower_box(a, x, z, win_w + .1, flowers)
            if kind == 'closed':                              # persiana bajada del todo
                a.box((win_w + .02, .05, win_h * .9), (x, -.13, z + win_h * .5), shutter)
    return H

def shop_shell(a, w, h, wall, trim='white'):
    a.box((w, .4, h), (0, .2, h / 2), wall, bevel=.03)
    a.box((w + .1, .14, .35), (0, -.05, .17), 'stone_dark')
    a.box((w + .25, .5, .22), (0, 0, h + .05), trim, bevel=.03)
    for s in (-1, 1):
        a.box((.28, .12, h), (s * (w / 2 - .1), -.04, h / 2), trim)

def shop_door(a, x, w=1.0, h=2.2, frame='wood_dark', leaf='wood', glass=True):
    a.box((w + .2, .1, h + .12), (x, -.04, (h + .12) / 2), frame)
    a.box((w, .05, h), (x, -.09, h / 2), leaf)
    if glass:
        a.box((w * .7, .03, h * .45), (x, -.12, h * .66), 'slate')
    a.box((.04, .06, .2), (x + w * .38, -.15, h * .48), 'gold')

def shop_window(a, x, z0, w, h, frame='wood_dark'):
    a.box((w + .16, .1, h + .16), (x, -.04, z0 + h / 2), frame)
    a.box((w, .04, h), (x, -.1, z0 + h / 2), 'slate')
    a.box((w + .3, .3, .1), (x, -.15, z0 - .05), 'stone')

# ---------------------------------------------------------------- interior
a = Asset('env_interior_floor_01')
a.box((2, 2, .03), (0, 0, -.045), 'wood_dark')
rows = 10
for r in range(rows):
    y = -1 + (r + .5) * .2
    cut = R.uniform(-.6, .6)
    for (x0, x1) in ((-1, cut), (cut, 1)):
        a.box((x1 - x0 - .012, .19, .04), ((x0 + x1) / 2, y, -.02), R.choice(['wood_light', 'wood_light', 'wood', 'sand']))

a = Asset('env_interior_wall_01')
a.box((2, .15, 3), (0, 0, 1.5), 'white')
a.box((2, .04, .14), (0, -.09, .07), 'wood')           # zócalo
a.box((2, .03, .04), (0, -.09, .15), 'wood_dark')
a.box((2, .04, .14), (0, .09, .07), 'wood')
a.box((2.02, .17, .08), (0, 0, 2.96), 'cream')          # moldura superior

a = Asset('env_interior_corner_01')
a.box((1.075, .15, 3), (.4625, 0, 1.5), 'white')
a.box((.15, 1.075, 3), (0, -.4625, 1.5), 'white')
a.box((1.0, .04, .14), (.575, -.095, .07), 'wood')
a.box((.04, 1.0, .14), (.095, -.575, .07), 'wood')
a.box((.17, .17, 3), (0, 0, 1.5), 'cream', bevel=.02)   # canto
a.box((1.075, .17, .08), (.4625, 0, 2.96), 'cream')
a.box((.17, 1.075, .08), (0, -.4625, 2.96), 'cream')

a = Asset('prop_door_01')
for s in (-1, 1):
    a.box((.12, .2, 2.2), (s * .51, 0, 1.1), 'white', bevel=.015)
a.box((1.14, .2, .12), (0, 0, 2.16), 'white', bevel=.015)
a.box((.9, .2, .02), (0, 0, .01), 'stone')
a.part('leaf', pivot=(-.45, -.03, 0))
a.box((.9, .05, 2.1), (0, -.03, 1.05), 'campaign_green', bevel=.012)
for zc in (.55, 1.5):
    a.box((.6, .03, .6 if zc < 1 else .8), (0, -.07, zc), 'green_dark', bevel=.01)
a.cyl(.04, .06, (.35, -.1, 1.0), 'gold', rot=(90, 0, 0))
a.box((.06, .04, .22), (.35, -.07, 1.0), 'gold')
a.cyl(.02, .02, (0, -.065, 1.6), 'gold', rot=(90, 0, 0))   # mirilla
a.box((.22, .02, .06), (0, -.065, 1.25), 'gold')            # buzón

a = Asset('prop_doorframe_01')
for s in (-1, 1):
    a.box((.14, .22, 2.25), (s * .52, 0, 1.125), 'wood', bevel=.02)
a.box((1.22, .24, .16), (0, 0, 2.3), 'wood', bevel=.02)
a.box((1.0, .04, .08), (0, -.12, 2.2), 'wood_dark')
a.box((1.0, .6, .03), (0, -.45, .015), 'campaign_green', bevel=.01)
a.box((.84, .46, .012), (0, -.45, .034), 'sand')

a = Asset('prop_door_double_01')
for s in (-1, 1):
    a.box((.2, .3, 2.6), (s * .9, 0, 1.3), 'wood_dark', bevel=.02)
a.box((2.0, .32, .25), (0, 0, 2.72), 'wood_dark', bevel=.02)
a.box((1.0, .05, .14), (0, -.17, 2.72), 'gold')
def dleaf(s):
    """s=-1 left leaf (hinge x=-0.8), s=+1 right leaf (hinge x=+0.8); absolute coordinates."""
    a.box((.8, .06, 2.5), (s * .4, -.03, 1.25), 'red_dark', bevel=.012)
    a.box((.6, .03, .8), (s * .4, -.075, .6), 'wood_dark')
    a.cyl(.17, .03, (s * .4, -.075, 1.75), 'slate', verts=10, rot=(90, 0, 0))
    a.torus(.17, .025, (s * .4, -.08, 1.75), 'gold', major=10, rot=(90, 0, 0))
    a.box((.04, .06, .45), (s * .08, -.1, 1.15), 'gold')
a.part('leaf_l', pivot=(-.8, 0, 0)); dleaf(-1)
a.part('leaf_r', pivot=(.8, 0, 0)); dleaf(1)

a = Asset('env_window_01')
# hueco de 1.0 x 1.3; z=0 en el pie del alféizar (montar a ~0.9 m sobre el suelo)
a.box((1.24, .22, 1.5), (0, 0, .78), 'white', bevel=.015)
a.box((1.0, .24, 1.25), (0, 0, .76), 'sky')
for zz in (.48, 1.0):
    a.box((1.0, .26, .03), (0, 0, zz), 'white')
a.box((.04, .26, 1.25), (0, 0, .76), 'white')
a.box((1.36, .14, .22), (0, -.08, 1.62), 'green_dark', bevel=.015)    # cajón de persiana
for i in range(5):
    a.box((1.0, .03, .085), (0, -.13, 1.45 - i * .09), 'green')       # persiana bajada a media altura
a.box((1.44, .36, .07), (0, -.1, .035), 'stone', bevel=.012)
pot_plant(a, .4, -.2, .07, r=.11)
pot_plant(a, -.38, -.2, .07, r=.09, leaf='leaf_dark')
a.ico(.05, (-.42, -.25, .33), 'red'); a.ico(.05, (-.32, -.24, .3), 'pink')

a = Asset('env_ceiling_beams_01')
a.box((4, 4, .12), (0, 0, 3.06), 'white')
for x in (-1.5, 0, 1.5):
    a.box((.22, 4, .26), (x, 0, 2.87), 'wood', bevel=.02)
for y in (-1.95, 1.95):
    a.box((4, .2, .2), (0, y, 2.9), 'wood_dark', bevel=.02)
a.cyl(.03, .4, (0, 0, 2.6), 'black', verts=6)                        # punto de luz
a.cone(.22, .2, (0, 0, 2.35), 'mustard', verts=10, rot=(0, 0, 0))
a.ico(.08, (0, 0, 2.25), 'lamp')

a = Asset('env_flat_exterior_view_01')
a.box((6, .05, 4), (0, .4, 2), 'sky')
a.ico(.5, (-1.8, .35, 3.4), 'white', scale=(1.8, .2, .6))
a.ico(.4, (1.9, .35, 3.6), 'white', scale=(2, .2, .5))
blds = [(-2.4, 1.4, 2.8, 'ochre'), (-1.05, 1.3, 3.2, 'peach'), (.3, 1.4, 2.5, 'cream'), (1.6, 1.2, 3.0, 'terracotta'), (2.6, .8, 2.2, 'sand')]
for (bx, bw, bh, c) in blds:
    a.box((bw, .08, bh), (bx, .3, bh / 2), c)
    a.box((bw + .08, .1, .08), (bx, .28, bh), 'terracotta_dark')
    for fz in range(int((bh - .4) / .6)):
        for k in range(max(1, int(bw / .45))):
            n = max(1, int(bw / .45))
            a.box((.16, .02, .26), (bx - bw / 2 + (k + .5) * bw / n, .25, .45 + fz * .6), 'slate')
a.ico(.55, (-.3, .2, .6), 'leaf', scale=(1, .3, 1)); a.ico(.45, (2.2, .2, .5), 'leaf_dark', scale=(1, .3, 1))

# plaza ground (env_plaza_ground_01) moved to build_ground.py; keep the RNG sequence of the assets below unchanged
for _ in range(36): R.choice(range(5))

a = Asset('env_plaza_tree_pit_01')
for s in (-1, 1):
    a.box((1.4, .16, .1), (0, s * .62, .05), 'stone', bevel=.015)
    a.box((.16, 1.08, .1), (s * .62, 0, .05), 'stone', bevel=.015)
a.box((1.08, 1.08, .04), (0, 0, .03), 'wood_dark')
for k in range(-2, 3):
    a.box((.02, 1.0, .02), (k * .2, 0, .06), 'metal_dark')
a.cyl(.14, .5, (0, 0, .25), 'wood', verts=6, r2=.1)
a.ico(.1, (.3, -.25, .07), 'leaf', scale=(1, 1, .5))

# ---------------------------------------------------------------- buildings
# A: ocre, balcones en cada ventana, contraventanas verdes
a = Asset('env_plaza_building_01')
H = building_shell(a, 8, 3, 'ochre', 'sand', trim='cream')
for f in range(3):
    z = 3.6 + f * 3 + .15
    for x in (-2.6, 0, 2.6):
        window(a, x, z, w=.95, h=2.25, frame='white', shutter='green', blind=False)
        balcony(a, x, z, .95)
shop_door(a, 0, 1.2, 2.4)
for x in (-2.6, 2.6):
    shop_window(a, x, .6, 1.8, 1.9)
    awning(a, x, 3.2, 2.4, .9, .5, ['red', 'cream'], n=6)
a.box((.6, .12, .2), (0, -.08, 2.9), 'white')
body(a, 8, H, wall='ochre', trim='cream', band='sand', sides=('med', 'win'), shutter='green',
     chimneys=((-.55, .62), (.6, .7)), antennas=((.1, .38),), ad=('LEJIA LA PLAZA', 'cream', 'blue'))

# B: crema/melocotón, toldos verdes en ventanas
a = Asset('env_plaza_building_02')
H = building_shell(a, 8, 3, 'peach', 'cream', trim='white')
for f in range(3):
    z = 3.6 + f * 3 + .45
    for x in (-2.6, 0, 2.6):
        window(a, x, z, w=1.0, h=1.75, frame='white', shutter='green_dark', wings=(f != 0))
        if f == 0:
            awning(a, x, z + 2.15, 1.5, .7, .55, ['green', 'cream'], n=4)
            flower_box(a, x, z, 1.1, ('red', 'yellow'))
a.box((7.6, .62, .1), (0, -.31, 3.55), 'stone')  # balcón corrido sobre la planta baja
shop_door(a, -2.6, 1.1, 2.3, leaf='green_dark')
shop_window(a, 1.2, .6, 3.6, 2.0)
awning(a, 1.2, 3.25, 4.0, 1.0, .5, ['green', 'cream'], n=8)
body(a, 8, H, wall='peach', trim='white', band='cream', sides=('win', 'med'), roof='flat', shutter='green_dark',
     chimneys=((-.7, .8),), antennas=((.5, .3), (-.2, .6)), tanks=((.45, .72),), ad=('CAFES EL GRANO', 'paper', 'red_dark'))

# C: terracota, macetas en ventanas, arcos en planta baja
a = Asset('env_plaza_building_03')
H = building_shell(a, 8, 2, 'orange', 'terracotta', trim='cream', fh=3.2)
for f in range(2):
    z = 3.6 + f * 3.2 + .5
    for x in (-2.7, -.9, .9, 2.7):
        window(a, x, z, w=.85, h=1.75, frame='cream', shutter='teal', wings=False)
        flower_box(a, x, z, .95, ('red', 'pink', 'yellow'))
for x in (-2.4, 0, 2.4):  # arcos
    a.box((1.6, .06, 2.2), (x, -.06, 1.1), 'wood_dark')
    a.cyl(.8, .06, (x, -.06, 2.2), 'wood_dark', verts=12, rot=(90, 0, 0))
    a.box((1.9, .1, .12), (x, -.08, .06), 'stone')
pot_plant(a, -3.6, -.3, 0, r=.25); pot_plant(a, 3.6, -.3, 0, r=.25)
a.box((1.6, .06, .5), (2.4, -.12, 2.3), 'cream')  # rótulo pequeño del local
a.text('CAFE', (2.4, -.16, 2.3), .32, 'terracotta_dark')
body(a, 8, H, wall='orange', trim='cream', band='terracotta', fh=3.2, floors=2, sides=('win', 'win'), frame='cream',
     shutter='teal', chimneys=((-.4, .3), (.45, .64)), antennas=((-.75, .66),), ridge=.6)

# D: esquina con chaflán, terraza en azotea y árbol
a = Asset('env_plaza_building_04')
H = building_shell(a, 8, 3, 'ochre', 'cream', trim='white', roof_pitch=False)
for f in range(3):
    z = 3.6 + f * 3 + .3
    for x in (-2.6, 0, 2.6):
        window(a, x, z, w=1.0, h=2.0 if f == 0 else 1.7, frame='white', shutter='green', blind=(f > 0))
        if f == 0:
            balcony(a, x, z, 1.0)
# volumen: lateral +X con ventanas y escaparate lateral, -X medianera hacia el ayuntamiento, azotea-terraza
body(a, 8, H, wall='ochre', trim='white', band='cream', sides=('med', 'win'), roof='flat', shutter='green',
     antennas=((-.7, .85),), tanks=((-.55, .55),), side_ground=False)
start = mark(a)  # escaparate lateral (mira +X), construido en local y girado
shop_window(a, 0, .6, 2.2, 1.9)
a.box((2.5, .07, .6), (0, -.02, 3.0), 'cream')
xform(a, start, 90, (4.0, 2.2, 0))
for x in (-3, -1, 1, 3):   # terraza en azotea
    pot_plant(a, x, .7, H + .3, r=.3, leaf=R.choice(['leaf', 'leaf_dark']))
a.box((7.6, .05, .06), (0, .25, H + 1.05), 'metal_dark')                  # barandilla sobre el pretil
a.box((2.5, 2.0, .05), (2.0, 2.4, H + 2.3), 'red')                     # sombrilla/pérgola
a.box((.06, .06, 2.0), (2.0, 2.4, H + 1.3), 'metal_dark')
for (tx, ty) in ((1.4, 2.6), (2.6, 2.2)):
    a.box((.5, .5, .05), (tx, ty, H + .75), 'white'); a.box((.05, .05, .45), (tx, ty, H + .5), 'metal_dark')
a.box((2.2, 2.0, 2.4), (-2.4, 5.6, H + 1.45), 'ochre')                   # casetón de escalera
a.box((2.4, 2.2, .12), (-2.4, 5.6, H + 2.7), 'white')
a.box((.8, .06, 1.9), (-2.4, 4.58, H + 1.2), 'green_dark')
# planta baja: bar de esquina con terraza
shop_door(a, -.9, 1.1, 2.3)
shop_window(a, -3.0, .6, 1.6, 1.9)
shop_window(a, 2.0, .6, 2.6, 1.9)
awning(a, 1.0, 3.2, 5.6, 1.4, .55, ['green_dark', 'cream'], n=10)
tree(a, -3.4, -1.4, 5.0, 1.4)
for (tx, ty) in ((1.0, -1.8), (2.8, -1.8)):
    a.cyl(.35, .04, (tx, ty, .74), 'white', verts=10)
    a.cyl(.04, .72, (tx, ty, .37), 'metal_dark', verts=6)

# Edificio de fondo: ayuntamiento/iglesia con rótulo
a = Asset('env_plaza_endbuilding_01')
W = 16
a.box((W, .6, 9), (0, .3, 4.5), 'sand', bevel=.04)
a.box((W + .1, .1, 4), (0, -.03, 2), 'cream')
a.box((W + .2, .3, .4), (0, -.1, .2), 'stone_dark')
for z in (4.0, 9.0):
    a.box((W + .3, .4, .25), (0, -.1, z), 'cream', bevel=.02)
for x in (-6.5, -4.0, 4.0, 6.5):        # soportales
    a.box((1.6, .06, 2.0), (x, -.1, 1.0), 'wood_dark')
    a.cyl(.8, .06, (x, -.1, 2.0), 'wood_dark', verts=12, rot=(90, 0, 0))
for x in (-6.5, -4.0, -1.5, 1.5, 4.0, 6.5):
    window(a, x, 5.3, w=.95, h=2.0, frame='cream', shutter='green_dark', wings=False)
    if abs(x) > 2:
        balcony(a, x, 5.3, .95)
# frontón central
a.prism([(-4.2, 9.1), (4.2, 9.1), (0, 11.4)], .5, (0, .1, 0), 'ochre')
a.prism([(-4.6, 9.1), (4.6, 9.1), (0, 11.65)], .3, (0, .4, 0), 'terracotta')
a.cyl(.6, .1, (0, -.2, 10.0), 'white', verts=16, rot=(90, 0, 0))  # reloj
a.torus(.6, .06, (0, -.25, 10.0), 'gold', major=16, rot=(90, 0, 0))
a.box((.06, .03, .45), (0, -.28, 10.15), 'black'); a.box((.32, .03, .06), (.14, -.28, 10.0), 'black')
# puerta principal
a.box((2.6, .2, 3.6), (0, -.08, 1.8), 'stone', bevel=.02)
a.box((2.0, .1, 3.0), (0, -.17, 1.5), 'wood')
a.cyl(1.0, .1, (0, -.17, 3.0), 'wood', verts=12, rot=(90, 0, 0))
a.box((.05, .12, 3.0), (0, -.22, 1.5), 'wood_dark')
# torres con cúpula
for s in (-1, 1):
    tx = s * 6.6
    a.box((2.6, 2.2, 13.0), (tx, .6, 6.5), 'ochre', bevel=.04)
    a.box((2.8, 2.4, .3), (tx, .6, 9.2), 'cream')
    a.box((1.0, .1, 1.6), (tx, -.52, 11.0), 'charcoal')
    a.cyl(.5, .1, (tx, -.52, 11.8), 'charcoal', verts=10, rot=(90, 0, 0))
    a.box((2.9, 2.5, .3), (tx, .6, 13.1), 'cream', bevel=.02)
    a.cone(2.0, 2.4, (tx, .6, 14.45), 'terracotta', verts=4, rot=(0, 0, 45))
    a.cyl(.04, .9, (tx, .6, 16.0), 'metal_dark', verts=4)
# rótulo
a.box((7.6, .2, 2.2), (0, -.2, 6.6), 'wood_dark', bevel=.04)
a.box((7.2, .1, 1.85), (0, -.32, 6.6), 'cream')
a.text('PLAZA', (0, -.38, 7.05), .95, 'red_dark', depth=.02)
a.text('DE LO DE SIEMPRE', (0, -.38, 6.05), .5, 'wood_dark', depth=.02)
for s in (-1, 1):
    a.ico(.35, (s * 3.85, -.35, 7.6), 'leaf', scale=(1.2, .5, .8))
    a.ico(.15, (s * 3.7, -.5, 7.75), 'orange')
body(a, W, 9.0, D=9.0, wall='sand', trim='cream', band='cream', gh=4.0, fh=5.0, floors=1, sides=('win', 'win'),
     frame='cream', shutter='green_dark', win_w=.95, win_h=2.0, ridge=.5, chimneys=((-.3, .7), (.35, .72)))
for s in (-1, 1):   # torres: fondo completo
    a.box((2.6, 1.2, 13.0), (s * 6.6, 2.2, 6.5), 'ochre')
    a.box((2.9, 1.3, .3), (s * 6.6, 2.2, 13.1), 'cream')
a.cyl(1.1, 1.6, (0, 4.5, 12.1), 'cream', verts=8)          # linterna central sobre la cumbrera
a.cone(1.4, 1.4, (0, 4.5, 13.6), 'terracotta', verts=8)
a.cyl(.04, .9, (0, 4.5, 14.6), 'metal_dark', verts=4)

# ---------------------------------------------------------------- tiendas
a = Asset('env_bakery_facade_01')
shop_shell(a, 4.2, 4.0, 'cream', trim='white')
a.box((4.0, .06, 1.0), (0, -.04, 3.45), 'wood')
sign(a, 'PAN Y PACIENCIA', 0, 3.45, 3.6, .55, board='paper', ink='wood_dark', size=.3)
shop_door(a, -1.3, 1.0, 2.3, leaf='wood_light')
# escaparate con panes
a.box((2.3, .12, 2.1), (.75, -.04, 1.55), 'wood_dark')
a.box((2.1, .05, 1.8), (.75, -.1, 1.55), 'slate')
a.box((2.1, .4, .08), (.75, -.25, .96), 'wood_light')
a.box((2.1, .3, .06), (.75, -.18, 1.6), 'wood_light')
for i in range(4):
    a.sphere(.13, (.05 + i * .45, -.3, 1.08), 'ochre', seg=6, rings=4, scale=(1.5, .9, .7))
for i in range(3):
    a.cyl(.06, .7, (.25 + i * .5, -.2, 1.72), 'mustard', verts=6, rot=(0, 75, 10))
a.box((2.4, .35, .5), (.75, -.17, .5), 'wood')   # base del escaparate
a.cyl(.38, .3, (-1.9, -.25, .15), 'wood', verts=8, r2=.3)  # cesto de pan
for i in range(3):
    a.cyl(.06, .65, (-1.9 + (i - 1) * .1, -.25, .45), 'mustard', verts=6, rot=(15 * (i - 1), 0, 0))
H = upper_floors(a, 4.2, 4.0, 1, 'peach', trim='white', kind='flowers', nwin=2, shutter='green_dark', flowers=('red', 'yellow'))
body(a, 4.2, H, D=3.4, wall='peach', trim='white', band='cream', gh=4.0, floors=1, sides=('win', 'win'),
     shutter='green_dark', ridge=.75, eave=.45, chimneys=((.55, .7),), win_w=.8, win_h=1.4)
a.box((.8, .8, .2), (-1.0, 3.4 + .45, .1), 'wood_light')                # cajas de harina en la trasera
a.box((.6, .6, .5), (-.2, 3.4 + .35, .25), 'wood', bevel=.02)

a = Asset('prop_awning_bakery_01')
# origen en la línea de anclaje a la pared (y=0, z=0); cuelga hacia -Y y abajo
awning(a, 0, 0, 3.0, 1.1, .6, ['red', 'cream'], n=8, valance=.32)
a.box((3.1, .1, .12), (0, .02, 0), 'metal_dark')

a = Asset('env_bar_laultima_facade_01')
shop_shell(a, 5.0, 4.0, 'terracotta_dark', trim='cream')
a.box((5.0, .06, 1.6), (0, -.02, .8), 'wood_dark')
shop_door(a, 1.6, 1.1, 2.3, leaf='wood')
shop_window(a, -.8, .9, 2.8, 1.5)
for i in range(4):   # botellas
    a.cyl(.05, .3, (-1.9 + i * .3, -.12, 1.1 + .15), R.choice(['green_dark', 'mustard', 'red_dark']), verts=6)
a.box((2.9, .25, .06), (-.8, -.18, 1.04), 'wood_light')
awning(a, 0, 3.15, 5.2, 1.4, .6, ['red'], n=6, valance=.3)
sign(a, 'LA ULTIMA', 0, 3.6, 3.2, .62, board='red', ink='white', trim='cream', size=.42)
for x in (-1.9, -1.0, -.1):
    a.cyl(.2, .06, (x, -.75, .76), 'red', verts=10, bevel=.01)
    a.cyl(.035, .72, (x, -.75, .37), 'metal_dark', verts=6)
    a.torus(.13, .015, (x, -.75, .3), 'metal_dark', major=8, minor=3)
    a.cyl(.16, .02, (x, -.75, .01), 'metal_dark', verts=8)
a.box((2.6, .3, .06), (-1.0, -.2, 1.15), 'wood')   # repisa exterior
for x in (-2.4, 2.4):
    pot_plant(a, x, -.25, 0, r=.22, leaf='leaf_dark')
a.ico(.5, (-2.3, -.1, 4.1), 'leaf_dark', scale=(1.2, .6, .7))  # enredadera
H = upper_floors(a, 5.0, 4.0, 2, 'peach', trim='cream', kind='balcony', nwin=2, shutter='green')
body(a, 5.0, H, wall='peach', trim='cream', band='terracotta_dark', gh=4.0, floors=2, sides=('none', 'none'),
     chimneys=((.5, .66),), antennas=((-.4, .35),))

a = Asset('prop_shutter_paco_01')
# hueco 2.6 x 2.5; persiana como parte 'shutter' con pivote en el eje superior (escalar Z para enrollar)
for s in (-1, 1):
    a.box((.1, .12, 2.6), (s * 1.35, -.02, 1.3), 'metal_dark')
a.box((2.9, .4, .4), (0, -.1, 2.75), 'metal_dark', bevel=.02)
a.box((2.9, .02, .3), (0, -.31, 2.75), 'grey')
a.part('shutter', pivot=(0, -.05, 2.55))
n = 14
for i in range(n):
    a.box((2.6, .05, 2.55 / n - .015), (0, -.05, 2.55 - (i + .5) * 2.55 / n), 'grey' if i % 2 else 'metal')
a.box((2.6, .07, .08), (0, -.06, .04), 'metal_dark')
a.box((.16, .04, .1), (0, -.1, .16), 'gold')  # cerradura

def shop_with_sign(name, w, wall, sign_txt, board, ink, trim='white'):
    a = Asset(name)
    shop_shell(a, w, 4.0, wall, trim=trim)
    sign(a, sign_txt, 0, 3.4, w - 1.0, .62, board=board, ink=ink, size=.42)
    return a

a = shop_with_sign('env_shop_hardware_01', 4.6, 'ochre', 'FERRETERIA', 'blue', 'yellow', trim='cream')
shop_door(a, -1.5, 1.0, 2.3, leaf='blue', frame='navy')
shop_window(a, .8, .6, 2.4, 2.0, frame='navy')
for i in range(3):  # herramientas expuestas
    a.box((.06, .03, .5), (0 + i * .55, -.14, 1.6), 'wood')
    a.box((.22, .06, .08), (0 + i * .55, -.15, 1.85), 'metal_dark')
a.cyl(.15, .3, (.3, -.2, .95), 'red', verts=8); a.cyl(.15, .3, (.7, -.2, .95), 'blue', verts=8)
a.cyl(.12, .25, (1.1, -.2, .92), 'yellow', verts=8)
a.box((2.2, .3, .06), (.8, -.2, .78), 'wood')
a.box((.5, .5, .5), (2.0, -.45, .25), 'wood_light', bevel=.02)  # caja
a.cyl(.12, .9, (1.55, -.35, .45), 'mustard', verts=6)            # escoba
a.box((.3, .06, .12), (1.55, -.35, .94), 'red')
a.ico(.4, (-1.9, -.1, 4.05), 'leaf_dark', scale=(1.2, .6, .7))
H = upper_floors(a, 4.6, 4.0, 2, 'sand', trim='cream', kind='balcony', nwin=2, shutter='blue')
body(a, 4.6, H, wall='sand', trim='cream', band='ochre', gh=4.0, floors=2, sides=('win', 'win'), shutter='blue',
     chimneys=((-.5, .3),), antennas=((.5, .62),), side_ground=False)

a = shop_with_sign('env_shop_greengrocer_01', 4.6, 'cream', 'FRUTERIA', 'campaign_green', 'white', trim='white')
awning(a, 0, 2.95, 4.6, 1.1, .5, ['green', 'white'], n=10, valance=.25)
shop_door(a, 1.5, 1.0, 2.3, leaf='green_dark')
shop_window(a, -.9, .9, 2.6, 1.5)
fruits = ['red', 'orange', 'yellow', 'leaf', 'purple', 'mustard']
for k, (cx, cz, cy) in enumerate([(-1.6, .2, -.6), (-.9, .2, -.6), (-.2, .2, -.6), (-1.25, .65, -.4), (-.55, .65, -.4)]):
    a.box((.6, .4, .3), (cx, cy, cz + .15 - .2 + .2), 'wood_light', bevel=.015)
    f = fruits[k % len(fruits)]
    for i in range(3):
        for j in range(2):
            a.ico(.09, (cx - .18 + i * .18, cy - .08 + j * .16, cz + .34), f)
a.box((2.4, .55, .2), (-.9, -.45, .55 - .1), 'wood')   # banco expositor
for x in (-2.1, .1):
    a.box((.05, .55, .45), (x - .1 + .1, -.45, .22), 'wood_dark')
a.ico(.12, (.4, -.6, .1), 'leaf', sub=1); a.box((.5, .35, .25), (.4, -.6, .12), 'wood_light')
H = upper_floors(a, 4.6, 4.0, 1, 'mint', trim='white', kind='flowers', nwin=2, shutter='green_dark')
body(a, 4.6, H, wall='mint', trim='white', band='cream', gh=4.0, floors=1, sides=('none', 'none'), shutter='green_dark',
     chimneys=((.5, .7),), ridge=.6)

a = Asset('env_shop_closed_01')
shop_shell(a, 4.0, 4.0, 'stone', trim='grey_light')
a.box((3.6, .08, .9), (0, -.04, 3.35), 'grey')       # rótulo antiguo vacío
a.box((3.4, .05, .7), (0, -.09, 3.35), 'stone_dark')
for s in (-1, 1):
    a.box((.1, .12, 2.7), (s * 1.6, -.04, 1.35), 'metal_dark')
a.box((3.4, .35, .35), (0, -.1, 2.8), 'metal_dark')
for i in range(12):
    a.box((3.1, .04, .2), (0, -.06, 2.55 - (i + .5) * .215), 'grey' if i % 2 else 'grey_light')
for (gx, gz, sx, sz, c) in [(-.9, 1.6, .8, .5, 'pink'), (.8, .9, 1.0, .45, 'mint'), (-.2, .6, .7, .3, 'purple'), (1.1, 1.8, .4, .4, 'yellow')]:
    a.ico(1, (gx, -.1, gz), c, scale=(sx, .02, sz))
a.text('TODO', (0, -.13, 1.75), .55, 'red', depth=.015)
a.text('IGUAL', (0, -.13, 1.15), .55, 'navy', depth=.015)
a.box((1.0, .02, .7), (1.4, -.4, .35), 'paper', rot=(-10, 0, 0))   # cartón apoyado
a.cyl(.2, .5, (-1.6, -.35, .25), 'charcoal', verts=8)                # cubo
H = upper_floors(a, 4.0, 4.0, 1, 'concrete', trim='grey_light', kind='closed', nwin=2, shutter='grey')
a.box((1.4, .04, .9), (.9, -.03, 5.6), 'paper'); a.text('SE VENDE', (.9, -.06, 5.6), .26, 'red', depth=.01)
body(a, 4.0, H, wall='concrete', trim='grey_light', band='stone', gh=4.0, floors=1, sides=('none', 'none'), roof='flat',
     frame='grey_light', shutter='grey', tanks=((-.3, .55),), antennas=((.5, .3),))

# ---------------------------------------------------------------- fondo lejano
a = Asset('env_plaza_skybacking_01')
x = -15
cols = ['peach', 'sand', 'pink', 'cream', 'ochre', 'terracotta']
while x < 15:
    bw = R.uniform(2.0, 3.6); bh = R.uniform(4.0, 9.0)
    c = R.choice(cols)
    a.box((bw, 1.0, bh), (x + bw / 2, R.uniform(0, .8), bh / 2), c)
    a.prism([(-bw / 2 - .1, bh), (bw / 2 + .1, bh), (0, bh + .9)], 1.1, (x + bw / 2, .5, 0), 'terracotta_dark')
    for k in range(int(bw / .8)):
        for f in range(int(bh / 1.6)):
            a.box((.3, .05, .5), (x + .5 + k * .8, -.05, 1.2 + f * 1.6), 'slate')
    x += bw + R.uniform(-.2, .3)
a.box((4, 3, 10), (.5, 2.0, 5), 'cream')
a.sphere(1.9, (.5, 2.0, 10.0), 'blue', seg=10, rings=6, scale=(1, 1, 1.2))  # cúpula
a.cyl(.12, 1.4, (.5, 2.0, 12.6), 'gold', verts=6)
for tx in (-9, 9.5):
    a.box((1.6, 1.6, 12), (tx, 1.8, 6), 'sand')
    a.cone(1.2, 2.2, (tx, 1.8, 13.1), 'terracotta', verts=4, rot=(0, 0, 45))
for tx in (-12, -5, 6, 12):
    a.ico(1.4, (tx, -1.0, 1.6), 'leaf_dark', scale=(1.2, .7, 1))

# ---------------------------------------------------------------- salón de actos
a = Asset('env_hall_stage_01')
a.box((8, 4, .5), (0, 0, .25), 'wood', bevel=.03)
a.box((8.1, 4.1, .06), (0, 0, .53), 'wood_light', bevel=.02)
for i in range(16):
    a.box((.02, 4.0, .005), (-3.75 + i * .5, 0, .562), 'wood')
a.box((8.0, .05, .4), (0, -2.04, .25), 'red_dark')
# telón
x0 = -4.0; folds = 20; fw = 8.0 / folds; ch = 4.6
prof = []
for i in range(folds + 1):
    prof.append((x0 + i * fw, 0))
pts = [(x0 + i * fw / 2, (.12 if i % 2 else 0)) for i in range(folds * 2 + 1)]
# perfil en planta (x, y) -> prism usa (x, z) y extruye en Y; construimos con poly
verts, faces = [], []
for k, (px, py) in enumerate(pts):
    verts += [(px, 1.85 + py, .55), (px, 1.85 + py, .55 + ch)]
for k in range(len(pts) - 1):
    i = 2 * k
    faces.append([i, i + 2, i + 3, i + 1])
a.poly(verts, faces, 'red')
a.box((8.6, .3, .7), (0, 1.75, .55 + ch - .25), 'red_dark', bevel=.03)  # bambalina
for s in (-1, 1):
    a.box((.9, .35, ch), (s * 3.75, 1.7, .55 + ch / 2), 'red_dark', bevel=.03)
a.box((8.6, .2, 5.4), (0, 2.1, 2.7), 'charcoal')

a = Asset('prop_stage_steps_01')
for i in range(3):
    h = .55 * (i + 1) / 3
    a.box((1.4, .35 * (3 - i), h), (0, .35 * i / 2 + .0, h / 2), 'wood', bevel=.02)
    a.box((1.42, .06, .03), (0, -.35 * (3 - i) / 2 + .35 * i / 2 + .03, h + .005), 'wood_light')
for s in (-1, 1):
    a.box((.05, .05, .9), (s * .72, -.35, .45 + .2), 'metal_dark')

a = Asset('env_hall_truss_01')
def truss_tower(cx):
    s = .15
    for (dx, dy) in ((-s, -s), (s, -s), (s, s), (-s, s)):
        a.cyl(.025, 4.0, (cx + dx, dy, 2.0), 'metal', verts=6)
    for k in range(9):
        z = .25 + k * .45
        a.box((.3, .02, .02), (cx, -s, z), 'metal'); a.box((.3, .02, .02), (cx, s, z), 'metal')
        a.box((.02, .3, .02), (cx - s, 0, z), 'metal'); a.box((.02, .3, .02), (cx + s, 0, z), 'metal')
        if k < 8:
            a.box((.42, .015, .015), (cx, -s, z + .225), 'metal', rot=(0, 56, 0))
            a.box((.42, .015, .015), (cx, s, z + .225), 'metal', rot=(0, -56, 0))
    a.box((.6, .6, .04), (cx, 0, .02), 'metal_dark')
truss_tower(-3.0); truss_tower(3.0)
s = .15
for (dy, dz) in ((-s, -s), (s, -s), (s, s), (-s, s)):
    a.cyl(.025, 6.3, (0, dy, 4.15 + dz), 'metal', verts=6, rot=(0, 90, 0))
for k in range(13):
    x = -3.0 + k * .5
    a.box((.02, .3, .02), (x, 0, 4.0), 'metal'); a.box((.02, .3, .02), (x, 0, 4.3), 'metal')
    a.box((.02, .02, .3), (x, -s, 4.15), 'metal'); a.box((.02, .02, .3), (x, s, 4.15), 'metal')
    if k < 12:
        a.box((.015, .015, .42), (x + .25, -s, 4.15), 'metal', rot=(0, 56 if k % 2 else -56, 0))
for x in (-1.8, -.6, .6, 1.8):
    a.box((.04, .04, .25), (x, -.2, 3.88), 'metal_dark')
    a.box((.36, .04, .04), (x, -.2, 3.76), 'metal_dark')
    a.cyl(.15, .4, (x, -.25, 3.55), 'black', verts=8, rot=(60, 0, 0))
    a.cyl(.12, .03, (x, -.43, 3.45), 'lamp', verts=8, rot=(60, 0, 0))

export_all('structure', columns=6)

# ---------------------------------------------------------------- previews por grupos (legibilidad)
def group_preview(tag, names, columns):
    allassets = list(kc._assets)
    keep = [x for x in allassets if x.name in names]
    hidden = []
    for x in allassets:
        if x not in keep:
            for c in [x.root] + list(x.root.children_recursive):
                c.hide_render = True; hidden.append(c)
    kc._assets[:] = keep
    kc.render_preview(tag, columns)
    kc._assets[:] = allassets
    for c in hidden: c.hide_render = False

group_preview('structure_interior', ['env_interior_floor_01', 'env_interior_wall_01', 'env_interior_corner_01', 'prop_door_01',
              'prop_doorframe_01', 'prop_door_double_01', 'env_window_01', 'env_plaza_tree_pit_01', 'prop_stage_steps_01',
              'prop_shutter_paco_01', 'prop_awning_bakery_01', 'env_ceiling_beams_01'], 4)
group_preview('structure_buildings', ['env_plaza_building_01', 'env_plaza_building_02', 'env_plaza_building_03', 'env_plaza_building_04',
              'env_plaza_endbuilding_01', 'env_plaza_skybacking_01'], 3)
group_preview('structure_shops', ['env_bakery_facade_01', 'env_bar_laultima_facade_01', 'env_shop_hardware_01', 'env_shop_greengrocer_01',
              'env_shop_closed_01', 'env_hall_stage_01', 'env_hall_truss_01', 'env_plaza_ground_01', 'env_flat_exterior_view_01'], 3)
