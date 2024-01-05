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
	/** "Tarea.contador" (nuestro "contador universal" de aquí en adelante) debe rescatarse desde Storage, con tal de que persista a través de las recargas del sitio web. */
	static contador = localStorage.getItem("Contador")
	constructor(descripcion) {
		this.tiempoDeCreacion = new Tiempo().localDateTime
		/** La propiedad "contador" de cada objetoTarea confiere especificidad adicional al momento de individualizar cada nueva instancia de "Tarea" (y también evita que al eliminar una tarea se borren sus duplicados - si es que los hubiera - junto con ella). */
		this.contador = ++Tarea.contador
		/** Si el {@link Tarea.contador | contador universal} no está en Storage, se creará allí apenas se cree un objetoTarea (sobreescribiéndose con su valor de "contador"). */
		localStorage.setItem("Contador", this.contador)
		this.descripcion = descripcion
		this.id = `${this.tiempoDeCreacion} - ${this.contador}`
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
	/** Cada vez que se edite la etiqueta de la tareaHTML: */
	etiqueta.addEventListener("input", () => {
		/** - Actualizar la propiedad "descripcion" del objetoTarea respectivo. */
		objetoTarea.descripcion = etiqueta.innerText
		/** - Actualizar tareaJSON en Storage. */
		localStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	})
	return etiqueta
}
/** @param {any[]} arrayDeTareas - Hubiera sido ideal no haber añadido el parámetro "arrayDeTareas" que agregué para mayor dinamismo al aplicar "filter"...por culpa de eso, tuve que también añadir el parámetro a todas las funciones que dependen de esta... 🤦🏻‍♂️ */
const crearDeleteBtn = (arrayDeTareas, objetoTarea) => {
	const deleteBtn = document.createElement("button")
	/** La "X" es una forma rápida de simbolizar la función de "eliminar tarea" que este botón representa. */
	deleteBtn.innerText = "X"
	deleteBtn.addEventListener("click", () => {
		/** Eliminar objetoTarea de arrayDeTareas en index.js: 
		 * (Aquí hay un PROBLEMA: no se están eliminando los "objetoTarea"s de arrayDeTareas cada vez que se elimina una tarea; muy por el contrario, arrayDeTareas sólo se actualiza cuando se recarga el sitio web. Al parecer tiene que ver con la primera invocación que hago: "let arrayDeTareas = recuperarTareasDesdeStorage()".) 
		 */
		arrayDeTareas = arrayDeTareas.filter(el => el.id !== objetoTarea.id)
		/** Eliminar tareaHTML del DOM: */
		deleteBtn.parentNode.remove()
		/** Eliminar tareaJSON de Storage: */
		localStorage.removeItem(objetoTarea.id)
		/** Actualizar contador universal: */
		localStorage.setItem("Contador", --Tarea.contador)
	})
	return deleteBtn
}

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
		/** Objeto instancia de la clase "Tarea", que será añadido a arrayDeTareas (y, eventualmente, a Storage). */
		const objetoTarea = new Tarea(entrada.value)
		arrayDeTareas.push(objetoTarea)
		/** Se asigna un valor de string vacío ("") al campo de entrada, para "reiniciarlo" y permitir que el usuario ingrese una nueva tarea desde 0. */
		entrada.value = ""

		/** Elemento "li" creado dinámicamente, que será anexado al pie de listaHTML (elemento "ul" ya presente en el documento). */
		const tareaHTML = crearTareaHTML(arrayDeTareas, objetoTarea)
		listaHTML.appendChild(tareaHTML)

		/** Crear objetoTarea en Storage: */
		localStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	}
}

function recuperarTareasDesdeStorage() {
	let arrayDeTareas = []
	for (let i = 0; i < localStorage.length; i++) {
		const claveTareaJSON = localStorage.key(i)
		/** Con este "if", me aseguro de recuperar sólo las tareas y no el {@link Tarea.contador | contador universal} que guardé en Storage. */
		if (claveTareaJSON !== "Contador") {
			const tareaJSON = localStorage.getItem(claveTareaJSON)
			const objetoTarea = JSON.parse(tareaJSON)
			arrayDeTareas.push(objetoTarea)
		}
	}
	return arrayDeTareas
}
function ordenarYAnexarTareasRecuperadasAHTML(arrayDeTareas, listaHTML) {
	/** La función pasada como argumento a ".sort()" debe ser acorde con el tipo de valor que intentamos ordenar (en este caso - objetoTarea.id - , NO una resta, sino que una COMPARACIÓN, dado que el "id" es un string - de números, pero string de todos modos -).
 
	 * Por cierto, para más adelante, aquí hay una forma más avanzada, abreviada, bonita y menos compleja de hacer este ".sort()" (usando operador condicional - ternario -):
	 * arrayDeTareas.sort((a, b) => a.id < b.id ? -1 : 1) 
	*/
	arrayDeTareas.sort((a, b) => {
		if (a.id < b.id) {
			return -1
		} else {
			return 1
		}
	})
	arrayDeTareas.forEach((el, idx, arr) => listaHTML.appendChild(crearTareaHTML(arr, el)))
}

/* ----------INVOCACIONES:---------- */

let arrayDeTareas = recuperarTareasDesdeStorage()
const listaHTML = document.getElementsByTagName("ul")[0]
ordenarYAnexarTareasRecuperadasAHTML(arrayDeTareas, listaHTML)

const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))