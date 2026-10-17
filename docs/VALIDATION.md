# Validación de OTEA’s RoboCODEx 0.2.0

Fecha: 13 de octubre de 2026.

| Comprobación | Resultado | Entorno |
|---|---|---|
| 18 pruebas del motor educativo | PASS | Node 24 local; Node 22 GitHub Actions |
| Colocación aleatoria, 100 semillas, 8 carros de combate y obstáculos | PASS | Prueba automática |
| Secuencias, radar, calor, daños, eventos, límites y empates | PASS | Pruebas automáticas |
| Emparejamientos de liga y suizo sin repetir cuando existe solución | PASS | Pruebas automáticas |
| Recuperación de borradores incompletos | PASS | Validación de esquema automática |
| Compilación Java real y combate del motor Robocode 1.11.1 | PASS | JVM Java 17 local y GitHub Actions |
| Compilación con símbolos OpenJDK separados | PASS | JVM Java 17 local y GitHub Actions |
| Tres combates Java consecutivos, incluidos dos límites de turnos: sin bloqueo de parada | PASS | JVM Java 17 local; también exigido por GitHub Actions |
| Compilación Java real con ECJ en CheerpJ | PASS | Chrome sobre la web desplegada |
| Misión: cambiar avanzar 50 a 100 y obtener el logro al recorrer 100 | PASS | Chrome sobre la web desplegada |
| Importación y validación de Python y JavaScript reales | PASS | Chrome sobre la web desplegada |
| Python emite órdenes y avanza 600 turnos con otro carro de combate | PASS | Chrome sobre la web desplegada |
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
- 20 mapas distintos, campo libre predeterminado, conectividad con margen de carro de combate y 100 semillas de ocho carros de combate por mapa (16 000 posiciones seguras). Rechazo de un recinto personalizado cerrado.
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
- Un proyecto de la versión anterior sigue abriendo sus carros de combate. Seleccionar el evento nuevo de choque y añadir Retroceder genera onHitRobot en la vista Java sin errores.
- La misión de interrupción del radar marca sus tres pasos por ejecución, acredita el disparo antes del giro completo y la reanudación. Repetirla conserva los mismos XP.
- La colisión con carro de combate marca sus tres pasos en bloques, JavaScript real y CPython/Pyodide; el evento retrocede 60 y gira 90°. La paleta Neón se habilita a 500 XP y se aplica a las piezas.
- Opciones: color de explosión violeta, ondas de choque, plasma, tamaño espectacular y duración cinemática se conservan tras recargar. La prueba visual anima la explosión sin avanzar la simulación. [Captura de la prueba visual](screenshots/effects-20261014.jpg).

- La misión «Del puzzle al compilador» también se verificó en Chrome: ECJ compila, el motor Robocode mueve el carro de combate, los tres pasos se acreditan y la experiencia habilita el nivel Operador.

### Corrección del menú y visibilidad de la destrucción

- Ajustes se divide en Aspecto, Fuego y explosiones y Accesibilidad. El encabezado y el botón Listo permanecen visibles; fieldsets, rejillas y controles se ajustan al ancho disponible.
- La destrucción se detecta también cuando el primer fotograma recibido por un espectador ya contiene un carro de combate muerto. Al retroceder el contador de turnos se reinician los identificadores de efectos para la siguiente partida.
- El resultado y el siguiente encuentro esperan el tiempo visual de la explosión. No se agregan turnos ni se cambia el resultado; el modo sin efectos y la preferencia de movimiento reducido continúan inmediatamente.
- 52 pruebas automáticas: se añade una destrucción por daño real de proyectiles, la llegada tardía de un espectador/reinicio de partida y la duración de la transición visual.

