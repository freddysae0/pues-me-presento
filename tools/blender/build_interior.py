"""Mobiliario interior (fila 'MOBILIARIO INTERIOR' de docs/reference/asset-kit-sheet.png).

blender -b --python tools/blender/build_interior.py
Front = -Y. Origins: floor props at ground-contact centre; wall props (clock, frames, curtain window)
at the centre of the back face touching the wall; ceiling lamp at the ceiling attachment point (geometry hangs to -Z).
"""
import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from kit_common import *

reset_scene()


def fix_normals(o):
    import bmesh
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    return o


class T:
    """Local frame (offset + yaw) to place composite pieces such as chairs."""
    def __init__(self, a, ox=0, oy=0, oz=0, ang=0):
        self.a, self.o, self.ang = a, (ox, oy, oz), ang
        self.c, self.s = math.cos(math.radians(ang)), math.sin(math.radians(ang))

    def p(self, l):
        x, y, z = l
        return (self.o[0] + x * self.c - y * self.s, self.o[1] + x * self.s + y * self.c, self.o[2] + z)

    def box(self, size, loc, m, rot=(0, 0, 0), bevel=0.0):
        return self.a.box(size, self.p(loc), m, (rot[0], rot[1], rot[2] + self.ang), bevel)

    def cyl(self, r, h, loc, m, verts=8, rot=(0, 0, 0), r2=None, bevel=0.0):
        return self.a.cyl(r, h, self.p(loc), m, verts, (rot[0], rot[1], rot[2] + self.ang), r2, bevel)


def legs4(a, w, d, h, m, t=.06, z0=0, inset=0.0, bevel=.01):
    for sx in (-1, 1):
        for sy in (-1, 1):
            a.box((t, t, h), (sx * (w / 2 - t / 2 - inset), sy * (d / 2 - t / 2 - inset), z0 + h / 2), m, bevel=bevel)


def office_chair(a, colour, ox=0, oy=0, ang=0):
    t = T(a, ox, oy, 0, ang)
    for k in range(5):
        g = k * 72 + 90
        c, s = math.cos(math.radians(g)), math.sin(math.radians(g))
        t.box((.30, .055, .045), (c * .15, s * .15, .075), 'metal_dark', rot=(0, 0, g), bevel=.01)
        t.cyl(.035, .04, (c * .29, s * .29, .035), 'black', verts=6, rot=(90, 0, g))
    t.cyl(.035, .30, (0, 0, .25), 'metal')
    t.box((.54, .50, .11), (0, 0, .46), colour, bevel=.035)
    t.box((.06, .06, .34), (0, .25, .58), 'metal_dark', rot=(-12, 0, 0))
    t.box((.50, .10, .56), (0, .29, .84), colour, rot=(-8, 0, 0), bevel=.035)
    for sx in (-1, 1):
        t.box((.04, .04, .18), (sx * .27, .02, .58), 'metal_dark')
        t.box((.07, .30, .04), (sx * .27, .0, .68), 'charcoal', bevel=.01)


def dining_chair(a, colour, ox=0, oy=0, ang=0):
    t = T(a, ox, oy, 0, ang)
    for sx in (-1, 1):
        for sy in (-1, 1):
            t.box((.05, .05, .44), (sx * .19, sy * .19, .22), colour)
        t.box((.05, .05, .50), (sx * .19, .19, .69), colour, rot=(-6, 0, 0))
    t.box((.46, .46, .06), (0, 0, .46), colour, bevel=.02)
    t.box((.46, .05, .16), (0, .22, .86), colour, rot=(-6, 0, 0), bevel=.02)
    t.box((.40, .03, .05), (0, .205, .68), 'green_dark', rot=(-6, 0, 0))


# ---------------------------------------------------------------- sofa
a = Asset('prop_sofa_01')
for sx in (-1, 1):
    for sy in (-1, 1):
        a.cyl(.04, .1, (sx * 1.2, sy * .38, .05), 'wood_dark', verts=6, r2=.03)
a.box((2.5, .9, .24), (0, .02, .22), 'terracotta_dark', bevel=.03)                 # base
a.box((2.5, .30, .56), (0, .35, .56), 'terracotta', rot=(-6, 0, 0), bevel=.05)     # back
for sx in (-1, 1):                                                                  # chunky arms
    a.box((.28, .92, .40), (sx * 1.2, .02, .42), 'terracotta', bevel=.05)
    a.cyl(.14, .92, (sx * 1.2, .02, .62), 'terracotta', verts=8, rot=(90, 0, 0))
for i, x in enumerate((-.73, 0, .73)):
    a.box((.72, .68, .17), (x, -.06, .42), 'terracotta', bevel=.05)                 # seat cushions
    a.box((.70, .18, .42), (x, .22, .66), 'terracotta', rot=(-14, 0, 0), bevel=.06)  # back cushions
