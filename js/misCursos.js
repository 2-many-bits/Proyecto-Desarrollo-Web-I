import {obtenerTodosLosCursos} from './detallesCursosServices.js';
import {getCurrentUserId, getUser} from './firebase/firebaseConfig.js';

const contenedor = document.getElementById("tarjetas");

async function cargarCursosInscritos() {
    contenedor.innerHTML = "";
    try {
        const informacionCursos = await obtenerTodosLosCursos();
        const cursos = [...informacionCursos.data];
        
        const userId = await getCurrentUserId();
        const user = await getUser(userId);

        const cursosUsuario = user.cursos == undefined ? [] : user.cursos;

        if (cursosUsuario.length == 0) {
            contenedor.innerHTML = "<h2>Aún no tienes cursos inscritos!</h2>";
        } else {
            for (let curso of cursos) {
                if (cursosUsuario.includes(curso.id)) {
                    const porcentaje = document.createElement("p");
                    porcentaje.innerHTML = curso.porcentaje == undefined ? "0%" : `${porcentaje}%`;
                    porcentaje.classList.add("porcentaje");

                    const boton = document.createElement("a");
                    boton.classList.add("boton");
                    boton.href = `cursos/plantillas/detallesCursosAdquirido.html?id=${curso.id}`; //Enlace corregido
                    boton.innerHTML = "Continuar";

                    const footerCurso = document.createElement("div");
                    footerCurso.classList.add("footer-curso");
                    footerCurso.appendChild(porcentaje);
                    footerCurso.appendChild(boton);

                    const tituloCurso = document.createElement("h3");
                    tituloCurso.classList.add("titulo-curso");
                    tituloCurso.innerHTML = curso.nombre;

                    const descripcionCurso = document.createElement("p");
                    descripcionCurso.classList.add("descripcion");
                    descripcionCurso.innerHTML = curso.descripcion;

                    const seccion = document.createElement("section");
                    seccion.classList.add("contenido-tarjeta");
                    seccion.appendChild(tituloCurso);
                    seccion.appendChild(descripcionCurso);
                    seccion.appendChild(footerCurso);

                    const img = document.createElement("img");
                    img.src = curso.imagen;
                    img.classList.add("imagen-curso");

                    const articulo = document.createElement("article");
                    articulo.classList.add("tarjeta");
                    articulo.appendChild(img);
                    articulo.appendChild(seccion);

                    contenedor.appendChild(articulo);
                } else {
                    continue;
                }
            };
        };
    } catch (error) {
        alert("Algo ha salido mal, intenta cerrar y volver a iniciar sesión");
        console.log("Error al cargar información: ", error);
    };
};

window.addEventListener("load", cargarCursosInscritos);