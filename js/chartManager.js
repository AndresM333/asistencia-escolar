/**
 * Interactive SVG Chart Renderer for Monthly Attendance Trends
 * Lightweight, 100% offline, fully responsive on mobile devices.
 */

window.chartManager = {
  renderAttendanceChart: function(containerId, records) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!records || records.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 30px; color: #94a3b8;">
          <p>No hay registros de asistencia para mostrar en el gráfico este mes.</p>
        </div>
      `;
      return;
    }

    const schoolDays = records.filter(r => !r.isNoClass);
    if (schoolDays.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 30px; color: #94a3b8;">
          <p>Todos los días registrados en este mes correspondieron a "Días sin clases".</p>
        </div>
      `;
      return;
    }

    const svgWidth = 600;
    const svgHeight = 220;
    const padding = { top: 25, right: 20, bottom: 40, left: 35 };

    const chartW = svgWidth - padding.left - padding.right;
    const chartH = svgHeight - padding.top - padding.bottom;

    // Calcular máximo para la escala Y
    const maxVal = Math.max(...schoolDays.map(r => (r.ninos || 0) + (r.ninas || 0)), 10);
    const yMax = Math.ceil(maxVal * 1.15);

    // Puntos de coordenadas
    const totalPoints = [];
    const ninosPoints = [];
    const ninasPoints = [];

    const numDays = schoolDays.length;
    const stepX = numDays > 1 ? chartW / (numDays - 1) : chartW / 2;

    schoolDays.forEach((r, idx) => {
      const x = padding.left + (numDays > 1 ? idx * stepX : chartW / 2);
      const total = (r.ninos || 0) + (r.ninas || 0);
      const ninos = r.ninos || 0;
      const ninas = r.ninas || 0;

      const yTotal = padding.top + chartH - (total / yMax) * chartH;
      const yNinos = padding.top + chartH - (ninos / yMax) * chartH;
      const yNinas = padding.top + chartH - (ninas / yMax) * chartH;

      const dayNum = r.date.split('-')[2];

      totalPoints.push({ x, y: yTotal, val: total, date: r.date, dayNum });
      ninosPoints.push({ x, y: yNinos, val: ninos });
      ninasPoints.push({ x, y: yNinas, val: ninas });
    });

    // Construir Path SVG
    const makePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

    const totalPath = makePath(totalPoints);
    const ninosPath = makePath(ninosPoints);
    const ninasPath = makePath(ninasPoints);

    // Area bajo la curva Total
    const areaPath = `${totalPath} L ${totalPoints[totalPoints.length - 1].x} ${padding.top + chartH} L ${totalPoints[0].x} ${padding.top + chartH} Z`;

    // Líneas de cuadrícula horizontal
    let gridLines = '';
    const numGridLines = 4;
    for (let i = 0; i <= numGridLines; i++) {
      const val = Math.round((yMax / numGridLines) * i);
      const y = padding.top + chartH - (val / yMax) * chartH;
      gridLines += `
        <line x1="${padding.left}" y1="${y}" x2="${svgWidth - padding.right}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" font-size="10" fill="#94a3b8" text-anchor="end">${val}</text>
      `;
    }

    // Etiquetas X (Días)
    let xLabels = '';
    totalPoints.forEach(p => {
      xLabels += `<text x="${p.x}" y="${svgHeight - 12}" font-size="10" fill="#64748b" text-anchor="middle">Día ${p.dayNum}</text>`;
    });

    // Puntos interactivos
    let dots = '';
    totalPoints.forEach(p => {
      dots += `
        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#2563eb" stroke="#ffffff" stroke-width="2">
          <title>Día ${p.dayNum}: ${p.val} asistencias totales</title>
        </circle>
      `;
    });

    const svgHTML = `
      <div style="width:100%; overflow-x:auto;">
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width:100%; min-width:320px; height:auto; display:block;">
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          <!-- Cuadrícula -->
          ${gridLines}

          <!-- Área sombreada -->
          <path d="${areaPath}" fill="url(#totalGrad)" />

          <!-- Líneas de tendencia -->
          <path d="${ninosPath}" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,2" />
          <path d="${ninasPath}" fill="none" stroke="#ec4899" stroke-width="2" stroke-dasharray="4,2" />
          <path d="${totalPath}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />

          <!-- Puntos -->
          ${dots}

          <!-- Eje X -->
          ${xLabels}
        </svg>
      </div>
      <div style="display:flex; justify-content:center; gap:16px; margin-top:8px; font-size:11px; color:#475569;">
        <span style="display:inline-flex; align-items:center; gap:4px;">
          <span style="width:12px; height:3px; background:#2563eb; display:inline-block; border-radius:2px;"></span> Total Asistencia
        </span>
        <span style="display:inline-flex; align-items:center; gap:4px;">
          <span style="width:12px; height:2px; background:#0284c7; display:inline-block; border-style:dashed;"></span> Niños
        </span>
        <span style="display:inline-flex; align-items:center; gap:4px;">
          <span style="width:12px; height:2px; background:#ec4899; display:inline-block; border-style:dashed;"></span> Niñas
        </span>
      </div>
    `;

    container.innerHTML = svgHTML;
  }
};