a.box((.42, .16, .40), (-.78, .06, .68), 'cream', rot=(-20, 0, 18), bevel=.07)     # throw pillows
a.box((.40, .16, .38), (.74, .06, .68), 'mustard', rot=(-20, 0, -14), bevel=.07)
a.box((.30, .13, .28), (.38, .06, .64), 'sand', rot=(-18, 0, -6), bevel=.06)
a.box((.62, .9, .03), (.62, -.02, .515), 'sand', bevel=.01)                         # draped blanket
a.box((.62, .03, .26), (.62, -.47, .40), 'sand', bevel=.01)
for x in (.42, .62, .82):
    a.box((.04, .05, .03), (x, -.49, .28), 'cream')                                  # fringe
a.box((.62, .08, .03), (.62, -.2, .535), 'terracotta_dark')                         # blanket stripe

# ---------------------------------------------------------------- loose cushions + blanket
a = Asset('prop_cushion_blanket_01')
a.box((.42, .40, .14), (-.2, .05, .07), 'mustard', rot=(0, 0, 12), bevel=.06)
a.box((.38, .36, .13), (-.18, .02, .2), 'cream', rot=(4, -3, -8), bevel=.06)
a.box((.36, .14, .34), (.3, .2, .17), 'terracotta', rot=(-12, 0, -6), bevel=.06)
for i, (m, z) in enumerate((('sand', .03), ('peach', .08), ('sand', .13))):
    a.box((.48, .34, .05), (.24, -.2, z), m, rot=(0, 0, 4 - i * 4), bevel=.02)
a.box((.48, .06, .051), (.24, -.2, .08), 'terracotta_dark', rot=(0, 0, 0))
a.box((.05, .34, .16), (.48, -.2, .08), 'sand', bevel=.02)

# ---------------------------------------------------------------- coffee table
a = Asset('prop_coffee_table_01')
a.box((1.5, .8, .07), (0, 0, .42), 'wood_light', bevel=.03)
a.box((1.4, .7, .05), (0, 0, .375), 'wood')
legs4(a, 1.36, .66, .38, 'wood', t=.08, bevel=.015)
a.box((1.3, .6, .03), (0, 0, .12), 'wood')                                           # lower shelf
a.box((.28, .2, .03), (.38, .08, .47), 'red', rot=(0, 0, 10))                        # magazines
a.box((.26, .19, .025), (.38, .08, .49), 'sky', rot=(0, 0, -6))
a.box((.24, .17, .05), (-.35, .05, .16), 'navy', bevel=.005)                         # books on shelf
a.box((.22, .16, .04), (-.35, .05, .2), 'mustard', bevel=.005)
a.cyl(.07, .1, (-.45, -.1, .5), 'terracotta', r2=.085)                               # small plant
a.ico(.09, (-.45, -.1, .6), 'leaf', scale=(1, 1, .8))

# ---------------------------------------------------------------- rug
a = Asset('prop_rug_01')
a.box((2.4, 1.6, .012), (0, 0, .006), 'terracotta_dark')
a.box((2.3, 1.5, .012), (0, 0, .010), 'sand')
a.box((2.1, 1.3, .012), (0, 0, .014), 'terracotta')
a.box((2.0, 1.2, .012), (0, 0, .018), 'cream')
a.box((.7, .7, .012), (0, 0, .022), 'terracotta', rot=(0, 0, 45))
a.box((.38, .38, .012), (0, 0, .026), 'mustard', rot=(0, 0, 45))
for sx in (-1, 1):
    a.box((.3, .3, .012), (sx * .72, 0, .022), 'teal', rot=(0, 0, 45))
    for y in (-.6, -.3, 0, .3, .6):
        a.box((.1, .05, .008), (sx * 1.25, y, .004), 'cream')                        # fringe

# ---------------------------------------------------------------- desk
a = Asset('prop_desk_01')
W, D = 2.4, 1.0
a.box((W, D, .07), (0, 0, .745), 'wood_light', bevel=.025)
a.box((.6, D - .08, .70), (W / 2 - .34, 0, .36), 'wood', bevel=.02)                  # drawer pedestal
for z in (.15, .38, .60):
    a.box((.52, .02, .18), (W / 2 - .34, -D / 2 + .03, z), 'wood_light', bevel=.008)
    a.box((.12, .03, .03), (W / 2 - .34, -D / 2 + .01, z + .03), 'metal_dark')
for sy in (-1, 1):
    a.box((.07, .07, .71), (-W / 2 + .08, sy * (D / 2 - .08), .355), 'wood', bevel=.01)
