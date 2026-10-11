"""Electronics, stage/debate and food/mess props. Run:
blender -b --python tools/blender/build_tech_stage_food.py
Exports public/assets/<name>.glb, art/tech_stage_food.blend, art/previews/tech_stage_food.png.
Front faces -Y; origin at ground contact centre (laptop lid pivots at its hinge).
"""
import sys, math, random
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from kit_common import *
from mathutils import Vector

reset_scene()
rng = random.Random(7)


def rod(a, p0, p1, r, m, verts=6):
    """Cylinder from p0 to p1."""
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    e = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_euler()
    return a.cyl(r, d.length, (p0 + p1) / 2, m, verts, rot=[math.degrees(x) for x in e])


def tripod(a, h, spread, m='metal_dark', r=.016, foot='black'):
    """Three legs from (0,0,h) to the floor; one leg points back (+Y) so the front stays clear."""
    for k in range(3):
        ang = math.radians(90 + 120 * k)
        f = (math.cos(ang) * spread, math.sin(ang) * spread, 0)
        rod(a, (0, 0, h), (f[0], f[1], .03), r, m)
        a.cyl(r * 1.8, .03, (f[0], f[1], .015), foot, 6)
    a.cyl(r * 2.6, .08, (0, 0, h), m, 8)


# ------------------------------------------------------------------ ELECTRÓNICA
# Phone (1.2x real size so it reads in hand / on a table), standing upright.
a = Asset('prop_phone_01')
a.box((.09, .014, .18), (0, 0, .09), 'blue', bevel=.008)
a.box((.084, .004, .172), (0, -.007, .09), 'black', bevel=.002)
a.label('phone', (.076, .15), (0, -.0095, .092))
a.box((.02, .003, .004), (0, -.0095, .174), 'charcoal')
a.cyl(.008, .004, (-.025, .0085, .16), 'charcoal', 8, rot=(90, 0, 0))
a.finish()

# Laptop with hinged lid.
a = Asset('prop_laptop_01')
W, D = .38, .27
a.box((W, D, .022), (0, 0, .011), 'metal', bevel=.006)
a.box((W - .04, .12, .004), (0, .04, .023), 'charcoal')              # keyboard
for i in range(5):
    a.box((W - .06, .003, .002), (0, -.012 + i * .024, .026), 'black')
a.box((.10, .06, .002), (0, -.08, .023), 'grey')                    # trackpad
tilt = 15
a.part('lid', pivot=(0, D / 2 - .006, .022))
hy, hz = D / 2 - .006, .022
L = .25
cy, cz = hy + math.sin(math.radians(tilt)) * L / 2, hz + math.cos(math.radians(tilt)) * L / 2
a.box((W, .012, L), (0, cy, cz), 'metal', rot=(-tilt, 0, 0), bevel=.005)
n = Vector((0, -math.cos(math.radians(tilt)), -math.sin(math.radians(tilt))))
c = Vector((0, cy, cz)) + n * .0065
a.box((W - .016, .002, L - .016), c, 'black', rot=(-tilt, 0, 0))
c2 = Vector((0, cy, cz + .006)) + n * .0080
a.label('laptop', (W - .04, L - .045), c2, rot=(90 - tilt, 0, 0))
a.finish()

# Ring light on tripod with phone.
a = Asset('prop_tripod_phone_01')
tripod(a, .95, .38)
a.cyl(.014, .62, (0, 0, 1.26), 'metal', 6)
a.cyl(.022, .06, (0, 0, 1.0), 'black', 6)
a.torus(.19, .028, (0, 0, 1.78), 'black', major=16, minor=4, rot=(90, 0, 0))
a.torus(.19, .02, (0, -.012, 1.78), 'lamp', major=16, minor=4, rot=(90, 0, 0))
rod(a, (0, 0, 1.57), (0, 0, 1.70), .01, 'metal')
a.box((.09, .02, .03), (0, -.01, 1.70), 'charcoal')
a.box((.09, .014, .18), (0, -.02, 1.78), 'black', bevel=.006)
a.label('phone', (.076, .15), (0, -.028, 1.78))
a.box((.10, .025, .025), (0, -.015, 1.86), 'charcoal')
a.finish()

