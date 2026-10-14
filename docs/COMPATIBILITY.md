# Compatibilidad

## Java real

CheerpJ 4.3 carga una JVM Java 17 en un iframe. Eclipse ECJ 3.46.0 compila el fuente a `.class` en el sistema de archivos virtual del navegador. `ArenaBridge` usa la API de control del motor original sin modificar: `RobocodeEngine`, `RobotSpecification`, `BattleSpecification` y `BattleAdaptor`. Las instantáneas reales del motor alimentan el lienzo moderno.

Compatibilidad del lenguaje: Java 17, clases, métodos, condiciones, bucles, tipos y bibliotecas estándar de la JVM disponibles en CheerpJ. No es un analizador de un subconjunto de Java. Los robots importados deben tener una clase pública y ser detectables por el repositorio de Robocode. Los robots pueden extender `Robot` o `AdvancedRobot`. Las versiones de Java posteriores a 17 no están activadas.

La importación actual acepta un `.java` por robot. No importa JAR arbitrarios, carpetas multifuente, equipos `.team` ni archivos de datos. Puede compilarlos solo si sus dependencias ya están disponibles en el entorno; en otro caso ECJ informa del error. La simulación usa API/física/eventos y puntuaciones Robocode, pero su ejecución en la JVM del navegador necesita validación de rendimiento por dispositivo. El modo headless no reproduce `onPaint` ni interfaces gráficas propias de los robots.

Los límites por tiempo total o turnos abortan la partida y la registran como empate, sin inventar puntuaciones parciales. La semilla editable solo pertenece al motor web; las posiciones Java son aleatorias según el motor original. Los obstáculos del motor educativo no se inyectan en Robocode.

## Python y JavaScript reales

Python: CPython compilado a WebAssembly a través de Pyodide 0.27.7. JavaScript: `AsyncFunction` dentro de un worker. El programa define `run(robot)` asíncrono. No hay traducción a Java ni pseudocódigo disfrazado de otro lenguaje.

API común: `ahead(n)`, `back(n)`, `turnRight(n)`, `turnLeft(n)`, `turnGunRight(n)`, `turnGunLeft(n)`, `turnRadarRight(n)`, `turnRadarLeft(n)`, `fire(n)`, `wait(n)`. Cada orden debe esperarse con `await`.

Consultas: `getEnergy()`, `getX()`, `getY()`, `getHeading()`, `getGunHeading()`, `getRadarHeading()`, `getTime()`. JavaScript dispone también de `getGunHeat()`.

JavaScript registra eventos con `robot.onScannedRobot(async e => ...)`, `robot.onHitWall(...)`, `robot.onHitByBullet(...)`. Python puede definir funciones globales asíncronas `onScannedRobot(e)`, `onHitWall(e)` y `onHitByBullet(e)`. Los eventos se atienden entre órdenes, no durante una orden de movimiento. En Python el código del evento puede usar el objeto global `robot`.

Un worker que deja de emitir órdenes durante cinco segundos activos se detiene. El arranque de Pyodide permite 90 segundos. Pausar no es una forma de probar programas sin límites: el botón Detener siempre termina los workers. Solo se ofrece el entorno estándar cargado; instalar paquetes adicionales no está integrado.

## Reglas del motor educativo

Campo 800 × 800; norte = 0°, giro positivo horario, origen abajo a la izquierda. Energía inicial 100. Máximo movimiento: 8 px/turno, giro del cuerpo 10°/turno, cañón 20°/turno y radar 45°/turno. No se modela la aceleración original ni el límite de giro dependiente de la velocidad. Órdenes bloqueantes, giro del cuerpo arrastra cañón/radar y giro del cañón arrastra radar.

Disparo de potencia `p` entre 0.1 y 3: coste `p`, velocidad `20 - 3p`, daño `4p + 2 max(0,p-1)`, recompensa de impacto `3p`, calor `1+p/5` y refrigeración configurable. Los obstáculos bloquean movimiento y proyectiles. No hay colisión bala contra bala. Las colisiones entre tanques se aproximan mediante un radio de 18 px. Un radar detecta un rival cuando barre su dirección; no se modela la oclusión del radar por obstáculos.

Victoria por último superviviente; si el límite de turnos deja varios supervivientes, empate. La puntuación educativa es daño infligido + energía restante + 50 por supervivencia. No equivale al ranking oficial de Robocode.

## Torneos

Hasta ocho participantes por torneo; 32 robots en el hangar. Liga: todos contra todos. Suizo: empareja por puntos y Buchholz con búsqueda de combinaciones sin repetir rivales cuando es posible; si no existe solución, señala una repetición necesaria. Para número impar se reparte bye, buscando primero a quien no lo ha recibido. Bye vale los puntos de victoria y no cuenta como combate.

Cada encuentro tiene un número configurable de partidas. Las victorias de partida pesan 3 y los empates 1 para determinar el resultado agregado del encuentro; después se aplican los puntos configurados de victoria/empate a la clasificación. En liga/suizo, un empate permanece empate. Eliminación usa el criterio elegido: puntuación agregada de combate y después sorteo reproducible por semilla, o semilla directamente. La tabla conserva el empate del combate y el cuadro identifica al clasificado.

No hay competición entre Java clásico y Python/JavaScript en un mismo motor. Bloques participan en ambos. No hay servidor multijugador, cuentas ni clasificaciones remotas. Los torneos se ejecutan con archivos aportados en el mismo navegador y sus resultados se exportan.

## Grabaciones

La grabación conserva como máximo 5000 fotogramas. Las partidas más largas producen una grabación parcial. La importación de repetición admite hasta 15 MB; las grabaciones muy grandes deben conservarse como archivo aunque excedan el límite del visor de esta versión. La copia JSON del proyecto guarda robots, preferencias, reglas y últimas actas, no sustituye la descarga de la repetición.

## Actualización de eventos 0.3.0

El editor usa siete eventos de combate. Los cuatro grupos antiguos siguen válidos y los nuevos son opcionales. Los manejadores de Java siguen siendo los originales. La arena web introduce prioridades estrictas (detección 10, choque 20, pared 30, recepción 40, acierto 50, choque de balas 55, fallo 60), evita la reentrada del mismo evento y reanuda la orden suspendida. Los eventos del mismo tipo pendientes se agrupan conservando los datos más recientes para limitar la cola. No equivale a todas las peculiaridades del gestor de eventos original (scan explícito recursivo, prioridades personalizadas, estado, teclado, ratón o fin de ronda). Esos métodos siguen disponibles en Java real conforme a su API.

Las métricas nuevas de las prácticas Java miden desplazamiento y giros por instantáneas consecutivas; los eventos de combate se verifican mediante la traza del motor web. La experiencia se conserva localmente y la ficha de práctica no es una credencial oficial ni una evaluación protegida frente a la modificación del almacenamiento.
