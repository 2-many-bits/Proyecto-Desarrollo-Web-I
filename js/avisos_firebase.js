// Importar las funciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";;
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDTgcA9VRYafPT09Q8pXmLqB4UXGRJ4u1s",
  authDomain: "nort3-avisos.firebaseapp.com",
  projectId: "nort3-avisos",
  storageBucket: "nort3-avisos.firebasestorage.app",
  messagingSenderId: "882536227722",
  appId: "1:882536227722:web:e7b72345b4f71ada641e73",
  measurementId: "G-WR66JN3BY4"
};

// Inicializar Firebase con tu configuración
const app = initializeApp(firebaseConfig);
const db=getFirestore(app)
export {db}
