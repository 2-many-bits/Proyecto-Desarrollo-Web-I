import { obtenerCursoPorId, obtenerProgresoUsuario, actualizarProgresoModulo } from './detallesCursosServices.js';
import { getCurrentUserId } from './firebase/firebaseConfig.js';

import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get('id');

function cargarDetallesCurso() {
    if (!cursoId) {
        alert('No se especificó un curso.');
        window.location.href = '../../../mis_cursos.html';
        return;
    }

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            try {
                const [cursoResult, progresoResult] = await Promise.all([
                    obtenerCursoPorId(cursoId),
                    obtenerProgresoUsuario(userId)
                ]);

                if (cursoResult.success) {
                    const curso = cursoResult.data;
                    const progreso = progresoResult.success ? (progresoResult.data[cursoId] || {}) : {};
                    renderizarCurso(curso, progreso, userId);
                } else {
                    alert('Error al cargar el curso: ' + cursoResult.error);
                    window.location.href = '../../../mis_cursos.html';
                }
            } catch (error) {
                console.error('Error loading course details:', error);
                alert('Error al cargar los detalles del curso');
            }
        } else {
            // User is not signed in
            console.log("User not authenticated, redirecting to login.");
            window.location.href = '../../../html/login.html';
        }
    });
}

function renderizarCurso(curso, progreso, userId) {
    document.title = `NORT3 - ${curso.nombre}`;
    
    setText('curso-titulo', curso.titulo);
    setText('curso-descripcion', curso.descripcion);

    renderizarModulos(curso.contenidoDelCurso, curso.id, progreso, userId);
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text || 'No especificado';
    }
}

function renderizarModulos(modulos, cursoId, progresoCurso, userId) {
    const contenedor = document.getElementById('modulos-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    console.log('Rendering modules with cursoId:', cursoId);
    const modulosProgreso = progresoCurso.modulos || {};

    if (modulos && Array.isArray(modulos)) {
        modulos.forEach((modulo, index) => {
            const article = document.createElement('article');
            article.className = 'modulo';

            const h2 = document.createElement('h2');
            h2.textContent = modulo.tituloModulo || `Módulo ${index + 1}`;

            const p = document.createElement('p');
            p.textContent = modulo.descripcionModulo || 'Sin descripción';

            // Determine status
            const moduloEstado = modulosProgreso[index] ? modulosProgreso[index].estado : 'Pendiente';
            
            const spanProgreso = document.createElement('span');
            spanProgreso.textContent = `Estado: ${moduloEstado}`;
            spanProgreso.className = `estado-modulo ${moduloEstado.toLowerCase().replace(' ', '-')}`;
            
            // Style based on status
            if (moduloEstado === 'Completado') {
                spanProgreso.style.color = 'green';
                spanProgreso.style.fontWeight = 'bold';
            } else if (moduloEstado === 'En progreso') {
                spanProgreso.style.color = 'orange';
                spanProgreso.style.fontWeight = 'bold';
            } else {
                spanProgreso.style.color = 'gray';
            }

            const btnCuestionario = document.createElement('a');
            const quizUrl = `cuestionario.html?cursoId=${cursoId}&modulo=${index}`;
            btnCuestionario.href = quizUrl;
            btnCuestionario.className = 'btn-cuestionario';
            btnCuestionario.textContent = moduloEstado === 'Completado' ? 'Ver Resultados' : 'Ir al Cuestionario';

            article.appendChild(h2);
            article.appendChild(p);
            article.appendChild(spanProgreso);
            article.appendChild(document.createElement('br'));
            article.appendChild(btnCuestionario);

            contenedor.appendChild(article);
        });
    }
}

document.addEventListener('DOMContentLoaded', cargarDetallesCurso);
