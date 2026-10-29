/**
 * Excel / Spreadsheet Export Module (Mejorado con anchos de columnas y diseño amplio)
 * Generates clean Excel XML / CSV files with complete monthly attendance report.
 */

window.excelExport = {
  exportMonthlyReport: function(year, monthName, records, summary, settings) {
    const fileName = `Informe_Asistencia_${monthName}_${year}.xls`;

    let rowsHtml = '';
    records.forEach((r, idx) => {
      const fp = r.date.split('-');
      const fechaFormateada = `${fp[2]}/${fp[1]}/${fp[0]}`;
      const totalAsistencia = r.isNoClass ? 0 : ((r.ninos || 0) + (r.ninas || 0));
      const integradosText = (r.ninosIntegrados || r.ninasIntegradas) ? 
        `Niños: ${r.ninosIntegrados || 0}, Niñas: ${r.ninasIntegradas || 0}` : '0';
      const retiradosText = (r.ninosRetirados || r.ninasRetiradas) ? 
        `Niños: ${r.ninosRetirados || 0}, Niñas: ${r.ninasRetiradas || 0}` : '0';
      
      const estadoBadge = r.isNoClass ? 'DÍA SIN CLASES' : 'CLASES IMPARTIDAS';
      const motivo = r.isNoClass ? (r.noClassReason || 'Sin motivo registrado') : '-';
      const bgColor = (idx % 2 === 0) ? '#ffffff' : '#f8fafc';

      rowsHtml += `
        <tr style="background-color: ${bgColor};">
          <td style="text-align:center; padding:8px 12px; font-weight:bold;">${fechaFormateada}</td>
          <td style="text-align:center; padding:8px 12px; font-weight:bold; color:${r.isNoClass ? '#dc2626' : '#16a34a'};">${estadoBadge}</td>
          <td style="text-align:center; padding:8px 12px;">${r.isNoClass ? '-' : r.ninos}</td>
          <td style="text-align:center; padding:8px 12px;">${r.isNoClass ? '-' : r.ninas}</td>
          <td style="text-align:center; padding:8px 12px; font-weight:bold; color:#1e40af;">${r.isNoClass ? 0 : totalAsistencia}</td>
          <td style="text-align:center; padding:8px 12px;">${integradosText}</td>
          <td style="text-align:center; padding:8px 12px;">${retiradosText}</td>
          <td style="padding:8px 12px; mso-number-format:'\\@';">${motivo}</td>
        </tr>
      `;
    });

    const xmlTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Asistencia ${monthName} ${year}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 12px; }
          .header-box { background-color: #1e3a8a; color: white; padding: 14px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 4px; }
          .info-table { margin-top: 10px; margin-bottom: 15px; border-collapse: collapse; }
          .info-table td { padding: 6px 12px; font-size: 12px; }
          .summary-table, .data-table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          .summary-table th, .data-table th { background-color: #1e40af; color: #ffffff; border: 1px solid #1d4ed8; padding: 10px 14px; font-size: 12px; font-weight: bold; text-align: center; white-space: nowrap; }
          .summary-table td, .data-table td { border: 1px solid #cbd5e1; padding: 8px 12px; vertical-align: middle; }
          .sub-header { font-size: 14px; font-weight: bold; color: #1e3a8a; margin-top: 15px; margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <div class="header-box">INFORME MENSUAL DE ASISTENCIA ESCOLAR - ${monthName.toUpperCase()} ${year}</div>
        
        <table class="info-table">
          <tr>
            <td><strong>Docente:</strong> ${settings.teacherName || 'Docente'}</td>
            <td><strong>Grado / Sección:</strong> ${settings.gradeSection || 'Sección'}</td>
            <td><strong>Institución:</strong> ${settings.schoolName || 'Unidad Educativa'}</td>
          </tr>
        </table>

        <div class="sub-header">1. RESUMEN MENSUAL Y PROMEDIOS</div>
        <table class="summary-table">
          <colgroup>
            <col style="width: 220px;" />
            <col style="width: 110px;" />
            <col style="width: 110px;" />
            <col style="width: 130px;" />
          </colgroup>
          <thead>
            <tr>
              <th>Indicador / Métrica</th>
              <th>Niños</th>
              <th>Niñas</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:bold; background-color:#eff6ff;">Promedio Diario de Asistencia</td>
              <td style="text-align:center;">${summary.promedioNinos}</td>
              <td style="text-align:center;">${summary.promedioNinas}</td>
              <td style="text-align:center; font-weight:bold; color:#1e40af; background-color:#dbeafe;">${summary.promedioTotal}</td>
            </tr>
            <tr>
              <td>Asistencia Total Acumulada</td>
              <td style="text-align:center;">${summary.sumaAsistenciaNinos}</td>
              <td style="text-align:center;">${summary.sumaAsistenciaNinas}</td>
              <td style="text-align:center; font-weight:bold;">${summary.sumaAsistenciaTotal}</td>
            </tr>
            <tr>
              <td>Nuevos Ingresos / Integrados</td>
              <td style="text-align:center;">${summary.totalIntegradosNinos}</td>
              <td style="text-align:center;">${summary.totalIntegradosNinas}</td>
              <td style="text-align:center; font-weight:bold; color:#0284c7;">${summary.totalIntegradosTotal}</td>
            </tr>
            <tr>
              <td>Estudiantes Retirados (Bajas)</td>
              <td style="text-align:center;">${summary.totalRetiradosNinos}</td>
              <td style="text-align:center;">${summary.totalRetiradosNinas}</td>
              <td style="text-align:center; font-weight:bold; color:#d97706;">${summary.totalRetiradosTotal}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;">Días Lectivos Impartidos</td>
              <td colspan="3" style="text-align:center; font-weight:bold; color:#15803d; background-color:#f0fdf4;">${summary.totalDiasLectivos} días</td>
            </tr>
            <tr>
              <td style="font-weight:bold;">Días Sin Clases (Suspendidos)</td>
              <td colspan="3" style="text-align:center; font-weight:bold; color:#b91c1c; background-color:#fef2f2;">${summary.totalDiasSinClases} días</td>
            </tr>
          </tbody>
        </table>

        <div class="sub-header">2. REGISTROS DIARIOS DETALLADOS</div>
        <table class="data-table">
          <colgroup>
            <col style="width: 120px;" />
            <col style="width: 180px;" />
            <col style="width: 90px;" />
            <col style="width: 90px;" />
            <col style="width: 100px;" />
            <col style="width: 160px;" />
            <col style="width: 160px;" />
            <col style="width: 320px;" />
          </colgroup>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado del Día</th>
              <th>Niños</th>
              <th>Niñas</th>
              <th>Total</th>
              <th>Nuevos Integrados</th>
              <th>Retirados (Bajas)</th>
              <th>Motivo (Si no hubo clases)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + xmlTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
