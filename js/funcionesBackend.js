// @ts-check
"use strict"

/* --------FUNCIONES, PT. 1:------- */
/* ------------"BACKEND"----------- */

/**
 * Recupera y retorna un array con todas las tareas que estén en {@link Storage|`Storage`}, cada vez que se recarga la página web.
 * @returns {Tarea[]} Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de objetos recuperados desde {@link Storage|`Storage`}.
 */
const recuperarTareasDesdeStorage = function () {
	/** 
	 * Un array con todos los objetos que están alojados actualmente en {@link Storage|`Storage`}.
	 * @type {string[]}
	*/
	const objetosEnStorage = Object.values(localStorage)

	/**
	 * Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de objetos recuperados desde {@link Storage|`Storage`}.
	 * @type {Tarea[]}
	 */
	const arrayDeTareasEnStorage = objetosEnStorage.map(obj => {
		/**
		 * Un objeto "tipo {@link Tarea|`Tarea`}" recuperado desde {@link Storage|`Storage`} *(por haberse guardado en {@link Storage|`Storage`}, ha perdido su clase {@link Tarea|`Tarea`}, pero mantiene todas sus propiedades)*.
		 * @type {Object}
		 */
		const tareaEnStorageRecuperada = JSON.parse(obj)
		/**
		 * Una instancia de la clase {@link Tarea|`Tarea`}, regenerada a partir de una {@link tareaEnStorageRecuperada|`tareaEnStorageRecuperada`}.
		 * @type {Tarea}
		 */
		const tareaEnStorageRegenerada = Object.assign(new Tarea(), tareaEnStorageRecuperada)
		return tareaEnStorageRegenerada
	})

	return arrayDeTareasEnStorage
}

/**
 * Solicita información a un archivo JSON, pasando como argumento su ruta y controlando errores. Retorna un objeto {@link Response|`Response`} en forma de promesa.
 * @param {RequestInfo | URL} jsonFilePath Ruta de un archivo JSON (disponible de forma local o en línea).
 * @returns {Promise<Response>} Una promesa que resuelve a un objeto {@link Response|`Response`}, cuya propiedad {@link Response.body|`body`} contiene (en formato JSON) un array con objetos que poseen sólo las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}, y que están destinados a (eventualmente) mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
 */
const solicitarRespuestaAArchivoJSONControlandoErrores = async jsonFilePath => {
	/**
	 * Un objeto {@link Response|`Response`} cuya propiedad {@link Response.body|`body`} contiene (en formato JSON) un array con objetos que poseen sólo las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}, y que están destinados a (eventualmente) mostrarse por defecto cuando no haya tareas ingresadas por el usuario. 
	 * @type {Response} 
	 */
	let respuesta

	try {
		respuesta = await fetch(jsonFilePath)
		if (!respuesta.ok) {
			throw new SyntaxError(`Ruta de archivo JSON "${jsonFilePath}" mal escrita o inaccesible`)
		}
	} catch (error) {
		// PLAN B, DE 2 PASOS:
		// 1.- Crear un array con 1 tarea para mostrar por defecto, ya que confirmamos que se produjo un error mientras se solicitaba una respuesta con la información requerida al archivo JSON especificado:
		const arrayDeTareasEnCasoDeError = [{
			descripcion: "Bah, qué raro...deberían mostrarse las instrucciones de cómo usar esta aplicación...🤔...¡pero no te preocupes, que yo te acompaño mientras tanto! 😊",
			completacion: false
		}]
		// 2.- Pasar el array de emergencia a formato JSON, y convertir el resultado en un objeto `Response`, cuyo `body` será "parseado" más adelante por `.json()`:
		respuesta = new Response(JSON.stringify(arrayDeTareasEnCasoDeError))
	}

	return respuesta
}
/**
 * Genera y retorna un array con instancias de la clase {@link Tarea|`Tarea`} (recuperadas y regeneradas a partir del resultado del "parseo" de un {@link respuesta|objeto `Response`}, y destinadas a mostrarse por defecto cuando no haya tareas ingresadas por el usuario), en forma de promesa.
 * @param {Response} respuesta Un objeto {@link Response|`Response`}, cuya propiedad {@link Response.body|`body`} contiene (en formato JSON) un array con objetos que poseen sólo las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}.
 * @returns {Promise<Tarea[]>} Una promesa que resuelve a un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de objetos traídos desde un objeto {@link Response|`Response`}, y destinadas a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
 */
