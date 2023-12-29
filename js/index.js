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
	constructor(descripcion, tiempo) {
		// ¿POR QUÉ? contador: Para dar especificidad al momento de individualizar cada tarea (y para así evitar que se borren duplicados).
		this.contador = ++Tarea.contador
		this.descripcion = descripcion
		this.tiempoDeCreacion = tiempo ? tiempo : new Tiempo().localDateTime
		this.id = `${this.tiempoDeCreacion} - ${this.contador} - ${this.descripcion}`
		this.completacion = false
	}
}

/* -----------FUNCIONES:----------- */

function instanciarObjetoTarea(entrada) {
	// Descomentar si deseamos impedir que se agreguen tareas vacías:
	// if (entrada.value) {
	if (entrada) {
		const objetoTarea = new Tarea(entrada.value)
		entrada.value = ""
		return objetoTarea
	}
}

const crearCheckbox = objetoTarea => {
	const checkbox = document.createElement("input")
	checkbox.setAttribute("type", "checkbox")
	// DESACTIVADO (para testearlo):
	// checkbox.setAttribute("name", objetoTarea.descripcion)
	// ¿POR QUÉ? id: Para que la etiqueta pueda identificar y reconocer a su checkbox:
	checkbox.id = objetoTarea.id
	checkbox.addEventListener("change", () => objetoTarea.completacion = checkbox.checked)
	return checkbox
}
const crearEtiqueta = (checkbox, objetoTarea) => {
	const etiqueta = document.createElement("label")
	// ¿POR QUÉ? for: Para que la etiqueta se aplique a su checkbox respectivo:
	etiqueta.setAttribute("for", checkbox.id)
	etiqueta.innerText = objetoTarea.descripcion
	return etiqueta
}
const crearDeleteBtn = objetoTarea => {
	// const crearDeleteBtn = () => {
	const deleteBtn = document.createElement("button")
	// DESACTIVADO (para testearlo):
	// ¿POR QUÉ? type: Para evitar que se active su comportamiento por defecto ("submit" dentro de un formulario). 
	// deleteBtn.setAttribute("type", "button")
	// DESACTIVADO (para testearlo):
	// deleteBtn.className = "deleteBtn"
	deleteBtn.innerText = "X"
	deleteBtn.addEventListener("click", () => {
		deleteBtn.parentNode.remove()
		// Eliminar objetoTarea de arrayDeTareas:
		arrayDeTareas = arrayDeTareas.filter(el => el.id !== objetoTarea.id)
		// Eliminar objetoTarea de Storage:
		localStorage.removeItem(objetoTarea.id)
	})
	return deleteBtn
}

function crearTareaHTML(objetoTarea) {
	const checkbox = crearCheckbox(objetoTarea)
	const etiqueta = crearEtiqueta(checkbox, objetoTarea)
	const deleteBtn = crearDeleteBtn(objetoTarea)
	// const deleteBtn = crearDeleteBtn()

	const tareaHTML = document.createElement("li")
	// DESACTIVADO (para testearlo):
	// tareaHTML.className = "tarea"
	tareaHTML.append(checkbox, etiqueta, deleteBtn)
	return tareaHTML
}

function agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML) {
	// ¿POR QUÉ?
	// evento.key: Necesito comprobar que la tecla pulsada en el evento "keydown" dentro del "input[type='text']" sea la tecla Enter.
	// evento.type: Si dejo sólo la condición "evento.key", no podrá ser escuchado el evento "click" del "button" que agrega tareas, porque no pasará la condición mencionada. Por eso, me veo obligado a poner esta segunda condición (alternativa).

	if (evento.key === "Enter" || evento.type === "click") {
		const objetoTarea = instanciarObjetoTarea(entrada)
		arrayDeTareas.push(objetoTarea)

		const tareaHTML = crearTareaHTML(objetoTarea)
		listaHTML.appendChild(tareaHTML)

		localStorage.setItem(objetoTarea.id, JSON.stringify(objetoTarea))
	}
}

function recuperarObjetosTareaDesdeStorage() {
	for (let i = 0; i < sessionStorage.length; i++) {
		const objetoTareaStorage = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)))
		const objetoTarea = new Tarea(objetoTareaStorage.descripcion,objetoTareaStorage.tiempoDeCreacion)
		lista.push(objetoTarea)
	}
	// La función pasada como argumento a "*.sort(*)" debe ser acorde con el tipo de valor que intentamos ordenar (en este caso - objetoTarea.id - , NO una resta, sino que una COMPARACIÓN):
	lista.sort((a, b) => a.id < b.id ? -1 : 1)
	return lista
}
/* const anexarTareasDeStorageAHTML = (listaStorage, listaHTML) => {
	listaStorage.forEach(tarea => {
		const tareaHTML = crearTareaHTML(tarea, listaStorage)
		if (tareaHTML) listaHTML.appendChild(tareaHTML)
	})
} */

/* ----------INVOCACIONES:---------- */

let arrayDeTareas = []
// Versión "static":
// const listaHTML = document.querySelector("ul")
// Versión "live":
const listaHTML = document.getElementsByTagName("ul")[0]

const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

/* -----------MISCELÁNEO:---------- */

/* // EXPERIMENTOS DE RESUCITACIÓN ("JSON.parse() revive function"):
const tareaRevivida = JSON.parse(`{
	 "contador": 1, 
	 "descripcion": "a", 
	 "tiempoDeCreacion": "29-12-2023, 00:09:51", 
	 "id": "29-12-2023, 00:09:51 - 1 - a", 
	 "completacion": false 
	}`,
	// (key, value) => key === "descripcion" ? new Tarea(value) : undefined)
	(key, value) => {
		if (value === "1") {
			return value
		} else {
			return false
		}
		// console.log(key);
	})
console.log(tareaRevivida) */
/* // FUNCIONES LOCAS PARA CONVERTIR MINUTOS/HORAS/DÍAS A MILISEGUNDOS (Y VICEVERSA):
function timeToMS(time, timeUnit) {
	const minutesToMS = minutes => minutes * 60 * 1000
	const hoursToMS = hours => hours * minutesToMS(60)
	const daysToMS = days => days * hoursToMS(24)
	const timeUnits = [
		{ name: "m", toMSFunc: minutesToMS, },
		{ name: "h", toMSFunc: hoursToMS, },
		{ name: "d", toMSFunc: daysToMS, }
	]
	const unit = timeUnits.find(unit => unit.name === timeUnit)
	return unit.toMSFunc(time)
}
function msToTime(ms, timeUnit) {
	const msToMinutes = ms => ms / (60 * 1000)
	const msToHours = ms => msToMinutes(ms) / 60
	const msToDays = ms => msToHours(ms) / 24
	const timeUnits = [
		{ name: "m", toTimeUnitFunc: msToMinutes, },
		{ name: "h", toTimeUnitFunc: msToHours, },
		{ name: "d", toTimeUnitFunc: msToDays, }
	]
	const unit = timeUnits.find(unit => unit.name === timeUnit)
	return unit.toTimeUnitFunc(ms)
}
*/