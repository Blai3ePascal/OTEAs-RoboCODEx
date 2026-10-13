# Servicio de salas

Worker ESM sin dependencias de ejecución. El servidor no ejecuta código de robots: el navegador del organizador ejecuta una batalla normal y publica fotogramas y resultados. El servicio mantiene un registro por sala con control optimista de versión en D1.

- Entrada: `rooms-worker.js` (exportación `default.fetch`).
- Binding requerido: `DB` (D1).
- Migración inicial: `drizzle/0000_rooms.sql` y su diario. Los mismos SQL se usan en las pruebas desde `../migrations/0000_rooms.sql`. No modifiques una migración aplicada; añade otra para futuras versiones.
- `hosting.json` conserva la identidad del servicio publicado de OTEA; colócalo como `.openai/hosting.json` al desplegar ese mismo servicio con Sites. Para otro alojamiento o proyecto crea su configuración propia.
- Artefacto Sites: `dist/server/index.js` copiado desde `rooms-worker.js`, `dist/.openai/hosting.json` y `dist/drizzle/`.
- CORS permitido: `https://blai3epascal.github.io`. Cambia también `ROOM_SERVICE` en `../src/rooms.js` si cambias de servidor.
- Las salas caducan en seis horas. La limpieza de registros caducados se ejecuta al crear o entrar en salas; los registros caducados no permiten acceso aunque aún no hayan sido eliminados físicamente.
- Una pestaña organizadora puede recuperar su token en la misma sesión de navegador. Si se interrumpe la simulación, debe detener y reabrir; no hay continuación de una JVM/worker desaparecida.

Pruebas locales desde la raíz: `npm test`. Prueba contra publicación: `node scripts/verify_rooms.mjs` (crea una sala efímera y la cierra). No registra contraseñas, tokens ni código en consola.

Código propio MIT; Cloudflare Workers/D1 y el alojamiento son servicios, sin bibliotecas externas redistribuidas aquí. Las licencias del resto del proyecto se mantienen en sus avisos.