- Menú publicado: 12 comprobaciones reales en marcos de 320, 390, 768 y 1280 píxeles (tres pestañas por tamaño). Ninguna presenta desbordamiento horizontal; Cerrar y Listo permanecen dentro del viewport. [Captura del menú corregido](screenshots/settings-responsive-20261015.jpg).
- La misión de variables también compila y ejecuta en CheerpJ, completa sus tres criterios y conserva la progresión.
- Al agotarse un tiempo de compilación, el cliente descarta la JVM pendiente para que una nueva prueba cargue un entorno limpio. El estado deja de indicar una compilación en curso. No se modifica el motor ni el compilador originales.

- La misión de métodos completa sus tres pasos en la JVM del navegador tras volver a cargar el entorno: definición y llamada, compilación real, 320 píxeles y 180° de giro. El progreso alcanza Mecánico de eventos, 1700 XP.
- 53 pruebas automáticas finales: la práctica de métodos admite argumentos distintos de 80 y sigue exigiendo código compilado y movimiento observado; una llamada sólo en comentarios no cuenta.
- La guía de pasos aparece antes del editor para poder leer las instrucciones al empezar la práctica.

- La destrucción real de una diana Java reveló que, durante las pausas entre fotogramas de la JVM, faltaba refresco del lienzo aunque hubiese partículas activas. El lienzo ahora anima a 30 FPS también durante un combate que está esperando fotogramas, usando el reloj visual actual sin alterar la simulación.
- 54 pruebas finales; se añade una comprobación de seguridad del dibujo cuando el tiempo del fotograma es anterior al nacimiento de una partícula. Las coordenadas siguen siendo finitas en los tres estilos.

- 55 pruebas finales: el worker JavaScript apunta usando el estado exacto del evento de detección y destruye una diana inmóvil por daño real. La arena espera la recepción del lote de eventos y la primera orden de su manejador antes de continuar; así el cañón no gira durante la entrega asíncrona del evento. La misma sincronización se usa con CPython.

- La carga fría de CheerpJ mostró un fallo temporal de acceso al paquete y un tiempo de compilación superior a dos minutos. El arranque fallido ya no conserva una promesa rechazada y la compilación dispone de cinco minutos antes de descartar el entorno. La validación técnica local y de GitHub sigue usando el motor original; no se equipara con la velocidad de un dispositivo escolar.

- La partida normal JavaScript publicada termina con victoria del cazador y destrucción de la diana en el turno 151. Una nueva partida después de la anterior también avanza y termina: la animación del último fotograma ya no detiene el bucle del juego.
- Iniciar una partida lleva la vista al campo; su tamaño se limita según la altura del viewport. Así los controles de preparación largos no dejan la explosión fuera de la pantalla.

- La grabación conserva también el último turno impar de una partida web. Ese último fotograma contiene la destrucción y permite repetir sus efectos sin omitir la muerte del carro de combate.

- Caso reproducible del motor original: NativeDeathProbe compila un cazador Java y ejecuta Robocode 1.11.1 en un campo de 800 × 800. En la ejecución registrada produjo 290 instantáneas; SittingDuck murió en el turno 140 y el cazador conserva 142 de energía. El extracto de cinco fotogramas conserva el paso de vivo a muerto: [repetición de la destrucción Java](fixtures/native-death.json), generada por [el programa de comprobación](../scripts/NativeDeathProbe.java).
- El visor identifica el motor de una repetición y muestra «Fin de reproducción» al terminar, sin registrar un empate nuevo ni conceder experiencia.

- 56 pruebas finales: el extracto real de Robocode genera exactamente una explosión en las coordenadas originales del robot destruido y conserva el fuego del chasis tras terminar los fotogramas.

- Comprobación visual publicada del extracto Java: el visor muestra Robocode original, SittingDuck fuera, Cazador con 142 de energía, supernova violeta, llamas y humo que continúan tras «Fin de reproducción». [Fotograma de la animación](screenshots/destruction-native-replay-20261015.jpg). Es una reproducción de instantáneas del motor original; no se presenta como otra compilación de CheerpJ.

## 15 de octubre · reacción de bloques y vista de combate

