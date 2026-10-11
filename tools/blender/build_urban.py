"""Urban furniture, vegetation, vehicles and luggage kit (Blender 5.x).

Run: blender -b --python tools/blender/build_urban.py
Outputs public/assets/<name>.glb, art/urban.blend, art/previews/urban.png.
Conventions: 1 u = 1 m, Z up, origin at ground contact centre, front faces -Y.
Replaces prop_bench_01 / prop_planter_01 from the old build_props.py (same names, same footprint).
"""
import sys, math, random
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from kit_common import *

reset_scene()
random.seed(7)


# ---------------------------------------------------------------- helpers
def _dir_rot(p1, p2):
    """Euler (deg) that turns +Z into direction p1->p2, plus length and midpoint."""
    d = [b - a for a, b in zip(p1, p2)]
    L = math.sqrt(sum(c * c for c in d))
    dx, dy, dz = (c / L for c in d)
    b = math.degrees(math.acos(max(-1, min(1, dz))))
    c = math.degrees(math.atan2(dy, dx))
    mid = tuple((a + b_) / 2 for a, b_ in zip(p1, p2))
    return (0, b, c), L, mid


def tube(a, p1, p2, r, m, verts=6):
    rot, L, mid = _dir_rot(p1, p2)
    return a.cyl(r, L, mid, m, verts=verts, rot=rot)


def bar(a, p1, p2, t, m):
    rot, L, mid = _dir_rot(p1, p2)
    return a.box((t, t, L), mid, m, rot=rot)


def wheel(a, x, y, r, w, tyre='black', hub='metal', verts=12):
    a.cyl(r, w, (x, y, r), tyre, verts=verts, rot=(0, 90, 0))
    a.cyl(r * .55, w + .02, (x, y, r), hub, verts=8, rot=(0, 90, 0))


def blob(a, r, loc, m, scale=(1, 1, 1), sub=2):
    """Faceted canopy mass (Portal Knights style)."""
    rot = (random.uniform(0, 30), random.uniform(0, 30), random.uniform(0, 360))
    return a.ico(r, loc, m, sub=sub, scale=scale, rot=rot)


def side_prism(a, profile, width, m, y0=0, x0=0):
    """Profile [(y, z), ...] in the YZ plane extruded along X (vehicle bodies, front at -Y)."""
    n = len(profile); d = width / 2
    verts = [(x0 - d, y + y0, z) for y, z in profile] + [(x0 + d, y + y0, z) for y, z in profile]
    faces = [list(range(n)), list(range(n, 2 * n))[::-1]] + [[i, n + i, n + (i + 1) % n, (i + 1) % n] for i in range(n)]
    return a.poly(verts, faces, m)


def flat_quads(a, quads, m, z):
    verts, faces = [], []
    for (x0, y0, x1, y1) in quads:
        i = len(verts)
        verts += [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)]
        faces.append([i, i + 1, i + 2, i + 3])
    return a.poly(verts, faces, m)


# ================================================================ MOBILIARIO URBANO
def bench():
    a = Asset('prop_bench_01', 'urban')
    # cast-iron sides (front -Y, backrest +Y); overall 2.30 x 0.80 x 0.95
    for x in (-1.06, 1.06):
        a.box((.18, .80, .06), (x, 0, .03), 'charcoal')       # foot (outer edge at +-1.15)
        bar(a, (x, -.30, .05), (x, -.22, .44), .07, 'charcoal')                 # front leg
        bar(a, (x, .28, .05), (x, .22, .44), .07, 'charcoal')                   # rear leg
        a.box((.08, .62, .06), (x, -.02, .44), 'charcoal')                      # seat rail
        bar(a, (x, .22, .44), (x, .34, .93), .07, 'charcoal')                   # back upright
        a.box((.10, .42, .05), (x, -.12, .66), 'charcoal')                      # armrest
        a.box((.06, .06, .22), (x, -.30, .55), 'charcoal')                      # armrest post
    for i, y in enumerate((-.27, -.13, .01, .15)):
        a.box((2.20, .12, .045), (0, y, .49), 'wood', bevel=.01)                # seat slats
    for z in (.62, .76, .90):
        a.box((2.20, .045, .11), (0, .27 + (z - .62) * .22, z), 'wood', bevel=.01)  # back slats
    a.finish()


def planter():
    a = Asset('prop_planter_01', 'urban')
    # concrete box 0.80 x 0.80, bush to ~1.05 high
    a.box((.74, .74, .44), (0, 0, .22), 'concrete', bevel=.02)
    a.box((.80, .80, .07), (0, 0, .45), 'stone', bevel=.01)                    # rim
    a.box((.66, .66, .04), (0, 0, .48), 'wood_dark')                           # soil
    blob(a, .30, (-.12, -.08, .66), 'leaf', sub=1)
    blob(a, .28, (.14, .10, .70), 'leaf_dark', sub=1)
    blob(a, .26, (.10, -.16, .62), 'green', sub=1)
    blob(a, .24, (-.14, .16, .64), 'leaf', sub=1)
    blob(a, .22, (0, 0, .86), 'leaf', sub=1)
    for i, (x, y, z) in enumerate([(-.26, -.26, .74), (.24, -.30, .72), (-.04, -.32, .86), (.30, .02, .84),
                                   (-.30, .04, .82), (.06, .28, .90), (-.16, .20, .95), (.14, -.04, 1.02)]):
        a.ico(.07, (x, y, z), ('red', 'pink', 'orange')[i % 3], sub=1)
    a.finish()


