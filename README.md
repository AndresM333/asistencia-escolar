# 📋 Control de Asistencia Escolar - MPPE Venezuela

Aplicación móvil y web **100% offline** para el registro diario de asistencia escolar y generación del **Resumen Estadístico Mensual del Grado**, adaptada rigurosamente al formato oficial del Ministerio del Poder Popular para la Educación (MPPE) de Venezuela.

---

## 🌟 Características Principales

- **100% Offline (Sin Conexión a Internet)**:
  - Todo se procesa y almacena localmente en el dispositivo (móvil, tablet o PC) mediante **IndexedDB** y **LocalStorage**.
  - Los datos permanecen guardados de forma segura hasta que el usuario decida borrarlos o exportar un respaldo.

- **Registro Diario de Asistencia**:
  - Selector de **¿Se dio clases o Día sin clases?** (con advertencia de límite de 20 palabras si se suspenden las actividades).
  - Conteo rápido por género: **Varones (V)** y **Hembras (H)** mediante botones rápidos o teclado numérico.
  - Cálculo automático del **Total ($T = V + H$)**.
  - **Lista de Alumnos Inasistentes**: Registro ilimitado de faltas con Nombre, Apellido, Cédula y Motivo (opcional).
  - **Movimientos de Matrícula**: Control diario de ingresos y egresos.

- **Registros Mensuales Especiales (Máximo 5 por mes)**:
  - **Estudiantes Ingresados/as**: Nombre y Apellido, Género, Plantel de Procedencia y Fecha de ingreso.
  - **Estudiantes Egresados/as**: Nombre y Apellido, Género, Plantel de Aceptación de Cupo y Fecha de retiro.
  - **Estudiantes Repitientes**: Nombre y Apellido, Edad y condición exclusiva (1ª vez, 2ª vez o 3ª vez).

- **Exportación en Formatos Oficiales (Excel y PDF)**:
  - **Planilla Oficial MPPE**: Réplica exacta en 2 columnas de la planilla física del MPPE.
  - Fusión de celdas ($V, H, T$) en días sin clases con motivo truncado para preservar la estética.
  - Tablas de ingresados, egresados y repitientes con un mínimo de 3 filas y máximo de 5 filas.
  - Cuadro de Clasificación por Edad y Género en doble columna paralela.
  - **Pie de página oficial**: Espacios en blanco para la fecha de entrega y las firmas manuales del Docente y Directivo.

- **Configuración y Modo Oscuro**:
  - Ajustes de Datos del Plantel (Nombre, Código DEA, RIF, Grado, Sección, Docente, Año Escolar, Días Hábiles).
  - Modo Oscuro integrado para ahorrar batería y cuidar la vista.
  - Copias de seguridad (Backup JSON) importables y exportables con un clic.

---

## 🚀 Uso Rápido

1. Abre el archivo `AsistenciaEscolar.html` o `index.html` en cualquier navegador web moderno (Google Chrome, Firefox, Brave, Safari, Edge).
2. ¡Listo! No requiere instalación de servidores ni conexión a internet.
