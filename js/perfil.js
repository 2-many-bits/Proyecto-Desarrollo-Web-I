// Importa funciones existentes de firebase config
import { getCurrentUserId, getUser } from "./firebase/firebaseConfig.js";

// Funcion auxiliar seleccionar elementos por texto de etiqueta
function seleccionarPorEtiqueta(seccionId, textoEtiqueta) {
    const filas = document.querySelectorAll(`#${seccionId} .fila`);
    for (const fila of filas) {
        const etiqueta = fila.querySelector('.campo h5');
        if (etiqueta && etiqueta.textContent.trim() === textoEtiqueta) {
            return fila.querySelector('.campo h3');
        }
    }
    return null;
}

// Elementos del dom para informacion personal
const nombreUsuario = seleccionarPorEtiqueta('informacion-personal', 'Nombre');
const fechaNacimiento = seleccionarPorEtiqueta('informacion-personal', 'Fecha de nacimiento');
const genero = seleccionarPorEtiqueta('informacion-personal', 'Género');
const direccion = seleccionarPorEtiqueta('informacion-personal', 'Dirección de casa');

// Elementos del dom para informacion de contacto
const email = seleccionarPorEtiqueta('contactos', 'Email');
const telefono = seleccionarPorEtiqueta('contactos', 'Teléfono');
const linkedin = seleccionarPorEtiqueta('contactos', 'LinkedIn');

// Elementos del dom para detalles laborales
const puesto = seleccionarPorEtiqueta('trabajo', 'Puesto');
const empresa = seleccionarPorEtiqueta('trabajo', 'Empresa');
const fechaContratacion = seleccionarPorEtiqueta('trabajo', 'Fecha de contratación');

// Carga los datos del usuario activo y actualiza el dom
async function cargarDatosUsuario() {
    try {
        // Obtiene el id del usuario activo
        const userId = await getCurrentUserId();
        
        if (!userId) {
            console.error("No se pudo obtener el ID del usuario activo");
            alert("No hay un usuario activo. Redirigiendo al login...");
            window.location.href = "../html/login.html";
            return;
        }

        // Obtiene desde firestore con su id
        const userData = await getUser(userId);

        if (!userData) {
            console.error("No se encontraron datos para el usuario activo");
            alert("No hay datos disponibles. Redirigiendo al login...");
            window.location.href = "../html/login.html";
            return;
        }

        // Actualiza informacion personal
        if (nombreUsuario) nombreUsuario.textContent = userData.name || "No disponible";
        if (fechaNacimiento) fechaNacimiento.textContent = formatearFecha(userData.birthDate) || "No disponible";
        if (genero) genero.textContent = userData.sex || "No disponible";
        if (direccion) direccion.textContent = userData.address || "No disponible";

        // Actualiza informacion de contacto
        if (email) email.textContent = userData.email || "No disponible";
        if (telefono) telefono.textContent = userData.phone || "No disponible";
        if (linkedin) linkedin.textContent = userData.linkedIn || "No disponible";

        // Actualiza detalles laborales
        if (puesto) puesto.textContent = userData.job || "No disponible";
        if (empresa) empresa.textContent = userData.company || "No disponible";
        if (fechaContratacion) fechaContratacion.textContent = formatearFecha(userData.hireDate) || "No disponible";

        console.log("Datos del usuario cargados exitosamente:", userData);
    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        alert("Hubo un problema al cargar tus datos. Intenta nuevamente.");
    }
}

// Formatea fecha en formato yyyy-mm-dd a dd de mes del yyyy
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

// Obtener datos del usuario
async function obtenerDatosUsuario() {
    try {
        const userId = await getCurrentUserId();
        
        if (!userId) {
            return null;
        }

        const userData = await getUser(userId);
        return userData;
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        return null;
    }
}

// Actualizar el nombre del usuario en el menu
async function actualizarNombreMenu() {
    try {
        const userData = await obtenerDatosUsuario();
        
        if (userData && userData.name) {
            const enlacePerfil = document.querySelector("header .perfil");
            
            if (enlacePerfil) {
                // Encuentra el nodo de texto que contiene el nombre
                const textoActual = enlacePerfil.childNodes;
                for (let nodo of textoActual) {
                    if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim() !== '') {
                        nodo.textContent = userData.name;
                        break;
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error al actualizar nombre en el menú:", error);
    }
}

// Importa firebase auth para verificar estado de autenticacion
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// Inicializa firebase auth
const auth = getAuth();

// Espera a que firebase verifique el estado de autenticacion antes de cargar datos
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Usuario autenticado, cargar sus datos
        if (nombreUsuario) {
            await cargarDatosUsuario();
        }
        // Se actualiza siempre el menu
        await actualizarNombreMenu();
        
    } else {
        // No hay usuario autenticado, redirigir al login
        console.warn("No hay un usuario autenticado. Redirigiendo al login...");
        window.location.href = window.location.pathname.includes('/html/') ? "../html/login.html" : "./html/login.html";
    }
});