def streetlamp():
    a = Asset('prop_streetlamp_01', 'urban')
    # fernandina: stepped base, fluted shaft, two curled arms with lanterns
    a.cyl(.26, .14, (0, 0, .07), 'charcoal', verts=8)
    a.cyl(.20, .30, (0, 0, .29), 'charcoal', verts=8, r2=.13)
    a.cyl(.07, 2.70, (0, 0, 1.79), 'charcoal', verts=8, r2=.05)
    for z in (.60, 1.6, 2.9):
        a.cyl(.10, .06, (0, 0, z), 'black', verts=8)
    a.cyl(.09, .12, (0, 0, 3.17), 'black', verts=8)
    for s in (-1, 1):
        x0 = s * .08
        bar(a, (x0, 0, 3.10), (s * .40, 0, 3.24), .045, 'charcoal')
        bar(a, (s * .40, 0, 3.24), (s * .62, 0, 3.22), .045, 'charcoal')
        bar(a, (s * .25, 0, 3.15), (s * .30, 0, 2.95), .035, 'charcoal')        # scroll hint
        a.ico(.04, (s * .30, 0, 2.93), 'charcoal', sub=1)
        lx = s * .64
        a.cyl(.07, .08, (lx, 0, 3.24), 'black', verts=6)                       # lantern base
        a.cyl(.11, .28, (lx, 0, 3.42), 'lamp', verts=6, r2=.15)                # glass (emissive)
        a.cyl(.19, .06, (lx, 0, 3.59), 'black', verts=6, r2=.15)
        a.cone(.15, .16, (lx, 0, 3.70), 'black', verts=6)                      # cap
        a.ico(.03, (lx, 0, 3.80), 'gold', sub=1)
    a.cone(.07, .2, (0, 0, 3.33), 'black', verts=6)
    a.finish()


def bollard():
    a = Asset('prop_bollard_01', 'urban')
    a.cyl(.10, .06, (0, 0, .03), 'charcoal', verts=8)
    a.cyl(.075, .72, (0, 0, .42), 'charcoal', verts=8, r2=.065)
    a.cyl(.085, .05, (0, 0, .62), 'black', verts=8)
    a.cyl(.085, .04, (0, 0, .70), 'black', verts=8)
    a.sphere(.075, (0, 0, .80), 'charcoal', seg=8, rings=4)
    a.finish()


def bus_stop():
    a = Asset('prop_bus_stop_01', 'urban')
    W, D, H = 3.2, 1.4, 2.5
    for x in (-1.52, 1.52):
        for y in (-.55, .58):
            a.box((.08, .08, H - .1), (x, y, (H - .1) / 2), 'charcoal')
    a.box((W + .2, D + .2, .10), (0, 0, H), 'charcoal', bevel=.02)            # roof
    a.box((W + .1, .1, .22), (0, -.68, H - .10), 'green')                     # fascia
    a.box((2.8, .03, 1.95), (0, .60, 1.12), 'glass')                          # rear glass
    a.box((W, .06, .06), (0, .60, .12), 'charcoal'); a.box((W, .06, .06), (0, .60, 2.12), 'charcoal')
    # side ad panel (left) and glass (right)
    a.box((.10, 1.05, 1.80), (-1.52, .02, 1.15), 'charcoal')
    a.box((.12, .90, 1.60), (-1.52, .02, 1.15), 'sky')
    a.box((.13, .60, .70), (-1.52, .02, 1.30), 'orange')                      # poster
    a.box((.135, .35, .30), (-1.52, -.02, 1.38), 'yellow')
    a.box((.03, 1.05, 1.70), (1.52, .02, 1.12), 'glass')
    # rear map panel
    a.box((.70, .05, 1.0), (.55, .55, 1.25), 'paper')
    a.box((.55, .055, .25), (.55, .55, 1.55), 'blue')
    # bench
    a.box((2.0, .40, .06), (-.2, .32, .48), 'wood', bevel=.01)
    for x in (-1.0, .6):
        a.box((.06, .30, .45), (x, .35, .23), 'metal_dark')
    a.finish()


def fountain():
    a = Asset('prop_fountain_01', 'urban')
    a.cyl(1.30, .45, (0, 0, .225), 'stone', verts=8)                         # basin wall
    a.cyl(1.38, .08, (0, 0, .48), 'stone_dark', verts=8)                     # rim
    a.cyl(1.18, .04, (0, 0, .40), 'sky', verts=8)                            # water
    a.cyl(.26, .35, (0, 0, .55), 'stone', verts=8, r2=.18)
    a.cyl(.13, .60, (0, 0, 1.00), 'stone', verts=8)
    a.cyl(.65, .16, (0, 0, 1.30), 'stone', verts=8, r2=.80)                  # lower bowl
    a.cyl(.72, .04, (0, 0, 1.39), 'sky', verts=8)
    a.cyl(.09, .40, (0, 0, 1.58), 'stone', verts=8)
    a.cyl(.28, .10, (0, 0, 1.80), 'stone', verts=8, r2=.38)                  # upper bowl
    a.cyl(.33, .03, (0, 0, 1.85), 'sky', verts=8)
    a.cone(.10, .30, (0, 0, 2.0), 'stone_dark', verts=6)
    a.ico(.06, (0, 0, 2.18), 'sky', sub=1)                                    # spout
    a.cyl(.70, .85, (0, 0, .88), 'glass', verts=8, r2=.74)                  # falling water veil
    a.cyl(.30, .32, (0, 0, 1.62), 'glass', verts=8, r2=.32)
    a.finish()


def bin_():
    a = Asset('prop_bin_01', 'urban')
    a.cyl(.24, .82, (0, 0, .43), 'grey', verts=10, r2=.26)
    a.cyl(.28, .06, (0, 0, .87), 'charcoal', verts=10)
    a.cyl(.20, .10, (0, 0, .94), 'charcoal', verts=10, r2=.12)
    a.cyl(.25, .05, (0, 0, .03), 'charcoal', verts=10)
    for z in (.3, .62):
        a.cyl(.255, .05, (0, 0, z), 'metal_dark', verts=10)
    a.box((.20, .04, .14), (0, -.255, .72), 'black')                        # slot
    a.finish()


