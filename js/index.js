/* function timeToMS(time, timeUnit) {
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
} */
/* function msToTime(ms, timeUnit) {
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
} */

/* --------------------------------- */

class Tiempo {
	constructor() {
		this.ms = Date.now()
		this.dateTime = new Date(this.ms)
		this.localDateTime = this.dateTime.toLocaleString()
	}
}
class Tarea {
	/* 	static counter = 0
		constructor(nombre) {
			// ¿POR QUÉ? contador: Para dar especificidad al momento de individualizar cada tarea (y para así evitar que se borren duplicados).
			this.contador = ++Tarea.counter */
	constructor(nombre) {
		this.nombre = nombre
		this.tiempoDeCreacion = new Tiempo().localDateTime
		this.id = `${this.tiempoDeCreacion} - ${this.nombre}`
		this.completacion = false
	}
}

function instanciarObjetoTarea(entrada) {
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
	// checkbox.setAttribute("name", objetoTarea.nombre)
	// ¿POR QUÉ? id: Para que la etiqueta pueda identificar y reconocer a su checkbox:
	checkbox.id = objetoTarea.id
	checkbox.addEventListener("change", () => objetoTarea.completacion = checkbox.checked)
	return checkbox
}
const crearEtiqueta = (checkbox, objetoTarea) => {
	const etiqueta = document.createElement("label")
	// ¿POR QUÉ? for: Para que la etiqueta se aplique a su checkbox respectivo:
	etiqueta.setAttribute("for", checkbox.id)
	etiqueta.innerText = objetoTarea.nombre
	return etiqueta
}
const crearDeleteBtn = () => {
	const deleteBtn = document.createElement("button")
	// DESACTIVADO (para testearlo):
	// ¿POR QUÉ? type: Para evitar que se active su comportamiento por defecto ("submit" dentro de un formulario). 
	// deleteBtn.setAttribute("type", "button")
	// DESACTIVADO (para testearlo):
	// deleteBtn.className = "deleteBtn"
	deleteBtn.innerText = "X"
	deleteBtn.addEventListener("click", () => deleteBtn.parentNode.remove())
	return deleteBtn
}

function crearTareaHTML(objetoTarea) {
	const checkbox = crearCheckbox(objetoTarea)
	const etiqueta = crearEtiqueta(checkbox, objetoTarea)
	const deleteBtn = crearDeleteBtn()

	const tareaHTML = document.createElement("li")
	// DESACTIVADO (para testearlo):
	// tareaHTML.className = "tarea"
	tareaHTML.append(checkbox, etiqueta, deleteBtn)
	return tareaHTML
}

function anexarTareaHTML(evento, entrada, listaHTML) {
	/* ¿POR QUÉ?
	// evento.key: Necesito comprobar que la tecla pulsada en el evento "keydown" dentro del "input[type='text']" sea la tecla Enter.
	// evento.type: Si dejo sólo la condición "evento.key", no podrá ser escuchado el evento "click" del "button" que agrega tareas, porque no pasará la condición mencionada. Por eso, me veo obligado a poner esta segunda condición (alternativa).
	*/
	if (evento.key === "Enter" || evento.type === "click") {
		const objetoTarea = instanciarObjetoTarea(entrada)
		const tareaHTML = crearTareaHTML(objetoTarea)
		listaHTML.appendChild(tareaHTML)
	}
}

/* ----------INVOCACIONES:---------- */

const listaHTML = document.querySelector("ul")
const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => anexarTareaHTML(evento, entrada, listaHTML))
const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => anexarTareaHTML(evento, entrada, listaHTML))

/* --------------------------------- */

/* // EXPERIMENTOS DE RESUCITACIÓN ("JSON.parse() revive function"):
const tareaRevivida = JSON.parse(`{
	"nombre": "b",
	"completacion": false,
	"tiempoDeCreacion": "28-12-2023, 17:25:57",
	"id": "28-12-2023, 17:25:57 - b",
	"esTarea": true
}`,	(key, value) => key === "nombre" ? new Tarea(value) : undefined)
console.log(tareaRevivida) */

// INSPIRADO EN https://www.w3schools.com/howto/howto_js_todolist.asp