// Ilustraciones animadas del feed de «unratito» (misión 'phone'). SVG inline, sin imágenes externas.
// Estilo del juego: low poly / flat shaded (facetas con luz desde arriba a la izquierda), colores saturados,
// personajes chibi cabezones con contorno de tinta como el resto de la UI. Las animaciones están en phone.css
// y se apoyan en las clases de cada grupo (.dancer, .arm-l, .rider…). Lienzo 360×640 (9:16).

import { t } from '../i18n/index.js';

const INK = '#2b2140';
const r1 = n => Math.round(n * 10) / 10;
const P = list => list.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');

/** Polígono regular (n lados) aplastado en vertical por sy. */
export const ngon = (cx, cy, r, n = 8, sy = 1, rot = Math.PI / n) => Array.from({ length: n }, (_, i) => {
  const a = rot + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * sy];
});

// Facetas: abanico de triángulos desde el centro, aclarados u oscurecidos según miran a la luz.
const LIGHT = [-0.55, -0.83];
function facets(points, strength = 1) {
  const cx = points.reduce((a, p) => a + p[0], 0) / points.length, cy = points.reduce((a, p) => a + p[1], 0) / points.length;
  return points.map((p, i) => {
    const q = points[(i + 1) % points.length], mx = (p[0] + q[0]) / 2 - cx, my = (p[1] + q[1]) / 2 - cy, len = Math.hypot(mx, my) || 1;
    const d = (mx * LIGHT[0] + my * LIGHT[1]) / len;
    const fill = d > 0 ? `rgba(255,255,255,${(d * 0.26 * strength).toFixed(2)})` : `rgba(43,33,64,${(-d * 0.24 * strength).toFixed(2)})`;
    return `<polygon points="${P([[cx, cy], p, q])}" fill="${fill}"/>`;
  }).join('');
}
/** Pieza low poly: relleno + facetas + contorno de tinta. */
export function gem(points, fill, { stroke = 4, shade = 1, cls = '' } = {}) {
  return `<g${cls ? ` class="${cls}"` : ''}><polygon points="${P(points)}" fill="${fill}"/>${shade ? facets(points, shade) : ''}${stroke ? `<polygon points="${P(points)}" fill="none" stroke="${INK}" stroke-width="${stroke}" stroke-linejoin="round"/>` : ''}</g>`;
}
const flat = (points, fill, extra = '') => `<polygon points="${P(points)}" fill="${fill}" ${extra}/>`;
const text = (x, y, s, { size = 20, fill = '#fff', stroke = INK, sw = 6, anchor = 'middle', cls = '', rotate = 0 } = {}) =>
  `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" paint-order="stroke fill" stroke-linejoin="round" text-anchor="${anchor}"${rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ''}>${s}</text>`;

// ---------------------------------------------------------------- chibi
// Origen entre los pies; ~300 unidades de alto, cabeza enorme centrada en y = -212.
const H = -212, R = 76;

function arm(side, { sleeve, skin, pose }) {
  const s = side, cls = `arm arm-${s < 0 ? 'l' : 'r'}`;
  if (pose === 'palms') {
    // Codo pegado al cuerpo y antebrazo hacia fuera con la palma hacia arriba (el gesto del «6 7»).
    return `<g class="${cls}">${gem([[s * 32, -142], [s * 52, -136], [s * 64, -98], [s * 46, -92]], sleeve)}${gem([[s * 50, -104], [s * 64, -98], [s * 94, -112], [s * 88, -126]], skin, { shade: .6 })}${gem(ngon(s * 100, -126, 16, 6, .5), skin, { shade: .6 })}</g>`;
  }
  if (pose === 'hold') return `<g class="${cls}">${gem([[s * 32, -142], [s * 50, -136], [s * 52, -104], [s * 36, -100]], sleeve)}</g>`;
  return `<g class="${cls}">${gem([[s * 32, -142], [s * 50, -136], [s * 58, -84], [s * 40, -82]], sleeve)}${gem(ngon(s * 49, -74, 12, 6), skin, { shade: .6 })}</g>`;
}

