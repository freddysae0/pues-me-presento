import { friends, proposals, speechParts } from '../data/campaign.js';
import { appoint, chooseProposal, finishSpeech } from '../state/campaign.js';
import { panel, escapeHTML as esc, icon, keycap, choiceList, timingTrack, resultStats, speakerColor } from './ui.js';
import { mountCallPortraits, preloadCallPortraits, dispose as disposePortraits } from './portraits.js';
import { feedMarkup, mountFeed } from './phoneFeed.js';
import { script, say } from '../data/script/index.js';

export function phone(game) {
  preloadCallPortraits([{ id: 'you' }, ...friends], { partyColor: game.state.party?.color }); // the call is next: warm the 3D webcams now
  game.setMode('modal');
  // Feed de «unratito» (src/ui/phoneFeed.js, textos en src/data/feed.js): scroll obligatorio hasta la noticia,
  // que es la que habilita #idea.
  game.ui.show(feedMarkup());
  mountFeed(game);
  game.ui.on('idea', () => { game.complete('phone'); game.ui.toast('Necesitas un equipo. El portátil está sobre el escritorio.', { icon: 'phone' }); });
}

export function call(game) {
  game.beginTransaction(); game.setMode('modal');
  let index = Object.keys(game.state.team).length;
  const T = script.call;
  const people = [{ id: 'you', name: 'Tú', role: say(T.you, game.state), color: '#d77952' }, ...friends];
  const draw = (reply = null) => {
    const friend = friends[index];
    const speakingId = friend?.id ?? 'nico', speaker = friend?.name || 'Nico';
    const ready = Object.keys(game.state.team).length;
    const tiles = people.map((f, i) => `<div class="call-person ${speakingId === f.id ? 'active' : ''}" data-person="${f.id}" style="--i:${i}"><div class="portrait" data-portrait="${f.id}" style="--shirt:${f.color}"><i class="torso"></i><i class="head"></i></div><span class="speaking-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="call-name">${f.name}<small>${esc(game.state.team[f.id]?.job || f.role)}</small></span></div>`).join('');
    const text = friend ? reply || friend.line : say(T.done, game.state);
    const actions = friend
      ? reply ? `<button class="primary" id="next-friend"><span>${esc(say(T.next, game.state))}</span>${icon('arrow')}</button>` : choiceList(friend.choices.map((c, i) => ({ id: `job-${i}`, title: c.label })))
      : `<button class="primary" id="finish-call"><span>${esc(say(T.finish, game.state))}</span>${icon('arrow')}</button>`;
    game.ui.show(`<section class="panel call-panel"><div class="call-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="eyebrow">${icon('phone')}EL GRUPO · VIDEOLLAMADA LOCAL</span><span class="call-status">4 conectados · ${ready} con cargo</span></div><div class="call-body"><h1>${esc(say(T.title, game.state))}</h1><div class="call-grid">${tiles}</div><div class="call-stage"><p class="call-sentence" style="--speaker:${speakerColor(speaker)}"><b>${speaker}</b>${esc(text)}</p>${actions}</div></div></section>`);
    mountCallPortraits(game.ui.overlay.querySelector('.call-grid'), [{ id: 'you' }, ...friends], { speaking: speakingId, partyColor: game.state.party?.color, active: () => game.mode !== 'pause' });
    game.audio.chatter(speaker, friend ? reply || friend.line : say(T.doneBabble || T.done, game.state));
    if (friend && !reply) friend.choices.forEach((c, i) => game.ui.on(`job-${i}`, () => { appoint(game.state, friend.id, i); game.refreshHUD(); draw(c.reply); }));
    game.ui.on('next-friend', () => { index++; draw(); });
    game.ui.on('finish-call', () => { disposePortraits(); game.complete('call'); });
  };
  ringing(game, people, draw);
}

/** "Llamando…" screen before the call: your webcam, the three friends ringing and joining one by one.
 *  Driven by its own rAF clock that stops while paused (CLAUDE.md rule 6). Space/Enter or the button skips it. */
