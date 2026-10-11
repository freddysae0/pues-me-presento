import { MeshBuilder, Vector3, UniversalCamera, Ray } from '@babylonjs/core';
import { createCharacter } from '../npc/character.js';
const JUMP_SPEED = 5.2, GRAVITY = 16; // ~0.85 m hop, ~0.65 s in the air
export class Player {
  constructor(world, canvas, settings) {
    this.world = world; this.canvas = canvas; this.settings = settings; this.keys = new Set(); this.yaw = world.cameraYaw; this.pitch = 0.36; this.enabled = false; this.vy = 0; this.grounded = true; this.jumpQueued = false;
    const s = world.scene;
    this.body = MeshBuilder.CreateBox('player-collider', { size: 0.1 }, s); this.body.isVisible = false; this.body.isPickable = false; this.body.position.copyFrom(world.spawn); this.body.ellipsoid.set(0.32, 0.87, 0.32); this.body.ellipsoidOffset.set(0, 0.9, 0);
    this.character = createCharacter(s, 'Tú', '#d77952'); this.shadow = world.shadow(0, 0, 0.42);
    this.camera = new UniversalCamera('follow-camera', new Vector3(0, 4, -8), s); this.camera.minZ = 0.08; this.camera.fov = 0.88; s.activeCamera = this.camera;
    this.abort = new AbortController(); const options = { signal: this.abort.signal };
    window.addEventListener('keydown', e => { if (this.enabled && e.code === 'Space' && !e.repeat && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(document.activeElement?.tagName)) { this.jumpQueued = true; e.preventDefault(); } }, options);
    window.addEventListener('keydown', e => { if (this.enabled && ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'ShiftRight'].includes(e.code)) { this.keys.add(e.code); e.preventDefault(); } }, options);
    window.addEventListener('keyup', e => this.keys.delete(e.code), options);
    window.addEventListener('blur', () => this.keys.clear(), options);
    canvas.addEventListener('pointerdown', e => { if (this.enabled) { this.dragging = true; if (e.button === 0) canvas.requestPointerLock?.()?.catch?.(() => {}); } }, options);
    window.addEventListener('pointerup', () => { this.dragging = false; }, options);
    window.addEventListener('mousemove', e => { if (!this.enabled || !(document.pointerLockElement === canvas || this.dragging)) return; this.yaw += e.movementX * 0.003 * settings.sensitivity; this.pitch = Math.max(0.08, Math.min(1.05, this.pitch + e.movementY * 0.002 * settings.sensitivity)); }, options);
    this.update(0.016);
  }
  setEnabled(value) {
    const was = this.enabled; this.enabled = value; this.keys.clear(); this.jumpQueued = false;
    if (!value) { this.dragging = false; document.exitPointerLock?.(); return; }
    // Back to play straight from a menu click/key: capture the mouse with that same gesture so no extra click is needed.
    if (!was && navigator.userActivation?.isActive && document.pointerLockElement !== this.canvas) this.canvas.requestPointerLock?.()?.catch?.(() => {});
  }
  update(dt, gesture = null) {
    let x = 0, z = 0, moving = false, running = false;
    if (this.enabled) {
      x = Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA')); z = Number(this.keys.has('KeyW')) - Number(this.keys.has('KeyS'));
      moving = x !== 0 || z !== 0; running = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
      const v = new Vector3(x * Math.cos(this.yaw) + z * Math.sin(this.yaw), 0, z * Math.cos(this.yaw) - x * Math.sin(this.yaw));
      if (moving) { v.normalize().scaleInPlace((running ? 5 : 3) * dt); this.character.root.rotation.y = Math.atan2(v.x, v.z); }
      // Jump (Space) with simple gravity. Grounded keeps the old gentle push down so slopes and steps still snap.
      if (this.jumpQueued && this.grounded) { this.vy = JUMP_SPEED; this.grounded = false; }
      this.jumpQueued = false;
      this.vy = this.grounded ? 0 : Math.max(-14, this.vy - GRAVITY * dt);
      v.y = this.grounded ? -1.5 * dt : this.vy * dt;
      const before = this.body.position.y; this.body.moveWithCollisions(v); const moved = this.body.position.y - before;
      if (v.y < 0) { this.grounded = moved > v.y * 0.5; if (this.grounded) this.vy = 0; } // blocked below: standing on something
      else if (moved < v.y * 0.5) this.vy = 0; // bumped a ceiling
    }
    this.character.root.position.copyFrom(this.body.position); this.character.update(dt, gesture || (moving ? running ? 'run' : 'walk' : 'idle'));
    this.shadow.position.x = this.body.position.x; this.shadow.position.z = this.body.position.z;
    if (this.cinematic) { this.camera.position.set(5.5, 4.2, 6.8); this.camera.setTarget(new Vector3(0, 1.1, 6.5)); return; }
    const target = this.body.position.add(new Vector3(0, 1.45, 0));
    const direction = new Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
    let distance = 5.3;
    // Five swept parallel rays protect the near plane, not only the camera centre.
    const right = new Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    for (const offset of [Vector3.Zero(), right.scale(0.2), right.scale(-0.2), new Vector3(0, 0.2, 0), new Vector3(0, -0.2, 0)]) {
      const hit = this.world.scene.pickWithRay(new Ray(target.add(offset), direction, 5.3), m => m.metadata?.cameraBlock === true);
      if (hit?.hit) distance = Math.min(distance, Math.max(0.2, hit.distance - 0.28));
    }
    this.camera.position.copyFrom(target.add(direction.scale(distance))); this.camera.setTarget(target);
    this.cameraDistance = distance;
  }
  nearest(preferredId = null) {
    let nearest = null, distance = 3.5;
    const preferred = preferredId && this.world.entities.find(e => e.id === preferredId);
    if (preferred && Vector3.Distance(this.body.position, preferred.anchor.position) < distance) return preferred;
    const entities = preferredId ? [...this.world.entities].sort((a,b)=>Number(b.id===preferredId)-Number(a.id===preferredId)) : this.world.entities;
    for (const e of entities) {
      if (e === preferred) continue;
      if (e.exit && !e.active) continue; // exits only answer when they are the current objective
      if (e.id.toLowerCase().includes('crowd')) continue;
      const d = Vector3.Distance(this.body.position, e.anchor.position);
      if (d < distance) {
        const from = this.body.position.add(new Vector3(0, 1.3, 0)), to = e.anchor.position.add(new Vector3(0, 1.3, 0));
        const ray = new Ray(from, to.subtract(from).normalize(), d);
        const hit = this.world.scene.pickWithRay(ray, m => m.checkCollisions && m.isVisible && m.metadata?.cameraBlock === true);
        if (e.id === preferredId || !hit?.hit || hit.distance > d - 0.45) { nearest = e; distance = d; }
      }
    }
    return nearest;
  }
  dispose() { this.abort.abort(); }
}
