//Este archivo se usará en todas las páginas para poder hacer el logout
import {onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { auth } from './firebase/firebaseConfig.js';

onAuthStateChanged(auth, async (user) => {
    if (user) {

    } else {
        window.location.href = "../html/login.html";
    }
});

document.getElementById("idBtnLogout").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "../html/login.html";
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
    }
});