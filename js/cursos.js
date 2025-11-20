import {obtenerTodosLosCursos} from './detallesCursosServices.js';
import {getCurrentUserId, getUser} from './firebase/firebaseConfig.js';

// Obtenemos el contenedor principal
const contenedorCursos = document.getElementById("cursos");

async function cargarCursos() {
    //Limpiamos el contenedor
    contenedorCursos.innerHTML = "";

    //Se carga la información del usuario y los cursos
    try {
        const informacionCursos = await obtenerTodosLosCursos();
        const cursos = [...informacionCursos.data];

        const userId = await getCurrentUserId();
        const user = await getUser(userId);
        const cursosUsuario = user.cursos != undefined ? user.cursos : [];

            for(let curso of cursos) {
                
                if (cursosUsuario.includes(curso.id)) {
                    continue;
                };

                //Si el usuario no tiene el curso inscrito se construye la tarjeta

                const tituloCurso = curso.nombre;
                const descripcionCurso = curso.descripcion;
                const img = curso.imagen;

                const titulo = document.createElement("h3");
                titulo.classList.add("titulo-caja");
                titulo.innerHTML = tituloCurso;

                const parrafo = document.createElement("p");
                parrafo.classList.add("descripcion");
                parrafo.innerHTML = descripcionCurso;

                const boton = document.createElement("a");
                boton.href="../detallesCursosSinAdquirir";
                boton.classList.add("btn-caja");
                boton.innerHTML = "Comenzar ahora";

                const seccion = document.createElement("section");
                seccion.classList.add("informacion");
                seccion.appendChild(titulo);
                seccion.appendChild(parrafo);
                seccion.appendChild(boton);

                const imagen = document.createElement("img");
                imagen.src = img;
                imagen.classList.add("imagen-caja");

                const tarjeta = document.createElement("article");
                tarjeta.classList.add("caja");
                tarjeta.appendChild(imagen);
                tarjeta.appendChild(seccion);

                //Se agrega la tarjeta al contenedor
                contenedorCursos.appendChild(tarjeta);
            };
    } catch (error) {
        alert("Algo ha salido mal, vuelve a iniciar sesión");
        console.log(error);
    }
};

//Vinculamos la funcion al evento de carga de la ventana
window.addEventListener("load", cargarCursos);