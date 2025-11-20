import { registerUser } from "./firebase/firebaseConfig.js";
const inputTxtName = document.getElementById("idTxtNombre");
const inputTxtPassword = document.getElementById("idTxtPassword");
const inputTxtBirthDate = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const inputTxtAddres = document.getElementById("idTxtDireccion");
const inputTxtEmail = document.getElementById("idTxtCorreo");
const inputTxtPhone = document.getElementById("idTxtTelefono");
const inputTxtLinkedIn = document.getElementById("idTxtLinkedIn");
const inputTxtCompany = document.getElementById("idTxtEmpresa");
const inputTxtJob = document.getElementById("idTxtPuestoLaboral");
const inputTxtHireDate = document.getElementById("idTxtFechaContratacion");

//Radio button marcado estandar
inputRdMasculino.checked = true;

// Variable para determinar si el formulario es válido
let formularioValido = true;

// Función para limpiar formulario
function limpiarFormulario() {
    inputTxtName.value = "";
    inputTxtPassword.value = "";
    inputTxtBirthDate.value = "";
    inputRdMasculino.checked = true;
    inputRdFemenino.checked = false;
    inputTxtAddres.value="";
    inputTxtEmail.value = "";
    inputTxtPhone.value = "";
    inputTxtLinkedIn.value = "";
    inputTxtCompany.value = "";
    inputTxtJob.value="";
    inputTxtHireDate.value = "";
};

// Función para limpiar validaciones
function limpiarValidaciones() {
    inputTxtName.classList.remove("is-invalid", "is-valid");
    inputTxtPassword.classList.remove("is-valid", "is-invalid");
    inputTxtBirthDate.classList.remove("is-valid", "is-invalid");
    inputTxtAddres.classList.remove("is-invalid", "is-valid");
    inputTxtEmail.classList.remove("is-valid", "is-invalid");
    inputTxtPhone.classList.remove("is-invalid", "is-valid");
    inputTxtLinkedIn.classList.remove("is-valid", "is-invalid");
    inputTxtCompany.classList.remove("is-valid", "is-invalid");
    inputTxtJob.classList.remove("is-valid", "is-invalid");
    inputTxtHireDate.classList.remove("is-valid", "is-invalid");
};

// Funciones para comprobar validez del formulario
function comprobarNombre(nombre) {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚ'ñ]{3,}(\s[A-Za-záéíóúÁÉÍÓÚ'ñ]{3,}){1,}$/
    const valido = regex.test(nombre);
    inputTxtName.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarContrasenia(contrasenia) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S{6,}$/
    const valido = regex.test(contrasenia);
    inputTxtPassword.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarFechaNacimiento(fecha) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const valido = regex.test(fecha);
    inputTxtBirthDate.classList.add(valido ? "is-valid": "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarDireccion(direccion) {
    const regex = /^.{10,700}$/;
    const valido = regex.test(direccion);
    inputTxtAddres.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarCorreo(correo) {
    const regex = /^[\dA-Za-z]([\._\-\+]?[A-Za-z\d]+)*[\dA-Za-z][@][A-Za-z\d]+([\.\-]?[\dA-Za-z]{1,62})*[\.\-][A-Za-z]{2,63}$/;
    const valido = regex.test(correo);
    inputTxtEmail.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarTelefono(telefono) {
    const regex = /^[2567]{1}\d{3}\-\d{4}$/;
    const valido = regex.test(telefono);
    inputTxtPhone.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarLinkedIn(linkedIn) {
    const regex = /^[A-Za-z\d](?:[A-Za-z\d\-]{1,98}[A-Za-z\d])?$/;
    const valido = regex.test(linkedIn);
    inputTxtLinkedIn.classList.add(valido ? "is-valid":"is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarCompania(compania) {
    const regex = /^(?!.*\s{2})[A-Za-zÁÉÍÓÚáéíóúñ]{4}[A-Za-zÁÉÍÓÚáéíóúñ\s]*$/;
    const valido = regex.test(compania);
    inputTxtCompany.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarTrabajo(trabajo) {
    const regex = /^(?!.*\s{2})[A-Za-zÁÉÍÓÚáéíóúñ]{4}[A-Za-zÁÉÍÓÚáéíóúñ\s]*$/;
    const valido = regex.test(trabajo);
    inputTxtJob.classList.add(valido ? "is-valid" : "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

function comprobarFechaContratacion(fecha) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const valido = regex.test(fecha);
    inputTxtHireDate.classList.add(valido ? "is-valid": "is-invalid");
    formularioValido = valido ? formularioValido : false;
};

// Función para validar todo el formulario
function validarFormulario(nombre, contrasenia, fechaNacimiento, direccion,
     correo, telefono, linkedIn, compania, trabajo, fechaContratacion) {
    formularioValido = true;
    comprobarNombre(nombre);
    comprobarContrasenia(contrasenia);
    comprobarFechaNacimiento(fechaNacimiento);
    comprobarDireccion(direccion);
    comprobarCorreo(correo);
    comprobarTelefono(telefono);
    comprobarLinkedIn(linkedIn);
    comprobarCompania(compania);
    comprobarTrabajo(trabajo);
    comprobarFechaContratacion(fechaContratacion);
};

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = inputTxtName.value.trim();
    let password = inputTxtPassword.value;
    let birthDate = inputTxtBirthDate.value;
    let sex = inputRdMasculino.checked == true 
    ? "Masculino" 
    : inputRdFemenino.checked == true
    ? "Femenino"
    :  "";
    let address = inputTxtAddres.value;
    let email = inputTxtEmail.value;
    let phone = inputTxtPhone.value;
    let linkedIn = inputTxtLinkedIn.value;
    let company = inputTxtCompany.value;
    let job = inputTxtJob.value;
    let hireDate = inputTxtHireDate.value;

    limpiarValidaciones();
    validarFormulario(name, password, birthDate, address, email, phone, linkedIn, company, job, hireDate);

    if (formularioValido) {
        const status = await registerUser(name, password, birthDate, sex, address, email, phone, linkedIn, company, job, hireDate);
        
        if (status) {
            alert("Usuario creado exitosamente");
            limpiarFormulario();
            limpiarValidaciones();
            window.location.href = "../html/login.html";
        } else {
            alert("Ya existe un usuario asociado a este correo");
        }
    } else {
        alert("Hay campos que requieren revisión");
    }
});