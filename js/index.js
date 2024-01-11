// INSPIRADO EN https://www.w3schools.com/howto/howto_js_todolist.asp

let arrayDeTareas = recuperarTareasDesdeStorage()
const listaHTML = document.getElementsByTagName("ul")[0]
ordenarYAnexarTareasRecuperadasAHTML(arrayDeTareas, listaHTML)

const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))