def recycling():
    a = Asset('prop_recycling_01', 'urban')
    for x, col, slot in ((-.86, 'green', 'cyl'), (0, 'yellow', 'box'), (.86, 'blue', 'box')):
        a.box((.78, .78, 1.05), (x, 0, .58), col, bevel=.03)
        a.cyl(.39, .78, (x, 0, 1.11), col, verts=10, rot=(0, 90, 0))      # rounded lid
        a.box((.80, .80, .06), (x, 0, 1.10), 'charcoal')
        if slot == 'cyl':
            a.cyl(.12, .04, (x, -.395, .85), 'black', verts=8, rot=(90, 0, 0))
        else:
            a.box((.40, .04, .08), (x, -.395, .85), 'black')
        a.box((.30, .03, .30), (x, -.40, .55), 'white')                    # sticker
        a.box((.70, .70, .05), (x, 0, .03), 'charcoal')
    a.finish()


def kiosk():
    a = Asset('prop_kiosk_01', 'urban')
    a.box((1.80, 1.50, .15), (0, 0, .075), 'stone_dark')
    a.box((1.70, 1.40, 2.0), (0, 0, 1.15), 'campaign_green', bevel=.02)
    a.box((1.40, .05, .80), (0, -.71, 1.55), 'cream')                       # open window back
    a.box((1.80, .50, .08), (0, -.92, 1.10), 'campaign_green')             # counter shelf
    for row, z in enumerate((1.20, 1.45, 1.70)):
        for i in range(6):
            x = -.60 + i * .24
            col = ('red', 'yellow', 'sky', 'pink', 'white', 'orange', 'blue', 'mint')[(i + row * 3) % 8]
            a.box((.20, .03, .24), (x, -.75, z), col, rot=(-12, 0, 0))     # magazines
    for i in range(5):
        a.box((.24, .30, .03), (-.55 + i * .27, -.92, 1.15 + i % 2 * .01),
              ('paper', 'red', 'sky', 'yellow', 'white')[i])
    # side racks
    for s in (-1, 1):
        for z in (.7, 1.0):
            a.box((.04, .9, .26), (s * .87, -.1, z), ('pink', 'sky')[int(z > .8)], rot=(0, s * 10, 0))
    # roof: overhanging pyramid
    a.box((2.3, 2.0, .12), (0, -.05, 2.20), 'green_dark')
    a.poly([(-1.15, -1.05, 2.26), (1.15, -1.05, 2.26), (1.15, .95, 2.26), (-1.15, .95, 2.26), (0, -.05, 2.85)],
           [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [3, 2, 1, 0]], 'campaign_green')
    a.box((2.3, .04, .30), (0, -1.06, 2.08), 'cream')                      # sign band
    a.box((1.2, .05, .16), (0, -1.08, 2.08), 'campaign_green')
    a.finish()


def work_fence():
    a = Asset('prop_work_fence_01', 'urban')
    L, H = 2.0, 1.0
    for x in (-L / 2, L / 2):
        a.box((.06, .06, H), (x, 0, H / 2 + .08), 'yellow')
        a.box((.18, .55, .12), (x, 0, .06), 'black', bevel=.01)             # rubber foot
    for z in (.15, 1.05):
        a.box((L, .06, .06), (0, 0, z), 'yellow')
    for z in (.48, .75):
        a.box((L - .1, .04, .04), (0, 0, z), 'yellow')
    for i in range(9):
        x = -.86 + i * .215
        a.box((.025, .03, .88), (x, 0, .6), 'yellow')
    a.box((.70, .07, .26), (0, -.01, .62), 'red')                         # warning plate
    a.box((.50, .075, .08), (0, -.01, .62), 'white')
    a.finish()


def terrace_table():
    a = Asset('prop_terrace_table_01', 'urban')
    a.cyl(.25, .04, (0, 0, .02), 'charcoal', verts=8)
    a.cyl(.035, .68, (0, 0, .37), 'charcoal', verts=6)
    a.box((.70, .70, .03), (0, 0, .72), 'metal_dark')
    S, n = .86, 6
    a.box((S, S, .14), (0, 0, .67), 'white')                               # cloth drape
    step = S / n
    reds, whites = [], []
    for i in range(n):
        for j in range(n):
            q = (-S / 2 + i * step, -S / 2 + j * step, -S / 2 + (i + 1) * step, -S / 2 + (j + 1) * step)
            (reds if (i + j) % 2 == 0 else whites).append(q)
    flat_quads(a, reds, 'red', .745)
    flat_quads(a, whites, 'white', .745)
    # drape checks on each side
    for side in range(4):
        for k in range(0, n, 2):
            off = -S / 2 + (k + .5) * step
            if side < 2:
                a.box((step, .005, .14), (off, (S / 2 + .003) * (1 if side else -1), .67), 'red')
            else:
                a.box((.005, step, .14), ((S / 2 + .003) * (1 if side == 3 else -1), off + step, .67), 'red')
    a.cyl(.04, .10, (.12, .05, .80), 'glass', verts=6)
    a.cyl(.05, .015, (-.15, -.1, .755), 'white', verts=8)
    a.finish()


def terrace_chair():
    a = Asset('prop_terrace_chair_01', 'urban')
    # bistro chair, front -Y, backrest +Y
    for x in (-.20, .20):
        tube(a, (x * 1.1, -.24, 0), (x, -.18, .45), .015, 'charcoal')
        tube(a, (x * 1.1, .24, 0), (x, .18, .45), .015, 'charcoal')
        tube(a, (x, .18, .45), (x * 1.05, .24, .88), .015, 'charcoal')
    a.cyl(.23, .04, (0, 0, .46), 'wood_light', verts=10)
    a.box((.44, .03, .14), (0, .23, .80), 'wood_light', rot=(-10, 0, 0))
    a.box((.40, .02, .04), (0, .21, .65), 'charcoal', rot=(-10, 0, 0))
    a.torus(.18, .012, (0, 0, .18), 'charcoal', major=10, minor=4)
    a.finish()


