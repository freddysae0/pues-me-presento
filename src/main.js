import { Engine } from '@babylonjs/core';
import { World } from './world/world.js';
import { Player } from './player/controller.js';
import { UI, panel, escapeHTML as esc, icon, keycap, buttons, resultStats, focusEntry } from './ui/ui.js';
import { Dialogue } from './dialogue/dialogue.js';
import { GameAudio } from './audio/audio.js';
import { trackFor } from './audio/music.js';
import { LocalPersistence } from './save/persistence.js';
import { newCampaign, missionFor, advance, applyEffect, markSeen, objectiveFor, crossExit } from './state/campaign.js';
import { Director } from './cinema/director.js';
import { cinematics, cinematicFor } from './data/cinematics.js';
import { dialogues, aftermathLines, sideTalk, hasSideTalk } from './data/dialogues.js';
import { phone, call, registration, program, speech } from './ui/experiences.js';
import { headquarters, video, crisis, debate, finalPrep, finalSpeech, results } from './ui/campaignFlow.js';
import { script } from './data/script/index.js';
import { Smartphone } from './ui/smartphone.js';
import { t, tOptional, lang, LANGUAGES, saveLanguage, applyDocumentLanguage } from './i18n/index.js';
import './ui/style.css';

// Modes in which the world simulates (and that a blur/visibility change pauses).
const LIVE = ['play', 'dialogue', 'modal', 'speech', 'cinematic', 'minigame'];

