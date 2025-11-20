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
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = inputTxtName.value;
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

    const status = await registerUser(name, password, birthDate, sex, address, email, phone, linkedIn, company, job, hireDate);
    
    if (status) {
        alert("Usuario creado exitosamente");
        limpiarFormulario();
    } else {
        alert("Ya existe un usuario asociado a este correo");
    }
});