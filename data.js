// data.js

window.bimestreActual = 4; // 1, 2, 3 o 4

window.notasPorAlumno = {
  "GabyRU": {
    "Programación": [
      { total: 85, examen: 50, ejercicios: 20, actitudinal: 10, trabajo: 5 },
      { total: 90, examen: 52, ejercicios: 23, actitudinal: 10, trabajo: 5 },
      { total: 88, examen: 48, ejercicios: 25, actitudinal: 10, trabajo: 5 },
      { total: 0, examen: 0, ejercicios: 0, actitudinal: 15, trabajo: 0 }
    ],
    "Robótica": [
      { total: 75, examen: 40, ejercicios: 20, actitudinal: 10, trabajo: 5 },
      { total: 78, examen: 42, ejercicios: 21, actitudinal: 10, trabajo: 5 },
      { total: 80, examen: 43, ejercicios: 22, actitudinal: 10, trabajo: 5 },
      { total: 82, examen: 45, ejercicios: 22, actitudinal: 10, trabajo: 5 }
    ],
    "Computación": [
      { total: 90, examen: 50, ejercicios: 25, actitudinal: 10, trabajo: 5 },
      { total: 85, examen: 45, ejercicios: 25, actitudinal: 10, trabajo: 5 },
      { total: 87, examen: 46, ejercicios: 26, actitudinal: 10, trabajo: 5 },
      { total: 89, examen: 48, ejercicios: 26, actitudinal: 10, trabajo: 5 }
    ],
    "Contabilidad": null
  },
  "alumno2": {
    "Programación": [
      { total: 65, examen: 35, ejercicios: 15, actitudinal: 10, trabajo: 5 },
      { total: 70, examen: 38, ejercicios: 17, actitudinal: 10, trabajo: 5 },
      { total: 68, examen: 36, ejercicios: 17, actitudinal: 10, trabajo: 5 },
      { total: 72, examen: 40, ejercicios: 17, actitudinal: 10, trabajo: 5 }
    ],
    "Contabilidad": [
      { total: 80, examen: 45, ejercicios: 20, actitudinal: 10, trabajo: 5 },
      { total: 82, examen: 47, ejercicios: 20, actitudinal: 10, trabajo: 5 },
      { total: 85, examen: 50, ejercicios: 20, actitudinal: 10, trabajo: 5 },
      { total: 83, examen: 48, ejercicios: 20, actitudinal: 10, trabajo: 5 }
    ],
    "Robótica": null,
    "Computación": null
  }
};

window.asistenciaPorAlumno = {
  "GabyRU": ["2025-07-01", "2025-07-02", "2025-07-04", "2025-07-10", "2025-07-15"],
  "alumno2": ["2025-07-03", "2025-07-05", "2025-07-10"]
};

window.notificaciones = {
  "GabyRU": [
    "Recuerda traer tu proyecto de robótica esta semana.",
    "No olvides revisar tus tareas de programación en Classroom."
  ],
  "alumno2": [
    "Tu examen de contabilidad es el viernes.",
    "Revisa tus calificaciones en el portal."
  ]
};

window.gradoPorAlumno = {
  "GabyRU": "5to Perito en Computación",
  "alumno2": "4to Perito Contador"
};
