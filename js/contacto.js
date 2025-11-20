



//Función para validar el formulario
function validarNombre() {
    let nombreInput = document.getElementById("nombre");
    let nombre = nombreInput.value.trim();
    const REGEX_NOMBRE= /^[A-Za-z]{2,}\s+[A-Za-z]{2,}$/;
    if (nombre === "") {
        alert("Por favor, ingrese su nombre y apellido.");
        nombreInput.focus();
        return false;
    }
    if (!REGEX_NOMBRE.test(nombre)) {
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
    if (!REGEX_CORREO.test(correo)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        correoInput.focus();
        return false;
    }
    return true;
}


//Evento para validar el formulario al enviarlo
document.querySelector("form").addEventListener("submit", function(event){
    let mensajeInput = document.getElementById("mensaje");
    let asuntoInput = document.getElementById("asunto");
    if (!validarNombre()){
        event.preventDefault();
    } else if (!validarCorreo()){
        event.preventDefault();
    } else if (asuntoInput.value.trim() === ""){
        alert("Por favor, ingrese el asunto.");
        asuntoInput.focus();
        event.preventDefault();
    } else if (mensajeInput.value.trim() === ""){
        alert("Por favor, ingrese un mensaje.");
        mensajeInput.focus();
        event.preventDefault();
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