- 62 pruebas automáticas superadas, incluidas detección/disparo en el mismo turno, detecciones consecutivas antes de reanudar el movimiento y ausencia de doble movimiento por turno. Se conservan las pruebas de prioridades, reanudación, JavaScript real, daño, efectos, mapas, progreso y salas.
- Ciclo de pantalla completa nativa y alternativa verificado con un adaptador DOM: los nodos originales vuelven a su posición, conservan permisos y permiten repetir entrada/salida, ocultar el panel y salir con Escape. La geometría real se comprueba aparte en la versión publicada.
- La telemetría y el listado conservan sus nodos y solo actualizan textos que cambian. Se evita dibujar dos veces el mismo fotograma; las partículas siguen el ritmo de animación del navegador.
- Medición local orientativa del motor, sin dibujo: 20.000 turnos con ocho carros de combate y 3.069 detecciones en aproximadamente 100 ms. No es una medida de FPS de un ordenador escolar ni una promesa de latencia de red.

- Terminología unificada en interfaz, textos accesibles, eventos, misiones, mensajes de salas, exportaciones y guías: carro de combate / proyectil. Los identificadores de la API original y los nombres escritos por el alumnado se conservan.

- Comprobación publicada: iniciar/pausar, avanzar un turno exacto (17 → 18), ocultar/mostrar y salir conservando la partida. Ocho medidas reales de campo a 320, 390, 768 y 1280 píxeles, con panel abierto/cerrado: campo cuadrado, dentro del viewport, sin solapamiento ni desbordamiento. Resultados en `qa-combat-results.json`. Captura en `screenshots/combat-fullscreen-20261015.jpg`. La repetición de fotogramas del Robocode original también conserva su distintivo, telemetría y final correcto en la vista ampliada.

## 17 de octubre · identidad Java y duplicados

- 77 pruebas automáticas: identificación de la clase pública real, comentarios/cadenas/text blocks, alias diferentes, paquetes distintos, nombres generados por bloques, corrección sin modificar el original, referencias a la propia clase, paquetes inválidos, límites de nombre, compatibilidad del formato de salas y resultados con clases homónimas en paquetes diferentes. Se mantienen las 62 pruebas anteriores.
- Eclipse ECJ compila dos clases `Duel` en paquetes distintos a través de `ArenaBridge.compileNamed`, la entrada usada por el navegador. La copia conserva su constructor y una referencia cualificada a sí misma. Ambas participan juntas en 100 fotogramas del Robocode original. La prueba se incorpora a `scripts/verify_blocks_java.mjs` y conserva su registro en el directorio de build.
- La detección de duplicados precede al arranque de la JVM. La identidad no reconocida se deja al compilador para evitar confundir errores sintácticos con una clase repetida. No se cambian los identificadores de la API de Robocode ni el formato del servicio de salas.

- Verificación en Chrome de la publicación: Ver declaración selecciona `Nova` en la línea 4, ignorando una clase falsa dentro de un comentario. Un intento con dos pares duplicados abre la revisión con cero iframes JVM. Un paquete repetido deshabilita Aplicar; la propuesta válida se aplica y se deshace; duplicar un alias distinto conserva `public Nova()` y asigna un paquete libre. La corrección desde bloques conserva su editor y programa.
- Tras corregir las identidades, cuatro carros completan una partida real de 100 turnos en CheerpJ/Java 17, con los identificadores `aula.Nova`, `aula.copia2.Nova`, `otea.robots.RadarA` y `otea.robots.RadarA2`. Final por límite de turnos y daños visibles en la telemetría.
- Ocho mediciones de ficha/propuesta en viewports de 320, 390, 768 y 1280 píxeles: sin desbordamiento horizontal y con Aplicar y Cancelar accesibles. Resultados en `qa-java-identity-results.json`; captura en `screenshots/java-identity-20261017.jpg`. El proyecto del navegador se exporta antes y se restaura después de la prueba.

- La exportación Java usa el nombre de la clase pública real (`Nova.java`), aunque el alias del carro sea distinto. Se añade una prueba de este caso y de la exportación desde bloques.
