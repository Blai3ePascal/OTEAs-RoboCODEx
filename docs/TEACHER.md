# Taller del aula

## Antes de llegar

Abre el laboratorio con la red del centro. Comprueba Bloques, Java y Python: la primera carga de sus runtimes utiliza Internet. Usa un navegador moderno de escritorio. Prepara un proyecto JSON exportado para recuperar los robots y revisa que no contenga información personal del alumnado.

La interfaz tiene modo calma, alto contraste, texto grande y navegación por teclado. Los bloques se pueden añadir con un clic y ordenar con botones: arrastrar no es obligatorio. El mapa visual requiere un puntero en esta versión. Para quien no pueda usarlo, selecciona los escenarios predefinidos. El campo dispone de telemetría textual, pero el combate no tiene todavía una narración accesible completa para lectores de pantalla.

## Ruta breve

1. **Movimiento:** cambia avanzar 50 por 100. ¿Qué cambia y qué permanece igual?
2. **Giro:** prueba 90 frente a 180. Separa rumbo y posición.
3. **Disparo:** compara potencia y espera. Observa energía y calor.
4. **Radar:** gira, detecta y dispara desde el evento.
5. **Bucles:** cuatro lados con dos órdenes dentro de repetir.
6. **Eventos:** choca a propósito y añade una respuesta.
7. **Java:** muestra el código generado. Identifica clase, `run`, bucle y evento. Descarga el archivo y compáralo con la microguía de Pascal.

Las misiones no se completan por pulsar un botón: requieren distancia, giro, disparos u otros valores reales de la telemetría. La misión activa se comprueba cuando se prueba el robot Entrenamiento. Cambiar a una partida libre deja de evaluar esa misión. Puedes volver al taller y corregir el programa tantas veces como quieras.

## Crear robots

En **Taller** pulsa ＋. Escribe un indicativo, elige color/chasis y programa. Para bloques anidados pulsa **Añadir aquí** y después una pieza. Para volver al nivel principal usa **Añadir al programa principal**. Los eventos tienen programas independientes. Para editar código pulsa **Código real**; cambiar de lenguaje carga su ejemplo. Conserva antes una copia del código que quieres guardar. Volver a bloques recupera tus bloques, no convierte automáticamente el código escrito.

Los `.java` se validan con el compilador real. Una clase o un paquete deben ser distintos de los de otro participante. Usa `await` en cada orden de Python/JavaScript; un bucle sin órdenes se interrumpe. El lenguaje elegido y la API del juego son diferentes: un programa de Tank Royale no se importa como robot clásico.

## Torneo

Importa fuentes y selecciona el motor correspondiente. Valida todos antes de empezar. Prueba primero una liga corta con 300 turnos por partida; después ajusta a la duración disponible. Suizo permite menos encuentros que una liga completa. La eliminación conserva en el acta los empates y explica su desempate.

No uses la posición del torneo como una nota automática: un robot aleatorio o heredado puede ganar sin que el autor haya entendido el programa. Pide que el estudiante cambie un parámetro, explique una reacción o prediga un movimiento.

## Salir sin perder el trabajo

En **Materiales → Tus proyectos** descarga el JSON. Para el robot individual, descarga su Java/Python/JS en el taller. Para actas, exporta el CSV. Borrar los datos del navegador elimina borradores y distintivos. Las reglas de arena y las últimas actas se recuperan al volver a abrir la web. Las repeticiones son instantáneas visuales: no contienen todos los programas ni sustituyen la copia del proyecto.

## Una batalla con toda la clase

1. En Torneos, elige motor, mapa, fondo y turnos. Campo libre es el valor inicial.
2. Escribe un nombre de sala y contraseña de al menos seis caracteres y pulsa Crear sala. Comparte esos dos datos con los alumnos.
3. Cada alumno pulsa Unirme, selecciona su tanque e Inscribir mi tanque. Escribe antes su nombre y alias en Taller. Se pueden añadir robots del hangar del organizador para completar la partida (máximo ocho en total).
4. Pulsa Iniciar batalla de sala, o elige inicio automático al alcanzar de dos a ocho tanques. Todos combaten simultáneamente en una sola partida. Mantén abierta la pestaña organizadora.
5. Los alumnos pueden Ver batalla. Al terminar, vuelve a Torneos para resultados y CSV. Reabre la inscripción para otra partida o cierra la sala. Las salas caducan en seis horas.

Si se recarga la pestaña organizadora durante el combate, pulsa Detener batalla de sala y Reabrir inscripción: no se conserva el estado de ejecución de la JVM ni de los workers. Los mapas con bloqueos funcionan en el motor Web. Java usa su motor clásico sin obstáculos; los fondos y la pintura funcionan también ahí. Los formatos de liga anteriores están en su desplegable.
