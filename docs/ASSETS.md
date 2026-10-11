# Inventario de modelos 3D

Estilo: `docs/reference/style-portal-knights.png`. Low poly, flat shaded, paleta en atlas, color de partido por tinte de material. Prioridad: **P1** jugable · **P2** ambientación · **P3** pulido. Estado: **B** boceto en código (MeshBuilder) · **G** GLB provisional · **F** futuro.
Convenciones de nombre, pivotes y colliders: `docs/ART.md`. Indicador de objetivo y sombras falsas siguen procedurales (no modelar).

## Personajes (2 cuerpos base, mismo rig Quaternius)

Cuerpo **A** adulto (escalable robusto/juvenil), cuerpo **B** mayor. Cabezas (~6), peinados (~10), ropa (4–5 cortes) modulares; accesorios en sockets `hand_R/L`, `head`, `back`.

| Modelo | Rol | Est. | P | Accesorios / notas |
|---|---|---|---|---|
| char_protagonist_01 | Candidato | B | P1 | Camisa tintable por partido; móvil, chapa, papeles |
| char_lola_01 | Tesorería | B | P1 | Calculadora, gafas, carpeta; busto para la llamada |
| char_dani_01 | Comunicación | B | P1 | Móvil con gimbal, sudadera, auriculares |
| char_nico_01 | Organización | B | P1 | Megáfono, chaleco, silla plegable |
| char_marisa_01 | Vecina panadería | B | P1 | Cuerpo B; libreta, rebeca, bolso |
| char_paco_01 | Bar La Última | B | P2 | Delantal, trapo, bigote |
| char_crowd_kit | Público plaza/salón/calle | B | P1 | Combinaciones de kit; abanico, pancarta, globo, bandera tintable |
| char_neighbor_01 | Vecina cap. 3 | F | P2 | Cuerpo B; carro de la compra, perro |
| char_courier_01 | Repartidor | F | P2 | Gorra, mochila cúbica de marca ficticia |
| char_student_01 | Estudiante | F | P2 | Mochila, auriculares, apuntes |
| char_terrace_01..03 | Conflicto de terraza | F | P2 | Café/caña; 2 cabezas únicas |
| char_rival_01..02 | Rivales ficticios | F | P2 | Traje / americana; siluetas distintas, sin parecido real |
| char_moderator_01 | Moderador | F | P2 | Tarjetas, auricular |
| char_press_01..02 | Cámara y periodista | F | P3 | Cámara al hombro, micro alcachofa |

Gestos: idle, walk, run, talk, cheer (procedurales hoy) + point, shrug, aplauso, abucheo/brazos cruzados, sentado, cargar objeto, discurso, grabar con móvil.

## Kit compartido (varios niveles)

| Modelo | Niveles | Est. | P | Notas |
|---|---|---|---|---|
| env_interior_kit_01 | piso, sede, salón | B | P1 | Suelo, pared con zócalo, esquina; colliders aparte |
| prop_door_01 | piso, sede | B | P1 | Pivote en bisagra, abrir/cerrar; variante `prop_door_double_01` salón (P2) |
| env_window_01 | piso, sede | B | P2 | Marco, alféizar, persiana |
| prop_folding_chair_01 | todos | F | P1 | Abierta y plegada; eje de "Seis sillas", trend y "Noche de las sillas" |
| prop_chair_stack_01 | sede, plaza, salón | F | P1 | Pila de 6 para recoger |
| prop_podium_01 | plaza, salón | G | P1 | Variante `_02` con escudo tintable para último mitin |
| prop_tripod_phone_01 | piso, plaza, sede | F | P1 | Trípode + móvil + aro de luz (foto, vídeo, trend, estudio de Dani) |
| prop_laptop_01 | piso, sede | B | P1 | Pantalla abatible; estados cerrado/abierto/llamada |
| prop_phone_01 | piso, sede, manos | B | P1 | Pantalla emisiva intercambiable |
| prop_poster_campaign_01 | sede, plaza, salón | F | P2 | Tintable; variante torcida (opcional Nico) |
| prop_banner_01 | sede, plaza, salón | B | P1 | Sábana pintada / backdrop de campaña tintable (`campaign-backdrop`) |
| prop_sofa_01 | piso, sede | B | P1 | Sofá chibi con cojines |
| prop_coffee_table_01 | piso, sede | B | P1 | Mesa baja |
| prop_rug_01 | piso, sede | B | P3 | Sin colisión |
| prop_kitchen_counter_01 | piso, sede | F | P2 | Encimera, nevera, fregadero, cafetera |
| prop_bookshelf_01 | piso, sede | F | P3 | Libros, carpetas |
| prop_floor_lamp_01 | piso, sede | F | P2 | Luz cálida |
| prop_tv_01 | piso, sede | F | P2 | Noticias / previsión electoral |
| prop_wall_clock_01 | piso, sede | F | P3 | Gag "antes de comer" |
| prop_cardboard_box_01 | todos | F | P2 | 2–3 tamaños apilables |
| prop_megaphone_01 | sede, plaza, manos | F | P3 | Nico |
| prop_microphone_stand_01 | plaza, salón | F | P2 | |
| prop_speaker_01 | plaza, salón | F | P3 | |
| prop_cable_mess_01 | sede, salón | F | P3 | Regletas y cables |
| prop_marisa_notebook_01 | plaza, sede, manos | F | P2 | Libreta de promesas, cap. 5 |
| prop_bench_01 | plaza | G | P1 | Revisar al estilo Portal Knights |
| prop_planter_01 | piso, plaza, sede | G | P2 | Revisar al estilo |
| prop_plant_pot_01 | piso, sede | F | P3 | Variantes |
| prop_coat_rack_01 | piso, salón | F | P3 | |