a.box((.05, D - .2, .05), (-W / 2 + .08, 0, .2), 'wood')
a.box((W - .7, .03, .35), (-.3, D / 2 - .06, .53), 'wood')                            # modesty panel
a.box((.42, .30, .02), (-.1, -.08, .79), 'charcoal', bevel=.006)                      # laptop
a.box((.42, .02, .28), (-.1, .08, .93), 'charcoal', rot=(-12, 0, 0), bevel=.006)
a.box((.38, .005, .24), (-.1, .066, .93), 'screen', rot=(-12, 0, 0))
a.box((.30, .22, .06), (-.85, .15, .81), 'red', bevel=.01)                           # box/files
a.box((.28, .2, .03), (-.85, .15, .855), 'paper')
a.cyl(.045, .1, (.45, -.15, .83), 'white')                                            # mug
a.cyl(.06, .03, (.75, .2, .795), 'charcoal')                                           # desk lamp
a.box((.025, .025, .38), (.75, .2, .98), 'charcoal', rot=(0, 18, 0))
a.cone(.1, .14, (.67, .2, 1.16), 'mustard', rot=(0, -150, 0))
a.cyl(.07, .1, (.95, -.22, .83), 'terracotta', r2=.08)                                # plant
a.ico(.09, (.95, -.22, .93), 'leaf')

# ---------------------------------------------------------------- office chair
a = Asset('prop_chair_desk_01')
office_chair(a, 'teal')

# ---------------------------------------------------------------- bookshelf
a = Asset('prop_bookshelf_01')
W, D, H = .9, .34, 1.8
for sx in (-1, 1):
    a.box((.05, D, H), (sx * (W / 2 - .025), 0, H / 2), 'wood', bevel=.012)
a.box((W, .02, H), (0, D / 2 - .01, H / 2), 'wood_dark')
shelves = [.06, .44, .82, 1.2, 1.56]
for z in shelves:
    a.box((W - .08, D - .02, .04), (0, -.01, z), 'wood_light')
a.box((W + .04, D + .03, .05), (0, -.01, H - .02), 'wood', bevel=.015)
cols = ['red', 'navy', 'mustard', 'teal', 'green', 'cream', 'purple', 'orange', 'sky', 'brick', 'leaf', 'slate']
k = 0
for si, z in enumerate(shelves[:4]):
    x = -W / 2 + .07
    n = 0
    while x < W / 2 - .12 - (.22 if si == 2 else 0):
        bw = .04 + (k * 37 % 5) * .01
        bh = .22 + (k * 53 % 7) * .02
        lean = 12 if (si == 1 and n == 5) else 0
        a.box((bw, .22, bh), (x + bw / 2, -.03, z + .02 + bh / 2), cols[k % len(cols)], rot=(0, lean, 0))
        x += bw + .006; k += 1; n += 1
a.box((.24, .2, .03), (.28, -.03, .845), 'red')                                        # lying stack
a.box((.22, .19, .03), (.28, -.03, .875), 'teal')
a.cyl(.06, .1, (.0, -.02, 1.63), 'terracotta', r2=.075)                                 # plant on top
for i in range(5):
    g = i * 72
    a.box((.05, .2, .02), (.08 * math.cos(math.radians(g)), -.02 + .08 * math.sin(math.radians(g)), 1.7),
          'leaf', rot=(30, 0, g + 90))
a.ico(.07, (0, -.02, 1.72), 'leaf_dark')

# ---------------------------------------------------------------- kitchen counter
a = Asset('prop_kitchen_counter_01')
W, D = 2.0, .64
a.box((W, D - .04, .1), (0, .02, .05), 'green_dark')                                   # plinth
a.box((W, D - .02, .78), (0, .01, .49), 'green', bevel=.02)
for i, x in enumerate((-.75, -.25, .25, .75)):
    a.box((.46, .03, .62), (x, -D / 2 + .01, .5), 'green', bevel=.012)                  # doors
    a.box((.36, .01, .5), (x, -D / 2 - .006, .5), 'green_dark')
    a.cyl(.02, .03, (x + (.17 if i % 2 == 0 else -.17), -D / 2 - .02, .7), 'cream', rot=(90, 0, 0))
a.box((W + .04, D + .02, .05), (0, 0, .905), 'cream', bevel=.012)                      # worktop
a.box((.56, .40, .02), (.35, -.02, .935), 'metal', bevel=.01)                           # sink rim
a.box((.48, .32, .02), (.35, -.02, .941), 'metal_dark')
a.cyl(.02, .25, (.35, .22, 1.05), 'metal')                                              # faucet
a.box((.03, .16, .03), (.35, .15, 1.17), 'metal')
a.cyl(.015, .06, (.35, .08, 1.14), 'metal')
a.box((W + .04, .03, .45), (0, D / 2 - .015, 1.15), 'white')                           # tiled backsplash
for r in range(3):
    a.box((W, .005, .012), (0, D / 2 - .033, .99 + r * .13), 'grey_light')
