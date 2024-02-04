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
		 * Un objeto "tipo {@link Tarea|`Tarea`}" recuperado desde {@link Storage|`Storage`} *(por haberse guardado en {@link Storage|`Storage`}, ha perdido su clase {@link Tarea|`Tarea`}, pero la estructura del objeto es la misma)*.
		 * @type {?}
		 */
		const tareaObjetoRecuperada = JSON.parse(obj)
		/**
		 * Una instancia de la clase {@link Tarea|`Tarea`}, regenerada a partir de una {@link tareaObjetoRecuperada|`tareaObjetoRecuperada`}.
		 * @type {Tarea}
		 */
		const tareaObjetoRegenerada = Object.assign(new Tarea(), tareaObjetoRecuperada)

		return tareaObjetoRegenerada
	})

	return arrayDeTareasEnStorage
}
/**
 * Solicita y busca retornar tareas obtenidas desde un {@link jsonFilePath|archivo JSON}.
 * @param {RequestInfo | URL} jsonFilePath Ruta de un archivo JSON (disponible de forma local o en línea).
 * @returns {Promise<Tarea[]>} Una promesa que resuelve a un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de objetos traídos desde un {@link jsonFilePath|archivo JSON}, y destinadas a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
 */
const traerTareasDesdeArchivoJSON = async function (jsonFilePath) {
	const respuesta = await fetch(jsonFilePath)

	/**
	 * Un array con objetos traídos desde un {@link jsonFilePath|archivo JSON}, que sólo contienen las propiedades {@link Tarea.descripcion|`descripcion`} y {@link Tarea.completacion|`completacion`} de la clase {@link Tarea|`Tarea`}, pero que se convertirán a instancias de la misma.
	 * @type {{descripcion: string, completacion: boolean}[]}
	 */
	const objetosDeArchivoJson = await /** @type Promise<{descripcion: string, completacion: boolean}[]> */(respuesta.json())
	/**
	 * Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de {@link objetosDeArchivoJson|`objetosDeArchivoJson`}, y destinadas a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
	 * @type {Tarea[]}
	*/
	const arrayDeTareasDeArchivoJson = objetosDeArchivoJson.map((el, idx) => {
		/**
		 * Una instancia de la clase {@link Tarea|`Tarea`}, regenerada a partir de un objeto traído desde un {@link jsonFilePath|archivo JSON}, y destinada a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
		 * @type {Tarea}
		*/
		const nuevoEl = Object.assign(new Tarea(), el)
		// Añadí el índice dentro del id de la tarea, con la intención de que estas se ordenaran correctamente en el documento HTML, pues una vez regeneradas, todas ellas tienen el mismo id, lo cual impide generar la ordenación deseada (invertí el orden de los objetos en el {@link jsonFilePath|archivo JSON} con el mismo fin):
		nuevoEl.id = `${nuevoEl.msDeCreacion}${idx + 1} - ${nuevoEl.fechaYHoraLocalesDeCreacion}`
		return nuevoEl
	})

	return arrayDeTareasDeArchivoJson
}

/** 
 * Recupera y retorna un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas desde todas las tareas que estén en {@link Storage|`Storage`}, o (si {@link Storage|`Storage`} no contiene tareas ingresadas por el usuario) desde un {@link jsonFilePath|archivo JSON}.
 * @param {RequestInfo | URL} jsonFilePath Ruta de un archivo JSON (disponible de forma local o en línea).
 * @returns {Promise<Tarea[]>} Una promesa que resuelve a un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un {@link jsonFilePath|archivo JSON}.
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
		 * Un array con instancias de la clase {@link Tarea|`Tarea`}, regeneradas a partir de objetos traídos desde un {@link jsonFilePath|archivo JSON}, y destinadas a mostrarse por defecto cuando no haya tareas ingresadas por el usuario.
		 * @type {Tarea[]}
		 */
		const arrayDeTareasDeArchivoJson = await traerTareasDesdeArchivoJSON(jsonFilePath)
		return arrayDeTareasDeArchivoJson
	}
}

/**
 * Ordena todas las tareas recuperadas con {@link recuperarTareas|`recuperarTareas`} dentro de un {@link arrayDeTareas|`arrayDeTareas`}, y las adjunta a una {@link lista|`lista`} en un documento HTML, cada vez que se recarga la página web.
 * @param {Tarea[]} arrayDeTareas Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un archivo JSON.
 * @param {HTMLUListElement} lista Elemento `ul` que contiene a todas las tareas creadas y agregadas a este.
 */
function ordenarTareasRecuperadasYAnexarlasAHTML(arrayDeTareas, lista) {
	arrayDeTareas.sort((a, b) => a.id < b.id ? 1 : -1)
	arrayDeTareas.forEach((el, idx, arr) => lista.appendChild(crearTareaHTML(arr, el)))
}