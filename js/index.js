// INSPIRADO EN https://www.w3schools.com/howto/howto_js_todolist.asp

/* ------------CLASES:------------ */

class Tiempo {
	constructor() {
		this.ms = Date.now()
		this.dateTime = new Date(this.ms)
		this.localDateTime = this.dateTime.toLocaleString()
	}
}
class Tarea {
	/** Aquí hay un PROBLEMA: al recuperar las 'Tarea's cada vez que el sitio web se recarga, el contador parte desde 0 de nuevo, cosa que no debería ser.*/
	static contador = 0
	constructor(descripcion) {
		this.tiempoDeCreacion = new Tiempo().localDateTime
		/** La propiedad "contador" confiere especificidad adicional al momento de individualizar cada tarea (y también evita que al borrar una tarea se borren sus duplicados con ella). */
		this.contador = ++Tarea.contador
		this.descripcion = descripcion
		/** Se me complica habilitar la edición de las tareas y que se actualicen sus descripciones pero no sus "id"s en Storage (por otro lado, si las seteo en Storage de todos modos, se creará una tarea nueva cada vez que se edite su descripción, cuando la idea es que se sobreescriba... 🤦🏻‍♂️). Por esto, simplifiqué el "id" sacando la propiedad "descripcion"...¡ojalá que funcione! */
		this.id = `${this.tiempoDeCreacion} - ${this.contador}`
		// this.id = `${this.tiempoDeCreacion} - ${this.contador} - ${this.descripcion}`
		this.completacion = false
	}
}

/* -----------FUNCIONES:----------- */

const crearCheckbox = objetoTarea => {
	const checkbox = document.createElement("input")
	checkbox.setAttribute("type", "checkbox")
	/** Esto permitirá persistir el estado de "tick" del checkbox a través de cualquier recarga del sitio web: */
	checkbox.checked = objetoTarea.completacion
	/** El atributo "id" permite que la etiqueta pueda identificar y reconocer a su checkbox. */
	checkbox.id = objetoTarea.id
	/** Cada vez que se alterne el estado de "tick" del checkbox, actualizar la propiedad "completacion" del objetoTarea respectivo (y también en Storage). */
	checkbox.addEventListener("change", () => {
		objetoTarea.completacion = checkbox.checked
		localStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	})
	return checkbox
}
const crearEtiqueta = (objetoTarea, checkbox) => {
	const etiqueta = document.createElement("label")
	/** El atributo "for" permite que la etiqueta se aplique a su checkbox respectivo (es decir, aquel cuyo "id" coincida con el "for" de la etiqueta). */
	etiqueta.setAttribute("for", checkbox.id)
	/** "El atributo "contenteditable" permite que el texto del elemento sea editable..." - Capitán Obvio, 2024 */
	etiqueta.setAttribute("contenteditable", true)
	etiqueta.innerText = objetoTarea.descripcion
	/** Cada vez que se edite la descripción de la tarea, actualizar la propiedad "descripcion" del objetoTarea respectivo (y también en Storage). */
	etiqueta.addEventListener("input", () => {
		objetoTarea.descripcion = etiqueta.innerText
		localStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	})
	return etiqueta
}
/** @param {any[]} arrayDeTareas - Hubiera sido ideal no haber añadido el parámetro "arrayDeTareas" que añadí para mayor dinamismo al aplicar "filter"...por culpa de esto, tuve que también añadir el parámetro a todas las funciones que dependen de esta... 🤦🏻‍♂️ */
const crearDeleteBtn = (arrayDeTareas, objetoTarea) => {
	const deleteBtn = document.createElement("button")
	/** La "X" es una forma rápida de simbolizar la función de "eliminar tarea" que este botón representa. */
	deleteBtn.innerText = "X"
	deleteBtn.addEventListener("click", () => {
		/** Eliminar tarea del array de tareas en index.js: */
		arrayDeTareas = arrayDeTareas.filter(el => el.id !== objetoTarea.id)
		/** Eliminar tarea del documento HTML: */
		deleteBtn.parentNode.remove()
		/** Eliminar tarea del Storage: */
		localStorage.removeItem(objetoTarea.id)
	})
	return deleteBtn
}
/** @param {any[]} arrayDeTareas - Hubiera sido ideal no haber añadido el parámetro "arrayDeTareas" que añadí para mayor dinamismo al aplicar "filter" en la función {@link crearDeleteBtn | crearDeleteBtn}...por culpa de esto, tuve que también añadir el parámetro a todas las funciones que dependen de esta... 🤦🏻‍♂️ */
function crearTareaHTML(arrayDeTareas, objetoTarea) {
	const checkbox = crearCheckbox(objetoTarea)
	const etiqueta = crearEtiqueta(objetoTarea, checkbox)
	const deleteBtn = crearDeleteBtn(arrayDeTareas, objetoTarea)

	const tareaHTML = document.createElement("li")
	tareaHTML.append(checkbox, etiqueta, deleteBtn)
	return tareaHTML
}

function agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML) {
	/** ¿POR QUÉ? 
	 * evento.key: Necesito comprobar que la tecla pulsada en el evento "keydown" dentro del "input[type='text']" sea la tecla Enter.

	 * evento.type: Si sólo dejo la condición "evento.key", no podrá funcionará el evento "click" del "button" que agrega tareas, porque no pasará la condición mencionada. Por eso, me veo obligado a poner esta segunda condición (alternativa).
	*/
	if (evento.key === "Enter" || evento.type === "click") {
		/** Objeto instanciado para añadirse al arrayDeTareas (y, eventualmente, al Storage). */
		const objetoTarea = new Tarea(entrada.value)
		arrayDeTareas.push(objetoTarea)
		/** Se asigna un valor de string vacío ("") al campo de entrada, para "reiniciarlo" y permitir que el usuario ingrese una nueva tarea desde 0. */
		entrada.value = ""

		/** Elemento "li" creado dinámicamente, que será anexado al pie de listaHTML (elemento "ul" ya presente en el documento). */
		const tareaHTML = crearTareaHTML(arrayDeTareas, objetoTarea)
		listaHTML.appendChild(tareaHTML)

		/** Añadir (por primera vez) objetoTarea al Storage: */
		localStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	}
}

function recuperarTareasDesdeStorage() {
	let arrayDeTareas = []
	for (let i = 0; i < localStorage.length; i++) {
		const claveJSONTarea = localStorage.key(i)
		const JSONtarea = localStorage.getItem(claveJSONTarea)
		const objetoTareaStorage = JSON.parse(JSONtarea)
		arrayDeTareas.push(objetoTareaStorage)
	}
	return arrayDeTareas
}
function ordenarYAnexarTareasRecuperadasAHTML(arrayDeTareas, listaHTML) {
	/** La función pasada como argumento a "*.sort(*)" debe ser acorde con el tipo de valor que intentamos ordenar (en este caso - objetoTarea.id - , NO una resta, sino que una COMPARACIÓN - dado que el "id" comienza con un "contador" numérico, el que será sometido a esta comparación -). */
	arrayDeTareas.sort((a, b) => {
		if (a.id < b.id) {
			return -1
		} else {
			return 1
		}
	})
	/** Forma avanzada, abreviada y menos compleja de hacerlo (operador condicional - ternario -):
	 * arrayDeTareas.sort((a, b) => a.id < b.id ? -1 : 1) 
	*/
	arrayDeTareas.forEach(
		/** @param {any[]} arr - Hubiera sido ideal no haber añadido el parámetro "arrayDeTareas" que añadí para mayor dinamismo al aplicar "filter" en la función {@link crearDeleteBtn | crearDeleteBtn}...por culpa de esto, tuve que también añadir el parámetro a todas las funciones que dependen de esta... 🤦🏻‍♂️ */
		(el, idx, arr) => listaHTML.appendChild(crearTareaHTML(arr, el))
	)
}

/* ----------INVOCACIONES:---------- */

let arrayDeTareas = recuperarTareasDesdeStorage()
const listaHTML = document.getElementsByTagName("ul")[0]
ordenarYAnexarTareasRecuperadasAHTML(arrayDeTareas, listaHTML)

const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))