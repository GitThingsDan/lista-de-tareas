// @ts-check
"use strict"

/* --------FUNCIONES, PT. 2:------- */
/* -----------"FRONTEND"----------- */

/** 
 * Crea un elemento `input type="checkbox"` vinculado a una tarea.
 * @param {Tarea} tareaObjeto Una instancia de la clase {@link Tarea|`Tarea`}.
 * @returns {HTMLInputElement}
 * ```js
 * `<input type="checkbox" class="taskCheckBox" name=${tareaObjeto.id}>`
 * ``` 
 * , cuya propiedad `checked` está vinculada con `tareaObjeto.completacion` por asignación.
 */
const crearCheckBoxTarea = tareaObjeto => {
	/** Un elemento `input type="checkbox"` vinculado a una tarea. @type {HTMLInputElement} */
	const checkBox = document.createElement("input")

	checkBox.type = "checkbox"
	checkBox.className = "taskCheckBox"
	checkBox.name = tareaObjeto.id
	// Esto permitirá persistir el estado de la check box ("checkBox.checked") a través de cualquier recarga de la página web:
	checkBox.checked = tareaObjeto.completacion
	// Cada vez que se alterne el estado de la check box, llevar a cabo las siguientes dos acciones:
	checkBox.addEventListener("change", () => {
		// 1.- Actualizar la propiedad "completacion" de la tareaObjeto respectiva.
		tareaObjeto.completacion = checkBox.checked
		// 2.- Actualizar tareaObjeto en Storage.
		localStorage.setItem(tareaObjeto.id, JSON.stringify(tareaObjeto))
	})

	return checkBox
}
/** 
 * Crea un elemento `span` destinado a ser la descripción de una tarea.
 * @param {Tarea} tareaObjeto Una instancia de la clase {@link Tarea|`Tarea`}. 
 * @returns {HTMLSpanElement}
 * ```js
 * `<span class="taskDescription" contenteditable="plaintext-only">
 *   ${tareaObjeto.descripcion}
 * </span>`
 * ```
 */
const crearDescripcionTarea = tareaObjeto => {
	/* 
	Inicialmente, consideré usar "label" como elemento para la descripción, pero dado que finalmente terminé neutralizando todos los comportamientos por defecto de "label" (mediante ".preventDefault()"), decidí que no tenía sentido usarla. Además, sentí que caería en el error de usar un elemento HTML para otro fin, distinto al propósito con que fue ideado. Por todo esto, cambié "label" por "span", y también modifiqué el nombre original de la variable, "etiqueta", por "descripcion":
	*/
	/** Un elemento `span` destinado a ser la descripción de una tarea. @type {HTMLSpanElement} */
	const descripcion = document.createElement("span")

	descripcion.className = "taskDescription"
	// Puse como valor "plaintext-only" en lugar de "true", para así evitar que se pegue texto en formato enriquecido, porque al recargar la página web el formato se pierde (esto, ya que al crear y editar la descripción, estoy jugando con la propiedad "innerText", y *no* "innerHTML"), y la idea es que no se produzcan cambios no intencionados de ese tipo, pues son estéticamente feos y desagradables a la vista:
	descripcion.contentEditable = "plaintext-only"
	descripcion.innerText = tareaObjeto.descripcion

	// Cuando se presione la tecla "Enter", "desenfocarse" (quitar el foco del teclado) del campo de edición de la descripción (en lugar de generar nuevas líneas), concluyendo así con la edición:
	descripcion.addEventListener("keydown", evento => { if (evento.key === "Enter") descripcion.blur() })

	// Cada vez que se "desenfoque" del campo de edición de la descripción, llevar a cabo las siguientes dos acciones:
	descripcion.addEventListener("blur", () => {
		// 1.- Actualizar la propiedad "descripcion" de la tareaObjeto respectiva.
		tareaObjeto.descripcion = descripcion.innerText
		// 2.- Actualizar tareaObjeto en Storage.
		localStorage.setItem(tareaObjeto.id, JSON.stringify(tareaObjeto))
	})

	return descripcion
}

/**
 * Elimina una {@link tareaObjeto|`tareaObjeto`} del {@link arrayDeTareas|`arrayDeTareas`}, del DOM, y de {@link Storage|`Storage`} (con el previo consentimiento del usuario).
 * @param {Tarea[]} arrayDeTareas Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un archivo JSON.
 * @param {Tarea} tareaObjeto Una instancia de la clase {@link Tarea|`Tarea`}. 
 * @param {HTMLButtonElement} botonEliminarTarea Un elemento `button` cuya finalidad es eliminar su tarea correspondiente.
 */
