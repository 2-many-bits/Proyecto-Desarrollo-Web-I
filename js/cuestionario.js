import { obtenerCursoPorId, actualizarProgresoModulo, obtenerProgresoUsuario } from './detallesCursosServices.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get('cursoId');
// Accept both 'modulo' and 'moduloIndex' for compatibility
const moduloParam = urlParams.get('modulo') || urlParams.get('moduloIndex');
const moduloIndex = parseInt(moduloParam);

console.log('=== CUESTIONARIO DEBUG ===');
console.log('Current URL:', window.location.href);
console.log('URL Search params:', window.location.search);
console.log('cursoId:', cursoId);
console.log('modulo param (raw):', urlParams.get('modulo'));
console.log('moduloIndex param (raw):', urlParams.get('moduloIndex'));
console.log('moduloParam (selected):', moduloParam);
console.log('moduloIndex (parsed):', moduloIndex);
console.log('========================');

let cursoData = null;
let moduloData = null;
let cuestionarioData = null;
let userId = null;

/**
 * Inicializa la página del cuestionario
 */
function inicializarCuestionario() {
    if (!cursoId || isNaN(moduloIndex)) {
        console.error('Invalid parameters detected:');
        console.error('cursoId:', cursoId, 'isValid:', !!cursoId);
        console.error('moduloIndex:', moduloIndex, 'isNaN:', isNaN(moduloIndex));
        mostrarError('Parámetros inválidos en la URL');
        return;
    }

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            try {
                // Obtener datos del curso desde Firebase
                const resultado = await obtenerCursoPorId(cursoId);
                
                if (!resultado.success) {
                    mostrarError('No se pudo cargar el curso');
                    return;
                }

                cursoData = resultado.data;
                moduloData = cursoData.contenidoDelCurso[moduloIndex];
                
                if (!moduloData) {
                    mostrarError('Módulo no encontrado');
                    return;
                }

                cuestionarioData = moduloData.cuestionario;
                
                if (!cuestionarioData || cuestionarioData.length === 0) {
                    mostrarError('Este módulo no tiene cuestionario disponible');
                    return;
                }

                // Verificar estado del módulo y actualizar a "En progreso" si es "Pendiente"
                console.log('Fetching user progress...');
                const progresoResult = await obtenerProgresoUsuario(userId);
                console.log('Progress result:', progresoResult);
                
                const progresoCurso = progresoResult.success ? (progresoResult.data[cursoId] || {}) : {};
                const modulosProgreso = progresoCurso.modulos || {};
                const moduloEstado = modulosProgreso[moduloIndex] ? modulosProgreso[moduloIndex].estado : 'Pendiente';

                console.log('Current module estado:', moduloEstado);
                console.log('Progreso del curso:', progresoCurso);
                console.log('Modulos progreso:', modulosProgreso);

                if (moduloEstado === 'Pendiente') {
                    console.log('Módulo está Pendiente, actualizando a En progreso...');
                    const updateResult = await actualizarProgresoModulo(userId, cursoId, moduloIndex, 'En progreso', 0, cursoData.contenidoDelCurso.length);
                    console.log('Update result:', updateResult);
                }

                // Renderizar la página
                renderizarTitulo();
                renderizarVideo();
                renderizarPreguntas();
                configurarFormulario();
                
            } catch (error) {
                console.error('Error al inicializar cuestionario:', error);
                mostrarError('Ocurrió un error al cargar el cuestionario');
            }
        } else {
            // User is not signed in
            mostrarError('Debes iniciar sesión para realizar el cuestionario');
            setTimeout(() => window.location.href = '../../../html/login.html', 2000);
        }
    });
}

/**
 * Renderiza el título del módulo
 */
function renderizarTitulo() {
    const tituloElement = document.getElementById('titulo-modulo');
    const descripcionElement = document.getElementById('descripcion-modulo');
    
    tituloElement.textContent = `Cuestionario: ${moduloData.tituloModulo}`;
    descripcionElement.textContent = moduloData.descripcionModulo || 'Responde las siguientes preguntas para completar el módulo.';
}

/**
 * Renderiza el video del módulo
 */
function renderizarVideo() {
    const videoContainer = document.getElementById('video-container');
    
    if (moduloData.videoModulo) {
        const iframe = document.createElement('iframe');
        iframe.src = moduloData.videoModulo;
        iframe.width = '560';
        iframe.height = '315';
        iframe.title = 'YouTube video player';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        
        videoContainer.appendChild(iframe);
    } else {
        videoContainer.style.display = 'none';
    }
}

/**
 * Renderiza las preguntas del cuestionario
 */
