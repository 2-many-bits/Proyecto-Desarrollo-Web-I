import {
    crearCurso,
    obtenerTodosLosCursos,
    obtenerCursoPorId,
    actualizarCurso,
    borrarCurso
} from './detallesCursosServices.js';

// Importar todos los cursos desde cursosData.js
import {
    cursoAbaco,
    cursoApplaudo,
    cursoBoxful,
    cursoFiado,
    cursoJobbi,
    cursoN1co,
    cursoPropi,
    cursoSostengo,
    cursoTilopay,
    cursoWeris,
    todosCursos
} from './cursosData.js';

// Función para insertar todos los cursos en Firebase
async function insertarTodosLosCursos() {
    console.log('Iniciando inserción de cursos en Firebase...');
    
    for (const curso of todosCursos) {
        try {
            const resultado = await crearCurso(curso);
            console.log(`✓ Curso "${curso.Nombre}" insertado exitosamente con ID: ${resultado.id}`);
        } catch (error) {
            console.error(`✗ Error al insertar curso "${curso.Nombre}":`, error);
        }
    }
    
    console.log('Proceso de inserción completado.');
}

// Función para insertar un curso individual
async function insertarCurso(curso) {
    try {
        const resultado = await crearCurso(curso);
        console.log(`✓ Curso "${curso.Nombre}" insertado exitosamente con ID: ${resultado.id}`);
        return resultado;
    } catch (error) {
        console.error(`✗ Error al insertar curso "${curso.Nombre}":`, error);
        throw error;
    }
}

// Exportar funciones y cursos individuales para uso en otros módulos
export {
    cursoAbaco,
    cursoApplaudo,
    cursoBoxful,
    cursoFiado,
    cursoJobbi,
    cursoN1co,
    cursoPropi,
    cursoSostengo,
    cursoTilopay,
    cursoWeris,
    todosCursos,
    insertarTodosLosCursos,
    insertarCurso
};

// Para ejecutar desde la consola del navegador:
// Descomentar la siguiente línea y cargar este script en una página con Firebase configurado
// insertarTodosLosCursos();