## Piso (cap. 1)

| Modelo | Est. | P | Notas |
|---|---|---|---|
| prop_desk_01 + prop_chair_desk_01 | B / F | P1 / P2 | Escritorio del portátil |
| prop_folder_01 | B | P1 | Carpeta de registro, abierta/cerrada |
| prop_flag_blank_01 | F | P2 | Bandera sin terminar, tintable ("La foto sin bandera") |
| env_flat_exterior_view_01 | F | P2 | Fachadas tras la ventana |
| prop_poster_01 | B | P2 | "MAÑANA LO ARREGLO" |
| prop_curtain_01, prop_cushion_01, prop_radiator_01, prop_ceiling_lamp_01, prop_wall_frames_01 | F | P3 | Decoración |
| prop_pizza_box_01, prop_laundry_pile_01 | F | P3 | Desorden cómico |

## Plaza (caps. 1, 3, 4, 6)

| Modelo | Est. | P | Notas |
|---|---|---|---|
| env_plaza_ground_01 | B | P1 | Losas, bordillo, alcorques |
| env_plaza_building_01..04 | B | P1 | Fachadas modulares con balcones, toldos |
| env_plaza_endbuilding_01 | B | P1 | Fondo "PLAZA DE LO DE SIEMPRE" |
| env_bakery_facade_01 + prop_awning_bakery_01 | B | P1 | "PAN Y PACIENCIA", escaparate |
| env_bar_laultima_facade_01 | F | P1 | Bar de Paco |
| prop_shutter_paco_01 | F | P2 | Persiana enrollable abierta/cerrada |
| prop_noticeboard_01 | B | P1 | Tablón de propuestas |
| prop_finalboard_map_01 | F | P1 | Mapa del barrio cap. 6 (separar de `board`) |
| prop_camera_mark_01 | F | P1 | Cinta en X para `cameraSpot` |
| prop_terrace_table_01, prop_terrace_chair_01 | F | P1 | Conflicto de terraza |
| prop_parasol_01 | F | P2 | |
| prop_work_fence_01 | F | P1 | Valla de obra, límite |
| prop_delivery_bag_01 | F | P1 | Repartidor |
| prop_delivery_bike_01, prop_student_backpack_01 | F | P2 | |
| env_tree_plaza_01..02, env_tree_small_01 | B / F | P2 | Copa facetada |
| env_bush_01..02, env_flowerpot_balcony_01 | F | P3 | Color saturado |
| prop_streetlamp_01, prop_bollard_01, prop_bus_stop_01, prop_fountain_01 | F | P2 | |
| prop_car_01, prop_van_01 | F | P2 | Genéricos sin marca; sirven de límite |
| env_shop_facade_01..03 | F | P2 | Ferretería, frutería |
| env_plaza_skybacking_01 | F | P2 | Siluetas lejanas en lugar de niebla |
| prop_poster_rival_01..02 | F | P3 | Rivales ficticios |
| prop_pergola_01, prop_mini_stage_01, prop_loading_zone_01 | F | P3 | Consecuencias visibles de shade / festival / parking |
| prop_bin_01, prop_recycling_01, prop_kiosk_01, prop_scooter_01, prop_ac_unit_01, prop_clothesline_01, prop_street_sign_01, prop_bread_basket_01, prop_flyer_stack_01 | F | P3 | Decoración |

## Sede (caps. 2, 5)

| Modelo | Est. | P | Notas |
|---|---|---|---|
| prop_planning_table_01 | B | P1 | Mesa de cocina de reunión |
| prop_crisis_board_01 | B | P1 | Corcho con estados limpio/lleno |
| prop_desk_lola_01 | F | P1 | Puesto de presupuesto |
| prop_calculator_01, prop_invoice_pile_01 | F | P2 | Lola |
| prop_whiteboard_01 | F | P2 | Cargos y horarios |
| prop_neighborhood_map_01 | F | P2 | Puerta a puerta de Nico |
| prop_printer_01 | F | P2 | Papel atascado |
| prop_lunch_tupper_01 | F | P2 | "Nadie dimite antes de comer" |
| prop_sign_hq_01 | B | P2 | "SEDE PROVISIONAL · FIANZA DEFINITIVA" |
| prop_cashbox_01, prop_paint_kit_01, prop_paper_ream_01, prop_sticky_notes_01, prop_mug_01 | F | P3 | Decoración |

## Salón de actos (caps. 5, 6)

| Modelo | Est. | P | Notas |
|---|---|---|---|
| env_hall_stage_01 + prop_stage_steps_01 | B / F | P1 | Tarima con escalones |
| prop_debate_lectern_01 (×3) | B | P1 | Sustituye `debate-desk`; placa tintable |
| prop_results_screen_01 | B | P1 | Pantalla emisiva de recuento |
| prop_ballot_box_01 | F | P1 | Urna translúcida |
| prop_moderator_desk_01, prop_debate_timer_01 | F | P2 | |
| env_hall_seating_01 | F | P2 | Filas de sillas plegables instanciadas |
| prop_stage_light_01, prop_tv_camera_01 | F | P2 | |
| prop_ballot_paper_01, prop_count_table_01 | F | P2 | Escrutinio |
| prop_balloon_cluster_01, prop_victory_banner_01 | F | P2 | Victoria, tintables |
| prop_defeat_set_01 | F | P2 | Reutiliza sillas volcadas, globo desinflado |
| env_hall_sign_01 | B | P2 | "HOY: DEMOCRACIA" |
| env_hall_truss_01 | F | P3 | |
| fx_confetti_01 | F | P2 | Partículas en Babylon, no GLB |
