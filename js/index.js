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
	static contador = 0
	/** Doy la opción de tomar "tiempo" como argumento para crear la propiedad "tiempoDeCreacion", con el fin de (más adelante) poder recuperar los "objetoTarea"s desde el Storage manteniendo el "tiempoDeCreacion" con que fueron ingresados al Storage.*/
	constructor(tiempo, descripcion) {
		if (tiempo) {
			this.tiempoDeCreacion = tiempo
		} else {
			this.tiempoDeCreacion = new Tiempo().localDateTime
		}
		/** Forma avanzada y abreviada de hacerlo (operador condicional - ternario -):
		 * this.tiempoDeCreacion = tiempo ? tiempo : new Tiempo().localDateTime
		*/
		/** La propiedad "contador" confiere especificidad adicional al momento de individualizar cada tarea (y así evita que se borren duplicados). */
		this.contador = ++Tarea.contador
		this.descripcion = descripcion
		this.id = `${this.tiempoDeCreacion} - ${this.contador} - ${this.descripcion}`
		this.completacion = false
	}
}

/* -----------FUNCIONES:----------- */

const crearCheckbox = objetoTarea => {
	const checkbox = document.createElement("input")
	checkbox.setAttribute("type", "checkbox")
	/** El atributo "id" permite que la etiqueta pueda identificar y reconocer a su checkbox. */
	checkbox.id = objetoTarea.id
	/** Cada vez que se alterne el estado de "tick" del checkbox, hacer que la propiedad "completacion" del objetoTarea refleje el estado nuevo (y actualizarla en Storage). */
	checkbox.addEventListener("change", () => {
		objetoTarea.completacion = checkbox.checked
		sessionStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	})
	return checkbox
}
const crearEtiqueta = (objetoTarea, checkbox) => {
	const etiqueta = document.createElement("label")
	/** El atributo "for" permite que la etiqueta se aplique a su checkbox respectivo (es decir, aquel cuyo "id" coincida con el "for" de la etiqueta). */
	etiqueta.setAttribute("for", checkbox.id)
	etiqueta.innerText = objetoTarea.descripcion
	return etiqueta
}
const crearDeleteBtn = objetoTarea => {
	const deleteBtn = document.createElement("button")
	/** La "X" es una forma rápida de simbolizar la función de "eliminar tarea" que este botón representa. */
	deleteBtn.innerText = "X"
	deleteBtn.addEventListener("click", () => {
		/** Eliminar tarea del documento HTML: */
		deleteBtn.parentNode.remove()
		/** Eliminar tarea del array de tareas en index.js: */
		arrayDeTareas = arrayDeTareas.filter(el => el.id !== objetoTarea.id)
		/** Eliminar tarea del Storage: */
		sessionStorage.removeItem(objetoTarea.id)
	})
	return deleteBtn
}

function crearTareaHTML(objetoTarea) {
	const checkbox = crearCheckbox(objetoTarea)
	const etiqueta = crearEtiqueta(objetoTarea, checkbox)
	const deleteBtn = crearDeleteBtn(objetoTarea)

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
		/** Objeto instanciado para añadirse al arrayDeTareas (y, eventualmente, al Storage) - se omitió "tiempo" (el primer argumento) a propósito , con el fin de que la propiedad "tiempoDeCreacion" corresponda, efectivamente, al tiempo actual en que se está creando la tarea por primera vez -. */
		const objetoTarea = new Tarea(/* tiempo = */ undefined, entrada.value)
		arrayDeTareas.push(objetoTarea)
		/** Se asigna un valor de string vacío ("") al campo de entrada, para "reiniciarlo" y permitir que el usuario ingrese una nueva tarea desde 0. */
		entrada.value = ""

		/** Elemento "li" creado dinámicamente, que será adjuntado al pie de listaHTML (elemento "ul" ya presente en el documento). */
		const tareaHTML = crearTareaHTML(objetoTarea)
		listaHTML.appendChild(tareaHTML)

		/** Añadir objetoTarea al Storage: */
		sessionStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	}
}

// FUNCIONES RELACIONADAS CON "Storage":
function recuperarDesdeStorageYPushearAArray(arrayDeTareas_Storage) {
	for (let i = 0; i < sessionStorage.length; i++) {
		const claveJSONTarea = sessionStorage.key(i)
		const JSONtarea = sessionStorage.getItem(claveJSONTarea)
		const objetoTareaStorage = JSON.parse(JSONtarea)
		arrayDeTareas_Storage.push(objetoTareaStorage)
	}
	/** La función pasada como argumento a "*.sort(*)" debe ser acorde con el tipo de valor que intentamos ordenar (en este caso - objetoTarea.id - , NO una resta, sino que una COMPARACIÓN - dado que el "id" comienza con un "contador" numérico, el que será sometido a esta comparación -). */
	arrayDeTareas_Storage.sort((a, b) => {
		if (a.id < b.id) {
			return -1
		} else {
			return 1
		}
	})
	console.log("🚀 ~ file: index.js:116 ~ arrayDeTareas_Storage.sort ~ arrayDeTareas_Storage:", arrayDeTareas_Storage, "\nEste array está ✅")
	/** Forma avanzada y abreviada de hacerlo (operador condicional - ternario -): 
	 arrayDeTareas.sort((a, b) => a.id < b.id ? -1 : 1) 
	*/
}
function anexarTareasDeStorageAHTML(arrayDeTareas_Storage, listaHTML) {
	/** Esta línea podría omitirla, pero decidí probar de todos modos, para ver si (regenerando el objetoTarea no sólo por "JSON.parse()" sino que también con el constructor de la clase "Tarea") puedo hacer uso de la propiedad "contador" que se basa en la propiedad estática "Tarea.contador".

	* (A esto me refería con {@link Tarea.tiempoDeCreacion | pasarle como argumento el "tiempoDeCreacion" original cuando se está recuperando desde Storage}: de otro modo, al "re-crearse" el objetoTarea, lo hará - probablemente - con la hora correspondiente a la recarga de la página a modo de "tiempoDeCreacion", y por tanto, su "id" ya no será el mismo, lo que influirá en operaciones posteriores que intenten manipular el Storage.)
	*/
	/* let arrayDeTareas = arrayDeTareas_Storage.map(el => new Tarea(el.tiempoDeCreacion, el.descripcion))
	console.log("🚀 ~ file: index.js:127 ~ anexarTareasDeStorageAHTML ~ arrayDeTareas:", arrayDeTareas, "\nAQUÍ HAY UN PROBLEMA: AL RECUPERAR LAS 'Tarea'S CADA VEZ QUE LA PÁGINA SE RECARGA, EL CONTADOR PARTE DESDE 0 DE NUEVO, COSA QUE NO DEBERÍA SER")
	for (const objetoTarea of arrayDeTareas) {
		const tareaHTML = crearTareaHTML(objetoTarea)
		listaHTML.appendChild(tareaHTML)
	} */
	for (const objetoTarea of arrayDeTareas_Storage) {
		const tareaHTML = crearTareaHTML(objetoTarea)
		listaHTML.appendChild(tareaHTML)
	}
}

/* ----------INVOCACIONES:---------- */

let arrayDeTareas = []
/** Lo ideal sería usar el mismo array tanto para recuperar */
recuperarDesdeStorageYPushearAArray(arrayDeTareas)
const listaHTML = document.getElementsByTagName("ul")[0]

const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

anexarTareasDeStorageAHTML(arrayDeTareas, listaHTML)