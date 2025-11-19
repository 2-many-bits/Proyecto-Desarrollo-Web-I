import {
    crearCurso,
    obtenerTodosLosCursos,
    obtenerCursoPorId,
    actualizarCurso,
    borrarCurso
} from './detallesCursosServices.js';

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
document.addEventListener('DOMContentLoaded', () => {
    probarFuncionesCRUD();
});
