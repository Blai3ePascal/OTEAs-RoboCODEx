# OTEA’s RoboCODEx

**Construye. Programa. Combate.** Un laboratorio de programación de carros de combate para los talleres de OTEA, con un hangar, bloques visuales, lenguajes reales y torneos del aula.

[Informe de pruebas](docs/VALIDATION.md) · **[Abrir el laboratorio](https://blai3epascal.github.io/OTEAs-RoboCODEx/)** · [Guía del profesorado](docs/TEACHER.md) · [Compatibilidad](docs/COMPATIBILITY.md) · [Referencias y diseño](docs/DESIGN.md) · [Licencias de terceros](THIRD_PARTY_NOTICES.md)

Versión **0.2.0**. El entorno funciona dentro del navegador: el alumnado no instala Java, Python, máquinas virtuales ni servicios locales. GitHub Pages sirve los archivos estáticos. La JVM, el compilador y los intérpretes se ejecutan en el navegador.

## Qué puedes hacer

- Crear un tanque, cambiar su nombre, alias del creador, colores de cada pieza y chasis sin alterar sus capacidades.
- Programar con piezas encajables: movimiento, cuerpo, cañón, radar, disparos, esperas, repetición, bucles y condiciones de energía. Incluye eventos al detectar, colisionar y recibir un disparo.
- Ver el Java generado por los bloques y descargar un `.java` compatible con Robocode clásico.
- Editar, importar y validar programas **Java reales**. Eclipse ECJ compila el código y **Robocode 1.11.1 sin modificar** ejecuta las partidas mediante una **JVM Java 17 de CheerpJ**.
- Programar en **Python real** (CPython/Pyodide) o **JavaScript real** (worker del navegador), con una API de órdenes asíncronas para el motor educativo web.
- Ejecutar partidas de hasta ocho participantes, observar energía y movimiento, pausar la reproducción y avanzar por turnos. El campo es cuadrado y mantiene las coordenadas de Robocode.
- Personalizar escenarios del motor web con 20 mapas, ocho fondos y semillas reproducibles.
- Completar seis misiones verificadas mediante telemetría y un reto diario generado con una semilla común para la fecha de Madrid.
- Reunir a la clase en salas con contraseña para una batalla conjunta; conservar liga, suizo o eliminación directa; ajustar turnos, partidas por encuentro y puntos de victoria/empate; importar robots y exportar resultados CSV.
- Exportar y reproducir partidas, exportar proyectos completos y recuperar borradores.
- Regular efectos, fondo, estelas, radar, victoria y sonido; activar modo calma, texto grande y alto contraste. Se respeta `prefers-reduced-motion`.

## Dos motores: una diferencia importante

| | Robocode original | Arena web educativa |
|---|---|---|
| Lenguajes | Java; bloques convertidos a Java | Bloques, Python, JavaScript |
| Ejecución | Bytecode real en JVM, compilación ECJ | CPython/Pyodide o JavaScript real; bloques interpretados |
| API y física | API, eventos, física y puntuación originales | API educativa documentada, física simplificada |
| Obstáculos | Campo clásico libre | Mapas editables |
| Posiciones | Aleatorias del motor original | Aleatorias, reproducibles por semilla |
| Mezcla de lenguajes | Java y bloques | Python, JavaScript y bloques |

No se convierten los archivos Java mediante expresiones regulares ni se simula un supuesto compilador. El código Java se compila realmente. Las expresiones regulares solo identifican el nombre de clase/paquete para guardar el archivo; los errores los devuelve ECJ.

El modo original conserva `Robot`, `AdvancedRobot`, eventos y reglas. El adaptador realiza las partidas en modo headless: no representa dibujos `onPaint`, ventanas Swing de robots ni sonido nativo. Los robots que dependen de archivos adicionales, equipos `.team` o bibliotecas externas requieren ampliar la importación actual de un archivo fuente por robot. El código del lenguaje y la compatibilidad de su entorno de ejecución son asuntos distintos. [Límites completos](docs/COMPATIBILITY.md).

Robocode Tank Royale es la referencia para un futuro protocolo multilenguaje común. Su API y arquitectura son distintas del Robocode clásico; no se presenta como compatible con los `.java` antiguos. No hay todavía encuentros que mezclen Java clásico con Python/JavaScript en un mismo motor.

## Empezar en una clase

1. Abre el laboratorio y entra en **Misiones → Hola, movimiento**.
2. Cambia el bloque avanzar de 50 a 100 y pulsa **Probar en arena**.
3. Comprueba el resultado, explica el parámetro y prueba otro valor.
4. Continúa con giro, energía, radar, bucles y eventos.
5. En el taller, abre **Código real** para observar la equivalencia en Java.
6. Antes de cerrar o cambiar de equipo, descarga el proyecto desde **Materiales → Tus proyectos**.

Para un torneo clásico, importa los `.java`, elige **Original · Java y bloques**, selecciona participantes y pulsa **Validar y empezar**. La primera descarga de la JVM y Python requiere conexión y puede tardar. Comprueba antes de la clase que la red permite sus CDN.

## Guardado y privacidad

Robots, reglas de arena, preferencias y últimas actas de torneo quedan en `localStorage` con una copia de sesión en `sessionStorage`. Las preferencias pequeñas también se guardan en una cookie de sesión `oteaSession` (`SameSite=Lax`, `Secure`). El código no se introduce en cookies: su límite de tamaño no permite conservar proyectos.

Cerrar una sesión no borra la copia local normal. Borrar los datos del sitio, cambiar de navegador, usar modo privado o agotar el almacenamiento puede eliminarla. La exportación JSON es la copia transportable. Los borradores incompletos se conservan aunque aún no puedan ejecutarse.

No hay cuentas, chat, publicidad, analítica, pagos ni clasificaciones públicas. La compilación no envía el programa a un servidor. La carga de CheerpJ y Pyodide sí realiza peticiones a sus CDN. Cada lenguaje recibe solo el estado del tanque y sus eventos. El código importado se ejecuta en un worker o un iframe; Java/Python no acceden al sistema de archivos real del ordenador. No se promete aislamiento frente a código hostil: utiliza programas propios o revisados en el aula.

## Construcción y despliegue

El instalador aportado se conserva en `vendor/robocode-1.11.1-setup.jar` sin modificaciones. `scripts/build.py` lo extrae, compila el adaptador con su ECJ, empaqueta los recursos y genera `dist/` con un manifiesto SHA-256. Se mantienen versiones del archivo original.

```sh
npm test
python3 scripts/build.py
```

El desarrollo necesita Node para las pruebas y Java 17/Python para empaquetar; los usuarios finales solo necesitan un navegador. No hay dependencias npm de ejecución. La interfaz conserva las reglas de arena y las últimas actas; las repeticiones se descargan por separado. La acción [Pages](.github/workflows/pages.yml) ejecuta las pruebas, construye y publica `dist/` en GitHub Pages con permisos de despliegue mínimos.

## Créditos, referencias y licencias

- **Actividad Robocode UCM / OTEA**: [web original](https://www.ucm.es/robocode/). Itinerario y materiales históricos de los talleres. Contacto de la actividad: OTEA UCM. La página acredita la colaboración histórica con BRI XII y la Cátedra Almirante Don Juan de Borbón; reutilizar su identidad histórica no constituye una nueva declaración de patrocinio.
- **David Pacios Izquierdo (Pascal)**: [microguía en español](https://www.ucm.es/robocode/file/guiarobocode-pascal), *Robocode: Programación y estrategias*, 9 de noviembre de 2021. Base del recorrido cuerpo/cañón/radar, métodos, bucles y eventos. Se enlaza el original, sin reproducir sus páginas.
- **Robocode**, Mathew A. Nelson, Flemming N. Larsen y colaboradores: [página principal](https://robocode.sourceforge.io/), [descargas](https://sourceforge.net/projects/robocode/files/), [fuentes](https://github.com/robo-code/robocode), [API Robot](https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html). Motor/API y distribución original: **Eclipse Public License 1.0**. [Texto conservado](licenses/robocode-epl-v1.html).
- **RoboWiki** y su comunidad: [Tu primer carro](https://robowiki.net/wiki/Robocode/My_First_Robot), [wiki](https://robowiki.net/wiki/Main_Page). Enlaces de consulta; no se redistribuye su contenido.
- **Robocode Tank Royale**: [fuentes](https://github.com/robocode-dev/tank-royale), [arquitectura](https://robocode.dev/articles/tank-royale.html), [APIs multilenguaje](https://robocode.dev/api/apis.html). Referencia técnica, Apache-2.0, no se incluye su servidor.
- **Scratch**, Scratch Foundation / MIT: [editor](https://scratch.mit.edu/projects/editor/?tutorial=getStarted), [ideas](https://scratch.mit.edu/ideas). Inspiración del editor de piezas y aprendizaje por exploración. Este proyecto no incorpora código, sprites ni marcas de Scratch y no se anuncia como editor oficial de Scratch.
- **OGame**, Gameforge: [lobby español](https://lobby.ogame.gameforge.com/es_ES/). Referencia de inmersión, mundo visual e identidad del jugador. No se copia código, ilustraciones, logotipo, textos ni recursos del juego.
- **Urban Rivals**, Acute Games: [presentación](https://www.urban-rivals.com/signup/). Referencia de dirección artística, personajes, paneles de juego y sesiones breves. No se copian cartas, ilustraciones, textos, logotipo ni recursos del juego.
- **CheerpJ 4.3**, Leaning Technologies: [documentación](https://cheerpj.com/docs/overview.html), [licencia](https://cheerpj.com/docs/licensing). JVM cargada desde el CDN oficial bajo **CheerpJ Community License** en este proyecto público de código abierto, con atribución. No se redistribuye CheerpJ ni se reetiqueta como MIT. Autohospedaje, productos comerciales fuera del alcance Community o usos institucionales específicos deben evaluarse con el proveedor.
- **OpenJDK 17**: símbolos de las bibliotecas estándar empaquetados sin modificar para que ECJ pueda compilar en el sistema virtual de CheerpJ. GPL-2.0 con Classpath Exception; [fuentes](https://github.com/openjdk/jdk17u), textos conservados en `licenses/openjdk17-*` y versión/hash en `runtime/jdk17-origin.json` del despliegue. No se añade este archivo de símbolos al classpath de ejecución.
- **Eclipse ECJ 3.46.0**: compilador incluido en la distribución original, EPL-2.0. [Fuentes JDT](https://github.com/eclipse-jdt/eclipse.jdt.core).
- **Pyodide 0.27.7**, Pyodide contributors / Mozilla: [documentación](https://pyodide.org/en/0.27.7/), [licencias](https://github.com/pyodide/pyodide/blob/0.27.7/LICENSE). MPL-2.0 y avisos de componentes asociados. **CPython** conserva PSF License y sus avisos. No se importan librerías de terceros del alumnado en esta primera versión.

El código y los SVG nuevos de este proyecto tienen **licencia MIT**. Los JPG/PNG históricos procedentes de la web UCM conservan sus titulares y no se relicencian como MIT. Se reutilizan en el contexto de la actividad solicitado por su organizador; no se ha identificado una licencia abierta independiente para esas imágenes. Los terceros incluidos en Robocode mantienen sus propias licencias. Consulta [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) y el inventario de avisos extraídos de los JAR.

No se modifica el código del motor Robocode: el adaptador llama a su API pública de control y representa sus instantáneas con una nueva interfaz. Si se modifica en el futuro un componente EPL, deben conservarse avisos y cumplirse las obligaciones de esa licencia para las modificaciones distribuidas.

## Salas del aula y batalla conjunta

El modo principal de Torneos reúne entre dos y ocho tanques en una sola partida. Se puede jugar localmente con la selección del hangar o crear una sala compartida por nombre y contraseña; los alumnos se unen desde sus propios navegadores e inscriben su robot. El organizador puede añadir competidores automáticos, retirarlos, elegir motor, mapa, fondo y límite de turnos, y comenzar manualmente o cuando se alcanza el número de inscritos elegido. La inscripción se cierra al comenzar. Los formatos anteriores de liga, suizo y eliminación siguen en «Formatos de liga anteriores».

La sala usa un pequeño servicio Worker con D1: [servicio de salas](https://otea-robocodex-salas.jammy-mochi-4804.chatgpt.site), separado de los archivos estáticos de GitHub Pages. Su código está en `service/rooms-worker.js` y el esquema en `migrations/0000_rooms.sql`. La web conserva su dirección y no requiere instalaciones en los ordenadores. El organizador ejecuta y compila los robots en su navegador; el servicio sólo almacena temporalmente las inscripciones y transmite el último fotograma y el resultado. Los espectadores reciben actualizaciones aproximadamente cada 1–2 segundos. La pestaña del organizador debe permanecer abierta. Si se interrumpe, puede recuperar su sesión, detener la batalla de sala y reabrir la inscripción. No se reanuda automáticamente una simulación interrumpida.

Las salas caducan a las seis horas y el organizador puede cerrarlas antes. La contraseña se verifica con PBKDF2-SHA256, sal aleatoria y 100 000 iteraciones. Los tokens son aleatorios, se almacenan como hashes en servidor y la sesión del navegador se guarda en sessionStorage; la contraseña no se guarda. Hay límites de intentos, tamaño y participantes, y actualización con control de versión para evitar perder inscripciones simultáneas. La pertenencia a una sala no permite iniciar, configurar, retirar rivales ni publicar resultados: sólo el organizador tiene esos permisos. Los resultados proceden del navegador del organizador, no de un árbitro independiente; este modo es para talleres y encuentros de aula.

Al inscribir un tanque se comparten su código, nombre y alias con el organizador durante la vigencia de la sala. Los otros alumnos reciben metadatos, fotogramas y resultados, sin acceso al código de sus compañeros. Usa alias cuando sea conveniente; no se solicitan cuentas, correos ni datos del centro. El resto del proyecto permanece en el navegador.

## Mapas y personalización

Hay **20 mapas preconfigurados**, incluido el campo libre predeterminado. Los demás combinan cajas, pasillos, columnas y estructuras abiertas en L, T y H. Se certifica la conectividad en una cuadrícula de 10 píxeles con margen de tanque de 22 píxeles; también se rechazan mapas personalizados con zonas cerradas antes de iniciar una batalla. Las posiciones iniciales dejan margen respecto de obstáculos y al menos 80 píxeles entre centros de tanques. Las pruebas cubren los 20 mapas con 100 semillas y ocho tanques: 16 000 posiciones iniciales. Una colisión posterior causada por el programa no implica que el mapa esté cerrado.

Los mapas con obstáculos pertenecen al motor educativo web (bloques, Python y JavaScript). El motor Java original sigue utilizando su campo libre; la interfaz lo indica y desactiva el mapa. Los ocho fondos procedurales originales funcionan en ambos motores y en partidas normales y de sala. Cada tanque permite colorear carrocería, orugas, dibujo de orugas, cubierta, torreta, cañón, boca, radar y bordes. Son cambios visuales, sin ventajas. El alias del creador acompaña al tanque en pista, resultados, exportaciones y cartel de victoria. Se añaden opciones de cuadrícula, barras de energía, alias en pista y acento de interfaz. Las preferencias y colores conservan el guardado local y la exportación del proyecto.

## Pruebas de salas

`npm test` incluye pruebas del servicio con SQLite real: permisos, contraseñas, concurrencia de ocho inscripciones, límites, caducidad, reapertura, compatibilidad y transmisión de resultados. `node scripts/verify_rooms.mjs` prueba una sala efímera contra el servicio publicado y la elimina al terminar. GitHub Actions exige ambas comprobaciones antes de publicar GitHub Pages, además de la compilación y las partidas Java originales consecutivas.
