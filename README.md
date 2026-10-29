# 🏫 Sistema de Control de Asistencia Escolar y Resumen Estadístico Mensual (MPPE Venezuela)

[![Probar en Vivo](https://img.shields.io/badge/Demo%20en%20Vivo-1--Click%20Online-success?style=for-the-badge&logo=googlechrome)](https://andresm333.github.io/asistencia-escolar/)
[![100% Offline](https://img.shields.io/badge/Funcionamiento-100%25%20Offline-blue?style=for-the-badge)](https://github.com/AndresM333/asistencia-escolar)
[![Formato Oficial](https://img.shields.io/badge/MPPE-Formato%20Oficial-yellow?style=for-the-badge)](https://github.com/AndresM333/asistencia-escolar)
[![Privacidad Local](https://img.shields.io/badge/Datos-Almacenamiento%20Local-green?style=for-the-badge)](https://github.com/AndresM333/asistencia-escolar)

> **Aplicación web y móvil progresiva (PWA) de arquitectura 100% local (offline-first), desarrollada específicamente para docentes con el propósito de erradicar los errores humanos en el registro diario de asistencia y en el cálculo del "Resumen Estadístico Mensual del Grado" exigido por el Ministerio del Poder Popular para la Educación (MPPE).**

---

## ⚡ Pruébala de Inmediato (1 Solo Clic)

No necesitas instalar nada para probar la aplicación en tu teléfono, tablet o computadora:

👉 **[HAGA CLIC AQUÍ PARA ABRIR LA APP EN VIVO](https://andresm333.github.io/asistencia-escolar/)**

*(Funciona tanto en línea como sin conexión a internet una vez cargada por primera vez).*

---

## 🎯 El Problema que Resuelve: Erradicación del Error Humano

En el sistema educativo venezolano, los maestros de aula deben realizar un registro diario minucioso y, al final de cada mes lectivo, presentar el informe oficial físico: **"RESUMEN ESTADISTICO MENSUAL DEL GRADO"**. 

El proceso tradicional mediante papel o planillas manuscritas presenta una tasa crítica de **error humano**, tales como:

1. **Inconsistencias Aritméticas Diarias**: 
   - Equivocaciones en las sumatorias de Varones ($V$) y Hembras ($H$) para obtener el Total del día ($T = V + H$).
2. **Fallas en Fórmulas Complejas de Fin de Mes**:
   - Cálculo incorrecto del **Promedio de Asistencia** ($\frac{\text{Total Asistencias}}{\text{Días efectivamente impartidos}}$).
   - Errores recurrentes en el cálculo del **Porcentaje de Asistencia**:
     $$\% = \frac{\text{Suma Asistencia del Mes}}{\text{Matrícula Final} \times \text{Días Hábiles}} \times 100$$
3. **Descuadre en Movimientos de Matrícula**:
   - Discrepancias entre la Matrícula al 1º día del mes, los estudiantes ingresados durante el mes, los retirados y la Matrícula Final del mes.
4. **Días Sin Clases y Borrones en la Planilla**:
   - Tachaduras y formato roto al intentar registrar en casillas pequeñas el motivo por el cual no se impartieron clases en una fecha determinada.
5. **Tiempo Invertido por el Docente**:
   - Los profesores gastan horas valiosas de su tiempo libre recalculando números y repitiendo planillas por errores de conteo o caligrafía.

### ✨ La Solución Digital

Esta aplicación elimina completamente estos problemas mediante:
- **Cálculo Automático en Tiempo Real**: El Total ($T$), los promedios y porcentajes se computan sin intervención manual.
- **Validación Estricta de Entradas**: Solo admite números enteros positivos; previene el ingreso de valores negativos o caracteres erróneos.
- **Fusión Inteligente de Celdas**: Cuando se marca "Día sin clases", las celdas diarias se combinan visualmente y plasman el motivo (con control sugerido de hasta 20 palabras para no saturar el formato).
- **Control Estricto de Ingresos, Egresos y Repitientes**: Mínimo 3 renglones y máximo estricto de 5 registros mensuales, cumpliendo con la cuadrícula de la planilla física.
- **Exportación Idéntica al Formato Oficial**: Genera con 1 solo clic la planilla ministerial tanto en **Excel (.xls)** como en **PDF imprimible**, dejando en blanco los espacios de entrega y firmas para la validación manuscrita.

---

## 📱 Guía de Instalación y Uso

### A. En Teléfonos Inteligentes (Android / iOS)

#### Opción 1: Instalar como App Móvil desde el Navegador (Recomendada)
1. Abre el enlace [https://andresm333.github.io/asistencia-escolar/](https://andresm333.github.io/asistencia-escolar/) desde el navegador de tu teléfono (**Google Chrome** en Android o **Safari** en iPhone).
2. Toca el menú de opciones del navegador (los 3 puntos verticales o el botón de compartir).
3. Selecciona **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.
4. ¡Listo! Tendrás un ícono directo en tu teléfono que funcionará **sin necesidad de internet**.

#### Opción 2: Uso 100% Offline con el Archivo Autónomo
1. Descarga el archivo [`AsistenciaEscolar.html`](./AsistenciaEscolar.html) en tu teléfono (puedes pasártelo por WhatsApp, Bluetooth o cable USB).
2. Toca el archivo y ábrelo con tu navegador web favorito (Chrome, Brave, etc.).
3. Funciona de manera perpetua sin gastar megas ni requerir red de internet.

---

### B. En Computadoras (Windows / macOS / Linux)

1. Clona o descarga el repositorio:
   ```bash
   git clone https://github.com/AndresM333/asistencia-escolar.git
   ```
2. Haz doble clic en `index.html` o en `AsistenciaEscolar.html`.
3. Se abrirá de inmediato en tu navegador predeterminado listo para trabajar.

---

## 💻 Recomendaciones de Navegador y Hardware

Para garantizar una experiencia óptima, fluidez y persistencia segura de los datos, toma en cuenta las siguientes recomendaciones:

### 🌐 Navegadores Web Recomendados

| Plataforma | Navegadores Óptimos | Comentarios |
| :--- | :--- | :--- |
| **Android** | **Google Chrome**, **Brave**, **Samsung Internet** | Compatibilidad nativa al 100% con **IndexedDB** y descarga de archivos Excel/PDF. |
| **iOS / iPadOS** | **Safari** (iOS 15.0 o superior), **Chrome** | Soporte completo para almacenamiento local y previsualización de impresión PDF. |
| **Computadoras** | **Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, **Brave** | Excelente rendimiento en exportación e impresión en hojas tamaño Carta / Oficio. |

> [!IMPORTANT]
> **Consejo sobre Navegadores**:  
> No utilices el "Modo Incógnito" o navegación privada para llevar tus registros cotidianos, ya que este modo borra la memoria del navegador al cerrarse. Utiliza siempre ventanas normales para que tus asistencias se conserven intactas en la memoria del dispositivo.

---

### ⚙️ Requisitos de Hardware

- **Requisitos Mínimos**:
  - **Dispositivo**: Cualquier teléfono inteligente de gama de entrada (Android 7.0+ o iOS 12+), tablet o PC básica.
  - **Memoria RAM**: 1 GB.
  - **Almacenamiento**: Menos de 5 MB de espacio disponible (la aplicación es ultraliviana).
  - **Pantalla**: Pantallas táctiles de cualquier resolución (diseño fluido responsive).

- **Requisitos Recomendados**:
  - **Memoria RAM**: 2 GB o más.
  - **Pantalla**: Pantalla de 5.5 pulgadas o superior (o pantalla de PC) para visualizar las tablas del resumen mensual con mayor comodidad y amplitud.

---

## 🔒 Privacidad y Almacenamiento 100% Local

- **Tus datos nunca salen de tu dispositivo**: No existe ningún servidor remoto ni base de datos en la nube que recolecte los nombres, cédulas o asistencias de los estudiantes.
- **Base de Datos Local**: Todo se almacena en el motor **IndexedDB** y **LocalStorage** de tu propio dispositivo.
- **Copias de Seguridad (Backup)**: En la pestaña de **Ajustes**, dispones de un botón para **Exportar Copia de Seguridad (.json)** para resguardar tus datos en un pendrive, correo personal o enviártelos por WhatsApp, y un botón para **Restaurar Copia** en caso de cambiar de teléfono.

---

## 📄 Estructura del Proyecto

```text
asistencia-escolar/
│
├── AsistenciaEscolar.html   # Aplicación todo-en-uno autónoma e independiente (Single-File)
├── index.html               # Entrypoint web principal y PWA
├── manifest.json            # Manifiesto para instalación como aplicación móvil
├── sw.js                    # Service Worker para funcionamiento sin conexión
├── README.md                # Documentación oficial del proyecto
├── .gitignore               # Exclusiones de control de versiones
│
├── css/
│   └── styles.css           # Estilos modernos, diseño responsive y modo oscuro
└── js/
    ├── app.js               # Lógica general y navegación de la interfaz
    ├── db.js                # Gestor de base de datos local (IndexedDB)
    ├── excelExport.js       # Motor de exportación a planilla oficial MPPE en Excel
    ├── pdfExport.js         # Motor de generación e impresión PDF formato oficial MPPE
    └── chartManager.js      # Métricas y visualizaciones estadísticas
```

---

## 📜 Licencia y Autor

Desarrollado con dedicación para apoyar la labor docente y administrativa escolar en Venezuela.  
Distribuido bajo la Licencia **MIT**. Eres libre de usar, adaptar y compartir este software.
