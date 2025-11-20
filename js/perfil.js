import { getUserData } from "./firebase/firebase_config.js";

// Elementos del DOM para Informacion Personal
const nombreUsuario = document.querySelectorAll("#informacion-personal .fila:nth-child(1) .campo h3")[0];
const fechaNacimiento = document.querySelectorAll("#informacion-personal .fila:nth-child(2) .campo h3")[0];
const genero = document.querySelectorAll("#informacion-personal .fila:nth-child(3) .campo h3")[0];
const direccion = document.querySelectorAll("#informacion-personal .fila:nth-child(4) .campo h3")[0];

// Elementos del DOM para Informacion de Contacto
const email = document.querySelectorAll("#contactos .fila:nth-child(1) .campo h3")[0];
const telefono = document.querySelectorAll("#contactos .fila:nth-child(2) .campo h3")[0];
const linkedin = document.querySelectorAll("#contactos .fila:nth-child(3) .campo h3")[0];

//  Elementos del DOM para detalles laborales
const puesto = document.querySelectorAll("#trabajo .fila:nth-child(1) .campo h3")[0];
const empresa = document.querySelectorAll("#trabajo .fila:nth-child(2) .campo h3")[0];
const fechaContratacion = document.querySelectorAll("#trabajo .fila:nth-child(3) .campo h3")[0];



// CARGA LOS DATOS DEL USUARIO ACTIVO Y ACTUALIZA EL DOM
async function cargarDatosUsuario() {
    try {
        const userData = await getUserData();

        if (!userData) {
            console.error("No se encontraron datos del usuario activo");
            alert("No hay un usuario activo. Redirigiendo al login...");
            window.location.href = "../html/login.html";
            return;
        }

        // ACTUALIZA INFORMACION PERSONAL
        if (nombreUsuario) nombreUsuario.textContent = userData.name || "No disponible";
        if (fechaNacimiento) fechaNacimiento.textContent = formatearFecha(userData.birthDate) || "No disponible";
        if (genero) genero.textContent = userData.sex || "No disponible";
        if (direccion) direccion.textContent = userData.address || "No disponible";

        // ACTUALIZA INFORMACION DE CONTACTO
        if (email) email.textContent = userData.email || "No disponible";
        if (telefono) telefono.textContent = userData.phone || "No disponible";
        if (linkedin) linkedin.textContent = userData.linkedIn || "No disponible";

        // ACTUALIZA DETALLES LABORALES
        if (puesto) puesto.textContent = userData.job || "No disponible";
        if (empresa) empresa.textContent = userData.company || "No disponible";
        if (fechaContratacion) fechaContratacion.textContent = formatearFecha(userData.hireDate) || "No disponible";

        

        console.log("Datos del usuario cargados exitosamente:", userData);
    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        alert("Hubo un problema al cargar tus datos. Intenta nuevamente.");
    }
}

// fecha en formato YYYY-MM-DD A DD DE MES DEL YYYY
function formatearFecha(fecha) {
    if (!fecha) return null;

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const fechaObj = new Date(fecha + "T00:00:00");
    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];
    const anio = fechaObj.getFullYear();

    return `${dia} de ${mes} del ${anio}`;
}

// IMPORTA FIREBASE AUTH PARA VERIFICAR ESTADO DE AUTENTICACION
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// INICIALIZA FIREBASE AUTH
const auth = getAuth();

// ESPERA A QUE FIREBASE VERIFIQUE EL ESTADO DE AUTENTICACION ANTES DE CARGAR DATOS
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Usuario autenticado, cargar sus datos
        await cargarDatosUsuario();
    } else {
        // No hay usuario autenticado, redirigir al login
        console.warn("No hay un usuario autenticado. Redirigiendo al login...");
        window.location.href = "../html/login.html";
    }
});