// Monta el tráiler a partir de los fotogramas y timeline.json que deja record.mjs (ffmpeg de `ffmpeg-static`, devDependency).
//   node tools/trailer/assemble.mjs [--out out/trailer] [--review art/review/trailer-sample] [--only 16x9|1x1]
// Salidas: trailer-16x9.mp4 (1920×1080) y trailer-1x1.mp4 (1080×1080, recorte por plano con `crop1x1`), poster.png.
// Ambos: H.264 High, yuv420p BT.709, fps del tráiler, ~12 Mbps, AAC 48 kHz estéreo, +faststart (compatible con LinkedIn).
// Audio: música (segmentos de public/assets/music) + sfx.wav (sonidos del juego renderizados offline) mezclados aquí.
import { spawn } from 'node:child_process';
import { readFile, copyFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

export function ffmpeg(args, { quiet = true } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, ['-hide_banner', ...(quiet ? ['-loglevel', 'error'] : []), ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = ''; p.stderr.on('data', d => { err += d; }); p.stdout.on('data', () => {});
    p.on('close', code => (code === 0 || !quiet ? resolve(err) : reject(new Error(`ffmpeg ${code}: ${err.slice(-2000)}`))));
  });
}

/** Resumen de un fichero con `ffmpeg -i` (ffmpeg-static no trae ffprobe). */
export async function inspect(file) {
  const info = await ffmpeg(['-i', file], { quiet: false });
  const video = info.match(/Stream #\S+.*Video: (.*)/)?.[1] ?? null, audio = info.match(/Stream #\S+.*Audio: (.*)/)?.[1] ?? null;
  return { file, duration: info.match(/Duration: ([\d:.]+)/)?.[1] ?? null, bitrate: info.match(/bitrate: (\d+ kb\/s)/)?.[1] ?? null, video, audio };
}

function audioGraph(tl, firstInput) {
  const parts = [], labels = [], master = tl.audio?.music ?? 1;
  tl.music.forEach((m, k) => {
    const i = firstInput + k, dur = Math.max(0.1, Math.min(m.dur, tl.duration - m.at)), f = [];
    if (m.trim) f.push('silenceremove=start_periods=1:start_threshold=-55dB');
    f.push(`atrim=start=${m.from}:duration=${dur}`, 'asetpts=PTS-STARTPTS', 'aformat=sample_rates=48000:channel_layouts=stereo');
    if (m.fadeIn > 0) f.push(`afade=t=in:st=0:d=${m.fadeIn}`);
    if (m.fadeOut > 0) f.push(`afade=t=out:st=${Math.max(0, dur - m.fadeOut)}:d=${m.fadeOut}`);
    f.push(`volume=${(m.gain * master).toFixed(3)}`);
    if (m.at > 0) { const ms = Math.round(m.at * 1000); f.push(`adelay=${ms}|${ms}`); }
    parts.push(`[${i}:a]${f.join(',')}[m${k}]`); labels.push(`[m${k}]`);
  });
  const sfx = firstInput + tl.music.length;
  parts.push(`[${sfx}:a]aformat=sample_rates=48000:channel_layouts=stereo[sfx]`); labels.push('[sfx]');
  parts.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest,apad=whole_dur=${tl.duration},atrim=0:${tl.duration},alimiter=limit=0.9:level=disabled[aout]`);
  return parts.join(';');
}

// x del recorte 1:1 por fotograma: crop1x1 = centro horizontal (0–1) o [desde, hasta] para panear dentro del plano.
function cropExpression(tl) {
  const W = tl.width, S = tl.height, max = W - S, px = c => Math.max(0, Math.min(max, Math.round(c * W - S / 2)));
  let expr = String(px(0.5));
  for (const s of [...tl.shots].reverse()) {
    const c = s.crop1x1, end = s.firstFrame + s.frames;
    const x = Array.isArray(c) ? `max(0,min(${max},${c[0] * W - S / 2}+(${(c[1] - c[0]) * W})*(n-${s.firstFrame})/${s.frames}))` : String(px(c));
    expr = `if(lt(n,${end}),${x},${expr})`;
  }
  return expr;
}

async function encode({ frames, tl, out, music, sfx, size, crop }) {
  const vf = [crop ? `crop=${tl.height}:${tl.height}:'${crop}':0` : null, 'scale=out_color_matrix=bt709:out_range=tv', 'format=yuv420p'].filter(Boolean).join(',');
  const args = ['-y', '-framerate', String(tl.fps), '-i', `${frames}/%05d.png`];
  for (const m of music) args.push('-stream_loop', '-1', '-i', m.file);
  args.push('-i', sfx, '-filter_complex', `[0:v]${vf}[vout];${audioGraph(tl, 1)}`, '-map', '[vout]', '-map', '[aout]',
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-b:v', size === '1x1' ? '9M' : '12M', '-maxrate', size === '1x1' ? '11M' : '14M', '-bufsize', '24M',
    '-g', String(tl.fps * 2), '-r', String(tl.fps), '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', '-t', String(tl.duration), out);
  await ffmpeg(args);
}

export async function assemble({ out = 'out/trailer', frames = `${out}/frames`, squareFrames = null, review = null, only = null } = {}) {
  const tl = JSON.parse(await readFile(`${out}/timeline.json`, 'utf8')), sfx = `${out}/sfx.wav`;
  for (const m of tl.music) await access(m.file);
  const files = {};
  if (only !== '1x1') { files['16x9'] = `${out}/trailer-16x9.mp4`; await encode({ frames, tl, out: files['16x9'], music: tl.music, sfx, size: '16x9' }); }
  if (only !== '16x9') { files['1x1'] = `${out}/trailer-1x1.mp4`; await encode({ frames: squareFrames || frames, tl, out: files['1x1'], music: tl.music, sfx, size: '1x1', crop: cropExpression(tl) }); }
  const posterFrame = Math.min(tl.frames - 1, Math.round(tl.poster * tl.fps));
  await copyFile(`${frames}/${String(posterFrame).padStart(5, '0')}.png`, `${out}/poster.png`);
  // Fotogramas de revisión sacados de los MP4 ya codificados (lo que verá LinkedIn), uno por plano a mitad + 1:1.
  if (review) {
    await mkdir(dirname(review), { recursive: true });
    for (const [size, file] of Object.entries(files)) for (const s of tl.shots) {
      const t = (s.start + s.dur * (s.reviewAt ?? 0.6)).toFixed(3);
      await ffmpeg(['-y', '-ss', t, '-i', file, '-frames:v', '1', `${review}-${size}-${s.id}.png`]);
    }
  }
  for (const file of Object.values(files)) { const i = await inspect(file); console.log(`${file}\n  duración ${i.duration} · ${i.bitrate}\n  vídeo: ${i.video}\n  audio: ${i.audio}`); }
  console.log(`${out}/poster.png (fotograma ${posterFrame})`);
  return files;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = process.argv.slice(2), opt = n => { const i = a.indexOf(`--${n}`); return i >= 0 ? a[i + 1] : undefined; };
  const out = opt('out') || 'out/trailer';
  let squareFrames = null; try { await access(`${out}/frames-1x1`); squareFrames = `${out}/frames-1x1`; } catch {}
  await assemble({ out, squareFrames, review: opt('review'), only: opt('only') });
}
