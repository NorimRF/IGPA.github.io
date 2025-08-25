// data.js
import { supabase } from './supabase.js'

window.bimestreActual = 4; // 1, 2, 3 o 4

// Función para cargar notas de un alumno desde Supabase
export async function cargarNotas(username) {
  const { data, error } = await supabase
    .from('notas')           // tabla 'notas' en Supabase
    .select('*')
    .eq('usuario', username);

  if (error) {
    console.error("Error cargando notas:", error);
    return {};
  }

  // Convertimos los datos a la misma estructura que tenías
  const notasPorAlumno = {};
  data.forEach(nota => {
    if (!notasPorAlumno[nota.usuario]) notasPorAlumno[nota.usuario] = {};
    if (!notasPorAlumno[nota.usuario][nota.curso]) notasPorAlumno[nota.usuario][nota.curso] = [];

    notasPorAlumno[nota.usuario][nota.curso][nota.bimestre - 1] = {
      total: nota.total,
      examen: nota.examen,
      ejercicios: nota.ejercicios,
      actitudinal: nota.actitudinal,
      trabajo: nota.trabajo
    };
  });

  window.notasPorAlumno = notasPorAlumno;
  return notasPorAlumno;
}

// Función para cargar asistencias
export async function cargarAsistencia(username) {
  const { data, error } = await supabase
    .from('asistencias')
    .select('fecha')
    .eq('usuario', username);

  if (error) {
    console.error("Error cargando asistencias:", error);
    window.asistenciaPorAlumno = {};
    return {};
  }

  const asistenciaPorAlumno = {};
  asistenciaPorAlumno[username] = data.map(a => a.fecha);
  window.asistenciaPorAlumno = asistenciaPorAlumno;
  return asistenciaPorAlumno;
}

// Función para cargar notificaciones
export async function cargarNotificaciones(username) {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('usuario', username);

  if (error) {
    console.error("Error cargando notificaciones:", error);
    window.notificaciones = {};
    return {};
  }

  const notis = {};
  notis[username] = data.map(n => n.mensaje);
  window.notificaciones = notis;
  return notis;
}

// Función para cargar grado
export async function cargarGrado(username) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('grado')
    .eq('usuario', username)
    .single();

  if (error) {
    console.error("Error cargando grado:", error);
    window.gradoPorAlumno = {};
    return {};
  }

  window.gradoPorAlumno = { [username]: data.grado };
  return data.grado;
}