function hair(style, color) {
  if (style === 'pony') {
    return {
      back: `<g class="pony">${gem([[50, H - 62], [100, H - 86], [128, H - 44], [124, H + 12], [104, H + 46], [96, H - 2], [74, H - 40]], color)}${gem(ngon(64, H - 64, 13, 6), '#ff5fa2', { shade: .7 })}</g>`,
      front: gem([[-84, H + 12], [-82, H - 38], [-54, H - 74], [0, H - 86], [54, H - 74], [82, H - 38], [84, H + 12], [68, H - 14], [42, H - 30], [12, H - 20], [-18, H - 34], [-48, H - 22], [-70, H - 6]], color),
    };
  }
  if (style === 'bald') {
    return {
      back: '',
      front: `${gem([[-82, H + 8], [-92, H - 22], [-72, H - 34], [-62, H + 2]], '#f4f1ea', { shade: .5 })}${gem([[82, H + 8], [92, H - 22], [72, H - 34], [62, H + 2]], '#f4f1ea', { shade: .5 })}<path d="M-30 ${H - 52} Q-10 ${H - 66} 14 ${H - 60}" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>`,
    };
  }
  if (style === 'cap') {
    return {
      back: '',
      front: `${gem([[-80, H - 6], [-72, H - 50], [-42, H - 80], [0, H - 90], [42, H - 80], [72, H - 50], [80, H - 6], [56, H - 18], [0, H - 24], [-56, H - 18]], '#ff4f5e')}${gem([[-18, H - 22], [-14, H - 44], [14, H - 44], [18, H - 22]], color, { stroke: 3, shade: .4 })}${gem([[-80, H - 6], [-60, H - 16], [-56, H + 8], [-78, H + 14]], color, { stroke: 3 })}${gem([[80, H - 6], [60, H - 16], [56, H + 8], [78, H + 14]], color, { stroke: 3 })}`,
    };
  }
  // 'neat': raya al lado, de presentador.
  return { back: '', front: gem([[-82, H + 6], [-80, H - 40], [-50, H - 76], [6, H - 86], [58, H - 72], [84, H - 36], [84, H + 4], [70, H - 22], [20, H - 40], [-30, H - 30], [-66, H - 8]], color) };
}

