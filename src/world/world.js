import { Scene, Color3, Color4, Vector3, HemisphericLight, DirectionalLight, ShadowGenerator, MeshBuilder, Mesh, VertexBuffer, StandardMaterial, PBRMaterial, DynamicTexture, TransformNode, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { createCharacter, characterModel } from '../npc/character.js';

const ASSET_DIR = './assets/';
const H = Math.PI / 2, P = Math.PI; // rotations: models face +Z; P faces -Z, H faces +X, -H faces -X
// Text drawn into GLB materials named MAT_label_<key>; [text, background, ink, width, height].
const LABELS = {
  party_name: ['PUES ME PRESENTO', '#f4ead2', '#2d4a43', 1024, 256], party_slogan: ['Una cosa bien hecha.', '#f4ead2', '#2d4a43', 1024, 160],
  rival_name: ['OTROS DE SIEMPRE', '#f4ead2', '#8b2c22', 512, 256], laptop: ['EL GRUPO', '#20343a', '#9fe0cf', 512, 320],
  phone: ['#ELECCIONES', '#18242a', '#f2d36b', 256, 480], results: ['RECUENTO', '#162a33', '#f4ead2', 1024, 600],
  name: ['CANDIDATURA', '#f4ead2', '#2d2d2d', 512, 128], tv: ['NOTICIAS DEL BARRIO', '#13202a', '#9cc8e4', 512, 288],
};

export class World {
  constructor(engine) { this.engine = engine; this.entities = []; this.characters = []; this.assetStatus = {}; this.containers = []; }
  async load(kind) {
    this.scene?.dispose(); this.containers.forEach(c => c.dispose());
    this.kind = kind; this.entities = []; this.characters = []; this.materials = {}; this.assetStatus = {}; this.containers = []; this.placements = []; this.npcs = []; this.tints = []; this.labelTextures = {}; this.kit = null;
    const s = this.scene = new Scene(this.engine); s.collisionsEnabled = true; s.metadata = { characters: {} };
    const outdoor = kind === 'plaza', sky = outdoor ? '#a9d4ee' : '#e9dfc9';
    s.clearColor = Color4.FromHexString(`${sky}ff`); s.fogMode = Scene.FOGMODE_LINEAR; s.fogStart = outdoor ? 45 : 32; s.fogEnd = outdoor ? 95 : 68; s.fogColor = Color3.FromHexString(sky);
    const hemi = new HemisphericLight('sky', new Vector3(0, 1, 0), s); hemi.intensity = outdoor ? 0.62 : 0.72; hemi.diffuse = Color3.FromHexString(outdoor ? '#eef6ff' : '#fff4e2'); hemi.groundColor = Color3.FromHexString('#8f7a68');
    const sun = new DirectionalLight('sun', new Vector3(-0.5, -1, 0.7), s); sun.position = new Vector3(20, 40, -28); sun.intensity = outdoor ? 2.1 : 1.45; sun.diffuse = Color3.FromHexString('#fff0d6');
    const shadows = new ShadowGenerator(2048, sun); shadows.usePercentageCloserFiltering = true; shadows.filteringQuality = ShadowGenerator.QUALITY_MEDIUM; shadows.bias = 0.0012; shadows.normalBias = 0.035; shadows.darkness = 0.3; sun.autoCalcShadowZBounds = true;
    s.metadata.shadows = shadows;
    this.ground = this.box('ground', [kind === 'flat' ? 18 : 54, 0.3, kind === 'flat' ? 18 : 54], [0, -0.16, 0], kind === 'flat' ? '#b88b65' : '#c9b48f');
    if (kind === 'flat') this.flat(); else if (kind === 'plaza') this.plaza(); else if (kind === 'hq') this.hq(); else this.hall();
    await this.loadAssets();
    this.marker = MeshBuilder.CreateCylinder('objective-marker', { diameterTop: 0, diameterBottom: 0.24, height: 0.35, tessellation: 4 }, s);
    this.marker.rotation.z = Math.PI; this.marker.material = this.material('#e9b453'); this.marker.material.emissiveColor = new Color3(0.25, 0.16, 0.04); this.marker.isPickable = false; this.marker.isVisible = false; this.markerTime = 0;
    this.beacon = this.exitBeacon();
    return s;
  }
  material(hex) { if (!this.materials[hex]) { const m = new StandardMaterial(hex, this.scene); m.diffuseColor = Color3.FromHexString(hex); m.specularColor = Color3.Black(); this.materials[hex] = m; } return this.materials[hex]; }
  box(name, size, pos, color, collision = true) {
    const b = MeshBuilder.CreateBox(name, { width: size[0], height: size[1], depth: size[2] }, this.scene); b.position.set(...pos); b.material = this.material(color); b.checkCollisions = collision; b.metadata = { cameraBlock: collision }; b.receiveShadows = true; return b;
  }
  /** Invisible collider; also blocks the follow camera unless block is false. */
  collider(name, size, pos, rot = 0, block = true) { const c = this.box(`collider-${name}`, size, pos, '#ffffff'); c.rotation.y = rot; c.isVisible = false; c.metadata.cameraBlock = block; return c; }
  label(text, pos, width = 3, height = 0.65, bg = '#254a45', color = '#f6ecd5') {
    const t = new DynamicTexture(`sign-${text}`, { width: 1024, height: 256 }, this.scene, false);
    const ctx = t.getContext(); ctx.fillStyle = bg; ctx.fillRect(0, 0, 1024, 256); ctx.font = 'bold 66px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(text, 512, 155); t.update();
    const m = new StandardMaterial(`sign-${text}`, this.scene); m.diffuseTexture = t; m.emissiveColor = new Color3(0.3, 0.3, 0.3); m.specularColor = Color3.Black(); m.backFaceCulling = false;
    const plane = MeshBuilder.CreatePlane(`label-${text}`, { width, height }, this.scene); plane.position.set(...pos); plane.material = m; plane.isPickable = false; return plane;
  }
  /** Queue a kit GLB from public/assets/. collider: true = model bounds, [w,h,d] = explicit box at the model's footprint. */
  place(name, x, z, { rot = 0, y = 0, scale = 1, tilt = 0, collider = false, block = true } = {}) { this.placements.push({ name, x, y, z, rot, scale, tilt, collider, block }); }
  entity(id, label, position, options = {}) {
    const anchor = new TransformNode(`entity-${id}`, this.scene); anchor.position.set(...position);
    const entity = { id, label, anchor, ...options }; this.entities.push(entity); return entity;
  }
  /** Walkable exit to another scene (see `exits` in src/data/campaign.js). `face`: yaw from the ring towards the door.
   *  Inactive exits are invisible to E and to the prompt; markObjective() activates the current one and its beacon. */
  exit(id, label, position, face, sign) { return this.entity(id, label, position, { exit: true, active: false, face, sign }); }
  /** Interactive character: entity plus collider; the model is attached once its GLB has loaded. */
  npc(id, name, position, shirt, rotation = Math.PI, model = null) {
    const entity = this.entity(id, name, position);
    this.npcs.push({ entity, name, position, shirt, rotation, model });
    this.collider(id, [0.65, 1.9, 0.65], [position[0], position[1] + 0.95, position[2]], 0, false);
  }
  /** Ambient character without interaction. */
  extra(name, model, position, rotation = 0) { this.npcs.push({ name, position, rotation, model }); this.collider(`extra-${name}`, [0.65, 1.9, 0.65], [position[0], position[1] + 0.95, position[2]], 0, false); }
  shadow(x, z, radius = 0.5) {
    const d = MeshBuilder.CreateDisc('soft-shadow', { radius, tessellation: 16 }, this.scene); d.rotation.x = Math.PI / 2; d.position.set(x, 0.013, z); const m = this.material('#675b4b'); m.alpha = 0.18; d.material = m; d.isPickable = false; return d;
  }
  tiles(name, size, xs, zs) { for (let x = xs[0]; x <= xs[1]; x += size) for (let z = zs[0]; z <= zs[1]; z += size) this.place(name, x, z); }

  flat() {
    this.spawn = new Vector3(0, 0.02, -2.8); this.cameraYaw = 0;
    this.ground.isVisible = false; this.tiles('env_interior_floor_01', 2, [-6, 6], [-6.5, 5.5]);
    this.box('back-wall', [14, 3.8, 0.3], [0, 1.9, 6], '#e8d6b4');
    this.box('left-wall', [0.3, 3.8, 14], [-7, 1.9, -0.8], '#b9cdb2');
    this.box('right-wall', [0.3, 3.8, 14], [7, 1.9, -0.8], '#e8d6b4');
    this.box('front-wall', [14, 3.8, 0.3], [0, 1.9, -7.5], '#e8d6b4');
    for (const [n, size, pos] of [['back', [14, 0.14, 0.06], [0, 0.07, 5.84]], ['left', [0.06, 0.14, 14], [-6.84, 0.07, -0.8]], ['right', [0.06, 0.14, 14], [6.84, 0.07, -0.8]]]) this.box(`skirting-${n}`, size, pos, '#8a6142', false);
    // Living room
    this.place('prop_rug_01', -3.2, 1.2, { scale: 1.3 });
    this.place('prop_sofa_01', -3.8, 2.9, { rot: P, collider: true });
    this.place('prop_coffee_table_01', -3.5, 0.95, { collider: [1.5, 0.5, 0.8] });
    this.place('prop_phone_01', -3.3, 0.75, { y: 0.465, tilt: H });
    this.place('prop_mug_01', -3.95, 0.85, { y: 0.45 }); this.place('prop_pizza_box_01', -1.6, 3.5, { rot: 0.35 });
    this.place('prop_tv_stand_01', -6.6, 0.95, { rot: H, collider: true }); this.place('prop_tv_01', -6.6, 0.95, { rot: H, y: 0.46 });
    this.place('prop_floor_lamp_01', -5.85, 3.75);
    this.entity('phone', 'Móvil · Un vídeo más', [-3.3, 0, 0.65]);
    // Kitchen corner
    this.place('prop_kitchen_counter_01', -6.62, -4.6, { rot: H, collider: true }); this.place('prop_coffee_maker_01', -6.55, -5.05, { rot: H, y: 0.93 });
    this.place('prop_fridge_01', -6.6, -2.95, { rot: H, collider: true });
    // Work corner
    this.place('prop_desk_01', 3.5, 3.8, { rot: P, collider: [2.4, 0.8, 1.0] }); this.place('prop_folder_01', 4.35, 3.55, { rot: P + 0.2, y: 0.78 });
    this.place('prop_chair_desk_01', 5.6, 3.05, { rot: 2.6 }); this.place('prop_bookshelf_01', 6.8, 1.2, { rot: -H, collider: true });
    this.place('prop_laundry_pile_01', 5.3, -1.7, { rot: 0.4 });
    this.entity('laptop', 'Portátil · Llamar a los amigos', [2.75, 0, 2.9]);
    this.entity('folder', 'Carpeta · Fundar el partido', [4.65, 0, 2.9]);
    // Walls and door
    this.place('prop_door_01', 0, 5.84, { rot: P, scale: 1.15 }); this.label('A LA CALLE', [0, 3.2, 5.69], 1.6, 0.4); this.exit('door', 'Salir a la plaza', [0, 0, 4.8], 0, 'PLAZA');
    this.place('prop_coat_rack_01', -1.45, 5.45);
    this.place('prop_curtain_01', -3.8, 5.84, { rot: P, y: 2.1, scale: 1.2 }); this.place('prop_wall_clock_01', 1.9, 5.84, { rot: P, y: 2.75 });
    this.place('prop_poster_flat_01', 3.7, 5.84, { rot: P, y: 2.15, scale: 1.6 });
    this.place('env_window_01', -6.84, -0.8, { rot: H, y: 1.0 }); this.place('prop_radiator_01', -6.82, -0.8, { rot: H, y: 0.12 });
    this.place('prop_wall_frames_01', 6.84, -1.6, { rot: -H, y: 1.9 });
    for (const [x, z] of [[6.2, 5.3], [-6.2, -6.8]]) this.place('prop_plant_pot_01', x, z, { collider: [0.6, 0.8, 0.6] });
  }
  plaza() {
    this.spawn = new Vector3(0, 0.02, -7); this.cameraYaw = 0;
    this.tiles('env_plaza_ground_01', 4, [-10, 10], [-16, 16]); // paving runs under the facades: no bare strip at the kerb
    // Facades: fronts on x = ±9 facing the square, solid colliders behind them. Blocks are full volumes (~7 m deep)
    // placed edge to edge (party walls touch); the left row ends in a corner filler hidden partly by the town hall.
    for (const [name, z] of [['env_plaza_building_02', -11.6], ['env_shop_closed_01', -5.6], ['env_shop_hardware_01', -1.3], ['env_shop_greengrocer_01', 3.3], ['env_plaza_building_03', 9.6], ['env_plaza_building_01', 17.6]]) this.place(name, -9, z, { rot: H });
    for (const [name, z] of [['env_plaza_building_01', -8.1], ['env_bar_laultima_facade_01', -1.6], ['env_plaza_building_02', 4.9], ['env_plaza_building_03', 12.9], ['env_plaza_building_03', -16.1]]) this.place(name, 9, z, { rot: -H });
    for (const side of [-1, 1]) this.collider(`facades${side}`, [1, 14, 34], [side * 9.6, 7, 1], 0);
    this.place('env_plaza_endbuilding_01', 0, 17.3, { rot: P }); this.collider('end-building', [20, 14, 2.5], [0, 7, 18.4]);
    this.place('env_plaza_building_04', 12.5, 19, { rot: P });
    this.place('env_plaza_skybacking_01', 0, 27, { rot: P, scale: 1.3 }); this.place('env_plaza_skybacking_01', 0, -26, { scale: 1.3 });
    for (const side of [-1, 1]) this.place('env_plaza_skybacking_01', side * 26, 0, { rot: side * -H, scale: 1.3 });
    // Bakery, Marisa and the stage of the campaign
    this.place('env_bakery_facade_01', -5.8, 9.2, { rot: P }); this.place('prop_awning_bakery_01', -5.8, 8.6, { rot: P, y: 3.05 }); this.collider('bakery', [4.6, 7.5, 3.75], [-5.8, 3.75, 10.875]); // two-storey volume 3.4 m deep
    this.npc('marisa', 'Marisa', [-5, 0, 6.7], '#8d779c', Math.PI * 0.85);
    this.npc('paco', 'Paco', [6.3, 0, -1.5], '#b89e5d', -Math.PI / 2);
    this.place('prop_campaign_backdrop_01', 0, 10.7, { rot: P, collider: [6.2, 3.1, 0.4] });
    for (const x of [-3.4, 3.4]) this.place('prop_flag_blank_01', x, 10.1, { rot: P });
    this.place('env_bush_long_01', 4.8, 11.2, { collider: true }); this.place('env_bush_long_01', -3.35, 11.6, { rot: H, collider: true }); // left one hugs the bakery's side
    this.place('prop_podium_01', 0, 7.35, { rot: P, collider: [0.9, 1.2, 0.65] }); this.entity('podium', 'Atril · Tu primer discurso', [0, 0, 8]);
    this.place('prop_fountain_01', 0, 13.6, { collider: [2.6, 1.2, 2.6] });
    for (const x of [-3.4, 3.4]) { this.place('env_tree_young_01', x, 13.4, { collider: [0.4, 3, 0.4] }); this.place('env_plaza_tree_pit_01', x, 13.4); }
    // Programme board and final map
    this.place('prop_noticeboard_01', -6, -3.5, { rot: P, collider: [1.5, 2.1, 0.35] }); this.entity('board', 'Tablón · Elegir una propuesta', [-6, 0, -4.3]);
    this.place('prop_finalboard_map_01', -7.7, -3.5, { rot: P, collider: [1.5, 2.1, 0.35] }); this.entity('finalBoard', 'Mapa · Último esfuerzo', [-6, 0, -4.3]);
    // Video mark
    this.place('prop_camera_mark_01', 5.5, 6, { y: 0.012 }); this.place('prop_tripod_phone_01', 5.5, 4.5);
    this.entity('cameraSpot', 'Marca · Grabar vídeo', [5.5, 0, 6]);
    // Bar terrace (Paco)
    for (const z of [-6.4, 3.3]) {
      this.place('prop_terrace_table_01', 7.5, z, { collider: [0.9, 0.85, 0.9] }); this.place('prop_parasol_01', 7.5, z, { y: 0.05 });
      for (const dz of [-0.7, 0.7]) this.place('prop_terrace_chair_01', 7.5, z + dz, { rot: dz > 0 ? P : 0 });
    }
    // Street furniture and greenery
    this.place('prop_bench_01', 4.7, 4, { collider: [2.3, 0.95, 0.8] }); this.place('prop_bench_01', -4, -9, { collider: [2.3, 0.95, 0.8] });
    for (const [x, z] of [[-7.3, 0.4], [7.0, 10.6]]) { this.place('env_tree_large_01', x, z, { collider: [0.6, 3, 0.6] }); this.place('env_plaza_tree_pit_01', x, z); }
    for (const [x, z] of [[-7.5, 7.6], [-7.5, -6.6], [7.6, -4.6], [7.6, 8.0]]) this.place('prop_streetlamp_01', x, z, { rot: x > 0 ? -H : H, collider: [0.3, 3.8, 0.3] });
    this.place('prop_bus_stop_01', -7.7, -10.6, { rot: H, collider: true });
    // Walkable exits: the sede is the ground floor of the portal beside the bar; the 27 stops at the bus shelter.
    this.label('SEDE DE CAMPAÑA', [8.86, 3.2, -7.95], 1.7, 0.36).rotation.y = H;
    this.exit('sedeDoor', 'Portal · Sede de campaña', [7.95, 0, -7.95], H, 'SEDE');
    this.exit('busStop', 'Parada · Línea 27', [-6.45, 0, -11.2], -H, 'BUS 27'); this.place('env_bush_round_01', -5.7, -9.4, { collider: true });
    this.place('prop_kiosk_01', -6.0, -13.4, { collider: true }); this.place('prop_car_01', -3.0, -13.9, { rot: H, collider: true });
    for (const x of [0.2, 2.4]) this.place('prop_work_fence_01', x, -14.1);
    this.place('prop_recycling_01', 5.0, -13.7, { collider: true }); this.place('prop_van_01', 0, -17.5, { rot: H });
    this.collider('boundary', [40, 3, 1], [0, 1.5, -15]);
    for (const [x, z] of [[2.6, -4.5], [-7.6, 2.9]]) this.place('prop_bin_01', x, z);
    this.place('prop_poster_campaign_01', -8.95, -8.2, { rot: H, y: 1.6, scale: 1.4 }); this.place('prop_poster_rival_01', -8.95, -9.4, { rot: H, y: 1.6, scale: 1.4 });
    this.place('prop_poster_campaign_02', 8.4, 6.4, { rot: -H, y: 1.7, scale: 1.4 }); this.place('prop_street_sign_01', -8.95, 1.0, { rot: H, y: 4.9, scale: 1.5 });
    // Neighbours
    for (const [i, x, z] of [[0, -1.8, 5], [1, 1.9, 5], [2, -0.5, 3.5], [3, 2.8, 2.5]]) this.npc(`crowd${i}`, ['Alba', 'Rafa', 'Reme', 'Luis'][i], [x, 0, z], ['#66988c', '#d58b60', '#8e9fab', '#c6b476'][i], 0);
    this.extra('Carmen', 'char_neighbor_cart_01', [-7.2, 0, 5.6], H); this.extra('Rubén', 'char_courier_01', [2.4, 0, -9.8], 0.6);
    this.place('prop_delivery_bike_01', 3.4, -10.4, { rot: 0.2 });
    this.extra('Lucía', 'char_student_01', [2.2, 0, 12.2], -2.4);
    this.extra('Tere', 'char_terrace_01', [8.1, 0, -5.8], -H); this.extra('Manolo', 'char_terrace_03', [6.8, 0, -7.0], 0.8);
  }
  roomBase(wallColor = '#d8c49f') {
    this.spawn = new Vector3(0, .02, -5); this.cameraYaw = 0;
    this.ground.isVisible = false; this.box('room-floor', [18, .25, 18], [0, -.13, 0], '#c99b70').isVisible = false;
    this.tiles('env_interior_floor_01', 2, [-8, 8], [-8, 8]);
    this.box('wall-back', [18, 5, .3], [0, 2.5, 8], wallColor);
    this.box('wall-left', [.3, 5, 18], [-9, 2.5, 0], '#b6cbb2');
    this.box('wall-right', [.3, 5, 18], [9, 2.5, 0], wallColor);
    this.box('wall-front', [18, 5, .3], [0, 2.5, -8], wallColor);
    for (const [n, size, pos] of [['back', [18, .14, .06], [0, .07, 7.84]], ['left', [.06, .14, 18], [-8.84, .07, 0]], ['right', [.06, .14, 18], [8.84, .07, 0]]]) this.box(`skirting-${n}`, size, pos, '#8a6142', false);
    this.place('env_window_01', -8.84, 3.6, { rot: H, y: 1.0 }); this.place('env_window_01', 8.84, -5.4, { rot: -H, y: 1.0 });
    for (const [x, z] of [[8.2, 7.3], [-8.2, -7.2]]) this.place('prop_plant_pot_01', x, z, { collider: [0.6, 0.8, 0.6] });
  }
  hq() {
    this.roomBase('#efdcb9');
    this.place('prop_door_01', 0, -7.84, { scale: 1.15 });
    this.label('A LA CALLE', [0, 3.25, -7.69], 1.6, 0.4).rotation.y = P; this.exit('hqDoor', 'Puerta · Salir a la calle', [0, 0, -6.75], P, 'CALLE');
    // Campaign table where the team meets
    this.place('prop_planning_table_01', 0, 1.0, { rot: P }); this.collider('planning-table', [3.7, 0.8, 1.05], [0, 0.4, 1.0]);
    this.place('prop_pizza_box_01', 1.1, 1.15, { y: 0.75, rot: 0.3 }); this.place('prop_laptop_01', -1.1, 1.0, { y: 0.75, rot: P + 0.3 }); this.place('prop_lunch_tupper_01', 0.3, 0.8, { y: 0.75 });
    this.entity('planning', 'Mesa · Repartir prioridades', [0, 0, -.4]);
    this.npc('lolaHq', 'Lola', [-2, 0, 2.7], '#c77657'); this.npc('daniHq', 'Dani', [0, 0, 3.2], '#789bad'); this.npc('nicoHq', 'Nico', [2, 0, 2.7], '#b8a45b');
    // Crisis corner
    this.place('prop_crisis_board_01', 5.7, 4.8, { rot: P, collider: [1.3, 1.7, 0.4] }); this.entity('crisisBoard', 'Tablón · Resolver la crisis', [5.7, 0, 3.6]);
    this.place('prop_whiteboard_01', 7.7, 4.6, { rot: P, collider: true });
    // Lola's treasury desk and the back wall
    this.place('prop_desk_lola_01', -6, 5.7, { rot: P, collider: [1.5, 0.8, 0.8] }); this.place('prop_printer_01', -7.9, 6.9, { rot: P });
    this.place('prop_sign_hq_01', -3.5, 7.2, { rot: P }); this.place('prop_banner_01', -0.2, 7.4, { rot: P });
    this.place('prop_kitchen_counter_01', 2.5, 7.45, { rot: P, collider: true }); this.place('prop_coffee_maker_01', 2.2, 7.35, { rot: P, y: 0.93 }); this.place('prop_fridge_01', 4.1, 7.4, { rot: P, collider: true });
    this.place('prop_wall_clock_01', -1.6, 7.84, { rot: P, y: 3.8 });
    this.place('prop_bookshelf_01', -8.65, 0.6, { rot: H, collider: true }); this.place('prop_bookshelf_01', -8.65, 1.6, { rot: H, collider: true });
    // Sofa corner
    this.place('prop_rug_01', -6.2, -3.0, { rot: H, scale: 1.2 }); this.place('prop_sofa_01', -7.9, -3.0, { rot: H, collider: true });
    this.place('prop_coffee_table_01', -6.2, -3.0, { rot: H, collider: [0.8, 0.5, 1.5] }); this.place('prop_tv_stand_01', -4.0, -3.0, { rot: -H, collider: true }); this.place('prop_tv_01', -4.0, -3.0, { rot: -H, y: 0.46 });
    this.place('prop_floor_lamp_01', -8.3, -5.0); this.place('prop_wall_frames_01', -8.84, -3.0, { rot: H, y: 2.3 });
    // Campaign material by the entrance
    this.place('prop_poster_campaign_01', 8.84, 1.2, { rot: -H, y: 1.8, scale: 1.4 }); this.place('prop_poster_campaign_02', 8.84, -0.3, { rot: -H, y: 1.8, scale: 1.4 }); this.place('prop_neighborhood_map_01', 8.84, -2.4, { rot: -H, y: 1.8, scale: 1.3 });
    this.place('prop_cardboard_box_03', 7.6, -6.6, { rot: 0.3, collider: true }); this.place('prop_cardboard_box_01', 7.6, -6.6, { rot: 0.7, y: 0.73 }); this.place('prop_cardboard_box_02', 6.8, -7.0, { rot: -0.2 });
    this.place('prop_chair_stack_01', 8.1, -4.4, { rot: -H, collider: true }); this.place('prop_folding_chair_01', 6.9, -3.7, { rot: 2.2 });
    this.place('prop_paint_kit_01', 6.3, -6.9, { rot: 0.5 }); this.place('prop_cable_mess_01', -4.6, 4.3, { rot: 1 }); this.place('prop_megaphone_01', -6.3, 5.8, { y: 0.78, rot: 2.6 });
  }
  hall() {
    this.roomBase('#e3cfb4');
    this.label('SALÓN MULTIUSOS · HOY: DEMOCRACIA', [0, 4.3, 7.8], 7, .7, '#653f55');
    this.place('prop_door_double_01', 0, -7.84);
    this.label('SALIDA', [0, 3.4, -7.69], 1.6, 0.4, '#653f55').rotation.y = P; this.exit('hallDoor', 'Puerta · Salida', [0, 0, -6.75], P, 'SALIDA');
    // Stage: the box keeps the walkable collider, the GLB dresses it.
    this.box('stage', [12, .55, 5], [0, .28, 4], '#6d5366').isVisible = false;
    this.place('env_hall_stage_01', 0, 4.05, { rot: P, scale: [1.4, 1, 1.17] }); this.place('prop_stage_steps_01', -4.8, 1.0, { rot: P });
    this.place('env_hall_truss_01', 0, 1.8, { rot: P, y: .55, scale: [1.7, 1, 1] });
    // Debate on stage
    // Lecterns: you, Rival A (tech), Rival B (populist), Rival C (Fox, 'hard'); see DEBATE_ROLES in src/data/parties.js.
    for (const x of [-0.4, 1.1, 2.6, 4.1]) this.place('prop_debate_lectern_01', x, 3.3, { rot: P, y: .55 });
    this.place('prop_moderator_desk_01', 1.1, 5.1, { rot: P, y: .55 }); this.place('prop_debate_timer_01', 1.1, 5.0, { rot: P, y: 1.55 });
    this.entity('debateDesk', 'Mesa · Empezar el debate', [0, 0, 1.8]);
    this.extra('Rival A', 'char_rival_a_01', [1.1, .55, 3.9], P); this.extra('Rival B', 'char_rival_b_01', [2.6, .55, 3.9], P); this.extra('Rival C', 'char_rival_c_01', [4.1, .55, 3.9], P);
    this.extra('Moderadora', 'char_moderator_01', [1.1, .55, 5.7], P);
    // Final rally and results
    this.place('prop_podium_02', -3, 3.7, { rot: P, y: .55 }); this.collider('podium', [0.9, 1.2, 0.65], [-3, 1.15, 3.7]);
    this.entity('finalPodium', 'Atril · Último mitin', [-3, 0, 0.8]);
    this.place('prop_campaign_backdrop_01', -2.5, 5.45, { rot: P, y: .55, scale: 0.72 });
    this.place('prop_results_screen_01', 3.0, 5.55, { rot: P, y: .55, scale: 0.85 }); this.entity('results', 'Pantalla · Ver resultados', [-1, 0, 0.8]);
    for (const x of [-5.6, 5.6]) this.place('prop_speaker_01', x, 4.5, { rot: P, y: .55 });
    for (const x of [-7.6, 7.6]) { this.place('prop_stage_light_01', x, -0.5, { rot: x < 0 ? 0.5 : -0.5 }); this.place('prop_balloon_cluster_01', x, 4.6); }
    // Audience: two rows of folding chairs either side of the aisle
    for (const z of [-2.6, -3.8]) {
      for (let x = -5.6; x <= 5.7; x += 0.9) if (Math.abs(x) > 1) this.place('prop_folding_chair_01', x, z);
      for (const side of [-1, 1]) this.collider(`chairs${z}${side}`, [5.0, 0.9, 0.55], [side * 3.4, 0.45, z], 0, false);
    }
    for (let i = 0; i < 6; i++) this.npc(`hallCrowd${i}`, ['Ana', 'Berto', 'Cris', 'Dora', 'Eloy', 'Fina'][i], [-5 + i * 2, 0, -1 + (i % 2) * 1.5], ['#7b9b8b', '#b47b61', '#8797ad', '#a9889e', '#bea75f', '#5f887e'][i], 0);
    // Press and count
    this.place('prop_tv_camera_01', 5.4, -1.3, { rot: -0.4 }); this.extra('Cámara', 'char_camera_op_01', [6.1, 0, -1.8], -0.4); this.extra('Periodista', 'char_journalist_01', [7.0, 0, -0.3], -0.9);
    this.place('prop_count_table_01', 7.7, -5.4, { rot: -H, collider: true }); this.place('prop_ballot_box_01', 7.7, -4.9, { rot: -H, y: 0.75 });
    this.place('env_hall_sign_01', -3.4, -7.3);
  }
  async loadAssets() {
    const s = this.scene, shadows = s.metadata.shadows;
    const characterFiles = new Set(['char_protagonist_01', ...this.npcs.map(n => characterModel(n.name, n.model))]);
    const files = [...new Set(this.placements.map(p => p.name)), ...characterFiles];
    const containers = {};
    await Promise.all(files.map(async name => {
      try { containers[name] = await SceneLoader.LoadAssetContainerAsync(ASSET_DIR, `${name}.glb`, s); this.assetStatus[name] = 'GLB'; this.containers.push(containers[name]); this.prepareMaterials(containers[name]); }
      catch { this.assetStatus[name] = 'missing'; }
    }));
    for (const name of characterFiles) if (containers[name]) s.metadata.characters[name] = containers[name];
    const templates = {};
    for (const name of new Set(this.placements.map(p => p.name))) if (containers[name]) templates[name] = this.bake(name, containers[name]);
    for (const p of this.placements) {
      const parts = templates[p.name]; if (!parts) continue;
      const root = new TransformNode(`${p.name}-placement`, s); root.position.set(p.x, p.y, p.z); root.rotation.set(p.tilt, p.rot, 0);
      if (Array.isArray(p.scale)) root.scaling.set(...p.scale); else root.scaling.setAll(p.scale);
      for (const part of parts) part.createInstance(`${p.name}-${part.name}`).parent = root;
      root.computeWorldMatrix(true);
      for (const m of root.getChildMeshes()) { m.isPickable = false; m.receiveShadows = true; shadows.addShadowCaster(m, false); m.computeWorldMatrix(true); m.freezeWorldMatrix(); }
      if (Array.isArray(p.collider)) this.collider(p.name, p.collider, [p.x, p.y + p.collider[1] / 2, p.z], p.rot, p.block);
      else if (p.collider) { const { min, max } = root.getHierarchyBoundingVectors(true); this.collider(p.name, [max.x - min.x, max.y - min.y, max.z - min.z], [(min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2], 0, p.block); }
    }
    for (const n of this.npcs) {
      const ch = createCharacter(s, n.name, n.shirt, n.model); ch.root.position.set(...n.position); ch.root.rotation.y = n.rotation; this.characters.push(ch);
      if (n.entity) n.entity.character = ch;
      this.shadow(n.position[0], n.position[2]);
    }
    this.assetStatus.podium = this.assetStatus.prop_podium_01 ?? this.assetStatus.prop_podium_02;
  }
  /** Merge a prop GLB into one vertex-coloured mesh (one draw call per instance) plus its label/tint/emissive/glass meshes. */
  bake(name, container) {
    const meshes = container.meshes.filter(m => m.getTotalVertices() > 0), plain = [], parts = [];
    meshes.forEach(m => m.computeWorldMatrix(true));
    for (const m of meshes) {
      const mat = m.material, special = /^MAT_(label|tint)_/.test(mat?.name ?? '') || (mat?.alpha ?? 1) < 1 || (mat?.emissiveColor && mat.emissiveColor.toLuminance() > 0.01);
      if (special) { if (mat && (mat.alpha ?? 1) >= 1) { mat.backFaceCulling = false; mat.twoSidedLighting = true; } parts.push(Mesh.MergeMeshes([m], false, true)); continue; }
      const c = mat?.albedoColor ?? Color3.White(), n = m.getTotalVertices(), colours = new Float32Array(n * 4);
      for (let i = 0; i < n; i++) colours.set([c.r, c.g, c.b, 1], i * 4);
      for (const kind of m.getVerticesDataKinds()) if (![VertexBuffer.PositionKind, VertexBuffer.NormalKind].includes(kind)) m.removeVerticesData(kind);
      m.setVerticesData(VertexBuffer.ColorKind, colours); plain.push(m);
    }
    if (plain.length) { const merged = Mesh.MergeMeshes(plain, false, true); merged.material = this.kitMaterial(); parts.unshift(merged); }
    parts.forEach((p, i) => { p.name = `${name}-${i}`; p.isVisible = false; p.isPickable = false; p.receiveShadows = true; });
    return parts;
  }
  kitMaterial() {
    if (!this.kit) { this.kit = new PBRMaterial('MAT_kit', this.scene); this.kit.albedoColor = Color3.White(); this.kit.metallic = 0; this.kit.roughness = 0.85;
      // Some procedural kit pieces (vehicles, thin panels) have faces wound inwards; draw both sides, lit correctly,
      // so nothing turns see-through from certain angles.
      this.kit.backFaceCulling = false; this.kit.twoSidedLighting = true; }
    return this.kit;
  }
  /** Fill MAT_label_* with text and collect MAT_tint_* for the party colour. */
  prepareMaterials(container) {
    for (const m of container.meshes) m.receiveShadows = true; // instances inherit this from their source mesh
    for (const m of container.materials) {
      const label = m.name.match(/^MAT_label_(.+)$/)?.[1];
      if (label) {
        if (!this.labelTextures[label]) { const [text, bg, ink, w, h] = LABELS[label] ?? ['', '#f4ead2', '#2d2d2d', 256, 128]; const texture = new DynamicTexture(`label-${label}`, { width: w, height: h }, this.scene, true); texture.vScale = -1; texture.vOffset = 1; this.labelTextures[label] = { texture, bg, ink }; this.drawLabel(label, text); }
        const t = this.labelTextures[label].texture; m.albedoTexture = t; m.emissiveTexture = t; m.emissiveColor = new Color3(0.45, 0.45, 0.45);
      }
      if (m.name.startsWith('MAT_tint_')) this.tints.push(m);
    }
  }
  drawLabel(key, text, bg = null, ink = null) {
    const entry = this.labelTextures[key]; if (!entry) return;
    const t = entry.texture, { width, height } = t.getSize(), ctx = t.getContext();
    ctx.fillStyle = bg ?? entry.bg; ctx.fillRect(0, 0, width, height); ctx.fillStyle = ink ?? entry.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let size = Math.floor(height * 0.42); ctx.font = `bold ${size}px sans-serif`;
    while (size > 10 && ctx.measureText(text).width > width * 0.9) { size -= 2; ctx.font = `bold ${size}px sans-serif`; }
    ctx.fillText(text, width / 2, height / 2); t.update();
  }
  /** Floating marker over the objective; an exit also gets its beacon (ring, chevrons, signpost) and becomes usable.
   *  `walk` (objectiveFor with a pending exit) overrides the exit's prompt and sign with the destination's. */
  markObjective(id, walk = null) {
    const entity = this.entityById(id); this.marker.isVisible = !!entity; this.markerTarget = entity;
    for (const e of this.entities) if (e.exit) e.active = e === entity;
    if (entity?.exit && walk?.prompt) entity.label = walk.prompt;
    const b = this.beacon; b.root.setEnabled(!!entity?.exit);
    if (entity?.exit) { b.root.position.set(entity.anchor.position.x, 0, entity.anchor.position.z); b.root.rotation.y = entity.face; this.drawSign(walk?.sign || entity.sign); }
  }
  /** Exit beacon in the kit's style: flat-shaded gold ring, chevrons marching towards the door, wooden signpost. */
  exitBeacon() {
    const s = this.scene, root = new TransformNode('exit-beacon', s);
    const glow = (name, hex, emissive, alpha = 1) => { const m = new StandardMaterial(name, s); m.diffuseColor = Color3.FromHexString(hex); m.emissiveColor = Color3.FromHexString(emissive); m.specularColor = Color3.Black(); m.alpha = alpha; return m; };
    const gold = glow('exit-gold', '#e9b453', '#8a5c14'), fill = glow('exit-fill', '#f3d27a', '#a8761c', 0.28);
    const ring = MeshBuilder.CreateTorus('exit-ring', { diameter: 1.55, thickness: 0.1, tessellation: 12 }, s); ring.material = gold; ring.position.y = 0.05; ring.parent = root;
    const disc = MeshBuilder.CreateDisc('exit-disc', { radius: 0.74, tessellation: 12 }, s); disc.rotation.x = Math.PI / 2; disc.position.y = 0.03; disc.material = fill; disc.parent = root;
    const chevrons = [0, 1, 2].map(i => {
      const c = new TransformNode(`exit-chevron-${i}`, s); c.parent = root;
      for (const side of [-1, 1]) { const arm = MeshBuilder.CreateBox('exit-chevron-arm', { width: 0.36, height: 0.03, depth: 0.09 }, s); arm.material = gold; arm.parent = c; arm.position.set(side * 0.11, 0.05, -0.11); arm.rotation.y = side * Math.PI / 4; }
      return c;
    });
    const wood = this.material('#8a6142'), post = MeshBuilder.CreateBox('exit-post', { width: 0.1, height: 1.7, depth: 0.1 }, s); post.material = wood; post.position.set(0.98, 0.85, 0.15); post.parent = root; // the post stops under the board, never across its faces
    const board = MeshBuilder.CreateBox('exit-board', { width: 1.06, height: 0.42, depth: 0.06 }, s); board.material = wood; board.position.set(0.98, 1.86, 0.15); board.parent = root;
    const texture = new DynamicTexture('exit-sign', { width: 512, height: 192 }, s, true), face = glow('exit-sign', '#ffffff', '#6a6a6a'); face.diffuseTexture = texture; face.emissiveTexture = texture;
    for (const back of [false, true]) { const p = MeshBuilder.CreatePlane('exit-sign-face', { width: 0.98, height: 0.36 }, s); p.material = face; p.parent = root; p.position.set(0.98, 1.86, back ? 0.19 : 0.11); if (back) p.rotation.y = Math.PI; }
    root.getChildMeshes().forEach(m => { m.isPickable = false; });
    root.setEnabled(false);
    return { root, ring, disc, chevrons, texture, signText: null };
  }
  drawSign(text) {
    const b = this.beacon; if (b.signText === text) return; b.signText = text;
    const ctx = b.texture.getContext(), w = 512, h = 192;
    ctx.fillStyle = '#254a45'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#e9b453'; ctx.lineWidth = 10; ctx.strokeRect(9, 9, w - 18, h - 18);
    // Arrow "ahead" on the left, destination on the right.
    ctx.fillStyle = '#e9b453'; ctx.beginPath(); ctx.moveTo(84, 38); ctx.lineTo(138, 96); ctx.lineTo(104, 96); ctx.lineTo(104, 154); ctx.lineTo(64, 154); ctx.lineTo(64, 96); ctx.lineTo(30, 96); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f6ecd5'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let size = 84; ctx.font = `bold ${size}px sans-serif`;
    while (size > 24 && ctx.measureText(text || '').width > 320) { size -= 4; ctx.font = `bold ${size}px sans-serif`; }
    ctx.fillText(text || '', 325, 100); b.texture.update();
  }
  setIdentity(party) {
    if (!party) return;
    const colour = Color3.FromHexString(party.color);
    for (const m of this.tints) { if (m.albedoColor) m.albedoColor = colour; else if (m.diffuseColor) m.diffuseColor = colour; }
    this.drawLabel('party_name', party.name.toUpperCase(), party.color, '#fbf4e2'); this.drawLabel('party_slogan', party.slogan ?? '');
  }
  update(dt, reaction = null) {
    // `acting` (Map character -> state) holds per-character overrides from cinematics and minigames (src/cinema/director.js).
    for (const ch of this.characters) ch.update(dt, this.acting?.get(ch) || reaction || 'idle');
    if (this.markerTarget) { this.markerTime += dt; this.marker.position.copyFrom(this.markerTarget.anchor.position); this.marker.position.y = 2.7 + Math.sin(this.markerTime * 2) * 0.12; }
    if (this.markerTarget?.exit) {
      const b = this.beacon, t = this.markerTime; b.ring.scaling.setAll(1 + Math.sin(t * 3) * 0.05);
      b.chevrons.forEach((c, i) => { const k = (t * 0.6 + i / 3) % 1; c.position.z = -0.5 + k * 1.0; c.scaling.setAll(0.6 + 0.4 * Math.sin(k * Math.PI)); });
    }
  }
  entityById(id) { return this.entities.find(e => e.id === id); }
}
