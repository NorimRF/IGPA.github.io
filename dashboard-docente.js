// ======== VERIFICAR USUARIO ========
const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
if (!usuario || usuario.tipo !== "docente") {
  window.location.href = "login.html";
}

// ======== DATOS GLOBALES ========
window.notasPorAlumno = JSON.parse(localStorage.getItem("notasPorAlumno")) || {};
window.asistenciaPorAlumno = JSON.parse(localStorage.getItem("asistenciaPorAlumno")) || {};
window.notificaciones = JSON.parse(localStorage.getItem("notificaciones")) || {};
window.listaAlumnosDesdeCSV = JSON.parse(localStorage.getItem("alumnosDesdeCSV")) || [];

// Mapa nombre -> código
const mapaNombreACodigo = {};
window.listaAlumnosDesdeCSV.forEach(alumno => {
  mapaNombreACodigo[alumno.nombre] = alumno.codigo;
});

// ======== ESTADO ========
let alumnoSeleccionado = null;

// ======== DOM ========
const listaAlumnos = document.getElementById("listaAlumnos");
const seccionAlumnos = document.getElementById("seccionAlumnos");
const seccionNotas = document.getElementById("seccionNotas");
const seccionAsistencia = document.getElementById("seccionAsistencia");
const seccionNotificaciones = document.getElementById("seccionNotificaciones");

const formNotas = document.getElementById("formNotas");
const selectAlumnoNotas = document.getElementById("selectAlumno");
const selectCurso = document.getElementById("selectCurso");
const selectBimestre = document.getElementById("selectBimestre");
const inputExamen = document.getElementById("notaExamen");
const inputEjercicios = document.getElementById("notaTareas");
const inputActitudinal = document.getElementById("notaActitudinal");
const inputTrabajo = document.getElementById("notaTrabajo");
const inputNotaFinal = document.getElementById("nota");

const formAsistencia = document.getElementById("formAsistencia");
const fechaAsistencia = document.getElementById("fechaAsistencia");
const listaFechasAsistencia = document.getElementById("listaFechasAsistencia");

const formNotificacion = document.getElementById("formNotificacion");
const selectAlumnoNotificacion = document.getElementById("alumnoNotificado");
const mensajeNotificacion = document.getElementById("mensajeNotificacion");
const listaNotificacionesDocente = document.getElementById("listaNotificacionesDocente");
const btnBorrarNotificaciones = document.getElementById("borrarNotificaciones");

const formNotificacionGeneral = document.getElementById("formNotificacionGeneral");
const inputNotificacionGeneral = document.getElementById("mensajeGeneral");

const inputCSV = document.getElementById("cargarCSVAlumnos");
const btnCargarCSV = document.getElementById("subirCSVAlumnos");

const selectBimestreActivo = document.getElementById("selectBimestreActivo");

// ======== INICIALIZAR BIMESTRE ========
let bimestreActualGuardado = parseInt(localStorage.getItem("bimestreActual")) || 1;
selectBimestreActivo.value = bimestreActualGuardado;
selectBimestre.value = bimestreActualGuardado;

// ======== FUNCIONES ========

// Actualizar selects de alumnos
function actualizarSelectsAlumnos() {
  [selectAlumnoNotas, selectAlumnoNotificacion].forEach(select => {
    select.innerHTML = '<option value="" disabled selected>Selecciona un alumno</option>';
    window.listaAlumnosDesdeCSV.forEach(({ nombre }) => {
      const option = document.createElement("option");
      option.value = nombre;
      option.textContent = nombre;
      select.appendChild(option);
    });
  });
}

// Cargar notas del alumno seleccionado
function cargarNotasAlumnoEnFormulario() {
  if (!alumnoSeleccionado) return;

  const codigo = mapaNombreACodigo[alumnoSeleccionado];
  const curso = selectCurso.value;
  const b = parseInt(selectBimestre.value) || bimestreActualGuardado;

  const notasAlumno = window.notasPorAlumno[codigo] || {};
  const notasCurso = notasAlumno[curso] || [];
  const notaBimestre = notasCurso[b - 1] || null;

  if (notaBimestre) {
    inputExamen.value = notaBimestre.examen ?? 0;
    inputEjercicios.value = notaBimestre.ejercicios ?? 0;
    inputActitudinal.value = notaBimestre.actitudinal ?? 0;
    inputTrabajo.value = notaBimestre.trabajo ?? 0;
    inputNotaFinal.value = notaBimestre.total ?? 0;
  } else {
    inputExamen.value = "";
    inputEjercicios.value = "";
    inputActitudinal.value = "";
    inputTrabajo.value = "";
    inputNotaFinal.value = "";
  }
}

// Calcular nota final automáticamente
[inputExamen, inputEjercicios, inputActitudinal, inputTrabajo].forEach(input => {
  input.addEventListener("input", () => {
    const examen = parseInt(inputExamen.value) || 0;
    const ejercicios = parseInt(inputEjercicios.value) || 0;
    const actitudinal = parseInt(inputActitudinal.value) || 0;
    const trabajo = parseInt(inputTrabajo.value) || 0;
    inputNotaFinal.value = examen + ejercicios + actitudinal + trabajo;
  });
});

