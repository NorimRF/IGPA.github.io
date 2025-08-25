// login.js
import { supabase } from './supabase.js';

const loginForm = document.getElementById("loginForm");

// Definir los códigos de docentes para redirigirlos correctamente
const codigosDocente = ["BC4002", "BC4001", "PC4001"]; // agrega aquí los códigos de tus docentes

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("contrasena").value.trim();

    if (!user || !pass) {
      alert("Por favor ingresa usuario y contraseña");
      return;
    }

    try {
      // Consultamos Supabase usando las columnas correctas
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("codigo", user)
        .eq("clave", pass)
        .single();

      if (error || !data) {
        alert("Usuario o contraseña incorrectos");
        return;
      }

      // Guardamos el usuario en localStorage
      localStorage.setItem("usuarioActual", JSON.stringify(data));

      // Redirigir según si es docente o alumno
      if (codigosDocente.includes(user)) {
        window.location.href = "dashboard-docente.html";
      } else {
        window.location.href = "dashboard-alumno.html";
      }

    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  });
}
