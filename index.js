const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value.trim();

    // Cargar alumnos desde CSV
    const alumnosCSV = JSON.parse(localStorage.getItem("alumnosDesdeCSV")) || [];

    // Usuarios fijos
    const usuariosFijos = [
      {
        usuario: "admin",
        contrasena: "admin",
        tipo: "docente",
        nombre: "Profesor Francisco"
      }
    ];

    // Unir todos los usuarios
    const todos = [
      ...usuariosFijos,
      ...alumnosCSV.map(a => ({
        usuario: a.codigo, // este es el campo correcto del CSV
        contrasena: a.clave || a.contraseña || a.password || a.codigo, // tolerancia y fallback
        tipo: "alumno",
        nombre: a.nombre,
        id: a.codigo,
        grado: a.grado
      }))
    ];

    const encontrado = todos.find(
      (u) => u.usuario === user && u.contrasena === pass
    );

    if (encontrado) {

      localStorage.setItem("usuarioActual", JSON.stringify(encontrado));
      if (encontrado.tipo === "alumno") {
        window.location.href = "dashboard-alumno.html";
      } else {
        window.location.href = "dashboard-docente.html";
      }
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  });
}
