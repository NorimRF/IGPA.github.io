// login.js
import { supabase } from './supabase.js';

const loginForm = document.getElementById("loginForm");

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
      // Consultamos Supabase
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("usuario", user)
        .eq("contraseña", pass)
        .single();

      if (error || !data) {
        alert("Usuario o contraseña incorrectos");
        return;
      }

      // Guardamos el usuario en localStorage
      localStorage.setItem("usuarioActual", JSON.stringify(data));

      // Redirigir según tipo
      if (data.tipo === "alumno") {
        window.location.href = "dashboard-alumno.html";
      } else {
        window.location.href = "dashboard-docente.html";
      }

    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  });
}
