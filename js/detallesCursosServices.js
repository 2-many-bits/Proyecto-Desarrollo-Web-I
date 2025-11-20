import {db} from './firebase/firebaseConfig.js'
import {
	addDoc,
	collection,
	serverTimestamp,
	query,
	getDocs,
	getDoc,
	updateDoc,
	deleteDoc,
	doc,
	orderBy
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js'

const COLLECTION_NAME = "Cursos"

export async function crearCurso(cursoData){
	try{
		const docRef = await addDoc(collection(db, COLLECTION_NAME), {
			...cursoData,
			createdAt: serverTimestamp(),
			updateAt: serverTimestamp(),
		})
		return {success: true, id: docRef.id}
	} catch (error) {
		console.error('Error al crear el curso:', error)
		return {success: false, error: error.message}
	}
}

/**
 * Obtiene todos los cursos de la base de datos.
 */
export async function obtenerTodosLosCursos(){
	try{
		const q = query(
			collection(db, COLLECTION_NAME),
			orderBy('createdAt', 'desc')
		);

		const result = await getDocs(q);
		const cursos = [];
		result.forEach(doc => {
			cursos.push({
				id:doc.id,
				...doc.data()
			})
		})
		return {success: true, data: cursos}
	}catch (error) {
        console.error('Error al obtener todos los cursos:', error);
		return {success: false, error: error.message}
	}
}

/**
 * Obtiene un curso específico por su ID.
 * @param {string} cursoId - El ID del curso a obtener.
 */
export async function obtenerCursoPorId(cursoId){
	try{
		const docRef = doc(db, COLLECTION_NAME, cursoId);
		const result = await getDoc(docRef)

		if (result.exists()){
			return {
				success: true,
				data: {
					id:result.id,...result.data()
				}
			}
		} else {
            return { success: false, error: "No se encontró ningún curso con el ID proporcionado." };
        }
	} catch (error){
        console.error(`Error al obtener el curso con ID ${cursoId}:`, error);
		return {success: false, error: error.message}
	}
}

/**
 * Actualiza los datos de un curso existente.
 * @param {string} cursoId - El ID del curso a actualizar.
 * @param {object} cursoData - Los nuevos datos para el curso.
 */
export async function actualizarCurso(cursoId, cursoData){
	try{
		const docRef = doc(db, COLLECTION_NAME, cursoId);
		await updateDoc(docRef, {
			...cursoData,
			updateAt: serverTimestamp()
		});
		return {success: true}
	}catch (error) {
        console.error(`Error al actualizar el curso con ID ${cursoId}:`, error);
		return {success: false, error: error.message}
	}
}

/**
 * Borra un curso de la base de datos.
 * @param {string} cursoId - El ID del curso a borrar.
 */
export async function borrarCurso(cursoId){
	try {
		const docRef = doc(db, COLLECTION_NAME, cursoId);
		await deleteDoc(docRef);
		return {success: true}
	} catch (error) {
        console.error(`Error al borrar el curso con ID ${cursoId}:`, error);
		return {success: false, error: error.message}
	}
}