# Calculator lying on a table.
a = Asset('prop_calculator_01')
a.box((.12, .18, .025), (0, 0, .0125), 'charcoal', bevel=.008)
a.box((.10, .045, .004), (0, .055, .026), 'black')
a.box((.09, .035, .004), (0, .055, .028), 'mint')
for row in range(5):
    for col in range(4):
        m = 'orange' if col == 3 else ('red' if (row, col) == (0, 0) else 'white')
        a.box((.019, .016, .008), (-.036 + col * .024, .015 - row * .021, .028), m)
a.finish()

# Megaphone: red body, white horn, handle down.
a = Asset('prop_megaphone_01')
a.cyl(.06, .14, (0, .17, .22), 'red', 10, rot=(90, 0, 0))
a.cyl(.062, .025, (0, .25, .22), 'charcoal', 10, rot=(90, 0, 0))
a.cyl(.055, .26, (0, -.03, .22), 'white', 10, rot=(90, 0, 0), r2=.17)
a.torus(.17, .018, (0, -.16, .22), 'red', major=10, minor=4, rot=(90, 0, 0))
a.cyl(.15, .01, (0, -.12, .22), 'charcoal', 10, rot=(90, 0, 0))
a.cyl(.03, .02, (0, -.125, .22), 'black', 6, rot=(90, 0, 0))
a.box((.04, .05, .17), (0, .15, .085), 'black', rot=(-12, 0, 0), bevel=.01)
a.box((.012, .018, .04), (0, .115, .13), 'red')
a.box((.03, .17, .02), (0, .12, .30), 'black', bevel=.006)
a.finish()

# Microphone stand.
a = Asset('prop_microphone_stand_01')
a.cyl(.15, .025, (0, 0, .0125), 'black', 12, bevel=.006)
a.cyl(.022, .1, (0, 0, .07), 'metal_dark', 8)
a.cyl(.011, 1.32, (0, 0, .7), 'metal', 6)
a.cyl(.02, .05, (0, 0, .95), 'black', 8)
a.cyl(.018, .04, (0, 0, 1.36), 'black', 8)
rod(a, (0, 0, 1.36), (0, -.12, 1.42), .008, 'metal')
rod(a, (0, -.12, 1.42), (0, -.24, 1.49), .02, 'charcoal', 8)
a.sphere(.035, (0, -.26, 1.505), 'grey', seg=8, rings=5)
a.finish()

# PA speaker.
a = Asset('prop_speaker_01')
a.box((.46, .38, .72), (0, 0, .38), 'black', bevel=.025)
for x in (-.18, .18):
    for y in (-.13, .13):
        a.cyl(.03, .02, (x, y, .01), 'charcoal', 6)
a.box((.42, .01, .66), (0, -.19, .38), 'charcoal')
a.cyl(.17, .02, (0, -.198, .27), 'metal_dark', 12, rot=(90, 0, 0))
a.cyl(.14, .02, (0, -.205, .27), 'black', 12, rot=(90, 0, 0), r2=.06)
a.cyl(.045, .02, (0, -.212, .27), 'grey', 8, rot=(90, 0, 0))
a.cyl(.075, .02, (0, -.198, .58), 'metal_dark', 10, rot=(90, 0, 0))
a.cyl(.05, .02, (0, -.205, .58), 'black', 10, rot=(90, 0, 0), r2=.02)
a.box((.14, .04, .025), (0, 0, .75), 'charcoal', bevel=.008)
a.cyl(.012, .01, (.17, -.2, .70), 'led_red', 6, rot=(90, 0, 0))
a.finish()

# TV camera on tripod.
a = Asset('prop_tv_camera_01')
tripod(a, 1.12, .45)
a.cyl(.06, .08, (0, 0, 1.19), 'charcoal', 8)
rod(a, (.05, .1, 1.2), (.12, .55, 1.08), .012, 'black')   # pan bar
a.box((.18, .42, .22), (0, .02, 1.35), 'charcoal', bevel=.02)
a.box((.185, .30, .03), (0, .05, 1.28), 'grey')
a.cyl(.07, .2, (0, -.27, 1.34), 'black', 10, rot=(90, 0, 0), r2=.085)
a.cyl(.07, .01, (0, -.375, 1.34), 'glass', 10, rot=(90, 0, 0))
a.torus(.085, .012, (0, -.37, 1.34), 'metal_dark', major=10, minor=4, rot=(90, 0, 0))
a.box((.10, .08, .07), (-.13, -.10, 1.42), 'black', bevel=.01)  # viewfinder
a.box((.06, .01, .05), (-.13, -.142, 1.42), 'screen_dark')
a.box((.03, .3, .03), (0, .0, 1.5), 'black')                      # handle
a.box((.03, .03, .05), (0, -.13, 1.47), 'black')
a.box((.03, .03, .05), (0, .13, 1.47), 'black')
a.cyl(.016, .16, (.06, -.16, 1.52), 'grey', 6, rot=(90, 0, 0))   # top mic
a.cyl(.012, .01, (.07, -.17, 1.43), 'led_red', 6)
a.box((.13, .06, .14), (0, .25, 1.33), 'metal_dark', bevel=.01)   # battery
a.finish()

