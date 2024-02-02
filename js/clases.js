// @ts-check
"use strict"

/* ------------CLASES:------------ */

/** 
 * Instancias de la clase {@link Tiempo}. 
 * */
class Tiempo {
	constructor() {
		/** Milisegundos transcurridos desde el 1 de enero de 1970. @type {number} */
		this.ms = Date.now()
		/** Objeto "Date", obtenido a partir de {@link ms|milisegundos}. @type {Date} */
		this.dateTime = new Date(this.ms)
		/** Fecha y hora actuales, en formato local, obtenido a partir de un {@link dateTime|objeto "Date"}. @type {string} */
		this.localDateTime = this.dateTime.toLocaleString()
	}
}

/** 
 * Instancias de la clase {@link Tarea}. 
 * */
class Tarea {
	/** 
	 * Un acumulador que suma 1 por cada tarea creada.
	 * 
	 * Debe rescatarse desde Storage, para que persista a través de las recargas de la página web.
	 * @type {number}
	 * */
	static contadorGlobal = /** @type {?} */ (localStorage.getItem("Contador global"))

	/** 
	 * @param {string} descripcion Descripción de la tarea.
	 * */
	constructor(descripcion) {
		/** Fecha y hora de creación de la tarea (en formato local). @type {string} */
		this.tiempoDeCreacion = new Tiempo().localDateTime

		/** 
		 * Suma 1 a {@link contadorGlobal} y asigna este resultado a sí mismo - {@link Tarea#contador|(this.contador)} -, para representar en qué posición ordinal se creó esta tarea (en un orden ascendente de acuerdo con su {@link tiempoDeCreacion}). 
		 * 
		 * Confiere especificidad adicional al momento de individualizar cada instancia de Tarea a partir de su {@link id}, y también evita que al eliminar una tarea se borren sus duplicados (si es que los hubiera) junto con ella. 
		 * @type {number}
		 */
		this.contador = ++Tarea.contadorGlobal
		/** 
		 * Si el {@link contadorGlobal} no está en Storage, entonces apenas se instancie una tarea, este contador se creará allí, con el valor de contador de la instancia (es decir, {@link Tarea#contador|this.contador}). 
		 * */
		localStorage.setItem("Contador global", /** @type {?} */(this.contador))

		/** Identificador único de la tarea. Es una concatenación de {@link tiempoDeCreacion} y {@link Tarea#contador|(this.contador)}. @type {string} */
		this.id = `${this.tiempoDeCreacion} - ${this.contador}`

		/** Descripción de la tarea. @type {string} */
		this.descripcion = descripcion

		/** Indica si la tarea está completada o no. @type {boolean} */
		this.completacion = false
	}
}