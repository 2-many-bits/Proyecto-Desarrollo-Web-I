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
insertarTodosLosCursos();
const nuevoCurso = {
        certificado: "De finalización",
        contenidoDelCurso: [
            {
                contenidosModulo: [
                    "¿Qué es la logística de última milla y por qué es crucial?",
                    "El rol de los lockers inteligentes en el e-commerce.",
                    "Conociendo la propuesta de valor de Boxful LATAM.",
                    "Creación de tu primer cuenta y primer vistazo al dashboard"
                ],
                descripcionModulo: "{insertar descripción adecuada}",
                tituloModulo: "Introducción a la Logística de Última Milla."
            },
            {
                contenidosModulo: [
                    "Cómo registrar un nuevo paquete en la plataforma.",
                    "Selección del locker y generación de etiquetas.",
                    "Seguimiento de envíos en tiempo real.",
                    "Notificaciones automáticas para ti y tu cliente."
                ],
                descripcionModulo: "{insertar descripción adecuada}",
                tituloModulo: "Gestión de Envíos con Boxful"
            },
            {
                contenidosModulo: [
                    "Integración de Boxful con plataformas como Shopify.",
                    "Gestión de devoluciones de manera sencilla.",
                    "Consejos para empacar tus productos de forma segura.",
                    "Análisis de reportes para optimizar costos."
                ],
                descripcionModulo: "{insertar descripción adecuada}",
                tituloModulo: "Optimización y Casos de Uso"
            }
        ],
        descripcion: "Aprende a usar la plataforma de lockers inteligentes y logística de última milla de Boxful LATAM. Este curso te enseña cómo enviar productos de forma rápida y segura, ideal para negocios que venden en línea y quieren mejorar su entrega.",
        duracion: "4 horas de contenido",
        formato: "Videos",
        imagen: "../img/boxful.png",
        loQueAprenderas: [
            "Gestionar envíos de forma eficiente usando la plataforma de Boxful.",
            "Optimizar la logística de última milla para tu negocio en línea.",
            "Integrar los lockers inteligentes en tu proceso de entrega y devolución.",
            "Mejorar la experiencia de tus clientes con entregas rápidas y seguras."
        ],
        nivel: "Principiante",
        nombre: "Domina tus envíos con Boxful LATAM",
        prerrequisitos: [
            "Tener un negocio de e-commerce o interés en crear uno.",
            "Conocimientos básicos de navegación por internet.",
            "No se requiere experiencia previa en logística."
        ],
        subtitulo: "Logística y E-commerce",
        titulo: "Logística Inteligente con Boxful LATAM"
    };

crearCurso(nuevoCurso)