# PAR stage light on tripod.
TL = 100
a = Asset('prop_stage_light_01')
tripod(a, 1.0, .42)
a.cyl(.016, .5, (0, 0, 1.25), 'metal', 6)
a.box((.36, .03, .03), (0, 0, 1.5), 'black')
for s in (-1, 1):
    a.box((.03, .03, .22), (s * .18, 0, 1.6), 'black')
a.cyl(.13, .34, (0, -.02, 1.64), 'black', 10, rot=(TL, 0, 0), bevel=.01)
c = Vector((0, -.02, 1.64)) + Vector((0, -math.sin(math.radians(TL)), math.cos(math.radians(TL)))) * .175
a.cyl(.11, .01, c, 'lamp', 10, rot=(TL, 0, 0))
a.torus(.125, .015, c, 'charcoal', major=10, minor=4, rot=(TL, 0, 0))
cb = Vector((0, -.02, 1.64)) + Vector((0, math.sin(math.radians(TL)), -math.cos(math.radians(TL)))) * .2
a.cyl(.07, .06, cb, 'charcoal', 8, rot=(TL, 0, 0))
for s in (-1, 1):  # barn doors
    a.box((.02, .09, .2), (s * .15, c.y - .04, c.z - .01), 'black', rot=(-15, 0, s * -20))
a.finish()

# Big results screen on legs (~4 x 2.4 m).
a = Asset('prop_results_screen_01')
a.box((4.12, .16, 2.52), (0, 0, 2.06), 'charcoal', bevel=.03)
a.box((4.0, .02, 2.4), (0, -.08, 2.06), 'black')
a.label('results', (3.92, 2.32), (0, -.092, 2.06))
for s in (-1, 1):
    a.box((.12, .12, 1.0), (s * 1.5, .12, .5), 'metal_dark', bevel=.01)
    a.box((.16, 1.0, .08), (s * 1.5, .12, .04), 'metal_dark', bevel=.015)
    a.box((.18, .18, .03), (s * 1.5, .12, .82), 'black')
a.box((3.1, .08, .1), (0, .14, .55), 'metal_dark')
a.finish()

# Debate timer "02:00".
a = Asset('prop_debate_timer_01')
a.box((.62, .14, .28), (0, 0, .17), 'black', bevel=.025)
a.box((.54, .01, .2), (0, -.068, .17), 'screen_dark')
SEG = {'0': 'abcdef', '2': 'abged'}
def digit(a, ch, x, z, w=.07, h=.13, t=.016, y=-.076):
    hw, hh = w / 2, h / 2
    segs = {'a': ((w - t, t), (x, z + hh)), 'g': ((w - t, t), (x, z)), 'd': ((w - t, t), (x, z - hh)),
            'f': ((t, hh - t), (x - hw, z + hh / 2)), 'b': ((t, hh - t), (x + hw, z + hh / 2)),
            'e': ((t, hh - t), (x - hw, z - hh / 2)), 'c': ((t, hh - t), (x + hw, z - hh / 2))}
    for k in SEG[ch]:
        (sx, sz), (px, pz) = segs[k]
        a.box((sx, .006, sz), (px, y, pz), 'led_red')
for ch, x in zip('0200', (-.19, -.085, .085, .19)):
    digit(a, ch, x, .17)
for dz in (-.03, .03):
    a.box((.018, .006, .018), (0, -.076, .17 + dz), 'led_red')
for s in (-1, 1):
    a.box((.1, .16, .03), (s * .22, 0, .015), 'charcoal', bevel=.008)
a.cyl(.012, .01, (.27, -.07, .3), 'led_red', 6, rot=(90, 0, 0))
a.finish()

