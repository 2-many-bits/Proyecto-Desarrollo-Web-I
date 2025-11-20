import {
    crearCurso,
    obtenerTodosLosCursos,
    obtenerCursoPorId,
    actualizarCurso,
    borrarCurso
} from './detallesCursosServices.js';

// TODO: insertar la información de todos los cursos restantes en firebase siguiendo el formato de los cursos ya insertados:
const nuevoCurso = {
        Certificado: "De finalización",
        ContenidoDelCurso: [
            {
                ContenidosModulo: [
                    "¿Qué es la logística de última milla y por qué es crucial?",
                    "El rol de los lockers inteligentes en el e-commerce.",
                    "Conociendo la propuesta de valor de Boxful LATAM.",
                    "Creación de tu primer cuenta y primer vistazo al dashboard"
                ],
                DescripcionModulo: "{insertar descripción adecuada}",
                TituloModulo: "Introducción a la Logística de Última Milla."
            },
            {
                ContenidosModulo: [
                    "Cómo registrar un nuevo paquete en la plataforma.",
                    "Selección del locker y generación de etiquetas.",
                    "Seguimiento de envíos en tiempo real.",
                    "Notificaciones automáticas para ti y tu cliente."
                ],
                DescripcionModulo: "{insertar descripción adecuada}",
                TituloModulo: "Gestión de Envíos con Boxful"
            },
            {
                ContenidosModulo: [
                    "Integración de Boxful con plataformas como Shopify.",
                    "Gestión de devoluciones de manera sencilla.",
                    "Consejos para empacar tus productos de forma segura.",
                    "Análisis de reportes para optimizar costos."
                ],
                DescripcionModulo: "{insertar descripción adecuada}",
                TituloModulo: "Optimización y Casos de Uso"
            }
        ],
        Descripcion: "Aprende a usar la plataforma de lockers inteligentes y logística de última milla de Boxful LATAM. Este curso te enseña cómo enviar productos de forma rápida y segura, ideal para negocios que venden en línea y quieren mejorar su entrega.",
        Duracion: "4 horas de contenido",
        Formato: "Videos",
        Imagen: "../img/boxful.png",
        LoQueAprenderás: [
            "Gestionar envíos de forma eficiente usando la plataforma de Boxful.",
            "Optimizar la logística de última milla para tu negocio en línea.",
            "Integrar los lockers inteligentes en tu proceso de entrega y devolución.",
            "Mejorar la experiencia de tus clientes con entregas rápidas y seguras."
        ],
        Nivel: "Principiante",
        Nombre: "Domina tus envíos con Boxful LATAM",
        Prerrequisitos: [
            "Tener un negocio de e-commerce o interés en crear uno.",
            "Conocimientos básicos de navegación por internet.",
            "No se requiere experiencia previa en logística."
        ],
        Subtitulo: "Logística y E-commerce",
        Titulo: "Logística Inteligente con Boxful LATAM"
    };