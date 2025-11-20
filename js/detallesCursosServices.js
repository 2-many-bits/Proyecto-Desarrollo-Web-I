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
	orderBy,
    arrayUnion
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

/**
 * Inscribe a un usuario en un curso.
 * @param {string} userId - El ID del usuario.
 * @param {string} cursoId - El ID del curso.
 */
export async function inscribirCurso(userId, cursoId) {
    try {
        const userRef = doc(db, "Users", userId);
        
        await updateDoc(userRef, {
            cursos: arrayUnion(cursoId)
        });
        return { success: true };
    } catch (error) {
        console.error("Error al inscribir al curso:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtiene el progreso del usuario.
 * @param {string} userId - El ID del usuario.
 */
export async function obtenerProgresoUsuario(userId) {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { success: true, data: userSnap.data().progreso || {} };
        } else {
            return { success: false, error: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error("Error al obtener progreso:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Actualiza el progreso de un módulo específico.
 * @param {string} userId - El ID del usuario.
 * @param {string} cursoId - El ID del curso.
 * @param {number} moduloIndex - El índice del módulo.
 * @param {string} estado - El nuevo estado ("Pendiente", "En progreso", "Completado").
 * @param {number} score - El puntaje obtenido (opcional).
 * @param {number} totalModulos - El número total de módulos en el curso (para calcular porcentaje).
 */
export async function actualizarProgresoModulo(userId, cursoId, moduloIndex, estado, score = 0, totalModulos = 0) {
    try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            throw new Error("Usuario no encontrado");
        }

        const userData = userSnap.data();
        let progreso = userData.progreso || {};
        
        // Inicializar estructura si no existe
        if (!progreso[cursoId]) {
            progreso[cursoId] = {
                modulos: {},
                porcentaje: 0,
                completado: false,
                fechaInicio: serverTimestamp()
            };
        }

        // Actualizar módulo
        progreso[cursoId].modulos[moduloIndex] = {
            estado: estado,
            score: score,
            fechaActualizacion: Date.now() // Usamos Date.now() para evitar problemas con serverTimestamp en objetos anidados complejos si no es necesario
        };

        // Calcular nuevo porcentaje si se proporciona totalModulos
        if (totalModulos > 0) {
            let modulosCompletados = 0;
            for (let i = 0; i < totalModulos; i++) {
                if (progreso[cursoId].modulos[i] && progreso[cursoId].modulos[i].estado === 'Completado') {
                    modulosCompletados++;
                }
            }
            
            const nuevoPorcentaje = Math.round((modulosCompletados / totalModulos) * 100);
            progreso[cursoId].porcentaje = nuevoPorcentaje;
            
            if (modulosCompletados === totalModulos) {
                progreso[cursoId].completado = true;
                progreso[cursoId].fechaFin = Date.now();
                
                // Agregar certificación si no existe
                let certificaciones = userData.certificaciones || [];
                if (!certificaciones.includes(cursoId)) {
                    certificaciones.push(cursoId);
                    await updateDoc(userRef, { certificaciones: certificaciones });
                }
            }
        }

        // Actualizar documento
        await updateDoc(userRef, {
            progreso: progreso
        });

        // Verificar logros
        await verificarLogros(userId, userData, progreso);

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar progreso:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Verifica y desbloquea logros del usuario.
 * @param {string} userId 
 * @param {object} userData 
 * @param {object} progreso 
 */
async function verificarLogros(userId, userData, progreso) {
    const logros = userData.logros || [];
    let nuevosLogros = [];

    // Logro: Bienvenido a NORT3 (Primer ingreso/acción)
    if (!logros.includes("bienvenido_nort3")) {
        nuevosLogros.push("bienvenido_nort3");
    }

    // Logro: Primer curso completado
    const cursosCompletados = Object.values(progreso).filter(p => p.completado).length;
    if (cursosCompletados >= 1 && !logros.includes("primer_curso_completado")) {
        nuevosLogros.push("primer_curso_completado");
    }

    // Logro: 3 cursos completados
    if (cursosCompletados >= 3 && !logros.includes("tres_cursos_completados")) {
        nuevosLogros.push("tres_cursos_completados");
    }
    
    // Logro: 5 cursos completados
    if (cursosCompletados >= 5 && !logros.includes("cinco_cursos_completados")) {
        nuevosLogros.push("cinco_cursos_completados");
    }

    if (nuevosLogros.length > 0) {
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, {
            logros: arrayUnion(...nuevosLogros)
        });
    }
}