# ------------------------------------------------------------ ESCENARIO Y DEBATE
# Wooden podium: replaces the plaza GLB. Footprint 0.9 x 0.65, writing surface ~1.2 m (collision 0.9x1.2x0.65).
a = Asset('prop_podium_01')
a.box((.9, .65, .08), (0, 0, .04), 'wood_dark', bevel=.015)
a.box((.74, .5, .98), (0, .02, .57), 'wood', bevel=.02)
a.box((.6, .02, .78), (0, -.235, .55), 'wood_light', bevel=.008)        # front panel
a.box((.5, .02, .12), (0, -.24, .86), 'wood_dark', bevel=.006)          # plaque slot
for s in (-1, 1):
    a.box((.06, .54, .98), (s * .37, .02, .57), 'wood_dark', bevel=.012)  # side pilasters
a.prism([(-.31, 1.06), (.31, 1.06), (.31, 1.12), (-.31, 1.2)], .86, (0, 0, 0), 'wood_dark', rot=(0, 0, 90))
a.prism([(-.29, 1.192), (.27, 1.12), (.27, 1.13), (-.29, 1.2025)], .76, (0, 0, 0), 'wood_light', rot=(0, 0, 90))
a.box((.86, .03, .05), (0, -.31, 1.19), 'wood', bevel=.008)            # front lip
a.box((.3, .22, .008), (.08, .05, 1.142), 'paper', rot=(-7.5, 0, 0))
rod(a, (-.28, -.1, 1.17), (-.28, -.2, 1.3), .007, 'metal_dark')
rod(a, (-.28, -.2, 1.3), (-.28, -.27, 1.32), .016, 'black', 8)
a.finish()

# White rally podium with shield.
a = Asset('prop_podium_02')
a.box((.86, .6, .08), (0, 0, .04), 'grey_light', bevel=.015)
a.cyl(.40, 1.0, (0, 0, .58), 'white', 8, r2=.44, rot=(0, 0, 22.5))
a.box((.9, .62, .06), (0, 0, 1.09), 'white', bevel=.015)
a.box((.92, .64, .02), (0, 0, 1.06), 'gold')
a.box((.88, .02, .03), (0, -.31, 1.06), 'gold')
a.prism([(-.29, 1.12), (.29, 1.12), (.29, 1.16), (-.29, 1.22)], .82, (0, 0, 0), 'white', rot=(0, 0, 90))
sh = [(-.13, .78), (.13, .78), (.13, .55), (0, .44), (-.13, .55)]
a.prism([(x * 1.12, z) for x, z in sh], .02, (0, -.40, -.003), 'gold')
a.prism(sh, .02, (0, -.41, 0), 'blue')
a.prism([(-.13, .78), (0, .78), (0, .44), (-.13, .55)], .02, (0, -.413, 0), 'red')
a.cyl(.035, .02, (0, -.423, .63), 'gold', 8, rot=(90, 0, 0))
a.box((.18, .03, .05), (0, -.41, .82), 'gold')
for x in (-.06, 0, .06):
    a.cone(.02, .05, (x, -.41, .865), 'gold', 4)
rod(a, (.25, -.2, 1.2), (.25, -.3, 1.32), .007, 'metal_dark')
rod(a, (.25, -.3, 1.32), (.25, -.36, 1.33), .016, 'black', 8)
a.finish()

# Red debate lectern with name plate and mic.
a = Asset('prop_debate_lectern_01')
a.box((.72, .52, .06), (0, 0, .03), 'red_dark', bevel=.012)
a.cyl(.42, 1.0, (0, .02, .56), 'red', 4, r2=.5, rot=(0, 0, 45), bevel=.015)
a.prism([(-.34, 1.06), (.36, 1.06), (.36, 1.12), (-.34, 1.18)], .78, (0, .02, 0), 'red_dark', rot=(0, 0, 90))
a.box((.56, .03, .15), (0, -.355, 1.06), 'white', bevel=.006)
a.label('name', (.5, .11), (0, -.372, 1.06))
rod(a, (.2, -.2, 1.16), (.2, -.28, 1.3), .007, 'metal_dark')
rod(a, (.2, -.28, 1.3), (.2, -.34, 1.31), .016, 'black', 8)
a.finish()

# Moderator desk with navy tablecloth, water bottles and 3 mics.
a = Asset('prop_moderator_desk_01')
a.box((2.5, .85, .05), (0, 0, .745), 'navy', bevel=.02)
a.box((2.44, .8, .72), (0, 0, .36), 'navy', bevel=.01)
for i in range(7):  # cloth folds
    x = -1.05 + i * .35
    a.prism([(-.04, 0), (.04, 0), (0, .7)], .03, (x, -.41, 0), 'navy', rot=(0, 0, 0))