a.box((.34, .24, .02), (-.45, -.02, .94), 'wood_light', rot=(0, 0, 8), bevel=.006)      # chopping board
a.cyl(.05, .14, (-.82, .15, 1.0), 'red')                                                # jars
a.cyl(.05, .11, (-.70, .18, .985), 'mustard')
a.cyl(.07, .12, (.85, .12, .99), 'terracotta', r2=.08)                                  # herb pot
a.ico(.09, (.85, .12, 1.1), 'leaf')
a.box((W + .04, .22, .03), (0, D / 2 - .11, 1.48), 'wood', bevel=.008)                 # wall shelf
for i, (x, m) in enumerate(((-.7, 'white'), (-.55, 'sky'), (-.2, 'cream'), (.2, 'red'), (.6, 'white'))):
    a.cyl(.045, .1 + (i % 2) * .04, (x, D / 2 - .11, 1.545 + (i % 2) * .02), m)

# ---------------------------------------------------------------- fridge (retro)
a = Asset('prop_fridge_01')
a.box((.72, .62, 1.62), (0, .03, .85), 'cream', bevel=.07)
a.box((.70, .58, .06), (0, .03, .03), 'charcoal')                                       # kick plate
a.box((.66, .05, .48), (0, -.29, 1.38), 'cream', bevel=.04)                             # freezer door
a.box((.05, .04, .16), (-.25, -.33, 1.24), 'metal', bevel=.012)
a.box((.6, .02, .03), (0, -.28, 1.12), 'grey_light')                                    # seam
a.part('door', pivot=(.36, -.29, 0))                                                    # hinge right-front
a.box((.68, .06, 1.0), (0, -.31, .6), 'cream', bevel=.04)
a.box((.05, .05, .26), (-.27, -.355, .95), 'metal', bevel=.015)                         # chrome handle
a.box((.06, .02, .04), (-.27, -.335, 1.06), 'metal')
a.box((.06, .02, .04), (-.27, -.335, .84), 'metal')
for (x, z, m, r) in ((.05, .9, 'red', 0), (.18, .82, 'mustard', 14), (-.08, .7, 'sky', -10),
                     (.15, .55, 'leaf', 6), (-.02, .42, 'pink', 0)):
    a.box((.08, .015, .08), (x, -.345, z), m, rot=(0, r, 0))                            # magnets
a.box((.16, .01, .2), (.0, -.343, .62), 'paper', rot=(0, 5, 0))                         # note/drawing
a.box((.10, .012, .015), (.0, -.35, .66), 'red', rot=(0, 5, 0))

# ---------------------------------------------------------------- moka pot
a = Asset('prop_coffee_maker_01')
a.cyl(.06, .09, (0, 0, .045), 'metal', r2=.048)
a.cyl(.048, .02, (0, 0, .1), 'metal_dark')
a.cyl(.048, .1, (0, 0, .16), 'metal', r2=.062)
a.cyl(.064, .02, (0, 0, .22), 'metal', r2=.04)
a.cyl(.012, .03, (0, 0, .24), 'black', verts=6)
a.prism([(0, 0), (.04, -.01), (.04, .01), (0, .02)], .03, (-.065, 0, .19), 'metal')    # spout
a.box((.025, .03, .12), (.1, 0, .16), 'black', rot=(0, -10, 0), bevel=.008)            # handle
a.box((.05, .025, .02), (.075, 0, .21), 'black')
a.box((.05, .025, .02), (.075, 0, .11), 'black')

# ---------------------------------------------------------------- mug
a = Asset('prop_mug_01')
a.cyl(.045, .1, (0, 0, .05), 'white', verts=10)
a.cyl(.038, .005, (0, 0, .098), 'wood_dark', verts=10)
a.torus(.03, .009, (.05, 0, .05), 'white', major=8, minor=4, rot=(90, 0, 0))
a.cyl(.046, .025, (0, 0, .055), 'red', verts=10)

# ---------------------------------------------------------------- TV stand
a = Asset('prop_tv_stand_01')
a.box((1.6, .45, .08), (0, 0, .5), 'wood_light', bevel=.02)
a.box((1.54, .42, .36), (0, .0, .28), 'wood', bevel=.015)
for x in (-.52, .52):
    a.box((.46, .02, .28), (x, -.21, .28), 'wood_light', bevel=.008)
    a.box((.14, .025, .025), (x, -.225, .34), 'metal_dark')
a.box((.5, .02, .3), (0, -.2, .28), 'wood_dark')                                        # open niche
a.box((.3, .2, .06), (0, -.08, .17), 'charcoal', bevel=.005)                            # console box
a.box((.03, .005, .01), (.1, -.183, .17), 'led_red')
for sx in (-1, 1):
    for sy in (-1, 1):
        a.box((.05, .05, .1), (sx * .72, sy * .17, .05), 'wood_dark', rot=(sy * 6, -sx * 6, 0))
a.cyl(.05, .08, (.68, .05, .58), 'terracotta', r2=.06)
a.ico(.07, (.68, .05, .66), 'leaf')

