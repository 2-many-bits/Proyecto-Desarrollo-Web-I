import {URL} from "./configuracionGemini.js";

const contenedorChat = document.getElementById("contenidoChat");
const textareaMensaje = document.getElementById("idTxtMensaje");
const buttonEnviar = document.getElementById("idBtnEnviar");
const buttonLimpiar = document.getElementById("idBtnLimpiar");

const conversacion = [];
const informacionPerfil = {
    nombre: "Emanuel Rivas",
    cargo: "Desarrollador Fullstack",
    empresa: {
        nombre: "Lulu's",
        sector: "Turismo, comercio y souvenirs",
        descripcion: "Ventas para turistas surfers en el malecón. Camisas, llaveros, artesanías y\
         suplementos para tablas",
        problemas: [
            "No tengo dinero para crear mis productos",
            "Quiero llegar a clientes pero no tengo repartidor"
        ],
        cursos: [
            {
                nombre: "Gestiona tus alquileres con Propi: tecnología para arrendadores y emprendedores",
                descripcion: "Aprende a usar la plataforma Propi para administrar contratos, pagos y\
                 comunicación con inquilinos de forma digital y eficiente."
            },
            {
                nombre: "Finanzas accesibles para tu negocio con DiiMO Technologies",
                descripcion: "Descubre cómo DiiMO conecta tu emprendimiento con servicios financieros \
                inclusivos, sin necesidad de historial bancario tradicional."
            }
        ]
    }
};
const informacionCursos = {
    data: [
        {
            nombre: "Domina tus envíos con Boxful LATAM",
            descripcion: "Aprende a usar la plataforma de lockers inteligentes y logística de última\
             milla de Boxful LATAM. Este curso te enseña cómo enviar productos de forma rápida y segura,\
              ideal para negocios que venden en línea y quieren mejorar su entrega.",
        },
        {
            nombre: "Microcréditos al instante con Fiado App",
            descripcion: "Este curso te enseña a usar Fiado App, una aplicación salvadoreña que ofrece\
             microcréditos accesibles para trabajadores independientes. Aprende cómo solicitar un préstamo,\
              construir tu historial crediticio y mejorar tu liquidez sin trámites complicados."
        }
    ]
};

// ACTIVAR/DESACTIVAR BOTON
function toggleButton() {
    buttonEnviar.toggleAttribute("disabled");
};

// ACTUALIZAR DOM
async function agregarInteraccion(mensaje) {
    const contenedor = document.createElement("div");
    contenedor.classList.add("interaccion");

    const parrafo = document.createElement("p");
    parrafo.innerHTML = mensaje;
    
    contenedor.appendChild(parrafo);
    contenedorChat.appendChild(contenedor);
    requestAnimationFrame(()=>{
        contenedorChat.scrollTop = contenedorChat.scrollHeight;
    });
};

function limpiarInteracciones() {
    conversacion.splice(0, conversacion.length-1);
    contenedorChat.innerHTML = "";
    textareaMensaje.value="";
    buttonEnviar.focus();
}

// FUNCIÓN PARA GUARDAR CONTEXTO DE LA CONVERSACIÓN
function guardarMemoria(mensaje) {
    conversacion.push(mensaje);
};

// FUNCIÓN PARA REALIZAR CONSULTA A LA IA
async function generarQuery(prompt, contexto) {
    const body = {
        contents: [{
            role:"user",
            parts: [
                {text:`Responde al siguiente prompt (entrega tu respuesta en texto plano sin * o /): ${prompt}`},
                {text:`Contexto adicional: ${contexto}`}
            ]
        }
        ]
    };

    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Función para interactuar con IA
const generarMensaje = async function () {
    // Obtener contexto
    const contexto = JSON.stringify({
        informacionDelUser: informacionPerfil, 
        CursosDisponibles: informacionCursos,
        interaccionesPrevias: conversacion
    });
    // Obtener prompt
    const prompt = textareaMensaje.value;

    if (prompt === "") {
        return;
    }

    // Agregar mensaje
    agregarInteraccion(prompt);
    guardarMemoria(prompt);

    // Limpiar textarea y desactivar botón
    textareaMensaje.value = "";
    toggleButton();
    const respuesta = await generarQuery(prompt, contexto);
    toggleButton();

    // aggregar respuesta
    agregarInteraccion(respuesta);
    guardarMemoria(respuesta);
};

buttonEnviar.addEventListener("click", generarMensaje);
buttonLimpiar.addEventListener("click", limpiarInteracciones);

textareaMensaje.value="";
buttonEnviar.focus();