// Guardar notas detalladas
formNotas.addEventListener("submit", e => {
  e.preventDefault();
  if (!alumnoSeleccionado) return alert("Selecciona un alumno primero.");

  const codigo = mapaNombreACodigo[alumnoSeleccionado];
  const curso = selectCurso.value;
  const b = parseInt(selectBimestre.value);

  const examen = parseInt(inputExamen.value);
  const ejercicios = parseInt(inputEjercicios.value);
  const actitudinal = parseInt(inputActitudinal.value);
  const trabajo = parseInt(inputTrabajo.value);

  if ([examen, ejercicios, actitudinal, trabajo].some(n => isNaN(n))) {
    return alert("Completa todos los campos de nota.");
  }

  window.notasPorAlumno[codigo] ||= {};
  window.notasPorAlumno[codigo][curso] ||= [];
  window.notasPorAlumno[codigo][curso][b - 1] = {
    examen,
    ejercicios,
    actitudinal,
    trabajo,
    total: examen + ejercicios + actitudinal + trabajo
  };

  localStorage.setItem("notasPorAlumno", JSON.stringify(window.notasPorAlumno));
  alert(`Notas guardadas para ${alumnoSeleccionado} - ${curso}, Bimestre ${b}`);
});

// ======== Mostrar lista de alumnos ========
function mostrarAlumnos() {
  listaAlumnos.innerHTML = "";
  const alumnos = window.listaAlumnosDesdeCSV;

  if (!alumnos || alumnos.length === 0) {
    listaAlumnos.innerHTML = "<p>No hay alumnos cargados.</p>";
    return;
  }

  alumnos.forEach(({ codigo, nombre, grado }) => {
    if (!nombre || !grado) return;
    mapaNombreACodigo[nombre] = codigo; // aseguramos el mapa actualizado
    const li = document.createElement("li");
    li.textContent = `${nombre} - ${grado}`;
    li.style.cursor = "pointer";
    li.onclick = () => {
      alumnoSeleccionado = nombre;
      selectAlumnoNotas.value = nombre;
      mostrarSeccion("notas");
      cargarNotasAlumnoEnFormulario();
    };
    listaAlumnos.appendChild(li);
  });

  actualizarSelectsAlumnos();
}

// ======== FORMULARIO MANUAL DE ALUMNOS ========
const formAgregarAlumno = document.getElementById("formAgregarAlumno");
const inputCodigoAlumno = document.getElementById("codigoAlumno");
const inputNombreAlumno = document.getElementById("nombreAlumno");
const inputClaveAlumno = document.getElementById("claveAlumno");
const inputGradoAlumno = document.getElementById("gradoAlumno");

formAgregarAlumno.addEventListener("submit", e => {
  e.preventDefault();

  const codigo = inputCodigoAlumno.value.trim();
  const nombre = inputNombreAlumno.value.trim();
  const clave = inputClaveAlumno.value.trim();
  const grado = inputGradoAlumno.value.trim();

  if (!codigo || !nombre || !clave || !grado) {
    return alert("Completa todos los campos del alumno.");
  }

  // Evitar duplicados por código
  const existe = window.listaAlumnosDesdeCSV.some(a => a.codigo === codigo);
  if (existe) return alert("Ya existe un alumno con ese código.");

  // Crear alumno
  const nuevoAlumno = { codigo, nombre, clave, grado };
  window.listaAlumnosDesdeCSV.push(nuevoAlumno);
  localStorage.setItem("alumnosDesdeCSV", JSON.stringify(window.listaAlumnosDesdeCSV));

  // Crear usuario correspondiente
  const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuariosExistentes.push({ usuario: codigo, contrasena: clave, tipo: "alumno", nombre });
  localStorage.setItem("usuarios", JSON.stringify(usuariosExistentes));

  alert(`Alumno ${nombre} agregado correctamente ✅`);

  // Refrescar vista
  mostrarAlumnos();

  // Limpiar formulario
  formAgregarAlumno.reset();
});

// ======== CARGA CSV ========
btnCargarCSV.addEventListener("click", () => {
  const archivo = inputCSV.files[0];
  if (!archivo) return alert("Selecciona un archivo CSV primero.");

  const lector = new FileReader();
  lector.onload = e => {
    const texto = e.target.result;
    const delimiter = texto.includes("\t") ? "\t" : ",";
    const lineas = texto.trim().split("\n").slice(1);

    const alumnos = [];
    const nuevosUsuarios = [];

    for (let linea of lineas) {
      const columnas = linea.trim().split(delimiter);
      if (columnas.length >= 4) {
        const [codigo, nombre, clave, grado] = columnas;
        if (codigo && nombre && clave && grado) {
          alumnos.push({ codigo, nombre, clave, grado });
          nuevosUsuarios.push({ usuario: codigo, contrasena: clave, tipo: "alumno", nombre });
        }
      }
    }

    window.listaAlumnosDesdeCSV = alumnos;
    localStorage.setItem("alumnosDesdeCSV", JSON.stringify(alumnos));

    // Actualizar usuarios
    const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuariosActualizados = [...usuariosExistentes, ...nuevosUsuarios];
    localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));

    alert("Alumnos y usuarios cargados correctamente.");
    mostrarAlumnos();
  };
  lector.readAsText(archivo);
});