def parasol():
    a = Asset('prop_parasol_01', 'urban')
    a.cyl(.30, .08, (0, 0, .04), 'charcoal', verts=8)
    a.cyl(.03, 2.35, (0, 0, 1.2), 'white', verts=6)
    R = 1.40
    n = 8
    verts = [(0, 0, 2.55)] + [(R * math.cos(i * 2 * math.pi / n), R * math.sin(i * 2 * math.pi / n), 2.05) for i in range(n)]
    for k, col in enumerate(('cream', 'white')):
        faces = [[0, 1 + i, 1 + (i + 1) % n] for i in range(k, n, 2)]
        under = [[n + 1, n + 2 + (i + 1) % n, n + 2 + i] for i in range(k, n, 2)]
        a.poly(verts + [(x, y, z - .01) for x, y, z in verts], faces + under, col)
    for i in range(n):                                                    # valance flaps
        ang = (i + .5) * 2 * math.pi / n
        r = R * math.cos(math.pi / n)
        a.box((2 * R * math.sin(math.pi / n), .01, .14), (r * math.cos(ang), r * math.sin(ang), 1.98),
              ('cream', 'white')[i % 2], rot=(0, 0, math.degrees(ang) + 90))
    a.ico(.05, (0, 0, 2.6), 'cream', sub=1)
    a.finish()


def camera_mark():
    a = Asset('prop_camera_mark_01', 'urban')
    a.box((.62, .07, .004), (0, 0, .002), 'yellow', rot=(0, 0, 45))
    a.box((.62, .07, .004), (0, 0, .0025), 'yellow', rot=(0, 0, -45))
    a.finish()


def pergola():
    a = Asset('prop_pergola_01', 'urban')
    W, D, H = 3.2, 2.4, 2.5
    a.box((W + .2, D + .2, .12), (0, 0, .06), 'stone')                     # deck
    for x in (-W / 2, W / 2):
        for y in (-D / 2, D / 2):
            a.box((.16, .16, H), (x, y, H / 2 + .1), 'wood', bevel=.01)
            a.box((.24, .24, .10), (x, y, .17), 'wood_dark')
    for y in (-D / 2, D / 2):
        a.box((W + .5, .14, .20), (0, y, H + .12), 'wood', bevel=.01)
    for i in range(8):
        x = -W / 2 - .05 + i * (W + .1) / 7
        a.box((.08, D + .5, .10), (x, 0, H + .27), 'wood_light')
    # back lattice
    for i in range(5):
        a.box((.05, .04, 1.9), (-1.2 + i * .6, D / 2, 1.2), 'wood_light')
    for z in (.6, 1.3, 2.0):
        a.box((W, .04, .05), (0, D / 2, z), 'wood_light')
    # vine
    spots = [(-1.5, -1.2, 2.6, .45), (-.8, -1.25, 2.65, .38), (.4, -1.2, 2.62, .40), (1.4, -1.1, 2.6, .45),
             (1.5, 1.2, 2.6, .42), (.2, 1.2, 2.7, .45), (-1.1, 1.15, 2.6, .40), (-.3, 0, 2.75, .40),
             (1.0, .3, 2.72, .36), (-1.6, -1.2, 1.9, .28), (1.6, -1.2, 1.6, .26), (1.6, 1.2, 1.9, .30),
             (-1.6, 1.2, 1.4, .26)]
    for i, (x, y, z, r) in enumerate(spots):
        blob(a, r, (x, y, z), ('leaf', 'leaf_dark', 'green')[i % 3], scale=(1.2, 1, .7), sub=1)
    for i in range(18):                                                        # dense vine along beams
        x = -1.75 + i * 3.5 / 17; y = (-1.2, 1.2)[i % 2]
        blob(a, random.uniform(.30, .40), (x, y + random.uniform(-.15, .15), 2.62 + random.uniform(-.05, .12)),
             ('leaf', 'green', 'leaf_dark')[i % 3], scale=(1.3, 1.1, .6), sub=1)
    for (x, y, z0) in [(-1.6, -1.2, .4), (1.6, 1.2, .5)]:                      # creepers on two posts
        for k in range(4):
            blob(a, .2, (x + .05, y - .05, z0 + k * .5), ('leaf', 'leaf_dark')[k % 2], scale=(1, 1, 1.3), sub=1)
    for (x, y, z) in [(-1.4, -1.35, 2.4), (.5, -1.35, 2.45), (1.3, 1.35, 2.35), (-.9, 1.3, 2.4)]:
        a.ico(.06, (x, y, z), 'purple', sub=1)
    a.finish()