class Game {
  constructor() {
    this.canvas = document.querySelector('#world'); this.ui = new UI(); this.storage = new LocalPersistence(); this.settings = this.storage.settings(); this.audio = new GameAudio(this.settings);
    this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true }); this.engine.setHardwareScalingLevel(Math.max(1, devicePixelRatio));
    this.world = new World(this.engine); this.state = newCampaign(); this.mode = 'loading'; this.dialogue = new Dialogue(this); this.director = new Director(this); this.minigame = null; this.playerGesture = null; this.last = performance.now();
    this.phone = new Smartphone(this); // player's phone (M): mode 'phone' stops the simulation like a menu
    window.addEventListener('resize', () => this.engine.resize());
    window.addEventListener('keydown', e => this.key(e));
    window.addEventListener('blur', () => { if (LIVE.includes(this.mode)) this.pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && LIVE.includes(this.mode)) this.pause(); });
    this.ui.overlay.addEventListener('pointerdown', () => { if (this.mode !== 'notice') this.audio.unlock(); }); // the notice button is the first unlock
    this.interfaceSounds();
  }
  // Hover/click/back feedback for every button in overlay and dialogue, wherever it was created.
  interfaceSounds() {
    const backIds = ['back-settings', 'back-credits', 'cancel-new', 'resume', 'save-menu', 'main-menu', 'menu-win', 'menu-loss'];
    const control = e => e.target.closest?.('button:not(:disabled), select, input[type=checkbox], input[type=range]');
    document.addEventListener('pointerover', e => { const c = control(e); if (c && c !== this.hovered) this.audio.ui('hover'); this.hovered = c; });
    document.addEventListener('click', e => { const c = control(e); if (c && c.tagName === 'BUTTON') this.audio.ui(backIds.includes(c.id) ? 'back' : 'click'); }, true);
    document.addEventListener('change', e => { if (control(e)) this.audio.ui('click'); }, true);
  }
  async init() {
    this.notice(); await this.loadWorld('flat'); this.worldReady = true;
    if (import.meta.env.DEV) { const { installDebug } = await import('./dev/debug.js'); installDebug(this); }
    this.engine.runRenderLoop(() => this.frame());
    if (this.noticeAccepted) this.menu(); // accepted while the flat was still loading
  }
  // Start-up notice, once per app launch (never when returning to the menu). Its button is the first user
  // gesture: nothing creates or plays audio before it; its click unlocks Web Audio and starts the menu theme.
  notice() {
    this.setMode('notice');
    this.ui.show(panel(t('notice.eyebrow'), t('notice.title'), `<div class="notice-badge" aria-hidden="true">${icon('ballot')}</div><p>${t('notice.body')}</p><p class="notice-wish">${t('notice.wish')}</p><p class="notice-sign">${t('notice.sign')}</p>` + buttons([{ id: 'notice-enter', kind: 'primary', icon: 'play', label: t('notice.button') }]) + `<p class="fine notice-hint">${t('notice.hint', { enter: keycap('Enter'), space: keycap(t('keys.space')) })}</p>`, '', { variant: 'notice', icon: 'chat' }), 'notice-screen');
    this.ui.on('notice-enter', () => {
      if (this.noticeAccepted) return; this.noticeAccepted = true;
      this.audio.start('confirm'); // creates/resumes the AudioContexts inside the gesture, then a confirmation chime
      if (this.worldReady) this.menu(); else { this.setMode('loading'); this.ui.transition(t('loading.opening')); }
    });
  }
  async loadWorld(scene) { this.player?.dispose(); await this.world.load(scene); this.world.setIdentity(this.state.party); this.player = new Player(this.world, this.canvas, this.settings); }
  setMode(mode) { this.mode = mode; document.body.dataset.mode = mode; this.player?.setEnabled(mode === 'play' || (mode === 'minigame' && !!this.minigame?.movement())); this.ui.prompt.hidden = true; this.ui.toastElement.classList.remove('visible'); if (this.player && mode === 'play') this.player.cinematic = false; if (mode !== 'dialogue') this.audio.stop();
    if (mode === 'pause') this.audio.pause(); else if (mode !== 'settings') this.audio.resume();
    if (!['pause', 'settings', 'loading', 'notice'].includes(mode)) { this.audio.music.play(trackFor(this.state, mode)); this.audio.music.duck(mode === 'dialogue'); }
  }
  menu() {
    this.dialogue.stop(); this.director.stop(); this.minigame?.abort(); this.setMode('menu'); this.ui.hud.hidden = true; this.transaction = null; this.reaction = null; this.timing = null;
    const save = this.storage.load();
    const letters = [...t('menu.logoLine2')].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('');
    this.ui.show(`<section class="menu-content"><span class="menu-ribbon">${icon('ballot')}${esc(script.menu.ribbon)}</span><h1 class="logo" aria-label="${esc(t('menu.logoLabel'))}"><span class="l1">${t('menu.logoLine1')}</span><span class="l2">${letters}</span></h1><p class="intro">${esc(script.menu.tagline)}</p><div class="menu-actions"><button class="primary" id="new" style="--i:0">${icon('play')}<span>${t('menu.newGame')}</span></button><button class="secondary" id="continue" style="--i:1" ${save.state ? '' : 'disabled'}>${icon('book')}<span>${t('menu.continue')}</span></button><button class="secondary" id="settings" style="--i:2">${icon('sliders')}<span>${t('menu.settings')}</span></button><button class="secondary" id="credits" style="--i:3">${icon('star')}<span>${t('menu.credits')}</span></button></div>${save.error ? `<p class="note">${icon('close')}<span>${esc(save.error)}</span></p>` : ''}<p class="fine">${t('menu.fine')}</p>${this.languagePicker('menu-lang', 'menu-lang')}</section><a class="menu-stamp" href="https://github.com/freddysae0" target="_blank" rel="noopener noreferrer" title="github.com/freddysae0"><span>${icon('chair')}${t('menu.stamp')}<br><u>FREDDY</u></span></a><div class="menu-bottom"><span>${keycap('W')}${keycap('A')}${keycap('S')}${keycap('D')} ${t('menu.move')}</span><span>${icon('sparkle')} ${t('menu.look')}</span><span>${keycap('E')} ${t('menu.interact')}</span></div>`, 'menu');
    this.ui.on('new', () => {
      if (save.state) {
        this.ui.show(panel(t('newGame.eyebrow'), t('newGame.title'), `<p>${t('newGame.body')}</p>` + buttons([{ id: 'confirm-new', kind: 'danger', icon: 'retry', label: t('newGame.confirm') }, { id: 'cancel-new', icon: 'back', label: t('newGame.cancel') }]), '', { icon: 'retry' }));
        this.ui.on('confirm-new', () => this.start(newCampaign())); this.ui.on('cancel-new', () => this.menu());
      } else this.start(newCampaign());
    });
    this.ui.on('continue', () => this.start(save.state)); this.ui.on('settings', () => this.showSettings(() => this.menu())); this.ui.on('credits', () => this.credits());
    const picker = this.ui.overlay.querySelector('#menu-lang'); if (picker) picker.onchange = () => this.switchLanguage(picker.value);
  }
  /** Selector de idioma (nombres nativos). Cambiar de idioma guarda el ajuste y recarga: los módulos de datos y el guion
   *  se resuelven al cargar, y la recarga vuelve al último punto seguro sin perder progreso (CLAUDE.md, regla 5). */
  languagePicker(id, className = '') {
    return `<label class="lang-picker ${className}"><span class="lang-picker-label">${icon('chat')}<span>${t('language.label')}</span></span><select id="${id}" aria-label="${esc(t('language.menuLabel'))}">${LANGUAGES.map(l => `<option value="${l.id}" lang="${l.id}"${l.id === lang ? ' selected' : ''}>${esc(l.name)}</option>`).join('')}</select></label>`;
  }
  switchLanguage(id) {
    if (!id || id === lang || !saveLanguage(id)) return false;
    this.setMode('loading'); this.ui.transition('…'); location.reload(); return true;
  }
  async start(state) {
    this.state = structuredClone(state); this.dialogue.stop(); this.director.stop(); this.minigame?.abort(); this.transaction = null; this.reaction = null; this.timing = null; this.setMode('loading'); this.audio.unlock();
    this.ui.transition(t('loading.start'));
    await this.loadWorld(state.scene); this.safeSave(); this.resumePlay();
  }
  resumePlay() {
    this.ui.hide();
    const cinematic = cinematicFor(this.state); if (cinematic) { this.playCinematic(cinematic); return; }
    this.setMode('play'); this.refreshHUD();
  }
  // Cinematics play once per campaign. They are marked as seen and saved before they start, at a safe point:
  // a reload in the middle resumes after the cinematic, with the same progress. Skipping runs `after` too.
  playCinematic(id, after = () => this.resumePlay()) {
    const def = cinematics[id];
    if (!def || this.state.seen?.[id]) { after(); return; }
    markSeen(this.state, id); this.safeSave(); this.refreshHUD();
    this.director.play(id, def, after);
  }
  refreshHUD() { const o = objectiveFor(this.state); this.ui.updateHUD(this.state, o); this.world.markObjective(o.target, o.exit ? o : null); this.phone.sync(); }
  safeSave() { const ok = this.storage.save(this.state); if (!ok) this.ui.toast(t('toast.saveFailed')); return ok; }
  beginTransaction() { this.transaction = structuredClone(this.state); }
  remember(choice) { this.state.memories[choice.memory] = true; applyEffect(this.state, choice.effect); this.refreshHUD(); }
  async complete(id) {
    const oldScene = this.state.scene;
    if (!advance(this.state, id)) return;
    this.transaction = null; this.safeSave();
    // Only a travel mission (the flat's door) changes scene here; otherwise the next step may be a walk to an exit.
    if (this.state.scene !== oldScene) { this.setMode('loading'); this.ui.transition(t('loading.street')); await this.loadWorld(this.state.scene); }
    this.resumePlay();
    const o = objectiveFor(this.state); if (o.exit && this.mode === 'play') this.ui.toast(o.objective, { icon: 'pin' });
  }
  /** Walk through the pending exit: saved on the far side first (safe point), then the usual loading card. */
  async crossExit() {
    const o = objectiveFor(this.state); if (!o.exit || !crossExit(this.state)) return;
    this.transaction = null; this.safeSave(); this.audio.ui('click');
    this.setMode('loading'); this.ui.transition(o.loading); await this.loadWorld(this.state.scene);
    this.resumePlay(); // the arrival cinematic (cinematicFor) plays here, once
  }
  interact() {
    if (this.mode !== 'play') return;
    this.audio.unlock(); const mission = missionFor(this.state), goal = objectiveFor(this.state); const e = this.player.nearest(goal.target); if (!e) return;
    const side = e.id !== goal.target ? sideTalk(e.id, this.state) : null;
    if (side?.toast) { this.ui.toast(side.toast); return; }
    if (side?.lines) { this.beginTransaction(); this.dialogue.start(side.lines, e, () => { this.transaction = null; this.safeSave(); this.resumePlay(); }); return; }
    if (e.id !== goal.target) { this.ui.toast(this.state.mission === 'complete' ? t('toast.campaignOver') : goal.objective); return; }
    if (goal.exit) { this.crossExit(); return; }
    if (mission.id === 'phone') phone(this);
    if (mission.id === 'call') call(this);
    if (mission.id === 'register') registration(this);
    if (mission.id === 'leave') this.complete('leave');
    if (mission.id === 'neighbor') { this.beginTransaction(); this.dialogue.start(dialogues.neighbor, e, () => this.complete('neighbor')); }
    if (mission.id === 'program') program(this);
    if (mission.id === 'speech') speech(this);
    if (mission.id === 'aftermath') this.dialogue.start(aftermathLines(this.state), e, () => this.complete('aftermath'));
    if (mission.id === 'hqBrief') headquarters(this);
    if (mission.id === 'video') video(this);
    if (mission.id === 'crisis') crisis(this);
    if (mission.id === 'debate') debate(this);
    if (mission.id === 'finalPrep') finalPrep(this);
    if (mission.id === 'finalSpeech') finalSpeech(this);
    if (mission.id === 'election') results(this);
  }
  showCompletion() {
    this.setMode('modal');
    this.ui.show(panel(t('completion.eyebrow'), t('completion.title'), `<p>${t('completion.body', { party: esc(this.state.party.name) })}</p>${resultStats({ support: this.state.support, credibility: this.state.credibility, reach: this.state.reach }, { signed: false })}<p class="fine">${t('completion.fine')}</p>` + buttons([{ id: 'explore', kind: 'primary', icon: 'play', label: t('completion.explore') }, { id: 'main-menu', icon: 'home', label: t('completion.menu') }]), '', { icon: 'star' }));
    this.ui.on('explore', () => this.resumePlay()); this.ui.on('main-menu', () => this.menu());
  }
  pause() {
    if (['pause', 'settings', 'loading', 'menu', 'notice'].includes(this.mode)) return;
    this.beforePause = this.mode;
    this.savedOverlay = this.ui.stash(); // DOM nodes survive the pause: inputs, focus targets and callbacks stay intact
    this.dialogue.el.hidden = true; this.setMode('pause'); this.pauseScreen();
  }
  pauseScreen() {
    this.mode = 'pause'; document.body.dataset.mode = 'pause';
    const m = objectiveFor(this.state);
    this.ui.show(panel(t('pause.eyebrow'), t('pause.title'), `<div class="pause-icon">${icon('pause')}</div><div class="journal"><small>${t('pause.objective')}</small><b>${esc(m.title)}</b><span>${esc(m.objective)}</span></div><div class="stack"><button class="primary" id="resume">${icon('play')}<span>${t('pause.resume')}</span></button><button class="secondary" id="pause-settings">${icon('sliders')}<span>${t('pause.settings')}</span></button><button class="secondary" id="save-menu">${icon('home')}<span>${t('pause.menu')}</span></button></div><p class="fine" style="margin-top:20px">${t('pause.fine')}</p>`, '', { variant: 'pause', icon: 'pause' }));
    this.ui.on('resume', () => this.unpause()); this.ui.on('pause-settings', () => this.showSettings(() => this.pauseScreen()));
    this.ui.on('save-menu', () => {
      this.minigame?.abort(); this.director.stop();
      if (this.transaction) this.state = this.transaction;
      // A speech is committed only when the result panel is accepted.
      if (this.state.mission === 'speech' && this.state.speech) { const saved = this.storage.load().state; if (saved) this.state = saved; }
      this.discardPaused(); this.menu();
    });
  }
  unpause() {
    this.ui.restore(this.savedOverlay); this.savedOverlay = null;
    this.setMode(this.beforePause); this.dialogue.el.hidden = !this.dialogue.active;
    focusEntry(this.dialogue.active ? this.dialogue.el : this.ui.overlay);
  }
  // Leaving to the menu from pause: release whatever the stashed overlay had mounted (3D portraits…).
  discardPaused() { const s = this.savedOverlay; this.savedOverlay = null; s?.disposers.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }
  showSettings(back) {
    this.setMode('settings');
    const row = (ico, label, control) => `<label class="setting-row"><span>${icon(ico)}${label}</span>${control}</label>`;
    const languages = `<select id="lang">${LANGUAGES.map(l => `<option value="${l.id}" lang="${l.id}"${l.id === lang ? ' selected' : ''}>${esc(l.name)}</option>`).join('')}</select>`;
    this.ui.show(panel(t('settings.eyebrow'), t('settings.title'), row('flag', t('language.label'), languages) + row('chat', t('settings.textSpeed'), `<select id="text-speed"><option value="20">${t('settings.speedSlow')}</option><option value="38">${t('settings.speedNormal')}</option><option value="65">${t('settings.speedFast')}</option></select>`) + row('mic', t('settings.babble'), '<input type="checkbox" id="babble">') + row('volume', t('settings.volume'), '<input type="range" id="volume" min="0" max="1" step="0.05">') + row('sparkle', t('settings.music'), '<input type="range" id="music" min="0" max="1" step="0.05">') + row('sliders', t('settings.sensitivity'), '<input type="range" id="sensitivity" min="0.3" max="2" step="0.1">') + `<div class="help-keys"><span>${keycap(t('keys.space'))} ${t('settings.keyAdvance')}</span><span>${keycap('1')}–${keycap('9')} ${t('settings.keyAnswer')}</span><span>${keycap('Tab')}${keycap('Enter')} ${t('settings.keyNavigate')}</span><span>${keycap('Esc')} ${t('settings.keyPause')}</span></div><p class="fine">${t('settings.mouseHint')} ${t('language.reloadNote')}</p>` + buttons([{ id: 'back-settings', kind: 'primary', icon: 'check', label: t('settings.save') }]), '', { variant: 'settings', icon: 'sliders' }));
    const speed = document.querySelector('#text-speed'), babble = document.querySelector('#babble'), volume = document.querySelector('#volume'), musicVolume = document.querySelector('#music'), sensitivity = document.querySelector('#sensitivity'), language = document.querySelector('#lang');
    speed.value = this.settings.speed; babble.checked = this.settings.babble; volume.value = this.settings.volume; volume.oninput = () => { this.settings.volume = Number(volume.value); }; musicVolume.value = this.settings.music; musicVolume.oninput = () => { this.settings.music = Number(musicVolume.value); this.audio.music.updateVolume(); }; sensitivity.value = this.settings.sensitivity;
    this.ui.on('back-settings', () => { Object.assign(this.settings, { speed: Number(speed.value), babble: babble.checked, volume: Number(volume.value), music: Number(musicVolume.value), sensitivity: Number(sensitivity.value) }); this.storage.settings(this.settings); this.audio.music.updateVolume(); if (this.switchLanguage(language.value)) return; back(); });
  }
  credits() {
    const translator = tOptional('credits.translationValue');
    const roll = [[t('credits.madeBy'), 'Freddy · <a href="https://github.com/freddysae0" target="_blank" rel="noopener noreferrer">github.com/freddysae0</a>'], [t('credits.design'), 'Opus 5.5'], [t('credits.characters'), t('credits.charactersValue')], [t('credits.rig'), t('credits.rigValue', { link: '<a href="https://github.com/Babylon-Projects/Babylon_101" target="_blank" rel="noopener noreferrer">Babylon-Projects/Babylon_101</a>' })], [t('credits.gestures'), t('credits.gesturesValue')], [t('credits.engine'), 'Babylon.js'], [t('credits.tools'), 'Vite · Blender'], [t('credits.props'), t('credits.propsValue')], [t('credits.sound'), t('credits.soundValue')], [t('credits.music'), t('credits.musicValue')], [t('credits.fonts'), t('credits.fontsValue')], ...(translator ? [[t('credits.translation'), esc(translator)]] : [])];
    this.ui.show(panel(t('credits.eyebrow'), t('credits.title'), `<dl class="credits-roll">${roll.map(([k, v], i) => `<div style="--i:${i}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p class="fine">${t('credits.planned')}</p><p class="fine">${t('credits.fiction')}</p><p class="fine">${t('credits.offline')}</p>` + buttons([{ id: 'back-credits', kind: 'primary', icon: 'home', label: t('credits.back') }]), '', { variant: 'credits', icon: 'star' }));
    this.ui.on('back-credits', () => this.menu());
  }
  key(e) {
    if (e.repeat || this.mode === 'notice') return; // Enter/Espacio on the notice reach its focused button natively
    this.audio.unlock();
    if (this.phone.key(e)) return; // M opens the phone in play; while it is out, it owns the keyboard (M/Esc close it)
    if (e.code === 'Escape') { e.preventDefault(); if (this.mode === 'pause') { this.audio.ui('back'); this.unpause(); } else if (!['settings', 'loading', 'menu'].includes(this.mode)) { this.audio.ui('click'); this.pause(); } return; }
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (this.mode === 'play' && e.code === 'KeyE') { e.preventDefault(); this.interact(); return; }
    if (this.mode === 'cinematic') { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); this.director.skip(); } return; }
    if (this.mode === 'minigame') { this.minigame?.key(e); return; }
    if (this.mode === 'dialogue') {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); const selected = document.activeElement?.dataset.choice;
        if (e.code === 'Enter' && selected !== undefined) this.dialogue.choose(Number(selected)); else this.dialogue.next();
      }
      if (/^Digit[1-9]$/.test(e.code)) { e.preventDefault(); this.dialogue.choose(Number(e.code.at(-1)) - 1); }
    } else if (this.mode === 'speech' && e.code === 'Space' && this.timing?.running) { e.preventDefault(); document.querySelector('#hit')?.click(); }
    else if (['modal', 'speech'].includes(this.mode) && /^Digit[1-9]$/.test(e.code)) {
      const index = Number(e.code.at(-1)) - 1;
      this.ui.overlay.querySelectorAll('.choice-list button')[index]?.click();
    }
  }
  frame() {
    const now = performance.now(), dt = Math.min(0.05, (now - this.last) / 1000); this.last = now; this.audio.music.tick();
    if (this.mode === 'loading' || !this.world.scene || this.world.scene.isDisposed || !this.world.scene.activeCamera || !this.player) return;
    const active = LIVE.includes(this.mode);
    this.world.scene.animationTimeScale = active || this.mode === 'menu' ? 1 : 0; // skeletal clips freeze while paused
    if (active) {
      this.state.activeSeconds += dt;
      if (this.mode === 'cinematic') this.director.update(dt);
      else if (this.mode === 'minigame') this.minigame?.update(dt);
      this.player.update(dt, this.mode === 'speech' ? 'talk' : this.playerGesture); this.world.update(dt, this.reaction);
      if (this.player.character.stepped) this.audio.footstep(this.state.scene, this.player.character.state === 'run');
      if (this.mode === 'dialogue') { this.dialogue.update(dt); this.dialogue.entity?.character?.update(dt, 'talk'); }
      if (this.mode === 'play') { const goal = objectiveFor(this.state); const e = this.player.nearest(goal.target); this.ui.interaction(e, e?.id === goal.target || hasSideTalk(e?.id)); }
      if (this.mode === 'speech' && this.timing?.running) { this.timing.elapsed += dt; this.timing.position = (Math.sin(this.timing.elapsed * 2.4 - Math.PI / 2) + 1) / 2; const cursor = document.querySelector('.timing-cursor'); if (cursor) cursor.style.left = `${this.timing.position * 99}%`; }
    } else if (this.mode === 'menu') { this.player.yaw = -0.5; this.player.pitch = 0.42; this.player.update(dt); }
    this.world.scene.render();
  }
}

applyDocumentLanguage();
const game = new Game();
game.init().catch(error => { console.error(error); game.ui.show(panel(t('error.eyebrow'), t('error.title'), `<p>${t('error.body')}</p>`, '', { icon: 'close' }), 'loss'); });
