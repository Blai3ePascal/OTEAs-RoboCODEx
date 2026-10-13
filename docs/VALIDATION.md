# Validación de la candidata 0.1.0

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
