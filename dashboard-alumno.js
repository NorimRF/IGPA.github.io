// dashboard-alumno.js

// Verificamos si el usuario está logueado
const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
if (!usuario) {
  window.location.href = "login.html";
}

const nombre = usuario.nombre;
const username = usuario.usuario;

// Cargar datos desde localStorage
const gradoPorAlumno = JSON.parse(localStorage.getItem("gradoPorAlumno")) || {};
const notasPorAlumno = JSON.parse(localStorage.getItem("notasPorAlumno")) || {};
const asistenciaPorAlumno = JSON.parse(localStorage.getItem("asistenciaPorAlumno")) || {};
const notificaciones = JSON.parse(localStorage.getItem("notificaciones")) || {};
const bimestreActual = parseInt(localStorage.getItem("bimestreActual")) || 1;

// Obtener grado
const grado = usuario.grado || gradoPorAlumno[username] || "Sin grado asignado";

// Set saludo y grado
document.getElementById("saludo").innerText = obtenerSaludo(nombre);
document.getElementById("grado").innerText = `Grado: ${grado}`;

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

// =======================
// Función para mostrar Inicio con gráficos 3D coloridos
// =======================
function mostrarInicio() {
  ocultarSecciones();
  resumenInicio.style.display = "flex";
  encabezado.querySelector("h1").innerText = obtenerSaludo(nombre);
  encabezado.querySelector("p").innerText = `Grado: ${grado}`;

  resumenInicio.innerHTML = `<h2 style="width:100%; text-align:center; margin-bottom:20px;">Bimestre actual: ${bimestreActual}</h2>`;

  // Notificaciones
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

  const coloresBase = ["#4CAF50","#FF9800","#9C27B0","#F44336","#2196F3","#FFC107"];
  const notas = notasPorAlumno[username] || {};

  for (const curso in notas) {
    const valores = notas[curso];
    if (!valores || valores.length === 0) continue;

    const objNota = valores[bimestreActual - 1] || {};
    const actual = objNota?.notaFinal ?? objNota?.total ?? 0;

    const div = document.createElement("div");
    div.style.width = "180px";
    div.style.backgroundColor = "#fff";
    div.style.boxShadow = "0 5px 25px rgba(0,0,0,0.3)";
    div.style.borderRadius = "12px";
    div.style.padding = "15px";
    div.style.textAlign = "center";
    div.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    const titulo = document.createElement("h3");
    titulo.textContent = curso;
    titulo.style.marginBottom = "10px";
    titulo.style.color = coloresBase[Object.keys(notas).indexOf(curso) % coloresBase.length];
    titulo.style.fontWeight = "700";
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

    // Gráfico radial
    const ctx = canvas.getContext("2d");
    const colorIndex = Object.keys(notas).indexOf(curso) % coloresBase.length;
    const colorPrincipal = coloresBase[colorIndex];

    const gradient = ctx.createRadialGradient(75, 75, 20, 75, 75, 75);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0.4, colorPrincipal);
    gradient.addColorStop(1, shadeColor(colorPrincipal, -20));

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ["Puntos actuales", "Restante hasta 100"],
        datasets: [{
          data: [actual, Math.max(0, 100 - actual)],
          backgroundColor: [gradient, "rgba(200,200,200,0.3)"],
          borderWidth: 2,
          borderColor: "#aaa",
          hoverOffset: 20
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        cutout: "55%",
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1800,
          easing: 'easeOutBounce'
        }
      }
    });
  }
}

// =======================
// Función auxiliar para oscurecer color
// =======================
function shadeColor(color, percent) {
  let f=parseInt(color.slice(1),16),
      t=percent<0?0:255,
      p=percent<0?percent*-1:percent,
      R=f>>16,
      G=f>>8&0x00FF,
      B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p/100)+R)*0x10000+
               (Math.round((t-G)*p/100)+G)*0x100+
               (Math.round((t-B)*p/100)+B)).toString(16).slice(1);
}