def mini_stage():
    a = Asset('prop_mini_stage_01', 'urban')
    W, D, h = 4.0, 2.5, .50
    a.box((W, D, h), (0, 0, h / 2), 'charcoal')
    a.box((W + .06, D + .06, .06), (0, 0, h), 'wood_dark')
    for i in range(8):
        a.box((W / 8 - .02, D - .04, .01), (-W / 2 + (i + .5) * W / 8, 0, h + .035), ('wood', 'wood_light')[i % 2])
    a.box((W, .02, h - .06), (0, -D / 2 - .01, h / 2), 'black')             # skirt
    for k in range(2):                                                       # steps
        a.box((.9, .32, h * (k + 1) / 3), (1.2, -D / 2 - .5 + k * .32, h * (k + 1) / 6), 'wood_dark')
    TH = 3.3
    for x in (-W / 2 + .1, W / 2 - .1):                                     # truss towers
        for y in (-D / 2 + .1, -D / 2 + .4):
            a.box((.05, .05, TH), (x, y, TH / 2), 'metal')
        for z in (.4, 1.2, 2.0, 2.8):
            bar(a, (x, -D / 2 + .1, z), (x, -D / 2 + .4, z + .8), .03, 'metal')
        a.box((.4, .5, .05), (x, -D / 2 + .25, .025), 'metal_dark')
    for z in (TH - .05, TH - .35):                                          # top truss beam
        for y in (-D / 2 + .1, -D / 2 + .4):
            a.box((W - .1, .05, .05), (0, y, z), 'metal')
    for i in range(10):
        x = -W / 2 + .3 + i * (W - .6) / 9
        bar(a, (x, -D / 2 + .1, TH - .35), (x + .18, -D / 2 + .1, TH - .05), .03, 'metal')
    for i in range(3):                                                     # stage spots
        x = -1.2 + i * 1.2
        a.cyl(.10, .22, (x, -D / 2 + .25, TH - .55), 'black', verts=6, rot=(60, 0, 0))
        a.cyl(.07, .02, (x, -D / 2 + .15, TH - .62), 'lamp', verts=6, rot=(60, 0, 0))
    # bunting (two sagging strings with triangles)
    cols = ('red', 'yellow', 'sky', 'green', 'orange', 'pink')
    tri = {c: ([], []) for c in cols}
    def sag(t): return TH - .45 - .45 * math.sin(math.pi * t)
    n = 14
    for i in range(n):
        t0, t1 = i / n, (i + .8) / n
        x0, x1 = -W / 2 + .1 + t0 * (W - .2), -W / 2 + .1 + t1 * (W - .2)
        z0, z1 = sag(t0), sag(t1)
        v, f = tri[cols[i % len(cols)]]
        k = len(v); y = -D / 2 + .08
        v += [(x0, y, z0), (x1, y, z1), ((x0 + x1) / 2, y, (z0 + z1) / 2 - .24)]
        v += [(x0, y + .005, z0), (x1, y + .005, z1), ((x0 + x1) / 2, y + .005, (z0 + z1) / 2 - .24)]
        f += [[k, k + 1, k + 2], [k + 3, k + 5, k + 4]]
    for c, (v, f) in tri.items():
        a.poly(v, f, c)
    for i in range(6):
        t0, t1 = i / 6, (i + 1) / 6
        bar(a, (-W / 2 + .1 + t0 * (W - .2), -D / 2 + .08, sag(t0)),
            (-W / 2 + .1 + t1 * (W - .2), -D / 2 + .08, sag(t1)), .012, 'black')
    # speakers on the ground at both sides
    for s in (-1, 1):
        x = s * (W / 2 + .45)
        a.box((.55, .50, 1.0), (x, -D / 2 + .3, .50), 'black', bevel=.02)
        a.cyl(.18, .02, (x, -D / 2 + .04, .35), 'grey', verts=10, rot=(90, 0, 0))
        a.cyl(.09, .02, (x, -D / 2 + .04, .78), 'grey', verts=8, rot=(90, 0, 0))
        a.cyl(.07, .03, (x, -D / 2 + .03, .35), 'charcoal', verts=8, rot=(90, 0, 0))
    a.finish()


def ac_unit():
    a = Asset('prop_ac_unit_01', 'urban')
    a.box((.82, .30, .56), (0, 0, .30), 'white', bevel=.02)
    a.cyl(.21, .02, (.13, -.15, .30), 'charcoal', verts=12, rot=(90, 0, 0))
    a.torus(.21, .018, (.13, -.165, .30), 'grey_light', major=12, minor=4, rot=(90, 0, 0))
    for ang in (0, 60, 120):
        a.box((.38, .01, .03), (.13, -.17, .30), 'grey_light', rot=(0, ang, 0))
    a.cyl(.04, .02, (.13, -.18, .30), 'grey', verts=6, rot=(90, 0, 0))
    for i in range(6):
        a.box((.18, .01, .015), (-.26, -.155, .14 + i * .07), 'grey')     # side grille
    for x in (-.30, .30):
        a.box((.06, .34, .02), (x, 0, .01), 'metal_dark')                 # feet
    a.cyl(.02, .2, (.36, .12, .58), 'grey', verts=6, rot=(0, 90, 0))      # pipe
    a.finish()


def clothesline():
    a = Asset('prop_clothesline_01', 'urban')
    L = 3.6
    for x in (-L / 2, L / 2):
        a.box((.08, .08, 1.9), (x, 0, .95), 'wood')
        a.box((.06, .40, .06), (x, 0, 1.78), 'wood')
    for y in (-.15, .15):
        a.box((L, .012, .012), (0, y, 1.80), 'white')
    items = [(-1.40, 'sky', 'shirt'), (-.90, 'white', 'towel'), (-.42, 'pink', 'shirt'), (.05, 'blue', 'pants'),
             (.55, 'cream', 'towel'), (1.0, 'mint', 'shirt'), (1.42, 'wood', 'pants')]
    for i, (x, col, kind) in enumerate(items):
        y = -.15 if i % 2 == 0 else .15
        if kind == 'shirt':
            a.box((.40, .03, .55), (x, y, 1.50), col)
            a.box((.62, .03, .16), (x, y, 1.72), col)
        elif kind == 'towel':
            a.box((.38, .025, .65), (x, y, 1.48), col)
            a.box((.38, .03, .05), (x, y, 1.22), 'red' if col == 'white' else 'sky')
        else:
            a.box((.34, .03, .14), (x, y, 1.73), col)
            for s in (-1, 1):
                a.box((.15, .03, .62), (x + s * .09, y, 1.36), col)
        for s in (-1, 1):
            a.box((.02, .04, .06), (x + s * .12, y, 1.80), 'yellow')          # pegs
    a.finish()