# ---------------------------------------------------------------- TV
a = Asset('prop_tv_01')
a.box((.36, .22, .03), (0, 0, .015), 'charcoal', bevel=.01)                             # foot
a.box((.07, .05, .14), (0, .03, .1), 'charcoal')
a.box((1.12, .07, .66), (0, .03, .5), 'charcoal', bevel=.02)
a.box((1.02, .01, .56), (0, -.008, .51), 'screen_dark')
a.box((.04, .005, .01), (.48, -.008, .2), 'led_red')

# ---------------------------------------------------------------- floor lamp
a = Asset('prop_floor_lamp_01')
a.cyl(.18, .04, (0, 0, .02), 'wood_dark', r2=.15)
a.cyl(.022, 1.3, (0, 0, .69), 'wood')
a.cyl(.035, .08, (0, 0, 1.36), 'gold')
a.cyl(.26, .32, (0, 0, 1.5), 'lamp', verts=10, r2=.16)
a.cyl(.03, .05, (0, 0, 1.68), 'gold')

# ---------------------------------------------------------------- ceiling lamp (origin = ceiling point)
a = Asset('prop_ceiling_lamp_01')
a.cyl(.08, .03, (0, 0, -.015), 'metal_dark')
a.cyl(.008, .5, (0, 0, -.28), 'black', verts=4)
a.cyl(.04, .06, (0, 0, -.55), 'metal_dark')
a.cyl(.07, .14, (0, 0, -.62), 'mustard', verts=10, r2=.04)
a.cyl(.26, .14, (0, 0, -.74), 'mustard', verts=12, r2=.08)
a.sphere(.07, (0, 0, -.81), 'lamp', seg=8, rings=4)

# ---------------------------------------------------------------- wall clock (origin = wall contact)
a = Asset('prop_wall_clock_01')
a.cyl(.2, .05, (0, -.025, 0), 'wood_dark', verts=16, rot=(90, 0, 0))
a.cyl(.17, .01, (0, -.052, 0), 'white', verts=16, rot=(90, 0, 0))
for i in range(12):
    g = math.radians(i * 30)
    L = .04 if i % 3 == 0 else .02
    a.box((.012, .005, L), (.145 * math.sin(g), -.058, .145 * math.cos(g) - 0), 'black', rot=(0, i * 30, 0))
a.cyl(.012, .012, (0, -.064, 0), 'gold', rot=(90, 0, 0))
a.part('hand_h', pivot=(0, -.06, 0))
a.box((.018, .006, .09), (0, -.062, .035), 'black')
a.part('hand_m', pivot=(0, -.066, 0))
a.box((.012, .006, .14), (0, -.068, .06), 'red_dark')

# ---------------------------------------------------------------- coat rack + jacket
a = Asset('prop_coat_rack_01')
for g in (45, 135, 225, 315):
    c, s = math.cos(math.radians(g)), math.sin(math.radians(g))
    a.box((.32, .05, .04), (c * .15, s * .15, .03), 'wood_dark', rot=(0, 0, g), bevel=.01)
a.cyl(.03, 1.72, (0, 0, .88), 'wood_dark', verts=6)
a.sphere(.05, (0, 0, 1.76), 'wood_dark', seg=6, rings=4)
for g in (0, 90, 180, 270):
    c, s = math.cos(math.radians(g)), math.sin(math.radians(g))
    a.box((.18, .03, .03), (c * .08, s * .08, 1.62), 'wood_dark', rot=(0, -30, g))
# jacket hanging from the front hook (-Y)
a.prism([(-.2, -.48), (.2, -.48), (.22, -.05), (.07, 0), (-.07, 0), (-.22, -.05)], .14, (0, -.13, 1.6), 'navy')
for sx in (-1, 1):
    a.box((.09, .12, .42), (sx * .22, -.13, 1.33), 'navy', rot=(0, sx * -6, 0), bevel=.02)
    a.box((.05, .015, .22), (sx * .05, -.205, 1.44), 'slate', rot=(0, sx * 18, 0))        # lapels
a.box((.012, .01, .36), (0, -.205, 1.3), 'slate')
a.box((.07, .07, .5), (.07, -.2, 1.35), 'red', rot=(0, 8, 0), bevel=.015)                 # scarf
a.box((.12, .1, .3), (-.05, .07, 1.4), 'mustard', rot=(0, 0, 0), bevel=.03)               # bag on back hook
a.box((.02, .02, .2), (-.05, .07, 1.6), 'wood_dark')

# ---------------------------------------------------------------- radiator
a = Asset('prop_radiator_01')
n = 9
for i in range(n):
    x = (i - (n - 1) / 2) * .085
    a.box((.06, .12, .58), (x, 0, .41), 'white', bevel=.02)