const eliminarTarea = (arrayDeTareas, tareaObjeto, botonEliminarTarea) => {
	// @ts-ignore
	const sweetConfirm = Swal.mixin({
		title: "¿Eliminar tarea?",
		text: "¡Esto no se puede deshacer!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Sí, eliminar",
		cancelButtonText: "No, cancelar",
		showClass: { popup: "animate__animated animate__zoomIn" },
	})

	/** 
	 * When the user clicks a button, the Promise returned by Swal.fire() will be resolved with the `SweetAlertResult` object.
	 * @typedef {Object} SweetAlertResult
	 * @property {boolean} isConfirmed The "Confirm" button was clicked, the `value` will contain the result.
	 * @property {boolean} isDenied The "Deny" button was clicked, the `value` will be `false`. Alternatively, if there's an input in a popup, you can use `returnInputValueOnDeny: true` to return the input's value.
	 * @property {boolean} isDismissed The "Cancel" button was clicked, the `dismiss` will be `Swal.DismissReason.cancel`.
	 * @property {boolean|?} [value] The value from the popup, possible values:
	 * - `true` for simple confirmed dialogs.
	 * - `false` for denied popups.
	 * - any value for popups with inputs.
	 * @property {string} [dismiss] The dismissal reason, possible values: 
	 * - `backdrop`: The user clicked the backdrop.
	 * - `cancel`: The user clicked the cancel button.
	 * - `close`: The user clicked the close button.
	 * - `esc`: The user clicked the `Esc` key.
	 * - `timer`: The timer ran out, and the alert closed automatically.
	 */
	/** Una promesa que resuelve a un objeto {@link SweetAlertResult|`SweetAlertResult`}. @type {Promise<SweetAlertResult>} */
	const confirmacion = sweetConfirm.fire()

	confirmacion.then((resultado) => {
		// Si el usuario confirmó que sí desea eliminar la tarea (es decir, si no hizo clic en el botón de "No, cancelar"):
		if (resultado.isConfirmed) {
			// 1.- Eliminar tareaObjeto de arrayDeTareas (en index.js).
			const idx = arrayDeTareas.indexOf(tareaObjeto)
			if (idx) arrayDeTareas.splice(idx, 1)
			// 2.- Eliminar del DOM la tarea correspondiente (elemento "li" que contiene a botonEliminarTarea).
			botonEliminarTarea.parentElement?.remove()
			// 3.- Eliminar tareaObjeto de Storage.
			localStorage.removeItem(tareaObjeto.id)

			// Adicionalmente, mostrar una sweetToast al usuario, comunicando que la eliminación de la tarea fue realizada exitosamente.
			// @ts-ignore
			const sweetToast = Swal.mixin({
				toast: true,
				timer: 2500,
				position: "top-end",
				title: "¡Tarea eliminada!",
				text: "La tarea ha sido eliminada exitosamente.",
				icon: "success",
				showConfirmButton: false
			})
			// El siguiente setTimeout es para que la sweetToast le dé un poco de tiempo a la sweetConfirm para que su animación de salida pueda ser terminada, sin interrupciones estéticamente desagradables:
			setTimeout(() => sweetToast.fire(), 250)
		}
	})
}
/** 
 * Crea un elemento `button` cuya finalidad es eliminar su tarea correspondiente.
 * @param {Tarea[]} arrayDeTareas Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un {@link jsonFilePath|archivo JSON}/un objeto {@link Response|`Response`} con un array de 1 tarea preparado en caso de error de {@link fetch|`fetch()`} del {@link jsonFilePath|archivo JSON}.
 * @param {Tarea} tareaObjeto Una instancia de la clase {@link Tarea|`Tarea`}. 
 * @returns {HTMLButtonElement}
 * ```js
 * `<button type="button" class="deleteTaskBtn">
 *   X
 * </button>`
 * ```
 */
const crearBotonEliminarTarea = function (arrayDeTareas, tareaObjeto) {
	/** Un elemento `button` cuya finalidad es eliminar su {@link tareaObjeto|`tareaObjeto`} correspondiente. @type { HTMLButtonElement } */
	const botonEliminarTarea = document.createElement("button")

	botonEliminarTarea.type = "button"
	botonEliminarTarea.className = "deleteTaskBtn"
	// La letra "X" es sólo una forma sencilla de simbolizar la funcionalidad de "eliminar tarea" que este botón posee:
	botonEliminarTarea.innerText = "X"

	// Cuando se haga clic en el botón, pedir confirmación al usuario y, de acuerdo con aquella y si corresponde, eliminar la tarea del arrayDeTareas, del DOM, y de Storage:
	botonEliminarTarea.addEventListener("click", () => eliminarTarea(arrayDeTareas, tareaObjeto, botonEliminarTarea))

	return botonEliminarTarea
}