// ======== BIMESTRE ACTUAL ========
selectBimestreActivo.addEventListener("change", () => {
  bimestreActualGuardado = parseInt(selectBimestreActivo.value);
  localStorage.setItem("bimestreActual", bimestreActualGuardado);
  selectBimestre.value = bimestreActualGuardado;
  if (alumnoSeleccionado) cargarNotasAlumnoEnFormulario();
});

// ======== NAVEGACIÓN ========
["Alumnos", "Notas", "Asistencia", "Notificaciones"].forEach(seccion => {
  document.getElementById(`link${seccion}`)?.addEventListener("click", e => {
    e.preventDefault();
    if (seccion !== "Alumnos" && !alumnoSeleccionado) return alert("Selecciona un alumno primero.");
    mostrarSeccion(seccion.toLowerCase());
  });
});

document.getElementById("linkCerrarSesion")?.addEventListener("click", e => {
  e.preventDefault();
  localStorage.removeItem("usuarioActual");
  window.location.href = "login.html";
});

function mostrarSeccion(seccion) {
  seccionAlumnos.style.display = seccion === "alumnos" ? "block" : "none";
  seccionNotas.style.display = seccion === "notas" ? "block" : "none";
  seccionAsistencia.style.display = seccion === "asistencia" ? "block" : "none";
  seccionNotificaciones.style.display = seccion === "notificaciones" ? "block" : "none";
}

// ======== NOTIFICACIONES ========
// Enviar notificación individual
formNotificacion.addEventListener("submit", e => {
  e.preventDefault();
  const alumnoNombre = selectAlumnoNotificacion.value;
  const mensaje = mensajeNotificacion.value.trim();
  if (!alumnoNombre || !mensaje) return alert("Selecciona un alumno y escribe un mensaje.");

  const codigo = mapaNombreACodigo[alumnoNombre];
  if (!codigo) return alert("No se encontró el código del alumno.");

  window.notificaciones[codigo] ||= [];
  window.notificaciones[codigo].push({
    mensaje,
    fecha: new Date().toLocaleString()
  });

  localStorage.setItem("notificaciones", JSON.stringify(window.notificaciones));

  mensajeNotificacion.value = "";
  alert("Notificación enviada correctamente ✅");
  mostrarNotificacionesDocente();
});

// Mostrar notificaciones enviadas
function mostrarNotificacionesDocente() {
  listaNotificacionesDocente.innerHTML = "";
  const todas = Object.entries(window.notificaciones);
  if (todas.length === 0) {
    listaNotificacionesDocente.innerHTML = "<li>No has enviado notificaciones todavía.</li>";
    return;
  }

  todas.forEach(([codigo, notis]) => {
    const alumno = window.listaAlumnosDesdeCSV.find(a => a.codigo === codigo);
    const nombre = alumno ? alumno.nombre : codigo;
    notis.forEach(n => {
      const li = document.createElement("li");
      li.textContent = `${nombre} - ${n.fecha}: ${n.mensaje}`;
      listaNotificacionesDocente.appendChild(li);
    });
  });
}

// Borrar todas las notificaciones
btnBorrarNotificaciones.addEventListener("click", () => {
  if (!confirm("¿Seguro que quieres borrar todas las notificaciones enviadas?")) return;
  window.notificaciones = {};
  localStorage.setItem("notificaciones", JSON.stringify(window.notificaciones));
  mostrarNotificacionesDocente();
});

// ======== NOTIFICACIÓN GENERAL ========
formNotificacionGeneral.addEventListener("submit", e => {
  e.preventDefault();
  const mensaje = inputNotificacionGeneral.value.trim();
  if (!mensaje) return alert("Escribe un mensaje para todos los alumnos.");

  window.listaAlumnosDesdeCSV.forEach(alumno => {
    const codigo = alumno.codigo;
    window.notificaciones[codigo] ||= [];
    window.notificaciones[codigo].push({
      mensaje: `[GENERAL] ${mensaje}`,
      fecha: new Date().toLocaleString()
    });
  });

  localStorage.setItem("notificaciones", JSON.stringify(window.notificaciones));
  inputNotificacionGeneral.value = "";
  alert("Notificación general enviada a todos ✅");
  mostrarNotificacionesDocente();
});



// ======== INICIALIZACIÓN ========
mostrarAlumnos();
mostrarSeccion("alumnos");
mostrarNotificacionesDocente();

