// Importa funciones existentes de firebase config
import { getCurrentUserId, getUser } from "./firebase/firebaseConfig.js";
import { obtenerCursoPorId } from "./detallesCursosServices.js";

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

        // Renderizar Logros y Diplomas
        await renderizarLogrosYDiplomas(userData);

        console.log("Datos del usuario cargados exitosamente:", userData);
    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        alert("Hubo un problema al cargar tus datos. Intenta nuevamente.");
    }
}

async function renderizarLogrosYDiplomas(userData) {
    const logrosContainer = document.getElementById('logros');
    const tablaLogros = logrosContainer.querySelector('.tabla');
    
    // Definición de logros
    const logros = [
        {
            id: 'bienvenida',
            titulo: 'Bienvenido a NORT3',
            descripcion: 'Ingresa a la plataforma por primera vez.',
            icono: 'fa-solid fa-door-open',
            condicion: () => true // Siempre desbloqueado si está logueado
        },
        {
            id: 'primer-curso-adquirido',
            titulo: 'Primer paso',
            descripcion: 'Adquiere tu primer curso.',
            icono: 'fa-solid fa-shopping-cart',
            condicion: (data) => data.cursos && data.cursos.length >= 1
        },
        {
            id: 'tres-cursos-adquiridos',
            titulo: 'Coleccionista de conocimiento',
            descripcion: 'Adquiere 3 cursos.',
            icono: 'fa-solid fa-layer-group',
            condicion: (data) => data.cursos && data.cursos.length >= 3
        },
        {
            id: 'primer-modulo',
            titulo: 'Primer logro',
            descripcion: 'Completa tu primer módulo.',
            icono: 'fa-solid fa-check',
            condicion: (data) => {
                if (!data.progreso) return false;
                return Object.values(data.progreso).some(progresoCurso => 
                    progresoCurso.modulos && Object.values(progresoCurso.modulos).some(m => m.estado === 'Completado')
                );
            }
        },
        {
            id: 'primer-curso-completado',
            titulo: 'Graduado novato',
            descripcion: 'Completa tu primer curso.',
            icono: 'fa-solid fa-graduation-cap',
            condicion: (data) => data.certificaciones && data.certificaciones.length >= 1
        },
        {
            id: 'cinco-modulos',
            titulo: 'Constancia pura',
            descripcion: 'Completa 5 módulos en total.',
            icono: 'fa-solid fa-list-check',
            condicion: (data) => {
                if (!data.progreso) return false;
                let total = 0;
                Object.values(data.progreso).forEach(progresoCurso => {
                    if (progresoCurso.modulos) {
                        Object.values(progresoCurso.modulos).forEach(m => {
                            if (m.estado === 'Completado') total++;
                        });
                    }
                });
                return total >= 5;
            }
        },
        {
            id: 'tres-cursos-completados',
            titulo: 'Maestro del aprendizaje',
            descripcion: 'Completa 3 cursos.',
            icono: 'fa-solid fa-award',
            condicion: (data) => data.certificaciones && data.certificaciones.length >= 3
        }
    ];

    // Renderizar Logros
    if (tablaLogros) {
        tablaLogros.innerHTML = ''; // Limpiar contenido anterior

        logros.forEach(logro => {
            const desbloqueado = logro.condicion(userData);
            
            const fila = document.createElement('div');
            fila.className = `fila ${desbloqueado ? 'logro-desbloqueado' : 'logro-bloqueado'}`;
            
            const icono = document.createElement('i');
            icono.className = logro.icono;
            
            const campo = document.createElement('div');
            campo.className = 'campo';
            
            const titulo = document.createElement('h5');
            titulo.textContent = logro.titulo;
            
            const descripcion = document.createElement('h3'); // Usamos h3 para mantener estilo de valor
            descripcion.textContent = logro.descripcion;
            descripcion.style.fontSize = "1em"; 
            descripcion.style.fontWeight = "normal";

            campo.appendChild(titulo);
            campo.appendChild(descripcion);
            
            fila.appendChild(icono);
            fila.appendChild(campo);
            
            // Si está bloqueado, añadir icono de candado
            if (!desbloqueado) {
                const candado = document.createElement('i');
                candado.className = 'fa-solid fa-lock';
                candado.style.marginLeft = 'auto'; // Empujar a la derecha
                candado.style.fontSize = '1.5em';
                candado.style.color = 'var(--gris-textos)';
                fila.appendChild(candado);
            }

            tablaLogros.appendChild(fila);
        });
    }

    // Renderizar Diplomas
    const diplomasContainer = document.getElementById('diplomas');
    if (diplomasContainer && userData.certificaciones && userData.certificaciones.length > 0) {
        // Limpiar diplomas existentes (excepto el título h1)
        const titulo = diplomasContainer.querySelector('h1');
        diplomasContainer.innerHTML = '';
        if (titulo) diplomasContainer.appendChild(titulo);

        for (const cursoId of userData.certificaciones) {
            const cursoResult = await obtenerCursoPorId(cursoId);
            if (cursoResult.success) {
                const curso = cursoResult.data;
                const fila = document.createElement('div');
                fila.className = 'fila';
                
                const img = document.createElement('img');
                img.src = '../img/diploma_1.png'; // Placeholder image
                img.alt = 'Diploma';
                
                const h3 = document.createElement('h3');
                h3.textContent = `Curso "${curso.nombre}" aprobado exitosamente`;
                
                fila.appendChild(img);
                fila.appendChild(h3);
                diplomasContainer.appendChild(fila);
            }
        }
    } else if (diplomasContainer) {
         // Limpiar diplomas existentes (excepto el título h1)
         const titulo = diplomasContainer.querySelector('h1');
         diplomasContainer.innerHTML = '';
         if (titulo) diplomasContainer.appendChild(titulo);
         
         const mensaje = document.createElement('p');
         mensaje.textContent = "Aún no tienes diplomas. ¡Completa un curso para obtener uno!";
         mensaje.style.padding = "20px";
         diplomasContainer.appendChild(mensaje);
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