// =======================
// Mostrar detalle Notas
// =======================
function mostrarNotas() {
  ocultarSecciones();
  panelNotas.style.display = "block";
  encabezado.querySelector("h1").innerText = "Detalle de Notas";
  encabezado.querySelector("p").innerText = `Grado: ${grado}`;

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
        const { notaFinal, examen, ejercicios, actitudinal, trabajo, total } = objNota;
        const totalNota = notaFinal ?? total ?? 0;
        const aprobado = totalNota >= 60;
        const estado = aprobado ? "APROBADO ✅" : "REPROBADO ❌";
        const color = aprobado ? "#4CAF50" : "#F44336";

        return `
          <div style="margin-bottom:15px;">
            <strong style="color:${i + 1 === bimestreActual ? '#000' : '#888'}">Bimestre ${i + 1}</strong><br/>
            <p><strong style="color:${color}">${estado}</strong> - Total: ${totalNota} puntos</p>
            <ul style="text-align:left; margin-left:15px;">
              <li>Examen: ${examen ?? 0} pts</li>
              <li>Ejercicios: ${ejercicios ?? 0} pts</li>
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

// =======================
// Mostrar Asistencia con grid de tarjetas coloridas
// =======================
function mostrarAsistencia() {
  ocultarSecciones();
  seccionAsistencia.style.display = "block";
  encabezado.querySelector("h1").innerText = "Asistencia";
  encabezado.querySelector("p").innerText = `Grado: ${grado}`;

  const dias = asistenciaPorAlumno[username] || [];
  const contenedor = document.getElementById("diasAsistidos");
  contenedor.innerHTML = "";

  // Resumen
  const resumen = document.createElement("p");
  resumen.textContent = `Días asistidos: ${dias.length}`;
  resumen.style.fontWeight = "700";
  contenedor.appendChild(resumen);

  // Grid de tarjetas
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))";
  grid.style.gap = "15px";
  grid.style.marginTop = "10px";

  const colores = ["#4CAF50","#FFC107","#2196F3","#FF5722","#9C27B0","#00BCD4"];

  dias.forEach((d, i) => {
    const tarjeta = document.createElement("div");
    tarjeta.style.backgroundColor = colores[i % colores.length];
    tarjeta.style.padding = "10px";
    tarjeta.style.borderRadius = "10px";
    tarjeta.style.color = "#fff";
    tarjeta.style.textAlign = "center";
    tarjeta.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)";

    const fecha = d.fecha || d; // soporta string o objeto
    const hora = d.hora_entrada ?? d.hora ?? "";
    tarjeta.innerHTML = `<strong>${fecha}</strong><br/>${hora ? "Entrada: "+hora : ""}`;

    grid.appendChild(tarjeta);
  });

  contenedor.appendChild(grid);
}

// =======================
// Mostrar Notificaciones
// =======================
function mostrarNotificaciones() {
  ocultarSecciones();
  seccionNotificaciones.style.display = "block";
  encabezado.querySelector("h1").innerText = "Notificaciones";
  encabezado.querySelector("p").innerText = `Grado: ${grado}`;

  const notis = notificaciones[username] || [];
  const lista = document.getElementById("listaNotificaciones");

  if (notis.length === 0) {
    lista.innerHTML = "<li>No tienes notificaciones</li>";
    return;
  }

  lista.innerHTML = notis.map(n => `<li><strong>${n.fecha}</strong>: ${n.mensaje}</li>`).join("");
}

// =======================
// Saludo personalizado
// =======================
function obtenerSaludo(nombre) {
  const hora = new Date().getHours();
  if (hora<12) return `¡Buenos días, ${nombre}!`;
  else if (hora<18) return `¡Buenas tardes, ${nombre}!`;
  else return `¡Buenas noches, ${nombre}!`;
}

// =======================
// Cerrar sesión
// =======================
function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  window.location.href="login.html";
}

// =======================
// Configuración del sidebar
// =======================
function setupSidebar() {
  const links = document.querySelectorAll(".sidebar ul li a");
  links.forEach(link => {
    link.addEventListener("click",(e)=>{
      e.preventDefault();
      links.forEach(l=>l.classList.remove("activo"));
      link.classList.add("activo");
      const text=link.textContent.toLowerCase();
      if(text.includes("inicio")) mostrarInicio();
      else if(text.includes("notas")) mostrarNotas();
      else if(text.includes("asistencia")) mostrarAsistencia();
      else if(text.includes("notificaciones")) mostrarNotificaciones();
      else if(text.includes("cerrar sesión")) cerrarSesion();
    });
  });
}

// Inicialización del dashboard
mostrarInicio();
setupSidebar();