function face(kind) {
  const cheeks = `<ellipse cx="-46" cy="${H + 24}" rx="11" ry="6" fill="#ff7d8a" opacity=".55"/><ellipse cx="46" cy="${H + 24}" rx="11" ry="6" fill="#ff7d8a" opacity=".55"/>`;
  const eyes = `<g class="eyes"><ellipse cx="-27" cy="${H + 4}" rx="8.5" ry="12" fill="${INK}"/><ellipse cx="27" cy="${H + 4}" rx="8.5" ry="12" fill="${INK}"/><circle cx="-30" cy="${H - 1}" r="3.4" fill="#fff"/><circle cx="24" cy="${H - 1}" r="3.4" fill="#fff"/></g>`;
  if (kind === 'serious') {
    // Gafas de sol, bigote y boca recta: la seriedad absoluta del abuelo.
    return `${gem([[-56, H - 8], [-6, H - 8], [-10, H + 18], [-50, H + 18]], '#1d1830', { stroke: 4, shade: 1.6 })}${gem([[6, H - 8], [56, H - 8], [50, H + 18], [10, H + 18]], '#1d1830', { stroke: 4, shade: 1.6 })}<path d="M-6 ${H - 2}H6" stroke="${INK}" stroke-width="5"/><path d="M-44 ${H - 2}l14 -6M18 ${H - 2}l14 -6" stroke="#fff" stroke-width="3" opacity=".6"/>
      <path d="M-50 ${H - 18}L-12 ${H - 14}M12 ${H - 14}L50 ${H - 18}" stroke="#f4f1ea" stroke-width="7" stroke-linecap="round"/>
      ${gem([[-32, H + 30], [-10, H + 22], [0, H + 26], [10, H + 22], [32, H + 30], [26, H + 38], [0, H + 33], [-26, H + 38]], '#f4f1ea', { stroke: 3, shade: .5 })}<path d="M-12 ${H + 47}H12" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
  if (kind === 'grin') {
    return `${cheeks}<path d="M-38 ${H + 8}L-27 ${H - 4}L-16 ${H + 8}M16 ${H + 8}L27 ${H - 4}L38 ${H + 8}" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-24 ${H + 24}H24Q20 ${H + 50} 0 ${H + 50}Q-20 ${H + 50} -24 ${H + 24}Z" fill="#c2414b" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-18 ${H + 26}H18V${H + 32}H-18Z" fill="#fff"/>`;
  }
  if (kind === 'talk') {
    return `${cheeks}${eyes}<ellipse class="mouth" cx="0" cy="${H + 34}" rx="11" ry="8" fill="#c2414b" stroke="${INK}" stroke-width="4"/>`;
  }
  return `${cheeks}${eyes}<path d="M-15 ${H + 28}Q0 ${H + 46} 15 ${H + 28}Z" fill="#c2414b" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
}

/** Personaje chibi. arms: 'down' | 'palms' | 'hold'. prop: SVG dibujado delante de los brazos (periódico…). */
export function chibi({ skin = '#ffcfa8', hairColor = '#5a3424', hairStyle = 'short', shirt = '#3ec7c2', sleeve = shirt, pants = '#3b4f9a', shoes = '#ffffff', faceKind = 'happy', arms = 'down', legs = true, prop = '', hood = '' } = {}) {
  const hr = hair(hairStyle, hairColor);
  const legSvg = legs ? `<g class="legs">${gem([[-28, -62], [-4, -62], [-6, -10], [-28, -10]], pants)}${gem([[4, -62], [28, -62], [28, -10], [6, -10]], pants)}${gem(ngon(-18, -8, 16, 6, .55), shoes, { shade: .6 })}${gem(ngon(18, -8, 16, 6, .55), shoes, { shade: .6 })}</g>` : '';
  const torso = gem([[-36, -146], [36, -146], [46, -54], [-46, -54]], shirt, { cls: 'torso' });
  const armSvg = arm(-1, { sleeve, skin, pose: arms }) + arm(1, { sleeve, skin, pose: arms });
  const ears = gem(ngon(-R + 4, H + 8, 15, 6), skin, { shade: .6 }) + gem(ngon(R - 4, H + 8, 15, 6), skin, { shade: .6 });
  const head = `<g class="head">${hood}${hr.back}${ears}${gem(ngon(0, H, R, 8, .94), skin)}${hr.front}${face(faceKind)}</g>`;
  return `${legSvg}<g class="upper">${torso}${armSvg}${prop}</g>${head}`;
}

// ---------------------------------------------------------------- escenas
const svg = (id, body, label) => `<svg class="feed-art art-${id}" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}" focusable="false">${body}</svg>`;
const clouds = (list) => list.map(([x, y, s], i) => `<g class="cloud" style="--d:${i}"><g transform="translate(${x} ${y}) scale(${s})">${gem([[-40, 0], [-30, -18], [-8, -26], [14, -22], [34, -10], [42, 4], [20, 10], [-20, 10]], '#ffffff', { stroke: 0, shade: .8 })}</g></g>`).join('');
const note = (x, y, i, color = '#fff') => `<g class="note" style="--d:${i}"><g transform="translate(${x} ${y})"><path d="M0 0V-26L16 -30V-6" stroke="${INK}" stroke-width="9" fill="none" stroke-linejoin="round"/><path d="M0 0V-26L16 -30V-6" stroke="${color}" stroke-width="4" fill="none" stroke-linejoin="round"/><circle cx="-4" cy="0" r="7" fill="${color}" stroke="${INK}" stroke-width="3"/><circle cx="12" cy="-6" r="7" fill="${color}" stroke="${INK}" stroke-width="3"/></g></g>`;
const sticker = (s, y = 92, rot = -3) => `<g class="sticker" transform="rotate(${rot} 180 ${y})"><rect x="${180 - s.length * 4.6 - 14}" y="${y - 22}" width="${s.length * 9.2 + 28}" height="36" rx="12" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="180" y="${y + 3}" font-size="16" fill="${INK}" text-anchor="middle">${s}</text></g>`;