function ringing(game, people, done) {
  const joinAt = [1.3, 2.1, 2.8], openAt = 3.5;
  const tiles = people.map((p, i) => `<div class="ring-person ${i === 0 ? 'me joined' : ''}" data-person="${p.id}" style="--i:${i}"><div class="ring-avatar"><div class="portrait" data-portrait="${p.id}" style="--shirt:${p.color}"><i class="torso"></i><i class="head"></i></div></div><b>${esc(p.name)}</b><small>${i === 0 ? 'En línea' : 'Sonando…'}</small></div>`).join('');
  game.ui.show(`<section class="panel call-panel ring-panel"><div class="call-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="eyebrow">${icon('phone')}EL GRUPO · VIDEOLLAMADA</span><span class="call-status" id="ring-status">Llamando…</span></div><div class="ring-body"><h1>Llamando a «El grupo»<span class="ring-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></h1><div class="ring-grid">${tiles}</div><button class="secondary" id="skip-ring">${keycap('Espacio')}<span>Entrar ya</span></button></div></section>`);
  mountCallPortraits(game.ui.overlay.querySelector('.ring-grid'), [{ id: 'you' }, ...friends], { speaking: null, partyColor: game.state.party?.color, active: () => game.mode !== 'pause' });
  let t = 0, last = performance.now(), joined = 0, nextRing = 0, finished = false, raf = 0;
  const finish = () => { if (finished) return; finished = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey, true); done(); };
  const onKey = e => { if ((e.code === 'Space' || e.code === 'Enter') && game.mode !== 'pause') { e.preventDefault(); e.stopPropagation(); finish(); } };
  window.addEventListener('keydown', onKey, true);
  game.ui.on('skip-ring', finish);
  const loop = now => {
    if (finished) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    raf = requestAnimationFrame(loop);
    if (game.mode === 'pause') return;
    if (!document.querySelector('.ring-panel')) { finish(); return; } // panel replaced (e.g. scene reload)
    t += dt;
    if (joined < friends.length && t >= nextRing) { game.audio.tone(659, 0.16, 0.05); setTimeout(() => game.audio.tone(831, 0.2, 0.05), 170); nextRing = t + 1.0; }
    while (joined < friends.length && t >= joinAt[joined]) {
      const el = game.ui.overlay.querySelector(`.ring-person[data-person="${friends[joined].id}"]`);
      el?.classList.add('joined'); if (el) el.querySelector('small').textContent = 'Conectado';
      game.audio.ui('click'); joined++;
      const status = document.querySelector('#ring-status'); if (status) status.textContent = `${joined + 1} conectados`;
    }
    if (t >= openAt) finish();
  };
  raf = requestAnimationFrame(loop);
}

export function registration(game) {
  game.setMode('modal'); let color = '#d5754f';
  const T = script.register, s = game.state, defName = esc(say(T.defaultName, s)), defSlogan = esc(say(T.defaultSlogan, s));
  game.ui.show(panel(say(T.eyebrow, s), say(T.title, s), `<span class="stamp" aria-hidden="true">${esc(say(T.stamp, s))}</span><p>${say(T.intro, s)}</p><form id="party-form"><label class="field">Nombre del partido<input id="party-name" maxlength="32" required value="${defName}" autocomplete="off"></label><label class="field">Lema<input id="party-slogan" maxlength="70" required value="${defSlogan}" autocomplete="off"></label><span class="field">Color de campaña</span><div class="swatches" role="group" aria-label="Color de campaña">${['#d5754f', '#42877c', '#7473a5'].map((c, i) => `<button type="button" class="swatch ${i === 0 ? 'selected' : ''}" data-color="${c}" style="background:${c}" aria-label="${['Terracota', 'Verde', 'Violeta'][i]}" aria-pressed="${i === 0}"></button>`).join('')}</div><div class="party-preview"><strong id="preview-name">${defName}</strong><span id="preview-slogan">${defSlogan}</span></div><div class="buttons"><button class="primary" type="submit">${icon('ballot')}<span>${esc(say(T.submit, s))}</span></button></div></form>`, '', { variant: 'form', icon: 'note' }));
  const name = document.querySelector('#party-name'), slogan = document.querySelector('#party-slogan');
  name.oninput = () => { document.querySelector('#preview-name').textContent = name.value; };
  slogan.oninput = () => { document.querySelector('#preview-slogan').textContent = slogan.value; };
  game.ui.overlay.querySelectorAll('[data-color]').forEach(b => b.onclick = () => {
    color = b.dataset.color; game.ui.overlay.querySelectorAll('[data-color]').forEach(s => { s.classList.toggle('selected', s === b); s.setAttribute('aria-pressed', String(s === b)); }); document.querySelector('.party-preview').style.background = color;
  });
  document.querySelector('#party-form').onsubmit = e => {
    e.preventDefault(); if (!name.value.trim() || !slogan.value.trim()) return;
    game.state.party = { name: name.value.trim(), slogan: slogan.value.trim(), color };
    game.complete('register'); game.ui.toast(say(T.toast, game.state), { icon: 'ballot', kind: 'good' });
  };
}