# ================================================================ VEGETACIÓN
def tree_large():
    a = Asset('env_tree_large_01', 'vegetation')
    a.cyl(.36, .45, (0, 0, .22), 'wood_dark', verts=7, r2=.24)
    a.cyl(.24, 1.8, (0, 0, 1.3), 'wood', verts=7, r2=.18)
    for s, (dx, dy) in enumerate(((1, -.3), (-1, .2), (.2, 1))):          # roots
        bar(a, (0, 0, .25), (dx * .55, dy * .55, .02), .12, 'wood_dark')
    tube(a, (0, 0, 2.0), (-1.0, -.2, 3.0), .12, 'wood', verts=6)
    tube(a, (0, 0, 2.1), (1.1, .3, 3.1), .12, 'wood', verts=6)
    tube(a, (0, 0, 2.1), (.1, .2, 3.4), .14, 'wood', verts=6)
    masses = [(0, 0, 3.9, 1.30, 'leaf'), (-1.25, -.3, 3.25, 1.0, 'green'), (1.3, .2, 3.35, 1.05, 'green'),
              (.3, -1.0, 3.2, .90, 'leaf'), (-.4, 1.0, 3.4, .95, 'green'), (.6, .2, 4.65, .80, 'leaf'),
              (-.75, -.3, 4.4, .78, 'leaf')]
    for x, y, z, r, m in masses:
        blob(a, r, (x, y, z), m, scale=(1, 1, .85))
    for x, y, z, r in [(-.9, -.9, 2.9, .55), (1.0, -.7, 2.95, .55), (.9, .9, 3.0, .6), (-1.1, .8, 3.0, .5)]:
        blob(a, r, (x, y, z), 'leaf_dark', scale=(1, 1, .7), sub=1)
    a.finish()


def tree_young():
    a = Asset('env_tree_young_01', 'vegetation')
    # alcorque: stone frame + metal grate + soil
    for s in (-1, 1):
        a.box((1.3, .12, .10), (0, s * .59, .05), 'stone')
        a.box((.12, 1.06, .10), (s * .59, 0, .05), 'stone')
    a.box((1.06, 1.06, .04), (0, 0, .03), 'wood_dark')
    for i in range(5):
        a.box((.03, 1.0, .02), (-.4 + i * .2, 0, .07), 'metal_dark')
    a.cyl(.09, 2.3, (0, 0, 1.15), 'wood', verts=6, r2=.06)
    tube(a, (0, 0, 1.6), (-.4, -.1, 2.1), .04, 'wood', verts=5)
    tube(a, (0, 0, 1.7), (.4, .15, 2.2), .04, 'wood', verts=5)
    a.cyl(.025, 1.6, (.16, 0, .8), 'wood_light', verts=5)                 # stake
    a.box((.18, .03, .03), (.08, 0, 1.2), 'green')                       # tie
    for x, y, z, r, m in [(0, 0, 2.6, .62, 'leaf'), (-.45, -.1, 2.25, .45, 'green'), (.45, .15, 2.35, .48, 'leaf'),
                          (.05, -.3, 2.2, .40, 'leaf_dark'), (0, .1, 3.0, .40, 'leaf')]:
        blob(a, r, (x, y, z), m, scale=(1, 1, .9))
    a.finish()


def bush_round():
    a = Asset('env_bush_round_01', 'vegetation')
    blob(a, .55, (0, 0, .50), 'leaf', scale=(1, 1, .9))
    blob(a, .38, (-.35, -.15, .35), 'green', scale=(1, 1, .85))
    blob(a, .38, (.35, .12, .36), 'leaf_dark', scale=(1, 1, .85))
    blob(a, .30, (.1, -.35, .30), 'leaf', scale=(1, 1, .85), sub=1)
    a.finish()


def bush_long():
    a = Asset('env_bush_long_01', 'vegetation')
    a.box((1.9, .55, .55), (0, 0, .30), 'leaf_dark', bevel=.05)
    for i in range(5):
        x = -.8 + i * .4
        blob(a, .34, (x, (-.05 if i % 2 else .05), .62), ('leaf', 'green')[i % 2], scale=(1.1, .95, .75))
    for i in range(4):
        blob(a, .26, (-.6 + i * .4, -.22, .35), 'leaf', scale=(1.2, .8, 1), sub=1)
    a.finish()


def flowerpot_balcony():
    a = Asset('env_flowerpot_balcony_01', 'vegetation')
    a.prism([(-.40, 0), (.40, 0), (.44, .22), (-.44, .22)], .24, (0, 0, 0), 'terracotta')
    a.box((.92, .28, .04), (0, 0, .23), 'terracotta_dark')
    a.box((.82, .18, .02), (0, 0, .225), 'wood_dark')
    for i in range(6):
        x = -.36 + i * .145
        blob(a, .13, (x, (.03 if i % 2 else -.03), .30), ('leaf', 'leaf_dark')[i % 2], scale=(1.1, 1, .7), sub=1)
    for i, (x, y, z) in enumerate([(-.33, -.05, .42), (-.18, .04, .46), (-.03, -.06, .44), (.12, .03, .47),
                                   (.27, -.04, .43), (.38, .05, .40), (-.40, .06, .38)]):
        for dx, dz in ((0, 0), (.035, -.03), (-.035, -.025)):
            a.ico(.045, (x + dx, y, z + dz), 'red', sub=1)
    for i in range(4):
        a.box((.05, .01, .07), (-.30 + i * .2, -.15, .26), 'leaf', rot=(70, 0, 20 * (i % 2 * 2 - 1)))
    a.finish()


# ================================================================ VEHÍCULOS Y EQUIPAJE
def edge_glass(a, half_w, p0, p1, m='slate', t0=.06, t1=.94, sign=1, off=.012):
    """Thin double-sided quad lying on a slanted YZ body edge p0->p1, pushed outward (windscreens)."""
    dy, dz = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dy, dz); ny, nz = -dz / L * sign * off, dy / L * sign * off
    q0 = (p0[0] + dy * t0 + ny, p0[1] + dz * t0 + nz); q1 = (p0[0] + dy * t1 + ny, p0[1] + dz * t1 + nz)
    v = [(-half_w, q0[0], q0[1]), (half_w, q0[0], q0[1]), (half_w, q1[0], q1[1]), (-half_w, q1[0], q1[1])]
    return a.poly(v + v, [[0, 1, 2, 3], [7, 6, 5, 4]], m)