function dance(item) {
  const bg = `<rect width="360" height="640" fill="#ff8fb8"/>${flat([[0, 0], [190, 0], [0, 260]], '#ff9fc3')}${flat([[360, 40], [360, 420], [210, 300]], '#f77fac')}
    <g transform="translate(26 150)">${gem([[0, 0], [86, 0], [86, 104], [0, 104]], '#9be3ff', { shade: .5 })}${gem(ngon(30, 34, 15, 8), '#ffd84a', { stroke: 3 })}<path d="M43 0V104M0 52H86" stroke="${INK}" stroke-width="4"/></g>
    ${gem([[0, 470], [360, 456], [360, 640], [0, 640]], '#ffcf5c', { stroke: 0 })}<path d="M0 520L360 506M0 580L360 566M60 470L20 640M150 466L130 640M240 462L250 640M320 458L350 640" stroke="#e8a93a" stroke-width="3"/>
    <g transform="translate(312 330)">${gem([[-4, 0], [4, 0], [10, 150], [2, 150]], '#d79b5b', { stroke: 3, shade: .4 })}${gem([[-22, 150], [26, 150], [32, 186], [-26, 186]], '#7dd3f5', { stroke: 3 })}</g>`;
  const ring = `<g class="ring"><circle cx="180" cy="290" r="118" fill="none" stroke="#fff6c8" stroke-width="26" opacity=".35"/><circle cx="180" cy="290" r="118" fill="none" stroke="${INK}" stroke-width="18"/><circle cx="180" cy="290" r="118" fill="none" stroke="#fffbe6" stroke-width="11"/><path d="M180 408V640" stroke="${INK}" stroke-width="9"/><path d="M180 408V640" stroke="#c9c2d9" stroke-width="4"/></g>`;
  const girl = chibi({ skin: '#ffd2b4', hairColor: '#7b3f2a', hairStyle: 'pony', shirt: '#2fd0c0', sleeve: '#ffd2b4', pants: '#5d5ad6', shoes: '#fff4f8' });
  const notes = note(56, 330, 0) + note(300, 250, 1, '#ffe76b') + note(286, 420, 2, '#a6f5ff');
  return svg('dance', `${bg}${ring}${notes}<g transform="translate(180 506)"><g class="dancer">${girl}</g></g><g class="sparkle"><path d="M80 236l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="#fff" stroke="${INK}" stroke-width="3"/></g>${sticker(item.sticker, 82)}`, item.alt);
}

