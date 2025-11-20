import { obtenerCursoPorId, inscribirCurso } from './detallesCursosServices.js';
import { getCurrentUserId } from './firebase/firebaseConfig.js';

// Obtener el ID del curso de la URL
const params = new URLSearchParams(window.location.search);
const cursoId = params.get('id');

const btnInscribirse = document.getElementById('btnInscribirse');

async function cargarDetallesCurso() {
    if (!cursoId) {
        alert('No se especificó un curso.');
        window.location.href = '../../../html/cursos.html';
        return;
    }

    const resultado = await obtenerCursoPorId(cursoId);

    if (resultado.success) {
        const curso = resultado.data;
        renderizarCurso(curso);
    } else {
        alert('Error al cargar el curso: ' + resultado.error);
        window.location.href = '../../../html/cursos.html';
    }
}

function renderizarCurso(curso) {
    // Actualizar título de la página
    document.title = `NORT3 - ${curso.nombre}`;

    // Rellenar campos de texto simples
    setText('curso-categoria', curso.subtitulo);
    setText('curso-titulo', curso.titulo);
    setText('curso-descripcion', curso.descripcion);
    
    // Detalles laterales
    setText('detalle-duracion', curso.duracion);
    setText('detalle-nivel', curso.nivel);
    setText('detalle-formato', curso.formato);
    setText('detalle-certificado', curso.certificado);

    // Listas
    renderizarLista('curso-aprendizajes-lista', curso.loQueAprenderas, 'fa-check icon-check');
    renderizarLista('curso-prerrequisitos-lista', curso.prerrequisitos); // Sin icono específico o default

    // Módulos
    renderizarModulos(curso.contenidoDelCurso);
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text || 'No especificado';
    }
}

function renderizarLista(elementId, items, iconClass) {
    const lista = document.getElementById(elementId);
    if (!lista) return;
    
    lista.innerHTML = ''; // Limpiar lista actual

    if (items && Array.isArray(items)) {
        items.forEach(item => {
            const li = document.createElement('li');
            if (iconClass) {
                li.innerHTML = `<span><i class="fa ${iconClass}"></i>${item}</span>`;
            } else {
                li.textContent = item;
            }
            lista.appendChild(li);
        });
    }
}

function renderizarModulos(modulos) {
    const contenedor = document.getElementById('curso-modulos-lista');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (modulos && Array.isArray(modulos)) {
        modulos.forEach((modulo, index) => {
            const details = document.createElement('details');
            details.className = 'dropdown-elemento';
            
            const summary = document.createElement('summary');
            summary.className = 'modulo-titulo';
            summary.innerHTML = `<span>Módulo ${index + 1}: ${modulo.tituloModulo || ''}</span>`;
            
            const divContenido = document.createElement('div');
            divContenido.className = 'modulo-contenido';
            
            const ul = document.createElement('ul');
            if (modulo.contenidosModulo && Array.isArray(modulo.contenidosModulo)) {
                modulo.contenidosModulo.forEach(tema => {
                    const li = document.createElement('li');
                    li.textContent = tema;
                    ul.appendChild(li);
                });
            }
            
            divContenido.appendChild(ul);
            details.appendChild(summary);
            details.appendChild(divContenido);
            contenedor.appendChild(details);
        });
    }
}

// Evento de inscripción
if (btnInscribirse) {
    btnInscribirse.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const userId = await getCurrentUserId();
        if (!userId) {
            alert("Debes iniciar sesión para inscribirte.");
            // Asumiendo que login.html está en html/login.html y estamos en html/cursos/plantillas/
            window.location.href = "../../../html/login.html"; 
            return;
        }

        if (confirm("¿Deseas inscribirte en este curso?")) {
            // Deshabilitar botón para evitar doble clic
            btnInscribirse.textContent = "Inscribiendo...";
            btnInscribirse.style.pointerEvents = "none";

            const resultado = await inscribirCurso(userId, cursoId);
            
            if (resultado.success) {
                alert("¡Inscripción exitosa!");
                window.location.href = "../../../html/mis_cursos.html";
            } else {
                alert("Error al inscribirse: " + resultado.error);
                btnInscribirse.textContent = "Inscribirse Ahora";
                btnInscribirse.style.pointerEvents = "auto";
            }
        }
    });
}

// Iniciar carga
window.addEventListener('load', cargarDetallesCurso);