function renderizarPreguntas() {
    const form = document.getElementById('form-cuestionario');
    const submitButton = form.querySelector('.btn-enviar');
    
    // Limpiar preguntas existentes
    const preguntasExistentes = form.querySelectorAll('.pregunta');
    preguntasExistentes.forEach(p => p.remove());
    
    // Crear preguntas dinámicamente
    cuestionarioData.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta';
        
        const titulo = document.createElement('h3');
        titulo.textContent = `${index + 1}. ${pregunta.pregunta}`;
        preguntaDiv.appendChild(titulo);
        
        const opcionesDiv = document.createElement('div');
        opcionesDiv.className = 'opciones';
        
        pregunta.opciones.forEach((opcion, opcionIndex) => {
            const label = document.createElement('label');
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `pregunta${index}`;
            input.value = opcion;
            input.required = true;
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${opcion}`));
            opcionesDiv.appendChild(label);
        });
        
        preguntaDiv.appendChild(opcionesDiv);
        form.insertBefore(preguntaDiv, submitButton);
    });
}

/**
 * Configura el evento submit del formulario
 */
function configurarFormulario() {
    const form = document.getElementById('form-cuestionario');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        evaluarRespuestas();
    });
}

/**
 * Evalúa las respuestas del usuario
 */
async function evaluarRespuestas() {
    const form = document.getElementById('form-cuestionario');
    const formData = new FormData(form);
    
    let correctas = 0;
    let total = cuestionarioData.length;
    const resultados = [];
    
    cuestionarioData.forEach((pregunta, index) => {
        const respuestaUsuario = formData.get(`pregunta${index}`);
        const esCorrecta = respuestaUsuario === pregunta.respuestaCorrecta;
        
        if (esCorrecta) {
            correctas++;
        }
        
        resultados.push({
            pregunta: pregunta.pregunta,
            respuestaUsuario,
            respuestaCorrecta: pregunta.respuestaCorrecta,
            esCorrecta
        });
    });
    
    mostrarResultados(correctas, total, resultados);

    // Si todas las respuestas son correctas, actualizar progreso
    if (correctas === total) {
        try {
            const totalModulos = cursoData.contenidoDelCurso.length;
            await actualizarProgresoModulo(
                userId, 
                cursoId, 
                moduloIndex, 
                'Completado', 
                100, 
                totalModulos
            );
            console.log('Progreso actualizado a Completado');
        } catch (error) {
            console.error('Error al actualizar progreso:', error);
        }
    }
}

/**
 * Muestra los resultados del cuestionario
 */
function mostrarResultados(correctas, total, resultados) {
    const resultadoDiv = document.getElementById('resultado-cuestionario');
    const porcentaje = Math.round((correctas / total) * 100);
    const aprobado = porcentaje === 100; // Solo se aprueba con 100% según requerimientos
    
    resultadoDiv.innerHTML = `
        <div class="resultado-header ${aprobado ? 'aprobado' : 'reprobado'}">
            <h2>${aprobado ? '¡Felicidades! Módulo Completado' : 'Inténtalo de nuevo'}</h2>
            <p class="puntuacion">Obtuviste ${correctas} de ${total} respuestas correctas (${porcentaje}%)</p>
            ${!aprobado ? '<p>Necesitas obtener todas las respuestas correctas para completar el módulo.</p>' : ''}
        </div>
        
        <div class="detalles-respuestas">
            <h3>Detalles de tus respuestas:</h3>
            ${resultados.map((resultado, index) => `
                <div class="respuesta-detalle ${resultado.esCorrecta ? 'correcta' : 'incorrecta'}">
                    <h4>Pregunta ${index + 1}: ${resultado.pregunta}</h4>
                    <p><strong>Tu respuesta:</strong> ${resultado.respuestaUsuario}</p>
                    ${!resultado.esCorrecta ? `<p><strong>Respuesta correcta:</strong> ${resultado.respuestaCorrecta}</p>` : ''}
                    <span class="icono">${resultado.esCorrecta ? '✓' : '✗'}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="acciones-resultado">
            ${!aprobado ? '<button class="btn-reintentar" onclick="location.reload()">Volver a intentar</button>' : ''}
            <button class="btn-volver" onclick="history.back()">Volver al curso</button>
        </div>
    `;
    
    resultadoDiv.classList.remove('resultado-oculto');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Ocultar el formulario
    document.getElementById('form-cuestionario').style.display = 'none';
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
    const container = document.querySelector('.cuestionario-container');
    container.innerHTML = `
        <div class="error-mensaje">
            <h2>Error</h2>
            <p>${mensaje}</p>
            <button onclick="history.back()">Volver</button>
        </div>
    `;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarCuestionario);
