"""Suelo modular de la plaza: env_plaza_ground_01 (módulo 4 x 4 m, instanciado en rejilla de 4 m).

blender -b --python tools/blender/build_ground.py      (o: node tools/blender/build_all.mjs ground)

Regla anti z-fighting: ninguna cara visible comparte plano con otra que la solape.
- Capas a alturas distintas: llagas (base) z=-0.004, losas z=0, bordillo z=+0.006 (por debajo de
  decals de world.js: sombra suave y=0.013, prop_camera_mark_01 y=0.012).
- La base queda 6 mm por encima del box 'ground' de world.js (techo en y=-0.01), que antes
  coincidía exactamente con la base (-0.01) y asomaba blanco/gris por las juntas según el ángulo.
- Juntas de 2 cm como hendidura (base oscura visible entre losas biseladas), también entre módulos:
  el bordillo termina a 1 cm del borde, y la base cubre exactamente 4 x 4 m, sin solapes con el vecino.
"""
import sys, random
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from kit_common import *

reset_scene()
R = random.Random(7)

HALF, PITCH, JOINT = 2.0, .5, .02
BASE_TOP, TILE_TOP, CURB_TOP = -.004, 0.0, .006

a = Asset('env_plaza_ground_01')
# base/mortero: cubre el módulo entero, su cara superior es el fondo de las juntas
a.box((2 * HALF, 2 * HALF, .1), (0, 0, BASE_TOP - .05), 'stone_dark')
# losas 0.48 m, 6 x 6, biseladas para que la junta se lea como hendidura
cols = ['concrete', 'concrete', 'stone', 'sand', 'grey_light']
t = .03
for i in range(1, 7):
    for j in range(1, 7):
        a.box((PITCH - JOINT, PITCH - JOINT, t), (-HALF + (i + .5) * PITCH, -HALF + (j + .5) * PITCH, TILE_TOP - t / 2),
              R.choice(cols), bevel=.006)
# bordillo perimetral 0.48 m: tiras en X de lado a lado, tiras en Y entre ellas; juntas de 2 cm, sin solapes
ct, cw = .04, PITCH - JOINT
outer = HALF - JOINT / 2                    # 1.99: deja 1 cm hasta el borde del módulo
cy = outer - cw / 2                         # 1.75
inner = outer - cw - JOINT                  # 1.49: largo libre entre tiras en X
for s in (-1, 1):
    a.box((2 * outer, cw, ct), (0, s * cy, CURB_TOP - ct / 2), 'stone', bevel=.01)
    a.box((cw, 2 * inner, ct), (s * cy, 0, CURB_TOP - ct / 2), 'stone', bevel=.01)

export_all('ground', columns=1)