function grandpa(item) {
  const sky = `<rect width="360" height="640" fill="#73cdf7"/>${flat([[0, 0], [360, 0], [360, 120], [0, 200]], '#5ec0f2')}${gem(ngon(300, 74, 34, 8), '#ffd84a', { stroke: 4 })}${clouds([[90, 70, 1], [250, 150, .7], [40, 230, .6]])}`;
  const back = `${gem([[0, 330], [80, 300], [170, 336], [170, 450], [0, 450]], '#5cc46e', { stroke: 0 })}${gem([[150, 340], [250, 310], [360, 340], [360, 450], [150, 450]], '#4fb563', { stroke: 0 })}
    <g transform="translate(16 172)"><rect x="0" y="0" width="134" height="92" rx="8" fill="#fff7e6" stroke="${INK}" stroke-width="4"/><path d="M28 92V170M106 92V170" stroke="${INK}" stroke-width="6"/>${text(67, 22, t('feedArt.pool'), { size: 11.5, fill: '#2a74c9', sw: 0 })}${text(67, 42, t('feedArt.forbidden'), { size: 12, fill: '#e2453b', sw: 0 })}<text x="12" y="60" font-size="10.5" fill="${INK}">${t('feedArt.rule1')}</text><text x="12" y="74" font-size="10.5" fill="${INK}">${t('feedArt.rule2')}</text><text x="12" y="88" font-size="10.5" fill="${INK}">${t('feedArt.rule3')}</text></g>`;
  const slide = `<path d="M300 210V470M200 300V470M120 390V470" stroke="${INK}" stroke-width="12"/><path d="M300 210V470M200 300V470M120 390V470" stroke="#c9c2d9" stroke-width="6"/>
    <path d="M400 140L300 205L200 300L120 390L66 440" stroke="${INK}" stroke-width="52" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M400 140L300 205L200 300L120 390L66 440" stroke="#ffb627" stroke-width="42" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M400 132L300 197L200 292L120 382L66 432" stroke="#ffe08a" stroke-width="10" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const pool = `${gem([[0, 452], [360, 444], [360, 640], [0, 640]], '#fff7e6', { stroke: 0, shade: .3 })}${gem([[-10, 470], [370, 462], [370, 650], [-10, 650]], '#35c9d8', { stroke: 4 })}<g class="waves">${flat([[20, 500], [70, 490], [120, 500]], '#8ef0f3')}${flat([[170, 530], [230, 518], [290, 530]], '#8ef0f3')}${flat([[40, 580], [110, 568], [180, 580]], '#8ef0f3')}</g>`;
  const paper = `<g class="paper">${gem([[-58, -148], [58, -148], [62, -82], [-62, -82]], '#f7f3e8', { stroke: 4, shade: .3 })}<path d="M0 -148V-82" stroke="${INK}" stroke-width="3"/>${text(-30, -132, t('feedArt.newspaper'), { size: 10, fill: INK, sw: 0 })}<path d="M-50 -120H-10M-50 -110H-12M-50 -100H-16M10 -128H50M10 -118H48M10 -108H50M10 -98H44" stroke="#9a91ad" stroke-width="3.5"/>${gem(ngon(-60, -114, 12, 6), '#f2c29b', { stroke: 3, shade: .6 })}${gem(ngon(60, -114, 12, 6), '#f2c29b', { stroke: 3, shade: .6 })}</g>`;
  const float = gem(ngon(0, -48, 80, 12, .42), '#ff5f7e', { stroke: 4 }) + `<ellipse cx="0" cy="-54" rx="44" ry="15" fill="#d94468" stroke="${INK}" stroke-width="3"/>`;
  const feet = `${gem([[-62, -40], [-34, -46], [-30, -26], [-60, -20]], '#ffffff', { stroke: 3, shade: .5 })}${gem([[62, -40], [34, -46], [30, -26], [60, -20]], '#ffffff', { stroke: 3, shade: .5 })}<path d="M-62 -26L-30 -32M62 -26L30 -32" stroke="#8a5530" stroke-width="7"/>`;
  const man = chibi({ skin: '#f2c29b', hairStyle: 'bald', shirt: '#ffffff', sleeve: '#f2c29b', faceKind: 'serious', arms: 'hold', legs: false, prop: paper });
  const rider = `<g class="rider"><g transform="scale(.58)"><g class="rider-body">${float}${man}${feet}</g></g></g>`;
  const splash = `<g class="splash"><g transform="translate(78 468)">${[[-40, -30], [-18, -52], [8, -60], [32, -44], [46, -20]].map(([x, y]) => gem(ngon(x, y, 10, 6), '#bff7ff', { stroke: 3, shade: .5 })).join('')}${gem([[-56, 6], [-30, -14], [0, -4], [30, -16], [58, 6]], '#ffffff', { stroke: 3, shade: .4 })}</g></g>`;
  return svg('grandpa', `${sky}${back}${slide}${pool}${splash}${rider}${sticker(item.sticker, 136, 3)}`, item.alt);
}

function sixseven(item) {
  const room = `<rect width="360" height="640" fill="#ffd27a"/>${flat([[0, 0], [360, 0], [360, 90], [0, 160]], '#ffdd94')}${flat([[0, 300], [140, 250], [0, 470]], '#f5c460')}
    <g transform="translate(36 60)">${gem([[-10, -10], [298, -10], [298, 176], [-10, 176]], '#b9773e', { shade: .5 })}${gem([[0, 0], [288, 0], [288, 166], [0, 166]], '#2f6b4f', { stroke: 3, shade: .6 })}${text(144, 82, t('feedArt.page'), { size: 50, fill: '#f4f7ee', sw: 0 })}<text x="144" y="122" font-size="15" fill="#d4e6d6" text-anchor="middle">${t('feedArt.homework')}</text><path d="M30 140q20 -8 40 0t40 0" stroke="#d4e6d6" stroke-width="3" fill="none"/></g>`;
  const hood = gem([[-74, H + 40], [-92, H - 10], [-70, H + 74], [70, H + 74], [92, H - 10], [74, H + 40]], '#7b55e8', { stroke: 4 });
  const kid = chibi({ skin: '#ffd0a6', hairColor: '#2e2235', hairStyle: 'cap', shirt: '#8f6bff', sleeve: '#8f6bff', pants: '#2f3f6e', faceKind: 'grin', arms: 'palms', hood }) + `<path d="M-12 -140V-112M12 -140V-112" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
  const desk = `${gem([[-10, 486], [370, 476], [370, 520], [-10, 530]], '#c98a4b', { shade: .6 })}${gem([[-10, 528], [370, 518], [370, 650], [-10, 650]], '#a8693a', { stroke: 0, shade: .5 })}${gem([[40, 470], [104, 466], [108, 484], [44, 490]], '#ffffff', { stroke: 3, shade: .3 })}<path d="M60 474l30 -2" stroke="#ff6b4f" stroke-width="3"/>`;
  const nums = `<g class="six">${text(72, 304, '6', { size: 92, fill: '#ffe76b', sw: 12, rotate: -10 })}</g><g class="seven">${text(268, 304, '7', { size: 92, fill: '#7df0c8', sw: 12, rotate: 10 })}</g>`;
  return svg('sixseven', `${room}<g transform="translate(180 548)"><g class="kid">${kid}</g></g>${desk}${nums}`, item.alt);
}

