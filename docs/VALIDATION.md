# Validación de OTEA’s RoboCODEx 0.2.0

Fecha: 13 de octubre de 2026.

| Comprobación | Resultado | Entorno |
|---|---|---|
| 18 pruebas del motor educativo | PASS | Node 24 local; Node 22 GitHub Actions |
| Colocación aleatoria, 100 semillas, 8 tanques y obstáculos | PASS | Prueba automática |
| Secuencias, radar, calor, daños, eventos, límites y empates | PASS | Pruebas automáticas |
| Emparejamientos de liga y suizo sin repetir cuando existe solución | PASS | Pruebas automáticas |
| Recuperación de borradores incompletos | PASS | Validación de esquema automática |
| Compilación Java real y combate del motor Robocode 1.11.1 | PASS | JVM Java 17 local y GitHub Actions |
| Compilación con símbolos OpenJDK separados | PASS | JVM Java 17 local y GitHub Actions |
| Tres combates Java consecutivos, incluidos dos límites de turnos: sin bloqueo de parada | PASS | JVM Java 17 local; también exigido por GitHub Actions |
| Compilación Java real con ECJ en CheerpJ | PASS | Chrome sobre la web desplegada |
| Misión: cambiar avanzar 50 a 100 y obtener el logro al recorrer 100 | PASS | Chrome sobre la web desplegada |
| Importación y validación de Python y JavaScript reales | PASS | Chrome sobre la web desplegada |
| Python emite órdenes y avanza 600 turnos con otro tanque | PASS | Chrome sobre la web desplegada |
| Liga Python + JavaScript: finaliza, conserva empate, un punto cada uno | PASS | Chrome sobre la web desplegada |
| Suizo de 3 participantes y 2 rondas: reparte descansos distintos | PASS | Chrome sobre la web desplegada |
| Eliminación de 4 participantes: 3 encuentros y desempates identificados | PASS | Chrome sobre la web desplegada |
| Combate Java real en CheerpJ: 300 turnos, movimiento, disparos, energías 81/61 y empate por límite | PASS | Chrome sobre la web desplegada |
| Torneo Java: dos partidas consecutivas, empate y un punto por participante | PASS | Chrome sobre la web desplegada |
| GitHub Pages | PASS | GitHub Actions, despliegue público |

La prueba del motor original en navegador detectó dos diferencias respecto a la JVM de escritorio: ECJ necesitaba símbolos estándar explícitos y Robocode necesita inicializar un contexto AWT. Estas correcciones se incluyen en el adaptador y la página JVM. El combate posterior en navegador ha finalizado correctamente, con instantáneas del motor original y empate al alcanzar el límite configurado. No se identifica un PASS de escritorio con un PASS de navegador.

No se han realizado evaluación pedagógica con alumnado, auditoría de accesibilidad, pruebas con lectores de pantalla ni una matriz de dispositivos/redes escolares. No se afirma compatibilidad completa de equipos, archivos auxiliares, bibliotecas externas u otros SDK como Tank Royale. Véase COMPATIBILITY.md.

La parada por límite se solicita fuera del callback del turno del motor. La prueba secuencial evita que una parada bloquee el siguiente encuentro.

## Actualización 0.2.0: salas y personalización

- 30 pruebas automáticas correctas: las 18 anteriores y 12 adicionales de mapas, personalización y servicio con SQLite real.
- 20 mapas distintos, campo libre predeterminado, conectividad con margen de tanque y 100 semillas de ocho tanques por mapa (16 000 posiciones seguras). Rechazo de un recinto personalizado cerrado.
- API publicada comprobada con una sala efímera: creación, contraseña errónea, entrada desde otra sesión, inscripción, código visible sólo al organizador, permiso de inicio, cierre de inscripción durante la partida, fotograma compartido, resultado con alias y reapertura. Limpieza al terminar.
- Control de versión probado con ocho inscripciones simultáneas. Límites de tamaño, permisos, compatibilidad de motor, caducidad y límite de intentos comprobados.
- Alias y colores por pieza comprobados en validación, instantáneas y puntuación; preferencias conservan la recuperación del proyecto.

- Interfaz publicada: creación de sala y entrada desde dos pestañas independientes, competidor automático del hangar más alumno inscrito, inicio automático al llegar a dos, partida conjunta de 100 turnos en Almacén y recepción del resultado y alias.
- Edición visual comprobada desde la interfaz: nombre, creador y colores de torreta, orugas, cubierta, cañón, boca, radar y bordes.
- Correcciones derivadas de esta prueba: sincronización de motor, mapa y fondo en espectadores, cierre persistente del cartel del resultado y reapertura sin lanzar inmediatamente otra batalla automática. El motor original recibe la identidad Java completa para separar clases con el mismo nombre en paquetes distintos.

- La edición de reglas mantiene un borrador mientras se escribe y serializa sus cambios, para que la actualización periódica de sala no restaure un número antiguo ni pierda cambios rápidos de mapa/fondo. El cliente descarta respuestas de versiones antiguas.

- Comprobación final en dos pestañas: cambios rápidos a 300 turnos, campo libre y Bosque táctico llegan íntegros al espectador. Inicio manual, ejecución de JavaScript real y victoria de Echo Naranja en el turno 112, con «Creado por Equipo naranja» en ambos carteles. Cerrar el cartel del espectador permanece efectivo tras nuevas actualizaciones.
- Capturas de la interfaz publicada: [sala y clasificación](screenshots/rooms-lobby-20261013.jpg) y [cartel de ganador](screenshots/rooms-20261013.jpg).


