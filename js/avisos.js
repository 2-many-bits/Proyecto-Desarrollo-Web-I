// IMPORTAR LA CONEXION A FIREBASE DESDE FIREBASECONFIG
import { db } from "./firebase/firebaseConfig.js";

// IMPORTAR FUNCIONES DE FIRESTORE
import { addDoc,
    collection,
    serverTimestamp, query, orderBy, getDocs, getDoc, updateDoc, deleteDoc, doc
 } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// Coleccion de avisos
const COLLECTION_NAME = 'avisos';

// Coleccion de categorias
const CATEGORIA = 'categoria';

// Los avisos
const avisos = [];

 try {
    const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('fechaCreacion', 'desc')
    );

    const result = await getDocs(q);
    result.forEach((doc) => {
        avisos.push({
            id: doc.id,
            ...doc.data()
        });
    });
    console.log(avisos);

} catch (error) {
    console.log('Error para recibir los datos');
}


const categorias= [];

 try {
    const q = query(
        collection(db, CATEGORIA)
    );

    const result = await getDocs(q);
    result.forEach((doc) => {
        categorias.push({
            id: doc.id,
            ...doc.data()
        });
    });
    console.log(categorias);

} catch (error) {
    console.log('Error para recibir los datos');
}

const  determinarCategoria = function(categoria) {

   // Si no hay datos, mostrar mensaje
    if (categorias.length === 0) {
      console.log('No hay categorias disponibles');
      return;
    }

    const encontrado = categorias.find(element => element.id === categoria);
    if (encontrado) {
        return encontrado;
    }
    return {
        nombre: "Sin categoría",
        boton: "Ver más",
        icono: "fa fa-newspaper-o",
        enlace: null
    };
}

// Funcion para crear y agregar los avisos
async function mostrarAvisos() {

    // Encontrar el contenedor de los avisos destacados
    const destacados = document.querySelector("#avisos-destacados .contenedor-avisos");

    // Encontrar el contenedor de los avisos recientes
    const recientes = document.querySelector("#avisos-recientes .contenedor-avisos");
    // Si no hay datos, mostrar mensaje
    if (avisos.length === 0) {
        destacados.innerHTML = '<div><p>No hay avisos destacados</p></div>';
        recientes.innerHTML = '<div><p>No hay avisos recientes</p></div>';
        return;
    }
    // Crear HTML para cada alumno
    avisos.forEach(aviso => {
      const categoriaInformacion = determinarCategoria(aviso.categoriaId);
      console.log(categoriaInformacion);
      const nombreCategoria = categoriaInformacion.nombre;
      const botonFrase = categoriaInformacion.boton;
      const iconoCategoria = categoriaInformacion.icono;
      let destacado = "";
      const rutaBoton = categoriaInformacion.enlace;

      if (aviso.destacado) {destacado = "destacado"}

      const contenido = `

      <article class="tarjeta-aviso ${destacado}">
                    <div class="encabezado-aviso">
                        <span class="etiqueta ${nombreCategoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}s">
                            <i class="${iconoCategoria}"></i> ${nombreCategoria}
                        </span>
                    </div>
                    <h3>${aviso.titulo}</h3>
                    <p class="descripcion-aviso">
                        ${aviso.descripcion}
                    </p>
                    <a href="${rutaBoton}.html" class="btn-ver-mas">${botonFrase}</a>
                </article>

      `
      if (aviso.destacado) 
        {
          destacados.innerHTML +=contenido;
        } 
      else {
        recientes.innerHTML += contenido
      }
    });
    }

    // Función principal que se ejecuta al cargar la página
async function init() {
  try {
    await mostrarAvisos();
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
}

// Ejecutar cuando el HTML esté completamente cargado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}