function news(item) {
  const bg = `<rect width="360" height="640" fill="#3346b8"/>${flat([[0, 0], [360, 0], [360, 180], [0, 260]], '#3d52c9')}${flat([[0, 260], [360, 180], [360, 470], [0, 480]], '#2c3da6')}<g class="beams" opacity=".18">${flat([[60, 0], [100, 0], [180, 470], [120, 470]], '#fff')}${flat([[260, 0], [300, 0], [240, 470], [180, 470]], '#fff')}</g>`;
  const cols = [0, 1, 2, 3, 4, 5].map(i => gem([[-92 + i * 34, -84], [-76 + i * 34, -84], [-76 + i * 34, 0], [-92 + i * 34, 0]], '#fff1d0', { stroke: 3, shade: .6 })).join('');
  const building = `<g transform="translate(160 420)">${gem([[-118, 0], [118, 0], [126, 22], [-126, 22]], '#f2dcae', { stroke: 4 })}${cols}${gem([[-110, -84], [110, -84], [110, -98], [-110, -98]], '#f2dcae', { stroke: 4, shade: .5 })}${gem([[-116, -98], [0, -142], [116, -98]], '#fff1d0', { stroke: 4 })}${gem(ngon(0, -112, 12, 8), '#ffc83d', { stroke: 3 })}</g>`;
  const ballot = `<g transform="translate(298 452)"><g class="envelope">${gem([[-20, -110], [20, -110], [20, -82], [-20, -82]], '#fffdf7', { stroke: 3, shade: .3 })}<path d="M-20 -110L0 -94L20 -110" stroke="${INK}" stroke-width="3" fill="none"/></g>${gem([[-40, -60], [40, -60], [44, 18], [-44, 18]], '#bfe9ff', { stroke: 4, shade: .8 })}${gem([[-46, -66], [46, -66], [46, -58], [-46, -58]], '#58b8f0', { stroke: 4, shade: .4 })}<path d="M-18 -62H18" stroke="${INK}" stroke-width="5"/>${gem([[-26, -36], [26, -36], [26, -6], [-26, -6]], '#ff6b4f', { stroke: 3, shade: .4 })}${text(0, -15, t('feedArt.ballot'), { size: 12, sw: 0 })}</g>`;
  const floor = gem([[-10, 470], [370, 470], [370, 650], [-10, 650]], '#20307e', { stroke: 0, shade: .5 });
  return svg('news', `${bg}${building}${floor}${ballot}`, item.alt);
}

const SCENES = { dance, grandpa, sixseven, news };
/** SVG de la ilustración de un vídeo del feed (item de src/data/feed.js). */
export const feedArt = item => (SCENES[item.art] || dance)(item);
