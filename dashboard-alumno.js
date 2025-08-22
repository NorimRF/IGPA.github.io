// dashboard-alumno.js

// Verificamos si el usuario está logueado
const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
if (!usuario) {
  window.location.href = "login.html";
}

const nombre = usuario.nombre;
const username = usuario.usuario;

// ✅ Cargar datos desde localStorage
const gradoPorAlumno = JSON.parse(localStorage.getItem("gradoPorAlumno")) || {};
const notasPorAlumno = JSON.parse(localStorage.getItem("notasPorAlumno")) || {};
const asistenciaPorAlumno = JSON.parse(localStorage.getItem("asistenciaPorAlumno")) || {};
const notificaciones = JSON.parse(localStorage.getItem("notificaciones")) || {};
const bimestreActual = parseInt(localStorage.getItem("bimestreActual")) || 1;

// Set saludo y grado
document.getElementById("saludo").innerText = obtenerSaludo(nombre);
document.getElementById("grado").innerText = `Grado: ${gradoPorAlumno[username] || "Sin grado asignado"}`;

// Referencias a secciones
const panelNotas = document.getElementById("panelNotas");
const seccionAsistencia = document.querySelector(".asistencia");
const seccionNotificaciones = document.querySelector(".notificaciones");
const encabezado = document.querySelector(".encabezado");

// Crear contenedor extra para resumen en Inicio
const resumenInicio = document.createElement("section");
resumenInicio.id = "resumenInicio";
resumenInicio.style.padding = "10px";
resumenInicio.style.display = "flex";
resumenInicio.style.flexWrap = "wrap";
resumenInicio.style.justifyContent = "center";
resumenInicio.style.gap = "20px";
document.querySelector("main.contenido").insertBefore(resumenInicio, panelNotas);

// Función para limpiar secciones
function ocultarSecciones() {
  resumenInicio.style.display = "none";
  panelNotas.style.display = "none";
  seccionAsistencia.style.display = "none";
  seccionNotificaciones.style.display = "none";
}

// Función para mostrar Inicio
function mostrarInicio() {
  ocultarSecciones();
  resumenInicio.style.display = "flex";
  encabezado.querySelector("h1").innerText = obtenerSaludo(nombre);
  encabezado.querySelector("p").innerText = `Grado: ${gradoPorAlumno[username] || "Sin grado asignado"}`;

  resumenInicio.innerHTML = `<h2 style="width:100%; text-align:center; margin-bottom:20px;">Bimestre actual: ${bimestreActual}</h2>`;

  // Mostrar aviso de notificaciones
  const notis = notificaciones[username] || [];
  if (notis.length > 0) {
    const notiAviso = document.createElement("div");
    notiAviso.style.width = "100%";
    notiAviso.style.backgroundColor = "#FFEB3B";
    notiAviso.style.color = "#333";
    notiAviso.style.padding = "10px";
    notiAviso.style.borderRadius = "6px";
    notiAviso.style.textAlign = "center";
    notiAviso.style.fontWeight = "600";
    notiAviso.style.marginBottom = "20px";
    notiAviso.textContent = `Tienes ${notis.length} notificación${notis.length > 1 ? "es" : ""}`;
    resumenInicio.appendChild(notiAviso);
  }

  // Mostrar gráficos circulares para cada curso con nota bimestre actual
  const notas = notasPorAlumno[username] || {};
  for (const curso in notas) {
    const valores = notas[curso];
    if (!valores || valores.length === 0) continue;

    const objNota = valores[bimestreActual - 1] || {};
    const actual = objNota?.notaFinal ?? objNota?.total ?? 0;

    const div = document.createElement("div");
    div.style.width = "180px";
    div.style.backgroundColor = "#fff";
    div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    div.style.borderRadius = "8px";
    div.style.padding = "15px";
    div.style.textAlign = "center";
    div.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    const titulo = document.createElement("h3");
    titulo.textContent = curso;
    titulo.style.marginBottom = "10px";
    div.appendChild(titulo);

    const canvas = document.createElement("canvas");
    canvas.id = `resumen-grafico-${curso.replaceAll(" ", "")}`;
    canvas.width = 150;
    canvas.height = 150;
    div.appendChild(canvas);

    const notaTexto = document.createElement("p");
    notaTexto.textContent = `Nota: ${actual} puntos`;
    notaTexto.style.margin = "10px 0 0";
    notaTexto.style.fontWeight = "700";
    notaTexto.style.fontSize = "1.1rem";
    div.appendChild(notaTexto);

    if (actual >= 60) {
      const aprobadoTexto = document.createElement("p");
      aprobadoTexto.textContent = "APROBADO";
      aprobadoTexto.style.color = "#4CAF50";
      aprobadoTexto.style.fontWeight = "700";
      aprobadoTexto.style.fontSize = "1.2rem";
      aprobadoTexto.style.marginTop = "5px";
      div.appendChild(aprobadoTexto);
    }

    resumenInicio.appendChild(div);

    const colors = ["#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0", "#FF5722"];
    const colorIndex = Object.keys(notas).indexOf(curso) % colors.length;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ["Puntos actuales", "Restante hasta 100"],
        datasets: [{ data: [actual, 100 - actual], backgroundColor: [colors[colorIndex], "#E0E0E0"] }]
      },
      options: { plugins: { legend: { display: false } }, cutout: "70%" }
    });
  }
}