/** 
 * Crea un elemento `li` que mostrará en el documento HTML datos interactivos y editables de una {@link tareaObjeto|`tareaObjeto`}. En su interior, contiene: 
 * - Un {@link crearCheckBoxTarea|check box}.
 * - La {@link crearDescripcionTarea|descripción} - editable - de una tarea.
 * - Un {@link crearBotonEliminarTarea|botón para eliminarla}.
 *
 * @param {Tarea[]} arrayDeTareas Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un {@link jsonFilePath|archivo JSON}/un objeto {@link Response|`Response`} con un array de 1 tarea preparado en caso de error de {@link fetch|`fetch()`} del {@link jsonFilePath|archivo JSON}.
 * @param {Tarea} tareaObjeto Una instancia de la clase {@link Tarea|`Tarea`}. 
 * @returns {HTMLLIElement}
 * ```html
 * <li class="task" id=${tareaObjeto.id}>
 *   <input type="checkbox" class="taskCheckBox" name=${tareaObjeto.id}>
 *   <span class="taskDescription" contenteditable="plaintext-only">${tareaObjeto.descripcion}</span>
 *   <button type="button" class="deleteTaskBtn">X</button>
 * </li>
 * ```
 */
function crearTareaHTML(arrayDeTareas, tareaObjeto) {
	const checkBox = crearCheckBoxTarea(tareaObjeto)
	const descripcion = crearDescripcionTarea(tareaObjeto)
	const botonEliminarTarea = crearBotonEliminarTarea(arrayDeTareas, tareaObjeto)

	/**
	 * Un elemento `li` que mostrará en el documento HTML datos interactivos y editables de una {@link tareaObjeto|`tareaObjeto`}. En su interior, contiene: 
	 * - Un {@link checkBox|check box}.
	 * - La {@link descripcion|descripción} - editable - de una tarea.
	 * - Un {@link botonEliminarTarea|botón para eliminarla}.
	 * @type {HTMLLIElement}
	 */
	const tareaHTML = document.createElement("li")

	tareaHTML.className = "task"
	tareaHTML.id = tareaObjeto.id
	tareaHTML.append(checkBox, descripcion, botonEliminarTarea)

	return tareaHTML
}

/**
 * Crea y agrega una tarea nueva al arrayDeTareas, al documento HTML, y a {@link Storage|`Storage`}.
 * @param {HTMLInputElement} entrada Elemento `input type="text"` en que se tipea la descripción de la tarea que se desea crear. Antes de ejecutar la función, se valida primero que este campo de edición no esté vacío en cuanto a caracteres visibles. 
 * @param {Event} evento Evento a escuchar. En paralelo a la condición mencionada para el {@link entrada|parámetro anterior}, esta función se ejecutará sólo si se trata de un evento {@link GlobalEventHandlersEventMap.click|`click`} en el botón "Agregar", o si se presionó la tecla `Enter` dentro del {@link entrada|campo de edición principal para crear tareas}.
 * @param {Tarea[]} arrayDeTareas Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un {@link jsonFilePath|archivo JSON}/un objeto {@link Response|`Response`} con un array de 1 tarea preparado en caso de error de {@link fetch|`fetch()`} del {@link jsonFilePath|archivo JSON}.
 * @param {HTMLUListElement} lista Elemento `ul` que contiene a todas las tareas creadas y agregadas a este.
 */
function agregarNuevaTarea(entrada, evento, arrayDeTareas, lista) {
	// Primero, se confirma que el campo de edición no esté vacío en cuanto a letras. Si se cumple esta condición, se comprueban las siguientes, que exigen que o se trate de un evento "click" en el botón "Agregar", o bien se presione la tecla "Enter" dentro del campo de edición principal para crear tareas. Si se cumplen estas condiciones:
	if (entrada.value.trim() && (evento.type === "click" ||/** @type {KeyboardEvent} */ (evento).key === "Enter")) {
		// 1.- Crear tareaObjeto a partir de texto ingresado, agregándola a arrayDeTareas:
		/** 
		 * Descripción de la tarea. @type {string} 
		 */
		const descripcion = entrada.value.trim()
		/** 
		 * Una instancia de la clase {@link Tarea|`Tarea`}. @type {Tarea}
		 */
		const tareaObjeto = new Tarea(descripcion)
		arrayDeTareas.push(tareaObjeto)
		const tareaHTML = crearTareaHTML(arrayDeTareas, tareaObjeto)
		// 2.- Crear tareaHTML, adjuntándola al principio de la lista `ul` que está en el documento HTML:
		lista.prepend(tareaHTML)
		// 3.- Guardar en Storage la tareaObjeto recién creada:
		localStorage.setItem(tareaObjeto.id, JSON.stringify(tareaObjeto))

		// Por último, asignar un valor de string vacío ("") al campo de entrada (para así "reiniciarlo" y permitir que el usuario pueda ingresar una nueva tarea desde 0), y devolver el foco al campo de edición (ya que al presionar el botón "Agregar", automáticamente se pierde el foco del campo de edición):
		entrada.value = ""
		if (evento.type === "click") entrada.focus()
	}
}