a.box((.78, .06, .04), (0, 0, .2), 'white')
a.box((.78, .06, .04), (0, 0, .64), 'white')
for sx in (-1, 1):
    a.box((.05, .14, .12), (sx * .3, 0, .06), 'grey_light')
a.cyl(.02, .1, (.43, 0, .2), 'metal', rot=(0, 90, 0))
a.cyl(.03, .04, (.45, 0, .25), 'metal_dark')

# ---------------------------------------------------------------- window with curtains (origin = wall, window centre)
a = Asset('prop_curtain_01')
a.box((1.1, .08, 1.3), (0, -.04, 0), 'white', bevel=.015)                                 # frame
a.box((.98, .02, 1.18), (0, -.07, 0), 'sky')                                              # view
a.box((.98, .02, .25), (0, -.072, -.46), 'leaf')                                          # trees outside
a.box((.04, .04, 1.18), (0, -.09, 0), 'white')
a.box((.98, .04, .04), (0, -.09, .12), 'white')
a.box((1.24, .2, .05), (0, -.12, -.67), 'white', bevel=.01)                               # sill
a.cyl(.02, 1.7, (0, -.19, .78), 'wood_dark', rot=(0, 90, 0))                               # rod
for sx in (-1, 1):
    a.sphere(.04, (sx * .86, -.19, .78), 'wood_dark', seg=6, rings=4)
    prof = []
    for i in range(7):
        prof.append((i * .06, (-.03 if i % 2 else .03)))
    # wavy panel: prism in XY (folds), extruded along Z
    pts = [(x, y) for x, y in prof] + [(x, y + .05) for x, y in prof[::-1]]
    verts = [(sx * (.5 + x), -.22 + y, -.75) for x, y in pts] + [(sx * (.5 + x), -.22 + y, .76) for x, y in pts]
    m = len(pts)
    faces = [[i, (i + 1) % m, m + (i + 1) % m, m + i] for i in range(m)] + [list(range(m)), list(range(m, 2 * m))]
    fix_normals(a.poly(verts, faces, 'cream'))
    a.box((.08, .1, .05), (sx * .68, -.24, -.15), 'terracotta', bevel=.01)               # tie-back
    for i in range(4):
        a.cyl(.025, .02, (sx * (.52 + i * .1), -.19, .78), 'gold', verts=6, rot=(0, 90, 0))
a.cyl(.06, .08, (.3, -.14, -.6), 'terracotta', r2=.07)                                     # sill plant
a.ico(.07, (.3, -.14, -.52), 'leaf')

# ---------------------------------------------------------------- wall frames (origin = wall centre)
a = Asset('prop_wall_frames_01')
def frame(x, z, w, h, fm, pics):
    a.box((w, .04, h), (x, -.02, z), fm, bevel=.012)
    a.box((w - .08, .01, h - .08), (x, -.042, z), 'paper')
    for (px, pz, pw, ph, m) in pics:
        a.box((pw, .01, ph), (x + px, -.048, z + pz), m)
frame(-.42, .1, .42, .52, 'wood', [(0, .06, .3, .28, 'sky'), (0, -.1, .3, .12, 'leaf'), (.07, .12, .07, .07, 'yellow'),
                                    (-.04, -.02, .1, .12, 'terracotta')])
frame(.08, .18, .32, .38, 'gold', [(0, .03, .14, .14, 'skin_2'), (0, .1, .16, .06, 'hair_brown'), (0, -.1, .2, .1, 'navy')])
frame(.4, -.18, .3, .3, 'wood_dark', [(0, 0, .2, .2, 'mint'), (0, 0, .1, .1, 'red')])

# ---------------------------------------------------------------- plant pot
a = Asset('prop_plant_pot_01')
a.cyl(.15, .28, (0, 0, .14), 'terracotta', verts=8, r2=.19)
a.cyl(.2, .05, (0, 0, .28), 'terracotta_dark', verts=8)
a.cyl(.17, .02, (0, 0, .3), 'wood_dark', verts=8)
for i in range(8):
    g = i * 45 + (i % 2) * 12
    tilt = 30 + (i % 3) * 12
    L = .22 + (i % 2) * .05
    c, s = math.cos(math.radians(g)), math.sin(math.radians(g))
    tl = math.radians(tilt)
    a.ico(L, (c * (.04 + L * math.sin(tl)), s * (.04 + L * math.sin(tl)), .32 + L * math.cos(tl)),
          'leaf' if i % 2 else 'leaf_dark', scale=(.32, .1, 1), rot=(0, tilt, g))
a.ico(.2, (0, 0, .62), 'leaf', scale=(.3, .1, 1), rot=(0, 5, 90))

# ---------------------------------------------------------------- planning table + 4 green chairs
a = Asset('prop_planning_table_01')
W, D = 2.6, 1.0
a.box((W, D, .06), (0, 0, .735), 'wood_light', bevel=.02)
a.box((.5, D, .061), (0, 0, .735), 'ochre', bevel=.02)                                     # extension leaf
for sx in (-1, 1):
    a.box((.008, D + .002, .062), (sx * .25, 0, .735), 'wood_dark')