## Actualización 0.3.0: interrupciones, efectos y ruta de aprendizaje

Fecha: 14 de octubre de 2026.

- 49 pruebas automáticas correctas: se conservan las 30 anteriores y se añaden 19 de interrupciones, prioridad de eventos, colisiones, misiones, progresión, telemetría Java y efectos.
- Un worker JavaScript real atiende la detección antes de terminar una orden pendiente y reanuda sus 360° completos. Una prueba adicional comprueba una interrupción de prioridad superior y evita recursión del mismo evento.
- Las nueve soluciones nuevas de bloques cumplen los tres pasos de sus misiones durante la simulación; no se conceden por pulsar marcas ni por pegar código sin ejecutarlo.
- ECJ compila los siete manejadores de combate generados, la orden scan() y las tres soluciones de las misiones Java contra los JAR del motor original.
- Animaciones comprobadas con reloj visual independiente del turno: una destrucción produce una sola secuencia, continúa después del último fotograma y no se repite al redibujar. Se comprueban tres estilos y desactivación de efectos.
- XP y distintivos se conceden una vez, conservan misiones antiguas y habilitan títulos, paletas y una ficha de evidencias. Importar una repetición no completa misiones.
- El servicio de salas conserva las cuatro familias nuevas de eventos sin cambiar el protocolo, las contraseñas, los mapas ni las migraciones.

Estas comprobaciones técnicas no sustituyen una evaluación del aprendizaje con alumnado. La ficha es un registro local, no una acreditación académica.


### Comprobación de la web publicada

- GitHub Actions aprobó las 49 pruebas, la API de salas publicada, la compilación de los siete manejadores y las tres soluciones Java y tres combates consecutivos del motor original.
- Un proyecto de la versión anterior sigue abriendo sus tanques. Seleccionar el evento nuevo de choque y añadir Retroceder genera onHitRobot en la vista Java sin errores.
- La misión de interrupción del radar marca sus tres pasos por ejecución, acredita el disparo antes del giro completo y la reanudación. Repetirla conserva los mismos XP.
- La colisión con tanque marca sus tres pasos en bloques, JavaScript real y CPython/Pyodide; el evento retrocede 60 y gira 90°. La paleta Neón se habilita a 500 XP y se aplica a las piezas.
- Opciones: color de explosión violeta, ondas de choque, plasma, tamaño espectacular y duración cinemática se conservan tras recargar. La prueba visual anima la explosión sin avanzar la simulación. [Captura de la prueba visual](screenshots/effects-20261014.jpg).

- La misión «Del puzzle al compilador» también se verificó en Chrome: ECJ compila, el motor Robocode mueve el tanque, los tres pasos se acreditan y la experiencia habilita el nivel Operador.

### Corrección del menú y visibilidad de la destrucción

- Ajustes se divide en Aspecto, Fuego y explosiones y Accesibilidad. El encabezado y el botón Listo permanecen visibles; fieldsets, rejillas y controles se ajustan al ancho disponible.
- La destrucción se detecta también cuando el primer fotograma recibido por un espectador ya contiene un tanque muerto. Al retroceder el contador de turnos se reinician los identificadores de efectos para la siguiente partida.
- El resultado y el siguiente encuentro esperan el tiempo visual de la explosión. No se agregan turnos ni se cambia el resultado; el modo sin efectos y la preferencia de movimiento reducido continúan inmediatamente.
- 52 pruebas automáticas: se añade una destrucción por daño real de balas, la llegada tardía de un espectador/reinicio de partida y la duración de la transición visual.

- Menú publicado: 12 comprobaciones reales en marcos de 320, 390, 768 y 1280 píxeles (tres pestañas por tamaño). Ninguna presenta desbordamiento horizontal; Cerrar y Listo permanecen dentro del viewport. [Captura del menú corregido](screenshots/settings-responsive-20261015.jpg).
- La misión de variables también compila y ejecuta en CheerpJ, completa sus tres criterios y conserva la progresión.
- Al agotarse un tiempo de compilación, el cliente descarta la JVM pendiente para que una nueva prueba cargue un entorno limpio. El estado deja de indicar una compilación en curso. No se modifica el motor ni el compilador originales.

- La misión de métodos completa sus tres pasos en la JVM del navegador tras volver a cargar el entorno: definición y llamada, compilación real, 320 píxeles y 180° de giro. El progreso alcanza Mecánico de eventos, 1700 XP.
- 53 pruebas automáticas finales: la práctica de métodos admite argumentos distintos de 80 y sigue exigiendo código compilado y movimiento observado; una llamada sólo en comentarios no cuenta.
- La guía de pasos aparece antes del editor para poder leer las instrucciones al empezar la práctica.

- La destrucción real de una diana Java reveló que, durante las pausas entre fotogramas de la JVM, faltaba refresco del lienzo aunque hubiese partículas activas. El lienzo ahora anima a 30 FPS también durante un combate que está esperando fotogramas, usando el reloj visual actual sin alterar la simulación.
- 54 pruebas finales; se añade una comprobación de seguridad del dibujo cuando el tiempo del fotograma es anterior al nacimiento de una partícula. Las coordenadas siguen siendo finitas en los tres estilos.

- 55 pruebas finales: el worker JavaScript apunta usando el estado exacto del evento de detección y destruye una diana inmóvil por daño real. La arena espera la recepción del lote de eventos y la primera orden de su manejador antes de continuar; así el cañón no gira durante la entrega asíncrona del evento. La misma sincronización se usa con CPython.