def car():
    a = Asset('prop_car_01', 'vehicle')
    W = 1.62
    # compact hatchback, profile (y, z), front at -Y
    body = [(-1.76, .28), (1.72, .28), (1.76, .86), (1.68, .96), (-1.02, .96), (-1.68, .82), (-1.77, .62)]
    side_prism(a, body, W, 'white')
    cw = W - .12
    cabin = [(-1.02, .96), (1.66, .96), (1.60, 1.50), (-.22, 1.54)]
    side_prism(a, cabin, cw, 'white')
    a.box((cw + .04, 1.75, .05), (0, .70, 1.55), 'white', bevel=.01)       # roof lip
    for s in (-1, 1):
        x0 = s * (cw / 2 + .006)
        side_prism(a, [(-.88, 1.03), (.30, 1.03), (.30, 1.46), (-.30, 1.48)], .012, 'slate', x0=x0)
        side_prism(a, [(.40, 1.03), (1.46, 1.03), (1.42, 1.44), (.40, 1.46)], .012, 'slate', x0=x0)
        a.box((.012, 3.30, .06), (s * (W / 2 + .004), 0, .40), 'charcoal')  # rubbing strip / sill
        a.box((.012, .02, .55), (s * (W / 2 + .004), -.05, .66), 'grey_light')  # door seam
        a.box((.02, .14, .03), (s * (W / 2 + .01), .12, .82), 'grey')      # handle
        a.box((.10, .14, .10), (s * (W / 2 + .03), -.84, 1.06), 'white')   # mirrors
        a.box((.30, .04, .13), (s * .54, -1.765, .74), 'lamp')
        a.box((.04, .20, .03), (s * (W / 2 - .02), -1.40, .78), 'orange')  # indicators
        a.box((.18, .04, .24), (s * .64, 1.75, .80), 'red')
    edge_glass(a, cw / 2 - .07, (-1.02, .96), (-.22, 1.54))                # windscreen
    edge_glass(a, cw / 2 - .12, (1.66, .96), (1.60, 1.50), t0=.25, t1=.9, sign=-1)  # rear window
    a.box((W + .04, .16, .22), (0, -1.78, .40), 'grey', bevel=.02)
    a.box((W + .04, .16, .22), (0, 1.74, .40), 'grey', bevel=.02)
    a.box((.56, .04, .10), (0, -1.79, .60), 'charcoal')                   # grille
    a.box((.40, .03, .10), (0, -1.87, .40), 'white')                      # blank plates
    a.box((.40, .03, .10), (0, 1.83, .58), 'white')
    for x in (-W / 2 + .11, W / 2 - .11):
        for y in (-1.12, 1.10):
            a.box((.04, .78, .36), (x + (.06 if x > 0 else -.06), y, .44), 'charcoal')  # arch shadow
            wheel(a, x + (.02 if x > 0 else -.02), y, .30, .22)
    a.finish()


def van():
    a = Asset('prop_van_01', 'vehicle')
    W = 1.95
    body = [(-2.45, .38), (2.50, .38), (2.50, 2.30), (2.40, 2.40), (-1.30, 2.40), (-1.95, 1.45),
            (-2.40, 1.25), (-2.52, .95)]
    side_prism(a, body, W, 'white')
    edge_glass(a, W / 2 - .10, (-1.95, 1.45), (-1.30, 2.40), t0=.05, t1=.88)     # windscreen
    for s in (-1, 1):
        x0 = s * (W / 2 + .006)
        side_prism(a, [(-1.80, 1.50), (-.98, 1.50), (-.98, 2.15), (-1.32, 2.15)], .012, 'slate', x0=x0)
        a.box((.012, .02, 1.6), (s * (W / 2 + .008), -.90, 1.30), 'grey_light')       # cab door seam
        a.box((.012, .02, 1.6), (s * (W / 2 + .008), .45, 1.30), 'grey_light')        # sliding door seam
        a.box((.012, .70, .04), (s * (W / 2 + .008), 1.05, 2.02), 'grey')              # slide rail
        a.box((.012, 4.6, .08), (s * (W / 2 + .008), .05, .52), 'charcoal')            # sill strip
        a.box((.012, 3.1, .22), (s * (W / 2 + .008), .85, 1.15), 'sky')                # plain livery stripe
        a.box((.10, .14, .26), (s * (W / 2 + .06), -1.80, 1.72), 'charcoal')            # mirrors
        a.box((.30, .04, .16), (s * .68, -2.53, 1.08), 'lamp')
        a.box((.16, .04, .40), (s * .82, 2.51, 1.20), 'red')
    a.box((W + .04, .18, .26), (0, -2.52, .50), 'grey', bevel=.02)
    a.box((W + .04, .16, .22), (0, 2.53, .50), 'grey', bevel=.02)
    a.box((.80, .04, .20), (0, -2.535, .85), 'charcoal')                    # grille
    a.box((.012, .012, 1.8), (0, 2.507, 1.40), 'grey_light')                # rear doors split
    for s in (-1, 1):
        a.box((.62, .012, .45), (s * .44, 2.507, 1.85), 'slate')            # rear windows
    a.box((.42, .03, .11), (0, -2.62, .50), 'white')                        # blank plate
    for x in (-W / 2 + .17, W / 2 - .17):
        for y in (-1.55, 1.70):
            a.box((.04, .90, .42), (x + (.10 if x > 0 else -.10), y, .52), 'charcoal')
            wheel(a, x + (.02 if x > 0 else -.02), y, .36, .26)
    a.finish()


