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
            console.log(`✓ Curso "${curso.nombre}" insertado exitosamente con ID: ${resultado.id}`);
        } catch (error) {
            console.error(`✗ Error al insertar curso "${curso.nombre}":`, error);
        }
    }
    
    console.log('Proceso de inserción completado.');
}

// Función para insertar un curso individual
async function insertarCurso(curso) {
    try {
        const resultado = await crearCurso(curso);
        console.log(`✓ Curso "${curso.nombre}" insertado exitosamente con ID: ${resultado.id}`);
        return resultado;
    } catch (error) {
        console.error(`✗ Error al insertar curso "${curso.nombre}":`, error);
        throw error;
    }
}

// Función para actualizar los detalles de un curso existente en Firebase
async function actualizarDetallesCurso(cursoId, nuevosDatos) {
    try {
        const resultado = await actualizarCurso(cursoId, nuevosDatos);
        if (resultado.success) {
            console.log(`✓ Curso con ID "${cursoId}" actualizado exitosamente.`);
        } else {
            console.error(`✗ Error al actualizar el curso con ID "${cursoId}":`, resultado.error);
        }
        return resultado;
    } catch (error) {
        console.error(`✗ Excepción al actualizar el curso con ID "${cursoId}":`, error);
        throw error;
    }
}

// Función para actualizar todos los cursos con la nueva información de cursosData.js
async function actualizarTodosLosCursos() {
    console.log('Iniciando actualización de todos los cursos en Firebase...');
    
    try {
        // Obtener todos los cursos de Firebase
        const resultado = await obtenerTodosLosCursos();
        
        if (!resultado.success) {
            console.error('Error al obtener cursos de Firebase:', resultado.error);
            return;
        }
        
        const cursosFirebase = resultado.data;
        console.log(`Se encontraron ${cursosFirebase.length} cursos en Firebase.`);
        
        // Actualizar cada curso
        for (const cursoFirebase of cursosFirebase) {
            // Buscar el curso actualizado en cursosData por nombre
            const cursoActualizado = todosCursos.find(c => c.nombre === cursoFirebase.nombre);
            
            if (cursoActualizado) {
                try {
                    const resultadoActualizacion = await actualizarCurso(cursoFirebase.id, cursoActualizado);
                    
                    if (resultadoActualizacion.success) {
                        console.log(`✓ Curso "${cursoFirebase.nombre}" (ID: ${cursoFirebase.id}) actualizado exitosamente.`);
                    } else {
                        console.error(`✗ Error al actualizar "${cursoFirebase.nombre}":`, resultadoActualizacion.error);
                    }
                } catch (error) {
                    console.error(`✗ Excepción al actualizar "${cursoFirebase.nombre}":`, error);
                }
            } else {
                console.warn(`⚠ No se encontró datos actualizados para el curso "${cursoFirebase.nombre}"`);
            }
        }
        
        console.log('Proceso de actualización completado.');
    } catch (error) {
        console.error('Error general en actualización:', error);
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
    insertarCurso, 
    actualizarDetallesCurso,
    actualizarTodosLosCursos
};

// Para ejecutar desde la consola del navegador:
// Descomentar la siguiente línea y cargar este script en una página con Firebase configurado
// insertarTodosLosCursos();

// Ejecutar la actualización de todos los cursos
actualizarTodosLosCursos();