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
      // Consultamos Supabase usando las columnas correctas
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("codigo", user)
        .eq("clave", pass)
        .single();

      if (error || !data) {
        console.log(error); // para depuración
        alert("Usuario o contraseña incorrectos");
        return;
      }

      // Guardamos el usuario en localStorage
      localStorage.setItem("usuarioActual", JSON.stringify({
        codigo: data.codigo,
        nombre: data.nombre,
        grado: data.grado
      }));

      // Redirigir según grado (puedes poner lógica diferente si quieres)
      if (data.grado.includes("Bachillerato") || data.grado.includes("Perito Contador")) {
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
