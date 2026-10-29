/**
 * PDF Export Module
 * Generates print-ready styled HTML report & PDF export.
 */

window.pdfExport = {
  generateAndPrintPDF: function(year, monthName, records, summary, settings) {
    const reportWindow = window.open('', '_blank');
    
    let rowsHtml = '';
    records.forEach(r => {
      const fechaPartes = r.date.split('-');
      const fechaFormateada = `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;
      const totalAsistencia = r.isNoClass ? 0 : ((r.ninos || 0) + (r.ninas || 0));
      const integradosText = (r.ninosIntegrados || r.ninasIntegradas) ? 
        `N: ${r.ninosIntegrados || 0} / M: ${r.ninasIntegradas || 0}` : '-';
      const retiradosText = (r.ninosRetirados || r.ninasRetiradas) ? 
        `N: ${r.ninosRetirados || 0} / M: ${r.ninasRetiradas || 0}` : '-';
      
      const estadoBadge = r.isNoClass ? 
        '<span class="badge badge-danger">SIN CLASES</span>' : 
        '<span class="badge badge-success">CLASES</span>';
      const motivo = r.isNoClass ? (r.noClassReason || 'Sin motivo registrado') : '-';

      rowsHtml += `
        <tr>
          <td style="text-align:center;">${fechaFormateada}</td>
          <td style="text-align:center;">${estadoBadge}</td>
          <td style="text-align:center;">${r.isNoClass ? '-' : r.ninos}</td>
          <td style="text-align:center;">${r.isNoClass ? '-' : r.ninas}</td>
          <td style="text-align:center; font-weight:bold;">${r.isNoClass ? '-' : totalAsistencia}</td>
          <td style="text-align:center;">${integradosText}</td>
          <td style="text-align:center;">${retiradosText}</td>
          <td style="font-size:11px;">${motivo}</td>
        </tr>
      `;
    });

    let noClassDaysSection = '';
    if (summary.noClassDays.length > 0) {
      let noClassRows = '';
      summary.noClassDays.forEach(d => {
        const fp = d.date.split('-');
        noClassRows += `
          <div style="margin-bottom: 6px; padding: 6px; background-color: #fef2f2; border-left: 3px solid #ef4444; border-radius: 4px;">
            <strong style="color:#b91c1c;">${fp[2]}/${fp[1]}/${fp[0]}:</strong> ${d.reason}
          </div>
        `;
      });
      noClassDaysSection = `
        <div style="margin-top:20px;">
          <h3 style="font-size:14px; margin-bottom:8px; color:#991b1b;">Detalle de Días Sin Clases (${summary.noClassDays.length})</h3>
          ${noClassRows}
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Informe_Asistencia_${monthName}_${year}</title>
        <style>
          @page { size: letter portrait; margin: 12mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0; padding: 0; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 18px; color: #1e3a8a; text-transform: uppercase; }
          .header h2 { margin: 4px 0 0 0; font-size: 14px; color: #3b82f6; }
          
          .info-grid { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; margin-bottom: 15px; }
          .info-item { font-size: 11px; }
          .info-item strong { color: #334155; }
          
          .section-title { font-size: 13px; font-weight: bold; color: #1e40af; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-top: 15px; margin-bottom: 8px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          th { background-color: #1e40af; color: white; padding: 6px 4px; text-align: center; font-size: 10px; text-transform: uppercase; border: 1px solid #1e3a8a; }
          td { border: 1px solid #cbd5e1; padding: 5px 4px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
          .badge-success { background: #dcfce7; color: #15803d; }
          .badge-danger { background: #fee2e2; color: #b91c1c; }
          
          .summary-cards { display: flex; gap: 10px; margin-bottom: 15px; }
          .card { flex: 1; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px; text-align: center; }
          .card-value { font-size: 16px; font-weight: bold; color: #1e3a8a; }
          .card-label { font-size: 9px; text-transform: uppercase; color: #64748b; margin-top: 2px; }

          .signature-box { margin-top: 40px; display: flex; justify-content: space-around; text-align: center; }
          .line { width: 180px; border-top: 1px solid #475569; margin-bottom: 4px; }

          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background:#2563eb; color:white; padding:12px; text-align:center; margin-bottom:15px; border-radius:6px;">
          <strong style="font-size:14px;">Previsualización de Informe listo para Guardar como PDF</strong>
          <p style="margin:4px 0 8px 0; font-size:12px;">Haga clic en el botón a continuación para imprimir o guardar como PDF en su dispositivo.</p>
          <button onclick="window.print()" style="background:#22c55e; color:white; border:none; padding:8px 18px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:13px;">
            📄 Descargar / Imprimir PDF
          </button>
        </div>

        <div class="header">
          <h1>REGISTRO Y RESUMEN MENSUAL DE ASISTENCIA</h1>
          <h2>MES DE ${monthName.toUpperCase()} ${year}</h2>
        </div>

        <div class="info-grid">
          <div class="info-item"><strong>Institución:</strong> ${settings.schoolName || 'Unidad Educativa'}</div>
          <div class="info-item"><strong>Docente:</strong> ${settings.teacherName || 'Docente'}</div>
          <div class="info-item"><strong>Grado / Sección:</strong> ${settings.gradeSection || 'Sección'}</div>
        </div>

        <div class="section-title">RESUMEN DE PROMEDIOS Y MÉTRICAS CLAVE</div>
        
        <div class="summary-cards">
          <div class="card">
            <div class="card-value">${summary.promedioTotal}</div>
            <div class="card-label">Promedio Asistencia Diaria</div>
          </div>
          <div class="card">
            <div class="card-value">${summary.promedioNinos} / ${summary.promedioNinas}</div>
            <div class="card-label">Promedio (Niños / Niñas)</div>
          </div>
          <div class="card">
            <div class="card-value">${summary.totalDiasLectivos}</div>
            <div class="card-label">Días Lectivos Impartidos</div>
          </div>
          <div class="card">
            <div class="card-value" style="color:#dc2626;">${summary.totalDiasSinClases}</div>
            <div class="card-label">Días Sin Clases</div>
          </div>
          <div class="card">
            <div class="card-value" style="color:#059669;">+${summary.totalIntegradosTotal}</div>
            <div class="card-label">Nuevos Integrados</div>
          </div>
          <div class="card">
            <div class="card-value" style="color:#d97706;">-${summary.totalRetiradosTotal}</div>
            <div class="card-label">Estudiantes Retirados</div>
          </div>
        </div>

        ${noClassDaysSection}

        <div class="section-title">BITÁCORA DIARIA DEL MES</div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Niños</th>
              <th>Niñas</th>
              <th>Total</th>
              <th>Integrados</th>
              <th>Retirados</th>
              <th>Observación / Justificación</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="signature-box">
          <div>
            <div class="line"></div>
            <div><strong>Firma del Docente</strong></div>
            <div style="font-size:10px; color:#64748b;">${settings.teacherName || ''}</div>
          </div>
          <div>
            <div class="line"></div>
            <div><strong>Firma / Sello Dirección</strong></div>
            <div style="font-size:10px; color:#64748b;">${settings.schoolName || ''}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  }
};
