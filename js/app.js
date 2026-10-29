/**
 * Main Application Logic & UI Event Controller
 * School Attendance Offline Application
 */

document.addEventListener('DOMContentLoaded', async () => {
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('Service worker registration failed:', err);
    });
  }

  // --- UI Elements ---
  const navTabs = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  // Tab 1: Form elements
  const inputDate = document.getElementById('inputDate');
  const btnToday = document.getElementById('btnToday');

  const toggleNoClass = document.getElementById('toggleNoClass');
  const cardNoClass = document.getElementById('cardNoClass');
  const containerNoClassReason = document.getElementById('containerNoClassReason');
  const inputNoClassReason = document.getElementById('inputNoClassReason');

  const countersContainer = document.getElementById('countersContainer');
  const displayNinos = document.getElementById('displayNinos');
  const displayNinas = document.getElementById('displayNinas');
  const displayTotal = document.getElementById('displayTotal');

  const btnMinusNinos = document.getElementById('btnMinusNinos');
  const btnPlusNinos = document.getElementById('btnPlusNinos');
  const btnMinusNinas = document.getElementById('btnMinusNinas');
  const btnPlusNinas = document.getElementById('btnPlusNinas');

  const inputIntegradosNinos = document.getElementById('inputIntegradosNinos');
  const inputIntegradosNinas = document.getElementById('inputIntegradosNinas');
  const inputRetiradosNinos = document.getElementById('inputRetiradosNinos');
  const inputRetiradosNinas = document.getElementById('inputRetiradosNinas');

  const btnSaveAttendance = document.getElementById('btnSaveAttendance');

  // Tab 2: Monthly Summary elements
  const selectMonth = document.getElementById('selectMonth');
  const selectYear = document.getElementById('selectYear');

  const valPromedioTotal = document.getElementById('valPromedioTotal');
  const valPromedioNinosNinas = document.getElementById('valPromedioNinosNinas');
  const valTotalAcumulado = document.getElementById('valTotalAcumulado');
  const valDiasLectivos = document.getElementById('valDiasLectivos');
  const valDiasSinClases = document.getElementById('valDiasSinClases');
  const valIntegradosTotal = document.getElementById('valIntegradosTotal');
  const valRetiradosTotal = document.getElementById('valRetiradosTotal');

  const noClassDaysList = document.getElementById('noClassDaysList');
  const dailyLogTableBody = document.getElementById('dailyLogTableBody');

  const btnExportPDF = document.getElementById('btnExportPDF');
  const btnExportExcel = document.getElementById('btnExportExcel');

  // Tab 3: Settings & Backup elements
  const inputTeacherName = document.getElementById('inputTeacherName');
  const inputGradeSection = document.getElementById('inputGradeSection');
  const inputSchoolName = document.getElementById('inputSchoolName');
  const btnSaveSettings = document.getElementById('btnSaveSettings');

  const btnLoadDemoData = document.getElementById('btnLoadDemoData');
  const btnExportBackup = document.getElementById('btnExportBackup');
  const inputImportBackup = document.getElementById('inputImportBackup');

  // Modals & Toast
  const modalReason = document.getElementById('modalReason');
  const modalReasonDate = document.getElementById('modalReasonDate');
  const modalReasonText = document.getElementById('modalReasonText');
  const btnCloseReasonModal = document.getElementById('btnCloseReasonModal');

  const toast = document.getElementById('toast');

  // --- App State ---
  let countNinos = 0;
  let countNinas = 0;
  let currentMonthRecords = [];
  let currentSummary = null;

  // Set default date to today YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  inputDate.value = todayStr;

  // Initialize Month & Year Pickers
  populateYearPicker();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  selectYear.value = currentYear;
  selectMonth.value = String(currentMonth).padStart(2, '0');

  // Load Settings
  await loadUserSettings();

  // Load initial record for today
  await loadRecordForDate(todayStr);

  // Load monthly summary
  await refreshMonthlySummary();

  // --- NAVIGATION EVENT LISTENERS ---
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');

      if (targetTab === 'summary') {
        refreshMonthlySummary();
      }
    });
  });

  // --- TAB 1: DAILY ATTENDANCE FORM LOGIC ---

  btnToday.addEventListener('click', () => {
    inputDate.value = todayStr;
    loadRecordForDate(todayStr);
  });

  inputDate.addEventListener('change', () => {
    loadRecordForDate(inputDate.value);
  });

  async function loadRecordForDate(dateStr) {
    const rec = await window.attendanceDB.getDailyRecord(dateStr);
    if (rec) {
      toggleNoClass.checked = rec.isNoClass;
      inputNoClassReason.value = rec.noClassReason || '';
      countNinos = rec.isNoClass ? 0 : (rec.ninos || 0);
      countNinas = rec.isNoClass ? 0 : (rec.ninas || 0);
      inputIntegradosNinos.value = rec.ninosIntegrados || 0;
      inputIntegradosNinas.value = rec.ninasIntegradas || 0;
      inputRetiradosNinos.value = rec.ninosRetirados || 0;
      inputRetiradosNinas.value = rec.ninasRetiradas || 0;
    } else {
      toggleNoClass.checked = false;
      inputNoClassReason.value = '';
      countNinos = 0;
      countNinas = 0;
      inputIntegradosNinos.value = 0;
      inputIntegradosNinas.value = 0;
      inputRetiradosNinos.value = 0;
      inputRetiradosNinas.value = 0;
    }
    updateCountersUI();
  }

  toggleNoClass.addEventListener('change', () => {
    updateCountersUI();
  });

  function updateCountersUI() {
    const isNoClass = toggleNoClass.checked;

    if (isNoClass) {
      cardNoClass.classList.add('is-active');
      containerNoClassReason.style.display = 'block';
      countersContainer.style.opacity = '0.4';
      countersContainer.style.pointerEvents = 'none';
      countNinos = 0;
      countNinas = 0;
    } else {
      cardNoClass.classList.remove('is-active');
      containerNoClassReason.style.display = 'none';
      countersContainer.style.opacity = '1';
      countersContainer.style.pointerEvents = 'auto';
    }

    displayNinos.textContent = countNinos;
    displayNinas.textContent = countNinas;
    displayTotal.textContent = countNinos + countNinas;
  }

  // Counter Buttons (+ / -)
  btnMinusNinos.addEventListener('click', () => {
    if (countNinos > 0) {
      countNinos--;
      updateCountersUI();
    }
  });

  btnPlusNinos.addEventListener('click', () => {
    countNinos++;
    updateCountersUI();
  });

  btnMinusNinas.addEventListener('click', () => {
    if (countNinas > 0) {
      countNinas--;
      updateCountersUI();
    }
  });

  btnPlusNinas.addEventListener('click', () => {
    countNinas++;
    updateCountersUI();
  });

  // Save Daily Record
  btnSaveAttendance.addEventListener('click', async () => {
    const dateStr = inputDate.value;
    if (!dateStr) {
      showToast('Por favor seleccione una fecha válida.');
      return;
    }

    const isNoClass = toggleNoClass.checked;
    const reason = inputNoClassReason.value.trim();

    if (isNoClass && !reason) {
      showToast('Por favor ingrese el motivo del día sin clases.');
      inputNoClassReason.focus();
      return;
    }

    const record = {
      date: dateStr,
      isNoClass,
      noClassReason: reason,
      ninos: isNoClass ? 0 : countNinos,
      ninas: isNoClass ? 0 : countNinas,
      ninosIntegrados: parseInt(inputIntegradosNinos.value) || 0,
      ninasIntegradas: parseInt(inputIntegradosNinas.value) || 0,
      ninosRetirados: parseInt(inputRetiradosNinos.value) || 0,
      ninasRetiradas: parseInt(inputRetiradosNinas.value) || 0
    };

    await window.attendanceDB.saveDailyRecord(record);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    showToast(`Asistencia del ${formatDateLatin(dateStr)} guardada con éxito.`);
    await refreshMonthlySummary();
  });

  // --- TAB 2: MONTHLY SUMMARY LOGIC ---

  selectMonth.addEventListener('change', refreshMonthlySummary);
  selectYear.addEventListener('change', refreshMonthlySummary);

  async function refreshMonthlySummary() {
    const year = selectYear.value;
    const month = selectMonth.value;

    currentMonthRecords = await window.attendanceDB.getRecordsByMonthYear(year, month);
    currentSummary = window.attendanceDB.calculateMonthlySummary(currentMonthRecords);

    // Update Summary Metrics
    valPromedioTotal.textContent = currentSummary.promedioTotal;
    valPromedioNinosNinas.textContent = `${currentSummary.promedioNinos} Niños / ${currentSummary.promedioNinas} Niñas`;
    valTotalAcumulado.textContent = currentSummary.sumaAsistenciaTotal;
    valDiasLectivos.textContent = currentSummary.totalDiasLectivos;
    valDiasSinClases.textContent = currentSummary.totalDiasSinClases;
    valIntegradosTotal.textContent = currentSummary.totalIntegradosTotal;
    valRetiradosTotal.textContent = currentSummary.totalRetiradosTotal;

    // Render Trend Chart
    window.chartManager.renderAttendanceChart('chartContainer', currentMonthRecords);

    // Render No-Class Days List
    renderNoClassDaysList(currentSummary.noClassDays);

    // Render Daily Log Table
    renderDailyLogTable(currentMonthRecords);
  }

  function renderNoClassDaysList(noClassDays) {
    if (!noClassDays || noClassDays.length === 0) {
      noClassDaysList.innerHTML = `
        <p style="font-size:12px; color:#64748b; text-align:center; padding:10px;">
          No se registraron días sin clases en este mes.
        </p>
      `;
      return;
    }

    let html = '';
    noClassDays.forEach(item => {
      const dateFormatted = formatDateLatin(item.date);
      html += `
        <div class="no-class-item">
          <div>
            <div class="no-class-date">${dateFormatted}</div>
            <div class="no-class-text-preview" title="${escapeHtml(item.reason)}">${escapeHtml(item.reason)}</div>
          </div>
          <button class="btn-view-more" data-date="${item.date}" data-reason="${escapeHtml(item.reason)}">
            Ver mensaje
          </button>
        </div>
      `;
    });
    noClassDaysList.innerHTML = html;

    // Attach click handlers to "Ver mensaje" buttons
    noClassDaysList.querySelectorAll('.btn-view-more').forEach(btn => {
      btn.addEventListener('click', () => {
        const dDate = btn.getAttribute('data-date');
        const dReason = btn.getAttribute('data-reason');
        modalReasonDate.textContent = `Día Sin Clases: ${formatDateLatin(dDate)}`;
        modalReasonText.textContent = dReason;
        modalReason.classList.add('active');
      });
    });
  }

  function renderDailyLogTable(records) {
    if (!records || records.length === 0) {
      dailyLogTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="color:#94a3b8; padding:20px;">No hay registros guardados para este mes.</td>
        </tr>
      `;
      return;
    }

    let html = '';
    records.forEach(r => {
      const fechaFormateada = formatDateLatin(r.date);
      const estadoBadge = r.isNoClass ? 
        '<span class="badge-status noclases">SIN CLASES</span>' : 
        '<span class="badge-status clases">CLASES</span>';
      
      const total = r.isNoClass ? '-' : (r.ninos + r.ninas);
      const integrados = (r.ninosIntegrados || r.ninasIntegradas) ? 
        `+${r.ninosIntegrados + r.ninasIntegradas}` : '-';
      const retirados = (r.ninosRetirados || r.ninasRetiradas) ? 
        `-${r.ninosRetirados + r.ninasRetiradas}` : '-';

      html += `
        <tr>
          <td><strong>${fechaFormateada}</strong></td>
          <td>${estadoBadge}</td>
          <td>${r.isNoClass ? '-' : r.ninos}</td>
          <td>${r.isNoClass ? '-' : r.ninas}</td>
          <td><strong>${total}</strong></td>
          <td style="color:#16a34a;">${integrados}</td>
          <td>
            <button class="btn-edit-row" data-date="${r.date}" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; padding:3px 8px; border-radius:4px; font-weight:600; cursor:pointer;">
              ✏️ Editar
            </button>
          </td>
        </tr>
      `;
    });

    dailyLogTableBody.innerHTML = html;

    // Attach edit events
    dailyLogTableBody.querySelectorAll('.btn-edit-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetDate = btn.getAttribute('data-date');
        inputDate.value = targetDate;
        loadRecordForDate(targetDate);
        
        // Switch to Tab 1
        navTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="form"]').classList.add('active');
        document.getElementById('tab-form').classList.add('active');

        showToast(`Cargada asistencia del ${formatDateLatin(targetDate)} para editar.`);
      });
    });
  }

  // EXPORTS
  btnExportPDF.addEventListener('click', async () => {
    if (currentMonthRecords.length === 0) {
      showToast('No hay registros en este mes para exportar.');
      return;
    }
    const settings = await window.attendanceDB.getSettings();
    const year = selectYear.value;
    const monthName = selectMonth.options[selectMonth.selectedIndex].text;
    window.pdfExport.generateAndPrintPDF(year, monthName, currentMonthRecords, currentSummary, settings);
  });

  btnExportExcel.addEventListener('click', async () => {
    if (currentMonthRecords.length === 0) {
      showToast('No hay registros en este mes para exportar.');
      return;
    }
    const settings = await window.attendanceDB.getSettings();
    const year = selectYear.value;
    const monthName = selectMonth.options[selectMonth.selectedIndex].text;
    window.excelExport.exportMonthlyReport(year, monthName, currentMonthRecords, currentSummary, settings);
    showToast('Informe de Excel generado y listo para descargar.');
  });

  // --- TAB 3: SETTINGS & BACKUP LOGIC ---

  async function loadUserSettings() {
    const s = await window.attendanceDB.getSettings();
    inputTeacherName.value = s.teacherName || '';
    inputGradeSection.value = s.gradeSection || '';
    inputSchoolName.value = s.schoolName || '';
  }

  btnSaveSettings.addEventListener('click', async () => {
    const settings = {
      teacherName: inputTeacherName.value.trim(),
      gradeSection: inputGradeSection.value.trim(),
      schoolName: inputSchoolName.value.trim()
    };
    await window.attendanceDB.saveSettings(settings);
    showToast('Información de la institución guardada.');
  });

  btnLoadDemoData.addEventListener('click', async () => {
    if (confirm('¿Desea generar registros de prueba para el mes actual? Esto servirá para probar los resúmenes e informes.')) {
      await window.attendanceDB.loadSampleDemoData();
      showToast('Datos de prueba cargados exitosamente.');
      await refreshMonthlySummary();
      loadRecordForDate(inputDate.value);
    }
  });

  btnExportBackup.addEventListener('click', async () => {
    const jsonStr = await window.attendanceDB.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Respaldo_Asistencia_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Copia de seguridad descargada.');
  });

  inputImportBackup.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        await window.attendanceDB.importBackupJSON(evt.target.result);
        showToast('Copia de seguridad restaurada correctamente.');
        await refreshMonthlySummary();
        await loadUserSettings();
        loadRecordForDate(inputDate.value);
      } catch (err) {
        alert('Error al importar la copia de seguridad. Verifique el archivo.');
      }
    };
    reader.readAsText(file);
  });

  // Close Reason Modal
  btnCloseReasonModal.addEventListener('click', () => {
    modalReason.classList.remove('active');
  });

  // --- HELPER FUNCTIONS ---
  function populateYearPicker() {
    const current = new Date().getFullYear();
    selectYear.innerHTML = '';
    for (let y = current - 2; y <= current + 2; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      selectYear.appendChild(opt);
    }
  }

  function formatDateLatin(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
});
