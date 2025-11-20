import {URL} from "./configuracionGemini.js";
import {obtenerTodosLosCursos} from "./detallesCursosServices.js";
import {getCurrentUserId, getUser} from './firebase/firebaseConfig.js';

const contenedorChat = document.getElementById("contenidoChat");
const textareaMensaje = document.getElementById("idTxtMensaje");
const buttonEnviar = document.getElementById("idBtnEnviar");
const buttonLimpiar = document.getElementById("idBtnLimpiar");

const conversacion = [];
let informacionPerfil;
let informacionCursos;

// Esto carga la información del usuario
async function cargarInformacionUsuario() {
    // Obtener usuario
    const userId = await getCurrentUserId();
    const user = await getUser(userId);
    // filtrar solo la información útil
    return {nombre:user.name, trabajo:user.job, idsCursosInscritos:user.cursos};
};

//Esto carga la información de los cursos disponibles
async function cargarInformacionCursos() {
    // obtener cursos
    let cursos = await obtenerTodosLosCursos();
    cursos = cursos.data;
    const cursosDetalles = cursos.map(curso => {
        return {id: curso.id, nombre:curso.nombre, descripcion: curso.descripcion}
    });
    return {data: cursosDetalles,};
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
    if (informacionPerfil == undefined) {
        informacionPerfil = await cargarInformacionUsuario();
    };
    
    if (informacionCursos == undefined) {
        informacionCursos = await cargarInformacionCursos();
    };
    
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