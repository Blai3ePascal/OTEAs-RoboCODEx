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
