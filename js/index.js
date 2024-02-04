// @ts-check
"use strict"

// INSPIRADO EN https://www.w3schools.com/howto/howto_js_todolist.asp

/**
 * Un array con instancias de la clase {@link Tarea|`Tarea`}, obtenidas desde {@link Storage|`Storage`} o desde un archivo JSON.
 * @type {Tarea[]} 
 */
const arrayDeTareas = await recuperarTareas("js/tareasPorDefecto.json")
/**
 * Elemento `ul` que contiene a todas las tareas creadas y agregadas a este.
 * @type {HTMLUListElement}
 */
const lista = document.getElementsByTagName("ul")[0]
ordenarTareasRecuperadasYAnexarlasAHTML(arrayDeTareas, lista)

/**
 * Elemento `input type="text"` en que se tipea la descripción de la tarea que se desea crear.
 * @type {HTMLInputElement}
 */
const entrada = document.getElementsByTagName("input")[0]
entrada.addEventListener("keydown", evento => agregarNuevaTarea(entrada, evento, arrayDeTareas, lista))
/**
 * Botón para agregar una nueva tarea, de la cual se haya tipeado su descripción en el {@link entrada|campo de edición} contiguo a este.
 * @type {HTMLButtonElement}
 */
const boton = document.getElementsByTagName("button")[0]
boton.addEventListener("click", evento => agregarNuevaTarea(entrada, evento, arrayDeTareas, lista))

export { }