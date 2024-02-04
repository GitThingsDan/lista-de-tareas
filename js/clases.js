// @ts-check
"use strict"

/* ------------CLASES:------------ */

/** 
 * Instancias de la clase {@link Tarea|`Tarea`}. 
 */
class Tarea {
	/** 
	 * @param {string} descripcion Descripción de la tarea.
	 */
	constructor(descripcion = "") {
		/** Descripción de la tarea. @type {string} */
		this.descripcion = descripcion
		/** Indica si la tarea está completada o no. @type {boolean} */
		this.completacion = false
		/** Instancia de la clase {@link Date|`Date`}. *(Se decidió que {@link msDeCreacion|`this.msDeCreacion`} y {@link fechaYHoraLocalesDeCreacion|`this.fechaYHoraLocalesDeCreacion`} sean obtenidos a partir de esta misma instancia - en lugar de crearles instancias adicionales -, con la intención de utilizar mejor los recursos.)* @type {Date} */
		this.dateObjeto = new Date
		/** Milisegundos transcurridos desde el 1 de enero de 1970, hasta el momento en que se creó la tarea. Obtenidos a partir de {@link dateObjeto|`this.dateObjeto`}. @type {number} */
		this.msDeCreacion = this.dateObjeto.getTime()
		/** Fecha y hora del momento en que se creó la tarea, convertidas a formato local *(mucho más legible que utilizar {@link msDeCreacion|milisegundos})*. Obtenidas a partir de {@link dateObjeto|`this.dateObjeto`}. @type {string} */
		this.fechaYHoraLocalesDeCreacion = this.dateObjeto.toLocaleString()
		/** Identificador único de la tarea. Corresponde a una concatenación de {@link msDeCreacion|`this.msDeCreacion`} y {@link fechaYHoraLocalesDeCreacion|`this.fechaYHoraLocalesDeCreacion`}. @type {string} */
		this.id = `${this.msDeCreacion} - ${this.fechaYHoraLocalesDeCreacion}`
	}
}