a.box((W - .2, D - .14, .1), (0, 0, .655), 'wood', bevel=.01)                               # apron
legs4(a, W - .1, D - .1, .62, 'wood', t=.08, bevel=.015)
dining_chair(a, 'green', -.5, .78, 0)
dining_chair(a, 'green', .55, .76, 0)
dining_chair(a, 'green', -1.58, 0, 90)
dining_chair(a, 'green', 1.6, .05, -90)
a.box((.3, .22, .01), (-.6, -.15, .77), 'paper', rot=(0, 0, 8))                             # papers & mug
a.box((.3, .22, .01), (-.55, -.12, .78), 'paper', rot=(0, 0, -5))
a.box((.25, .18, .02), (.3, -.1, .775), 'red', rot=(0, 0, 15))
a.box((.36, .26, .02), (.75, .1, .775), 'charcoal', bevel=.005)
a.cyl(.045, .1, (-.1, .2, .815), 'white')
a.cyl(.05, .05, (1.05, -.25, .79), 'mustard', bevel=.0)
a.cyl(.07, .1, (0, .05, .815), 'terracotta', r2=.08)
a.ico(.08, (0, .05, .91), 'leaf')

# ---------------------------------------------------------------- crisis board on easel
a = Asset('prop_crisis_board_01')
for sx in (-1, 1):
    a.box((.06, .06, 1.75), (sx * .5, -.05, .85), 'wood', rot=(-4, sx * 8, 0), bevel=.01)
a.box((.06, .06, 1.6), (0, .35, .78), 'wood', rot=(14, 0, 0), bevel=.01)
a.box((1.25, .1, .05), (0, -.12, .62), 'wood', bevel=.01)                                    # ledge
a.box((1.3, .06, .95), (0, -.06, 1.12), 'wood_dark', bevel=.02)                              # frame
a.box((1.2, .02, .85), (0, -.095, 1.12), 'ochre')                                            # cork
notes = [(-.45, 1.38, 'yellow', 5), (-.15, 1.4, 'paper', -4), (.2, 1.36, 'pink', 8), (.46, 1.4, 'mint', -6),
         (-.4, 1.05, 'paper', -8), (-.05, 1.1, 'yellow', 3), (.32, 1.08, 'sky', -3), (-.42, .82, 'mint', 6),
         (-.05, .84, 'pink', -5), (.4, .82, 'paper', 4)]
for (x, z, m, r) in notes:
    w = .2 if m == 'paper' else .14
    a.box((w, .008, w * (1.25 if m == 'paper' else 1)), (x, -.108, z), m, rot=(0, r, 0))
    a.sphere(.015, (x, -.118, z + w * .4), 'red', seg=6, rings=3)
for (x1, z1, x2, z2) in ((-.45, 1.38, -.05, 1.1), (-.05, 1.1, .32, 1.08), (.2, 1.36, .32, 1.08), (-.05, 1.1, -.05, .84)):
    L = math.hypot(x2 - x1, z2 - z1)
    ang = math.degrees(math.atan2(z2 - z1, x2 - x1))
    a.box((L, .004, .01), ((x1 + x2) / 2, -.125, (z1 + z2) / 2 + .05), 'red', rot=(0, -ang, 0))
a.box((.12, .03, .03), (.4, -.14, .66), 'red')                                                # marker on ledge

# ---------------------------------------------------------------- whiteboard on wheels
a = Asset('prop_whiteboard_01')
for sx in (-1, 1):
    a.box((.04, .04, 1.75), (sx * .8, 0, .93), 'metal', bevel=.008)
    a.box((.06, .56, .05), (sx * .8, 0, .09), 'metal_dark', bevel=.01)
    for sy in (-1, 1):
        a.cyl(.04, .03, (sx * .8, sy * .25, .04), 'black', rot=(0, 90, 0))
a.box((1.56, .05, 1.04), (0, 0, 1.25), 'grey_light', bevel=.012)
a.box((1.48, .01, .96), (0, -.026, 1.25), 'white')
a.box((1.2, .08, .025), (0, -.06, .72), 'grey_light')                                         # tray
for i, m in enumerate(('red', 'blue', 'charcoal')):
    a.box((.11, .02, .02), (-.3 + i * .14, -.06, .74), m)
def stroke(x1, z1, x2, z2, m, w=.014):
    L = math.hypot(x2 - x1, z2 - z1)
    ang = math.degrees(math.atan2(z2 - z1, x2 - x1))
    a.box((L + w, .004, w), ((x1 + x2) / 2, -.033, (z1 + z2) / 2), m, rot=(0, -ang, 0))
