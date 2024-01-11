/* INSPIRADO EN https://www.w3schools.com/howto/howto_js_todolist.asp */

const arrayDeTareas = recuperarTareasDesdeStorage()

const listaHTML = document.getElementsByTagName("ul")[0]
ordenarYAnexarTareasRecuperadasAHTML(arrayDeTareas, listaHTML)

const entrada = document.querySelector("input[type='text']")
entrada.addEventListener("keydown", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

const boton = document.querySelector("button#addTaskBtn")
boton.addEventListener("click", evento => agregarNuevaTarea(evento, entrada, arrayDeTareas, listaHTML))

// Esta línea de código es para asegurarme de que el contador no tome valores menores que 0 o mayores que la longitud del arrayDeTareas, pero la dejaré comentada por ahora porque creo que es algo "hacky", y no me gusta la idea de usar la fuerza bruta para machacar los problemas del código, o poner cosas de las que no estoy seguro *qué* son:
// localStorage.setItem("Contador", arrayDeTareas.length)