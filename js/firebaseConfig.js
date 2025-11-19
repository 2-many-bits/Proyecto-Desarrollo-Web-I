// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAORVP1TlF9ECsFLaIUODkPRqfcS8UydGY",
	authDomain: "nort3-1f32f.firebaseapp.com",
	projectId: "nort3-1f32f",
	storageBucket: "nort3-1f32f.firebasestorage.app",
	messagingSenderId: "698900268988",
	appId: "1:698900268988:web:6f49473a7747fbc6f50db9",
	measurementId: "G-ZB4GZH5T1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();