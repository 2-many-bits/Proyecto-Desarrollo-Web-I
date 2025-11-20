import {
    crearCurso,
    obtenerTodosLosCursos,
    obtenerCursoPorId,
    actualizarCurso,
    borrarCurso
} from './detallesCursosServices.js';

// Siguiendo la lógica de negocio, este archivo debe contener las funciones para obtener los datos del curso seleccionado y luego mostrar su información en la página plantilla correspondiente. Por lo tanto, se debe obtener el ID del curso seleccionado y luego mostrar su información en la página plantilla correspondiente. Si el curso seleccionado 


// --- Inicio de Pruebas de Funciones CRUD ---

async function probarFuncionesCRUD() {
    console.log("Iniciando pruebas de las funciones CRUD para cursos...");

    // 1. Probar crearCurso
    console.log("Prueba 1: Creando un nuevo curso...");
    const nuevoCurso = {
        nombre: "Curso de Prueba",
        descripcion: "Esta es una descripción de prueba.",
        categoria: "Pruebas",
        duracion: "1 hora",
    };
    const resultadoCrear = await crearCurso(nuevoCurso);
    if (!resultadoCrear.success) {
        console.error("Error en la prueba de crearCurso:", resultadoCrear.error);
        return; // Detener si la creación falla
    }
    const cursoId = resultadoCrear.id;
    console.log(`Curso de prueba creado con ID: ${cursoId}`);

    // 2. Probar obtenerTodosLosCursos
    console.log("\nPrueba 2: Obteniendo todos los cursos...");
    const resultadoObtenerTodos = await obtenerTodosLosCursos();
    if (resultadoObtenerTodos.success) {
        console.log("Cursos obtenidos:", resultadoObtenerTodos.data);
    } else {
        console.error("Error en la prueba de obtenerTodosLosCursos:", resultadoObtenerTodos.error);
    }

    // 3. Probar obtenerCursoPorId
    console.log(`\nPrueba 3: Obteniendo el curso con ID: ${cursoId}...`);
    const resultadoObtenerPorId = await obtenerCursoPorId(cursoId);
    if (resultadoObtenerPorId.success) {
        console.log("Curso obtenido por ID:", resultadoObtenerPorId.data);
    } else {
        console.error("Error en la prueba de obtenerCursoPorId:", resultadoObtenerPorId.error);
    }

    // 4. Probar actualizarCurso
    console.log(`\nPrueba 4: Actualizando el curso con ID: ${cursoId}...`);
    const datosActualizados = {
        nombre: "Curso de Prueba Actualizado",
        descripcion: "La descripción ha sido actualizada.",
    };
    const resultadoActualizar = await actualizarCurso(cursoId, datosActualizados);
    if (resultadoActualizar.success) {
        console.log("Curso actualizado con éxito. Verificando los datos...");
        const cursoActualizado = await obtenerCursoPorId(cursoId);
        console.log("Datos del curso después de la actualización:", cursoActualizado.data);
    } else {
        console.error("Error en la prueba de actualizarCurso:", resultadoActualizar.error);
    }

    // 5. Probar borrarCurso
    console.log(`\nPrueba 5: Borrando el curso con ID: ${cursoId}...`);
    const resultadoBorrar = await borrarCurso(cursoId);
    if (resultadoBorrar.success) {
        console.log("Curso borrado con éxito. Intentando obtenerlo de nuevo para confirmar...");
        const resultadoDespuesDeBorrar = await obtenerCursoPorId(cursoId);
        if (!resultadoDespuesDeBorrar.success) {
            console.log("Confirmado: El curso ya no se puede encontrar, como se esperaba.");
        } else {
            console.error("Error en la prueba de borrarCurso: El curso todavía existe después de ser borrado.");
        }
    } else {
        console.error("Error en la prueba de borrarCurso:", resultadoBorrar.error);
    }

    console.log("\nPruebas CRUD finalizadas.");
}

// Ejecutar las pruebas cuando el DOM esté cargado
// document.addEventListener('DOMContentLoaded', () => {
//     probarFuncionesCRUD();
// });

// Flujo de cursos:
/*
1. Obtener todos los cursos
2. Mostrarlos en la galería de cursos (en el selector CSS con id #cursos)
3. Al seleccionar un curso, cargar la página plantilla "detallesCursos.html" y llenarla con la información del curso respectivo, obteniendo los datos del documento dentro de la base de datos de firestore.
4. Al dar clic sobre el botón "Inscribirse ahora", ocurrirá lo siguiente:
    a. Se redirigirá al usuario a la página "mis_cursos.html"
    b. Se agregará el curso a la lista de cursos del usuario
    c. Se mostrará un mensaje de confirmación
    d. Se agregará el curso a la lista de cursos del usuario en la base de datos de firestore
    e. Dado que el curso ahora está en la base de datos del usuario, cuando el usuario vuelva a ingresar a la página de "Cursos", entonces el curso inscrito ya no aparecerá en la galería de cursos.
5. Al dar clic sobre uno de los cursos en "Mis cursos", se redirigirá al usuario a la página plantilla "contenidoCursos.html" y se llenará con la información del curso respectivo, obteniendo los datos del documento dentro de la base de datos de firestore. Dado que todos los cursos contienen módulos de aprendizaje, cuándo el usuario ingrese a la página "contenidoCursos.html", se mostrará la lista de módulos de aprendizaje disponibles para el curso seleccionado (deberán incluirse indicadores de progreso como barras de progreso, etiquetas de estado y botones para iniciar el módulo de aprendizaje, el cuál consistirá en un cuestionario que el usuario deberá responder para completar el módulo de aprendizaje).
*/
