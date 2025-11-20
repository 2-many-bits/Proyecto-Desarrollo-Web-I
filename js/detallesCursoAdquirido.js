import { obtenerCursoPorId } from './detallesCursosServices.js';

const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get('id');

async function cargarDetallesCurso() {
    if (!cursoId) {
        alert('No se especificó un curso.');
        window.location.href = '../../../mis_cursos.html';
        return;
    }

    const resultado = await obtenerCursoPorId(cursoId);

    if (resultado.success) {
        const curso = resultado.data;
        renderizarCurso(curso);
    } else {
        alert('Error al cargar el curso: ' + resultado.error);
        window.location.href = '../../../mis_cursos.html';
    }
}

function renderizarCurso(curso) {
    document.title = `NORT3 - ${curso.nombre}`;
    
    setText('curso-titulo', curso.titulo);
    setText('curso-descripcion', curso.descripcion);

    renderizarModulos(curso.contenidoDelCurso, curso.id);
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text || 'No especificado';
    }
}

function renderizarModulos(modulos, cursoId) {
    const contenedor = document.getElementById('modulos-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    console.log('Rendering modules with cursoId:', cursoId);

    if (modulos && Array.isArray(modulos)) {
        modulos.forEach((modulo, index) => {
            const article = document.createElement('article');
            article.className = 'modulo';

            const h2 = document.createElement('h2');
            h2.textContent = modulo.tituloModulo || `Módulo ${index + 1}`;

            const p = document.createElement('p');
            p.textContent = modulo.descripcionModulo || 'Sin descripción';

            const spanProgreso = document.createElement('span');
            spanProgreso.textContent = 'Progreso: 0%'; // Placeholder

            const btnCuestionario = document.createElement('a');
            // Both files are in the same directory: html/cursos/plantillas/
            const quizUrl = `cuestionario.html?cursoId=${cursoId}&modulo=${index}`;
            console.log(`Module ${index} quiz URL:`, quizUrl);
            btnCuestionario.href = quizUrl;
            btnCuestionario.className = 'btn-cuestionario';
            btnCuestionario.textContent = 'Ir al Cuestionario';

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
