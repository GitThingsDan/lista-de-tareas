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