a.box((2.46, .01, .03), (0, -.43, .73), 'gold')
for i, x in enumerate((-.8, 0, .8)):
    a.cyl(.07, .015, (x, .05, .78), 'black', 8)
    rod(a, (x, .05, .78), (x, -.12, .95), .007, 'metal_dark')
    rod(a, (x, -.12, .95), (x, -.18, .97), .015, 'black', 8)
    a.box((.3, .22, .006), (x + .25, .1, .773), 'paper', rot=(0, 0, 8 - i * 6))
    bx = x - .32
    a.cyl(.035, .2, (bx, -.12, .87), 'glass', 8)
    a.cyl(.036, .06, (bx, -.12, .86), 'sky', 8)
    a.cyl(.018, .03, (bx, -.12, .985), 'blue', 6)
a.finish()


# Folding chairs.
def chair_open(a):
    for s in (-1, 1):
        x = s * .2
        rod(a, (x, -.2, 0), (x, .16, .88), .014, 'charcoal')        # front leg + back frame
        rod(a, (x * .92, .24, 0), (x * .92, -.14, .45), .013, 'charcoal')  # rear leg
        a.cyl(.018, .02, (x, -.2, .01), 'black', 6)
        a.cyl(.018, .02, (x * .92, .24, .01), 'black', 6)
    a.box((.42, .4, .035), (0, -.02, .46), 'black', bevel=.012)
    a.box((.4, .04, .17), (0, .13, .76), 'black', rot=(-22, 0, 0), bevel=.012)
    rod(a, (-.2, -.15, .12), (.2, -.15, .12), .009, 'charcoal')
    rod(a, (-.184, .2, .1), (.184, .2, .1), .009, 'charcoal')


def chair_folded(a, y=0., lean=0.):
    """Folded chair standing, leaning back by `lean` metres at the top."""
    k = lean / .9
    def p(x, yy, z): return (x, y + yy + z * k, z)
    for s in (-1, 1):
        x = s * .2
        rod(a, p(x, 0, 0), p(x, 0, .9), .014, 'charcoal')
        rod(a, p(x * .92, .03, 0), p(x * .92, .03, .78), .013, 'charcoal')
        a.cyl(.018, .02, p(x, 0, .01), 'black', 6)
    a.box((.42, .03, .4), p(0, .03, .52), 'black', rot=(-math.degrees(math.atan(k)), 0, 0), bevel=.01)
    a.box((.4, .03, .17), p(0, -.005, .78), 'black', rot=(-math.degrees(math.atan(k)), 0, 0), bevel=.01)
    rod(a, p(-.2, 0, .12), p(.2, 0, .12), .009, 'charcoal')


a = Asset('prop_folding_chair_01'); chair_open(a); a.finish()
a = Asset('prop_folding_chair_02'); chair_folded(a); a.finish()
a = Asset('prop_chair_stack_01')
for i in range(6):
    chair_folded(a, y=-.18 + i * .07, lean=.16)
a.finish()

# ------------------------------------------------------------ COMIDA Y DESORDEN
# Open pizza box.
a = Asset('prop_pizza_box_01')
S = .44
a.box((S, S, .012), (0, 0, .006), 'sand')
for s in (-1, 1):
    a.box((.012, S, .05), (s * (S / 2 - .006), 0, .025), 'ochre')
    a.box((S, .012, .05), (0, s * (S / 2 - .006), .025), 'ochre')
L = S
ang = 110
cy = S / 2 + math.sin(math.radians(ang - 90)) * L / 2
cz = .05 + math.cos(math.radians(ang - 90)) * L / 2
a.box((S, .012, L), (0, cy, cz), 'ochre', rot=(-(ang - 90), 0, 0))
a.box((S - .03, .002, L - .03), (0, cy - .007, cz), 'sand', rot=(-(ang - 90), 0, 0))
a.box((.2, .002, .08), (0, cy + .008, cz), 'red', rot=(-(ang - 90), 0, 0))
a.cyl(.19, .022, (0, 0, .023), 'ochre', 12)
a.cyl(.165, .006, (0, 0, .036), 'orange', 12)
a.cyl(.155, .005, (0, 0, .039), 'yellow', 12)
for _ in range(7):
    r, t = rng.uniform(.03, .12), rng.uniform(0, 6.28)
    a.cyl(.026, .006, (math.cos(t) * r, math.sin(t) * r, .043), 'red_dark', 6)
