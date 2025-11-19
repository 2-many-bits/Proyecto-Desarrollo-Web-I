import { loginUser } from "./firebase/firebaseConfig.js";

const inputTxtEmail = document.getElementById("idTxtCorreo");
const inputTxtPassword = document.getElementById("idTxtContrasenia");

document.getElementById("loginForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = inputTxtEmail.value;
    const password = inputTxtPassword.value;

    try {
        const userData = await loginUser (email, password);

        if (userData) {
            window.location.href = "../index.html";
        } else {
            alert("Usuario y/o contraseña incorrectos");
        }
    } catch (error) {
        alert("Hubo un problema al iniciar sesión");
        console.error("Error al inciar sesión: ", error.message);
    }
});