def scooter():
    a = Asset('prop_scooter_01', 'vehicle')
    wheel(a, 0, -.62, .20, .12, verts=10)
    wheel(a, 0, .58, .20, .12, verts=10)
    # body: floorboard + rear cowl
    a.box((.36, .70, .10), (0, -.05, .30), 'mint', bevel=.02)
    side_prism(a, [(.10, .26), (.80, .30), (.85, .55), (.70, .72), (.10, .68)], .44, 'mint')
    a.box((.36, .62, .10), (0, .42, .78), 'black', bevel=.02)              # seat
    # front shield + steering
    side_prism(a, [(-.55, .30), (-.40, .30), (-.40, 1.00), (-.62, .98)], .38, 'mint')
    a.cyl(.04, .55, (0, -.62, .60), 'metal_dark', verts=6, rot=(-15, 0, 0))
    a.box((.30, .16, .14), (0, -.62, .37), 'mint')                       # front mudguard
    a.box((.30, .18, .16), (0, -.58, 1.06), 'mint', bevel=.02)            # headset
    a.box((.70, .04, .04), (0, -.56, 1.12), 'charcoal')                  # handlebar
    for s in (-1, 1):
        a.cyl(.025, .12, (s * .38, -.56, 1.12), 'black', verts=6, rot=(0, 90, 0))
        a.box((.04, .02, .16), (s * .20, -.56, 1.24), 'charcoal')
        a.box((.06, .01, .04), (s * .20, -.56, 1.33), 'metal')           # mirrors
    a.cyl(.07, .04, (0, -.68, 1.06), 'lamp', verts=8, rot=(90, 0, 0))
    a.box((.18, .03, .06), (0, .87, .62), 'red')
    a.box((.30, .30, .06), (0, .80, .86), 'metal_dark')                   # rear rack
    a.finish()


def delivery_bike():
    a = Asset('prop_delivery_bike_01', 'vehicle')
    R = .34
    for y in (-.55, .55):
        a.torus(R - .02, .03, (0, y, R), 'black', major=14, minor=4, rot=(0, 90, 0))
        a.cyl(.04, .10, (0, y, R), 'metal', verts=6, rot=(0, 90, 0))
        for ang in (0, 60, 120):
            a.box((.01, .02, 2 * (R - .04)), (0, y, R), 'metal', rot=(ang, 0, 0))
    c = 'orange'
    bb, seat, head = (0, 0, .30), (0, .22, .78), (0, -.40, .84)
    tube(a, bb, seat, .022, c); tube(a, bb, head, .022, c); tube(a, seat, head, .022, c)
    tube(a, bb, (0, .55, R), .018, c); tube(a, seat, (0, .55, R), .018, c)
    tube(a, head, (0, -.55, R), .02, 'metal_dark')
    tube(a, (0, .22, .78), (0, .24, .88), .015, 'metal')
    a.box((.14, .26, .06), (0, .25, .91), 'black', bevel=.01)            # saddle
    tube(a, (0, -.40, .84), (0, -.44, 1.02), .016, 'metal_dark')
    a.box((.56, .03, .03), (0, -.44, 1.02), 'metal_dark')
    for s in (-1, 1):
        a.cyl(.022, .10, (s * .29, -.44, 1.02), 'black', verts=6, rot=(0, 90, 0))
    a.cyl(.06, .04, (0, -.04, .30), 'metal_dark', verts=8, rot=(0, 90, 0))
    # rear rack + delivery box
    a.box((.30, .40, .03), (0, .52, .78), 'metal_dark')
    tube(a, (0, .70, .78), (0, .55, R), .012, 'metal_dark')
    a.box((.44, .42, .40), (0, .52, 1.00), 'teal', bevel=.02)
    a.box((.46, .44, .04), (0, .52, 1.20), 'mint')
    a.box((.20, .02, .10), (0, .31, 1.02), 'white')                     # generic sticker
    # front basket light
    a.cyl(.04, .05, (0, -.47, .92), 'lamp', verts=6, rot=(90, 0, 0))
    a.box((.06, .14, .06), (.08, .10, .30), 'metal_dark')                # kickstand stub
    a.finish()


def delivery_bag():
    a = Asset('prop_delivery_bag_01', 'luggage')
    a.box((.44, .36, .46), (0, 0, .23), 'yellow', bevel=.025)
    a.box((.46, .38, .05), (0, 0, .45), 'mustard', bevel=.01)            # lid seam
    a.box((.30, .02, .16), (0, -.185, .26), 'ochre')                     # front patch (no logo)
    a.box((.20, .015, .08), (0, -.193, .26), 'white')
    for s in (-1, 1):
        a.box((.06, .03, .40), (s * .12, .195, .25), 'black')            # shoulder straps
        a.box((.06, .06, .04), (s * .12, .19, .05), 'black')
    for s_ in (-1, 1):
        a.box((.03, .03, .07), (s_ * .09, 0, .505), 'black')               # top handle
    a.box((.21, .03, .03), (0, 0, .54), 'black')
    a.box((.45, .02, .03), (0, -.18, .40), 'grey')                       # reflective band
    a.finish()


def student_backpack():
    a = Asset('prop_student_backpack_01', 'luggage')
    a.box((.32, .20, .42), (0, 0, .23), 'wood', bevel=.04)
    a.cyl(.16, .20, (0, 0, .44), 'wood', verts=8, rot=(90, 0, 0))       # rounded top
    a.box((.28, .02, .03), (0, -.10, .52), 'wood_dark')
    a.box((.24, .08, .18), (0, -.13, .15), 'wood_dark', bevel=.02)       # front pocket
    a.box((.20, .01, .02), (0, -.17, .22), 'mustard')                   # zip
    a.box((.04, .02, .04), (.05, -.18, .21), 'metal')
    for s in (-1, 1):
        a.box((.05, .03, .40), (s * .09, .11, .30), 'wood_dark')         # straps
        a.box((.04, .14, .26), (s * .17, -.02, .14), 'wood_dark')         # side pockets
    a.box((.10, .04, .02), (0, .04, .60), 'wood_dark')                   # handle loop
    a.box((.06, .02, .06), (.08, -.18, .30), 'red')                     # keychain/pin
    a.finish()


for fn in (bench, planter, streetlamp, bollard, bus_stop, fountain, bin_, recycling, kiosk, work_fence,
           terrace_table, terrace_chair, parasol, camera_mark, pergola, mini_stage, ac_unit, clothesline,
           tree_large, tree_young, bush_round, bush_long, flowerpot_balcony,
           car, van, scooter, delivery_bike, delivery_bag, student_backpack):
    fn()

export_all('urban', columns=6)