for _ in range(4):
    r, t = rng.uniform(.03, .13), rng.uniform(0, 6.28)
    a.box((.03, .018, .004), (math.cos(t) * r, math.sin(t) * r, .044), 'leaf', rot=(0, 0, rng.uniform(0, 180)))
for t in range(2):  # slice cuts
    a.box((.36, .006, .004), (0, 0, .045), 'ochre', rot=(0, 0, t * 90))
a.finish()

# Laundry pile.
a = Asset('prop_laundry_pile_01')
cols = ['blue', 'red', 'teal', 'mustard', 'pink', 'white', 'purple', 'sky', 'green', 'orange', 'navy', 'cream']
for i, col in enumerate(cols):
    k = i / len(cols)
    t, r = rng.uniform(0, 6.28), rng.uniform(.05, .3) * (1 - k)
    x, y = math.cos(t) * r, math.sin(t) * r * .75
    z = .04 + k * .2
    sc = 1 - k * .5
    if i % 2 == 0:
        a.ico(1, (x, y, z + .02), col, sub=1, scale=(.24 * sc, .18 * sc, .065), rot=(rng.uniform(-10, 10), rng.uniform(-10, 10), rng.uniform(0, 180)))
    else:
        a.box((.38 * sc, .26 * sc, .05), (x, y, z), col, rot=(rng.uniform(-12, 12), rng.uniform(-12, 12), rng.uniform(0, 180)), bevel=.018)
rod(a, (.15, -.1, .07), (.42, -.26, .025), .035, 'blue')        # jeans leg
rod(a, (-.2, .05, .08), (-.42, .12, .02), .03, 'red')            # sleeve
a.box((.12, .04, .03), (-.1, -.3, .015), 'white', rot=(0, 0, 25), bevel=.01)  # sock
a.box((.04, .06, .03), (-.04, -.34, .015), 'white', rot=(0, 0, 25), bevel=.01)
a.finish()

# Lunch tupper with food, lid leaning against it.
a = Asset('prop_lunch_tupper_01')
a.box((.25, .19, .08), (0, 0, .04), 'white', bevel=.015)
a.box((.21, .16, .01), (0, 0, .075), 'cream')                        # rice
a.box((.004, .2, .03), (.02, 0, .07), 'white')                       # divider
for i in range(4):
    a.ico(.028, (-.05 + (i % 3) * .03, -.04 + (i // 3) * .06, .085), 'leaf_dark', sub=1)
for i in range(4):
    a.box((.04, .022, .016), (.06 + (i % 2) * .045, -.04 + (i // 2) * .05, .088), 'wood', rot=(0, 0, 20 * i), bevel=.004)
a.box((.28, .2, .018), (.0, .175, .09), 'sky', rot=(68, 0, 0), bevel=.006)
a.finish()

# Bread basket with baguettes.
a = Asset('prop_bread_basket_01')
a.box((.44, .28, .02), (0, 0, .01), 'wood')
for sy in (-1, 1):
    a.box((.52, .025, .17), (0, sy * .155, .09), 'wood', rot=(sy * 12, 0, 0))
    a.box((.56, .035, .03), (0, sy * .172, .17), 'wood_dark', bevel=.008)
    a.box((.5, .03, .022), (0, sy * .158, .09), 'wood_light', rot=(sy * 12, 0, 0))
for sx in (-1, 1):
    a.box((.025, .32, .17), (sx * .245, 0, .09), 'wood', rot=(0, -sx * 12, 0))
    a.box((.035, .38, .03), (sx * .262, 0, .17), 'wood_dark', bevel=.008)
a.box((.44, .3, .02), (0, 0, .13), 'cream')                                # cloth
a.prism([(-.12, .17), (.12, .17), (0, .02)], .01, (.0, -.19, 0), 'cream', rot=(-12, 0, 0))  # cloth flap
for i, (x, y, z, ry, rz) in enumerate([(-.02, -.07, .2, -22, 8), (.02, .0, .22, -16, -6), (-.03, .07, .2, 24, 12), (.05, .04, .26, -30, 30)]):
    col = 'ochre' if i % 2 == 0 else 'orange'
    a.sphere(1, (x, y, z), col, seg=8, rings=6, scale=(.33, .068, .062), rot=(0, ry, rz))
a.finish()

export_all('tech_stage_food')
