// Regenerates every kit GLB in public/assets/ by running each Blender category script in sequence.
// Usage: node tools/blender/build_all.mjs [category ...]   (BLENDER env var overrides the executable)
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BLENDER = process.env.BLENDER ?? 'C:/Program Files/Blender Foundation/Blender 5.0/blender.exe';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ALL = ['ground', 'structure','interior', 'tech_stage_food', 'campaign', 'urban', 'characters', 'char_anims'];
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

for (const cat of wanted) {
  if (!ALL.includes(cat)) { console.error(`Unknown category ${cat}; expected one of ${ALL.join(', ')}`); process.exit(1); }
  console.log(`== ${cat}`);
  const r = spawnSync(BLENDER, ['--background', '--python', path.join(DIR, `build_${cat}.py`)], { encoding: 'utf8' });
  const report = (r.stdout ?? '').split('\n').filter(l => /KIT REPORT|ANIMS REPORT|clips:|tris,|^preview|Error|Traceback/.test(l));
  console.log(report.join('\n'));
  if (r.status !== 0) { console.error(r.stderr); process.exit(r.status ?? 1); }
}