export function program(game) {
  game.setMode('modal');
  const items = proposals.map(p => ({ id: `proposal-${p.id}`, title: p.title, extra: `<span class="cost">${icon('star')} ${esc(p.cost)}</span><small>${esc(p.benefit)}</small><small><b>Compromiso:</b> ${esc(p.compromise)}</small>` }));
  const T = script.program, s = game.state;
  game.ui.show(panel(say(T.eyebrow, s), say(T.title, s), `<p>${say(T.intro, s)}</p>${game.state.memories.promisedBoth ? `<p class="note">${icon('note')}<span>${say(T.promisedBothNote, s)}</span></p>` : ''}${choiceList(items)}`, '', { variant: 'board', icon: 'note' }));
  proposals.forEach(p => game.ui.on(`proposal-${p.id}`, () => { chooseProposal(game.state, p.id); const toast = say(T.toast, game.state, { proposal: { id: p.id, title: p.title } }); game.complete('program'); game.ui.toast(toast, { icon: 'note', kind: 'good' }); }));
}

export function speech(game) {
  game.setMode('speech'); game.speechPicks = []; game.speechStep = 0; game.timing = null;
  game.player.body.position.set(0, 0.02, 8); game.player.cinematic = true; game.player.character.root.rotation.y = Math.PI;
  const T = script.speech;
  const draw = () => {
    const part = speechParts[game.speechStep];
    if (!part) { timing(); return; }
    game.ui.show(panel(part.title, say(T.headings[Math.min(game.speechStep, 2)], game.state), `<p>${part.prompt}</p>${choiceList(part.options.map((o, i) => ({ id: `speech-${i}`, title: o.text })))}`, '', { icon: 'mic' }), 'speech-overlay');
    part.options.forEach((o, i) => game.ui.on(`speech-${i}`, () => { game.speechPicks.push(o.id); game.speechStep++; draw(); }));
  };
  const timing = () => {
    game.timing = { elapsed: 0, position: 0, running: true };
    game.ui.show(panel(say(T.timing.eyebrow, game.state), say(T.timing.title, game.state), `<p>Pulsa ${keycap('Espacio')} o el botón cuando el micro entre en la zona verde. No hay penalización por esperar otra pasada.</p>${timingTrack()}<button class="primary" id="hit">${icon('mic')}<span>${esc(say(T.timing.button, game.state))}</span>${keycap('Espacio')}</button>`, '', { icon: 'mic' }), 'speech-overlay');
    game.ui.on('hit', () => {
      if (!game.timing?.running) return;
      game.timing.running = false;
      const accuracy = Math.max(0, 1 - Math.abs(game.timing.position - 0.5) * 2);
      finishSpeech(game.state, game.speechPicks, accuracy); game.reaction = game.state.speech.score >= 6 ? 'cheer' : game.state.speech.score >= 3 ? 'disappointed' : 'boo';
      game.audio.tone(game.state.speech.score >= 6 ? 440 : 180, 0.2);
      const r = game.state.speech, good = r.score >= 6;
      const R = T.result, s = game.state;
      game.ui.show(panel(say(R.eyebrow, s), say(good ? R.goodTitle : R.badTitle, s), `<p>${say(r.coherent ? R.coherent : R.incoherent, s)}</p>${resultStats({ support: r.support, credibility: r.credibility, reach: r.reach })}<p class="fine"><span class="score-badge">${icon('mic')} Timing ${Math.round(accuracy * 100)}%</span> ${say(R.fine, s)}</p><button class="primary" id="finish-speech"><span>${esc(say(R.button, s))}</span>${icon('arrow')}</button>`, '', { icon: good ? 'star' : 'chat' }), 'speech-overlay');
      if (good) game.ui.confetti(40);
      game.ui.on('finish-speech', () => { game.reaction = null; game.timing = null; game.complete('speech'); });
    });
  };
  draw();
}
