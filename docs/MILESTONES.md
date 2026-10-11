# Milestones y contenido

## M1 · primera experiencia

Criterio: completar menú → piso → vídeo → llamada a tres amigos con cargos → registro → plaza → Marisa → propuesta → discurso con tres elecciones y timing → reacción/memoria → autoguardado. Reanudar con Continuar; caminar y usar ratón/E; colisiones; no requerir debug. Implementado con placeholders y tres props GLB de Blender.

## M2 · recorrido provisional (implementado en v0.2)

Los seis capítulos y los cuatro escenarios están conectados. Modelo electoral determinista: resultado = 55% apoyo + 30% credibilidad + 15% organización; umbral 48. Alcance no añade votos. Se muestra previsión antes de crisis y cierre.

Hay checkpoint antes de crisis, tres acciones recuperadoras, repetición de crisis/debate/cierre, derrota con motivos y reintento, y victoria con créditos/menú. Las pruebas cubren derrota y remontada. El contenido es deliberadamente provisional y corto.

## M3 · cinemáticas y minijuegos (v0.3, implementado parcialmente)

Implementado: seis cinemáticas in-engine (intro en el piso con TV y móvil vibrando, llegada a la plaza, a la sede, al salón del debate, victoria y derrota) y cuatro minijuegos integrados en misiones existentes, tras la decisión de cada pantalla (`#flow-N` se mantiene):

| Misión | Minijuego | Controles | Resultado (una vez, al aceptar) |
|---|---|---|---|
| video | «Hazlo viral»: poses al compás con el móvil en trípode (~30 s, 28 notas a 96 BPM) | ←↑→↓ o WASD | alcance 0..+10 |
| debate | Duelo de réplicas: 4 rondas, 10 s, interrupción a mitad | 1–3, Espacio pide la palabra | credibilidad 0..+6, apoyo +2 si ≥3 aciertos |
| finalPrep | «Seis sillas»: recoger seis sillas por la plaza y llevarlas al corro (70 s, movimiento 3D real) | WASD, Shift | organización 0..+8 |
| finalSpeech | Mitin: rematar 12 frases y mantener la atención (cheer/boo del público) | Espacio | apoyo 0..+6 |

Reglas: un minijuego nunca resta; saltar (`X`) o abandonar no aplica nada; `R` repite; el bonus se registra en `state.minigames` una sola vez y solo durante su misión (`recordMinigame`). Cinemáticas: `state.seen`, marcadas y guardadas al empezar (recargar a mitad reanuda después, en punto seguro); se conservan tras el reintento del checkpoint. Duración medida de M3 pendiente.

## M3 · campaña completa (pendiente)

Objetivos 15 + 20 + 25 + 20 + 25 + 20 = 125 minutos, pendientes de validación. La duración se medirá en primeras partidas separando actividad, pausa, inactividad y repetición. No se deduce de la longitud del guion. Reescribir y ampliar misiones sobre sistemas ya verificados; evitar relleno.

## M4 · arte, audio y pulido (parcial)

Props de Blender reproducibles, paleta, balbuceo y placeholders animados ya disponibles como base de M1. Pendientes personajes propios riggeados, Quaternius/retargeting, clips reales validados, sombreado final, efectos/ambiente y revisión auditiva humana. Criterio: todas las rutas del catálogo resueltas; locomoción y gestos verificados; rendimiento medido antes de optimizar.

## M5 · verificación de entrega (pendiente)

Completar campaña ganadora, perdedora y remontada sin debug; guardado/carga, fallos de almacenamiento, interrupciones en todas las escenas, regresiones de diálogos y transiciones. Build offline y medición a 1080p en hardware identificado. No llamar campaña terminada al build de M1.

## Misiones implementadas

El inicio de cada obligatoria exige la finalización de la anterior. `src/data/campaign.js` es la fuente ejecutable. Sin recompensas repetibles. Recuperación: último punto seguro, inicio de escenario y misión no finalizada; las conversaciones/llamada interrumpidas se repiten sin efectos parciales.

| ID | Objetivo / finalización | Consecuencias |
|---|---|---|
| phone | Leer vídeo y aceptar la idea | Desbloquea llamada; convocatoria etiquetada ficción |
| call | Convencer a Lola, Dani y Nico | Cargo, relación y estadísticas según cada elección |
| register | Nombre, color y lema; registro cómico | Identidad persistente; abre salida |
| leave | Interactuar con puerta | Transición a plaza |
| neighbor | Escuchar a Marisa y responder | Memoria y apoyo/credibilidad/alcance |
| program | Elegir una propuesta con coste | Compromiso excluyente; penalización si prometiste ambas |
| speech | Apertura, argumento, cierre y timing | Coherencia y ejecución; reacción visible; alcance separado |
| aftermath | Volver a Marisa y oír reacción | Recupera memoria y evalúa discurso; fin del slice |
| Paco (opcional) | Disponible en plaza; conversar una vez | Escuchar petición de costes o pedir sillas; memoria, apoyo |

## Lista propuesta para ampliar (diseño, no implementada)

| Cap. | Misión obligatoria | Inicio → fin | Consecuencia y recuperación |
|---|---|---|---|
| 1 | La foto sin bandera | Registro → hacer foto con equipo | Identidad; repetir toma interrumpida |
| 2 | Mesa de cocina | Equipo fundado → reunir amigos en sede | Relación según cargo; checkpoint antes de reunión |
| 2 | La cuenta de Lola | Reunión → cerrar tres partidas presupuestarias | Programa y coste; borrador descartable hasta confirmar |
| 2 | Seis sillas | Presupuesto → pedir/recoger sillas en plaza | Organización; inventario persistente por silla/grupo |
| 3 | Tres maneras de ver un banco | Plaza abierta → escuchar vecina, repartidor y estudiante | Conocimiento de audiencias; cada charla guardada |
| 3 | Turno de palabra | Tres charlas → moderar conflicto de terraza | Coherencia/relaciones; reiniciar conversación actual |
| 3 | Primer discurso | Propuesta → discurso y reacción | Mecánica del slice; repetir solo si se interrumpe |
| 4 | La marca del suelo | Comunicación → encuadrar vídeo en lugar 3D | Tema y alcance; reiniciar toma, no penalizar abandono |
| 4 | El trend de las sillas | Vídeo → secuencia de poses/timing | Alcance vs credibilidad; crítica según programa |
| 4 | Fuera de contexto | Trend → responder a malentendido en calle | Confianza; checkpoint antes de decisión |
| 5 | La libreta de Marisa | Promesas acumuladas → rendir cuentas | Reparación admitiendo costes; checkpoint recuperable aquí |
| 5 | Nadie dimite antes de comer | Crisis → resolver conflicto entre dos cargos | Organización/relaciones; charla transaccional |
| 5 | Debate de salón | Conflicto resuelto → tres rondas con rivales ficticios | Programa/recuerdos; reinicio completo de debate |
| 6 | Última vuelta al barrio | Previsión electoral visible → dos contactos | Margen real para recuperar apoyo; guardado por contacto |
| 6 | El último mitin | Contactos → discurso final | Resultado determinista; checkpoint no sobrescrito |
| 6 | La noche de las sillas | Mitin → recuento, victoria o derrota | Razones y reintento útil; victoria/créditos/menú |

Opcionales previstos: persiana de Paco (comercio/organización), carteles torcidos con Nico (relación), revisar facturas con Lola (costes), desactivar filtros con Dani (credibilidad). Cada uno una vez, accesible antes de cierre, con guardado transaccional; ninguno necesario para hacer posible remontar.