// Función para mostrar detalle Notas
function mostrarNotas() {
  ocultarSecciones();
  panelNotas.style.display = "block";
  encabezado.querySelector("h1").innerText = "Detalle de Notas";
  encabezado.querySelector("p").innerText = `Grado: ${gradoPorAlumno[username] || "Sin grado asignado"}`;

  panelNotas.innerHTML = "";

  const notas = notasPorAlumno[username] || {};
  for (const curso in notas) {
    const valores = notas[curso];
    const div = document.createElement("div");
    div.classList.add("card");

    if (!valores || valores.length === 0 || valores === null) {
      div.innerHTML = `<h3>${curso}</h3><p>No estás asignado a esta clase.</p>`;
    } else {
      const bimestresHtml = valores.map((objNota, i) => {
        if (!objNota) return "";
        const { notaFinal, examen, tareas, actitudinal, trabajo, total } = objNota;
        const totalNota = notaFinal ?? total ?? 0;
        const aprobado = totalNota >= 60;
        const estado = aprobado ? "APROBADO ✅" : "REPROBADO ❌";
        const color = aprobado ? "#4CAF50" : "#F44336";

        return `
          <div style="margin-bottom:15px;">
            <strong style="color:${i + 1 === bimestreActual ? '#0D47A1' : '#888'}">Bimestre ${i + 1}</strong><br/>
            <p><strong style="color:${color}">${estado}</strong> - Total: ${totalNota} puntos</p>
            <ul style="text-align:left; margin-left:15px;">
              <li>Examen: ${examen ?? 0} pts</li>
              <li>Ejercicios y tareas: ${tareas ?? 0} pts</li>
              <li>Actitudinal: ${actitudinal ?? 0} pts</li>
              <li>Trabajo: ${trabajo ?? 0} pts</li>
            </ul>
          </div>
        `;
      }).join("");

      div.innerHTML = `<h3>${curso}</h3>${bimestresHtml}`;
    }
    panelNotas.appendChild(div);
  }
}

// Función para mostrar Asistencia
function mostrarAsistencia() {
  ocultarSecciones();
  seccionAsistencia.style.display = "block";
  encabezado.querySelector("h1").innerText = "Asistencia";
  encabezado.querySelector("p").innerText = `Grado: ${gradoPorAlumno[username] || "Sin grado asignado"}`;

  const dias = asistenciaPorAlumno[username] || [];
  document.getElementById("diasAsistidos").innerHTML = `
    <p>Días asistidos: ${dias.length}</p>
    <ul>${dias.map(d => `<li>${d}</li>`).join("")}</ul>
  `;

  const ctx = document.getElementById("graficoAsistencia").getContext("2d");
  if (window.chartAsistencia) window.chartAsistencia.destroy();
  window.chartAsistencia = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Asistencias", "Inasistencias"],
      datasets: [{ data: [dias.length, Math.max(0, 20 - dias.length)], backgroundColor: ["#2196F3", "#90CAF9"] }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

// Función para mostrar Notificaciones
function mostrarNotificaciones() {
  ocultarSecciones();
  seccionNotificaciones.style.display = "block";
  encabezado.querySelector("h1").innerText = "Notificaciones";
  encabezado.querySelector("p").innerText = `Grado: ${gradoPorAlumno[username] || "Sin grado asignado"}`;

  const notis = notificaciones[username] || [];
  document.getElementById("listaNotificaciones").innerHTML = notis.map(n => `<li>${n}</li>`).join("");
}

// Saludo personalizado
function obtenerSaludo(nombre) {
  const hora = new Date().getHours();
  if (hora < 12) return `¡Buenos días, ${nombre}!`;
  else if (hora < 18) return `¡Buenas tardes, ${nombre}!`;
  else return `¡Buenas noches, ${nombre}!`;
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  window.location.href = "login.html";
}

// Sidebar
function setupSidebar() {
  const links = document.querySelectorAll(".sidebar ul li a");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove("activo"));
      link.classList.add("activo");
      const text = link.textContent.toLowerCase();
      if (text.includes("inicio")) mostrarInicio();
      else if (text.includes("notas")) mostrarNotas();
      else if (text.includes("asistencia")) mostrarAsistencia();
      else if (text.includes("notificaciones")) mostrarNotificaciones();
      else if (text.includes("cerrar sesión")) cerrarSesion();
    });
  });
}

// Iniciar mostrando Inicio
mostrarInicio();
setupSidebar();