stroke(-.6, 1.6, -.25, 1.6, 'blue'); stroke(-.6, 1.6, -.6, 1.4, 'blue'); stroke(-.25, 1.6, -.25, 1.4, 'blue')
stroke(-.6, 1.4, -.25, 1.4, 'blue')                                                          # box
stroke(-.25, 1.5, .1, 1.35, 'red'); stroke(.1, 1.35, .02, 1.4, 'red'); stroke(.1, 1.35, .05, 1.29, 'red')  # arrow
for i, h in enumerate((.12, .22, .16, .3)):                                                  # bar chart
    a.box((.07, .006, h), (.25 + i * .11, -.034, .85 + h / 2), 'blue')
stroke(.2, .85, .66, .85, 'charcoal')
for i in range(4):                                                                           # zig-zag scribble
    stroke(-.6 + i * .12, 1.0 + (i % 2) * .1, -.48 + i * .12, 1.0 + ((i + 1) % 2) * .1, 'red')
stroke(.25, 1.62, .6, 1.62, 'charcoal'); stroke(.25, 1.54, .52, 1.54, 'charcoal'); stroke(.25, 1.46, .58, 1.46, 'charcoal')
a.box((.1, .006, .1), (-.0, -.034, 1.0), 'leaf', rot=(0, 45, 0))                             # tick/ok mark

# ---------------------------------------------------------------- Lola's work desk + red chair
a = Asset('prop_desk_lola_01')
W, D = 1.5, .75
a.box((W, D, .06), (0, 0, .73), 'wood_light', bevel=.02)
legs4(a, W - .06, D - .06, .70, 'wood', t=.07, bevel=.012)
a.box((W - .2, .02, .25), (0, D / 2 - .06, .55), 'wood')
a.box((.35, .55, .25), (.5, 0, .53), 'wood', bevel=.012)                                     # hanging drawers
a.box((.3, .02, .07), (.5, -.28, .58), 'wood_light')
for i in range(6):                                                                           # paper stacks
    a.box((.3, .22, .02), (-.45, .1, .77 + i * .022), 'paper' if i % 3 else 'cream', rot=(0, 0, (i * 7) % 11 - 5))
for i in range(4):
    a.box((.3, .22, .02), (-.1, .18, .77 + i * .022), 'paper', rot=(0, 0, (i * 5) % 9 - 4))
a.box((.32, .24, .04), (.15, .15, .78), 'mustard', rot=(0, 0, -6), bevel=.005)              # folders
a.box((.32, .24, .03), (.15, .15, .815), 'sky', rot=(0, 0, 4), bevel=.005)
a.box((.22, .3, .005), (-.15, -.17, .763), 'paper', rot=(0, 0, 12))                          # loose sheets
a.box((.22, .3, .005), (.2, -.2, .763), 'paper', rot=(0, 0, -20))
a.box((.12, .01, .01), (.2, -.2, .77), 'blue', rot=(0, 0, 30))                               # pen
a.cyl(.04, .09, (.55, -.15, .805), 'red')                                                    # mug
a.cyl(.05, .08, (.55, .2, .8), 'terracotta', r2=.06)
a.ico(.07, (.55, .2, .88), 'leaf')
office_chair(a, 'red', .05, -.75, 170)

# ---------------------------------------------------------------- printer with jammed paper
a = Asset('prop_printer_01')
a.box((.55, .42, .2), (0, 0, .12), 'grey_light', bevel=.03)
a.box((.55, .42, .03), (0, 0, .015), 'charcoal')
a.box((.5, .36, .06), (0, .03, .25), 'charcoal', bevel=.015)                                 # scanner lid
a.box((.38, .18, .015), (0, -.2, .1), 'charcoal', rot=(-8, 0, 0))                            # output tray
a.box((.14, .02, .06), (.17, -.21, .17), 'charcoal')                                         # panel
a.box((.07, .005, .035), (.15, -.221, .175), 'screen')
a.box((.015, .005, .015), (.215, -.221, .175), 'led_red')
a.box((.4, .01, .25), (0, .2, .38), 'paper', rot=(-25, 0, 0))                               # input paper
a.box((.3, .2, .005), (0, -.27, .1), 'paper', rot=(-14, 0, 6))                               # printed sheet
# jammed, crumpled paper bursting out of the front slot
for i, (x, rx, rz, ry) in enumerate(((-.08, -60, 10, 8), (.03, -40, -15, -10), (.1, -75, 25, 15), (-.02, -20, 0, -5))):
    a.box((.2, .006, .16), (x, -.24 + i * .01, .2 + i * .015), 'paper', rot=(rx, ry, rz))
a.ico(.05, (.06, -.28, .2), 'paper', scale=(1.2, 1, .8))
a.box((.24, .006, .3), (-.05, -.32, .07), 'paper', rot=(-75, 0, -12))                        # sheet hanging to floor

export_all('interior')