const traerTareasPorDefectoDesdeRespuesta = async respuesta => {
	/**
	 * Un array con objetos que poseen sólo las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}, pero que se convertirán a instancias de la misma, destinadas a mostrarse por defecto cuando no haya tareas ingresadas por el usuario. Obtenido desde un objeto {@link Response|`Response`}.
	 * @type {{descripcion: string, completacion: boolean}[]}
	 */
	const objetosPorDefectoRecuperados = await /** @type Promise<{descripcion: string, completacion: boolean}[]> */(respuesta.json())
	/**
	 * Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de {@link objetosPorDefectoRecuperados|`objetosPorDefectoRecuperados`}, y que se mostrarán por defecto cuando no haya tareas ingresadas por el usuario.
	 * @type {Tarea[]}
	 */
	const arrayDeTareasPorDefecto = objetosPorDefectoRecuperados.map((objetoPorDefectoRecuperado, idx) => {
		/**
		 * Una instancia de la clase {@link Tarea|`Tarea`}, regenerada a partir de un elemento de {@link objetosPorDefectoRecuperados|`objetosPorDefectoRecuperados`}, y destinada a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
		 * @type {Tarea}
		*/
		const tareaPorDefectoRegenerada = Object.assign(new Tarea(), objetoPorDefectoRecuperado)
		// Añadí el índice dentro del id de la tarea, con la intención de que estas se ordenaran correctamente en el documento HTML, pues una vez regeneradas, todas ellas tienen el mismo id, lo cual impide generar la ordenación deseada (invertí el orden de los objetos en el archivo JSON con el mismo fin):
		tareaPorDefectoRegenerada.id = `${tareaPorDefectoRegenerada.msDeCreacion}${idx + 1} - ${tareaPorDefectoRegenerada.fechaYHoraLocalesDeCreacion}`
		return tareaPorDefectoRegenerada
	})

	return arrayDeTareasPorDefecto
}

/** 
 * Recupera y retorna un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas desde todas las tareas que estén en {@link Storage|`Storage`}, o bien (si {@link Storage|`Storage`} no contiene tareas ingresadas por el usuario), desde un {@link jsonFilePath|archivo JSON} o (en caso de error de {@link fetch|`fetch()`}) un objeto {@link Response|`Response`} con un array de 1 tarea especialmente fabricado para emergencias.
 * @param {RequestInfo | URL} jsonFilePath Ruta de un archivo JSON (disponible de forma local o en línea).
 * @returns {Promise<Tarea[]>} Una promesa que resuelve a un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un {@link jsonFilePath|archivo JSON}/un objeto {@link Response|`Response`} con un array de 1 tarea preparado en caso de error de {@link fetch|`fetch()`} del {@link jsonFilePath|archivo JSON}.
*/
async function recuperarTareas(jsonFilePath) {
	/**
	 * Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de objetos recuperados desde {@link Storage|`Storage`}.
	 * @type {Tarea[]}
	 */
	const arrayDeTareasEnStorage = recuperarTareasDesdeStorage()

	// Si se logró recuperar tareas desde Storage (es decir, si Storage contiene al menos 1 tarea ingresada por el usuario):
	if (arrayDeTareasEnStorage.length > 0) {
		return arrayDeTareasEnStorage
		// De otro modo, si Storage está vacío:
	} else {
		/**
		 * Un objeto {@link Response|`Response`} cuya propiedad {@link Response.body|`body`} contiene (en formato JSON) un array con objetos que poseen sólo las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}, y que están destinados a (eventualmente) mostrarse por defecto cuando no haya tareas ingresadas por el usuario. 
		 * @type {Response} 
		 */
		const respuesta = await solicitarRespuestaAArchivoJSONControlandoErrores(jsonFilePath)
		/**
		 * Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de los elementos de un array, elementos los cuales poseen sólo las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}, y que a su vez derivan de un objeto {@link Response|`Response`}. Destinado a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
		 * @type {Tarea[]}
		 */
		const arrayDeTareasPorDefecto = await traerTareasPorDefectoDesdeRespuesta(respuesta)
		return arrayDeTareasPorDefecto
	}
}

/**
 * Ordena todas las tareas recuperadas con {@link recuperarTareas|`recuperarTareas`} dentro de un {@link arrayDeTareas|`arrayDeTareas`}, y las adjunta a una {@link lista|`lista`} en un documento HTML, cada vez que se recarga la página web.
 * @param {Tarea[]} arrayDeTareas Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un {@link jsonFilePath|archivo JSON}/un objeto {@link Response|`Response`} con un array de 1 tarea preparado en caso de error de {@link fetch|`fetch()`} del {@link jsonFilePath|archivo JSON}.
 * @param {HTMLUListElement} lista Elemento `ul` que contiene a todas las tareas creadas y agregadas a este.
 */
function ordenarTareasRecuperadasYAnexarlasAHTML(arrayDeTareas, lista) {
	arrayDeTareas.sort((a, b) => a.id < b.id ? 1 : -1)
	arrayDeTareas.forEach((el, idx, arr) => lista.appendChild(crearTareaHTML(arr, el)))
}