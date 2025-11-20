import {auth, getCurrentUserId, getUser} from './firebase/firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

//Agregar empresa del usuario al dropdown de empresa

//Obtenemos nombre actual de su empresa
async function getEmpresa() {
    const userId = await getCurrentUserId();
    
    if (!userId) {
        console.warn("User not logged in or Auth not ready yet.");
        return null;
    }

    const user = await getUser(userId);
    return user ? user.company : null;
}

async function agregarEmpresa(empresa) {
   const empresaInput = document.getElementById("cualEmpresa"); 
   if (empresaInput) {
        empresaInput.innerHTML += `<option value="${empresa}">${empresa}</option>`;
    }
}
onAuthStateChanged(auth, async (user) => {
    if (user) {        
        const userDoc = await getUser(user.uid);
        if (userDoc && userDoc.company) {
            agregarEmpresa(userDoc.company);
            console.log("Empresa agregada:", userDoc.company);
        }
    } else {
        console.log("Userio no ha ingresado aun.");
    }
});




//Función para validar el formulario
function validarNombre() {
    let nombreInput = document.getElementById("nombre");
    let nombre = nombreInput.value.trim();
    const REGEX_NOMBRE= /^[A-Za-z]{2,}\s+[A-Za-z]{2,}$/;
    if (nombre === "") {
        alert("Por favor, ingrese su nombre y apellido.");
        nombreInput.focus();
        return false;
    } else if (nombre.split(' ').length < 2) {
        alert("Por favor, ingrese su nombre y un apellido.");
        nombreInput.focus();
        return false;
    }else if (!REGEX_NOMBRE.test(nombre)) {
        alert("El campo solo debe contener letras y espacios.");
        nombreInput.focus();
        return false;
    }
    return true;
}

function validarCorreo(){
    let correoInput = document.getElementById("correo");
    let correo = correoInput.value.trim();
    const REGEX_CORREO = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (correo === "") {
        alert("Por favor, ingrese su correo electrónico.");
        correoInput.focus();
        return false;
    }
    else if (!REGEX_CORREO.test(correo)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        correoInput.focus();
        return false;
    }
    return true;
}


//Evento para validar el formulario al enviarlo
document.querySelector("form").addEventListener("submit", function(event){
    let asuntoInput = document.getElementById("asunto");
    if (!validarNombre() || !validarCorreo()){
        event.preventDefault();
    } else if (asuntoInput.value.trim() === ""){
        alert("Por favor, ingrese el asunto.");
        asuntoInput.focus();
        event.preventDefault();
    } else if (mensajeInput.value.trim() === "" || mensajeInput.value.length > MAX_CARACTERES){
        alert("Por favor, ingrese un mensaje.");
        mensajeInput.focus();
        event.preventDefault();
    }
    else {
        alert("Formulario enviado con éxito.");
        event.preventDefault();
        document.querySelector("form").reset();
        actualizarContador();
        nombreInput.focus();
    }
});

//Contador dinamico de caracteres para el campo mensaje
const mensajeInput = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const MAX_CARACTERES = 700;

function actualizarContador() {
    const longitudActual = mensajeInput.value.length;
    contador.textContent = `${longitudActual} / ${MAX_CARACTERES}`;
    if (longitudActual > MAX_CARACTERES){
        contador.classList.add("limite-alcanzado");
    }else {
        contador.classList.remove("limite-alcanzado");
    }
}

actualizarContador();
mensajeInput.addEventListener("input", actualizarContador);