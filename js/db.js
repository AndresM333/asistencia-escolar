/**
 * Database Manager for Asistencia Escolar
 * Uses IndexedDB for reliable offline storage with localStorage fallback.
 */

const DB_NAME = 'AsistenciaEscolarDB';
const DB_VERSION = 1;
const STORE_NAME = 'asistencia_diaria';
const SETTINGS_STORE = 'configuracion';

class AttendanceDB {
  constructor() {
    this.db = null;
    this.initPromise = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB no disponible, usando localStorage como respaldo.');
        resolve(null);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Error al abrir IndexedDB:', event.target.error);
        resolve(null); // Fallback to localStorage
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'date' });
          store.createIndex('date', 'date', { unique: true });
        }

        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  // --- REGISTROS DIARIOS ---

  async saveDailyRecord(record) {
    await this.initPromise;
    const formattedRecord = {
      date: record.date, // 'YYYY-MM-DD'
      isNoClass: Boolean(record.isNoClass),
      noClassReason: record.isNoClass ? (record.noClassReason || '').trim() : '',
      ninos: record.isNoClass ? 0 : Number(record.ninos || 0),
      ninas: record.isNoClass ? 0 : Number(record.ninas || 0),
      ninosIntegrados: Number(record.ninosIntegrados || 0),
      ninasIntegradas: Number(record.ninasIntegradas || 0),
      ninosRetirados: Number(record.ninosRetirados || 0),
      ninasRetiradas: Number(record.ninasRetiradas || 0),
      updatedAt: new Date().toISOString()
    };

    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(formattedRecord);
        req.onsuccess = () => resolve(formattedRecord);
        req.onerror = () => reject(req.error);
      });
    } else {
      // LocalStorage fallback
      const all = this._getLS();
      all[formattedRecord.date] = formattedRecord;
      localStorage.setItem('asistencia_records', JSON.stringify(all));
      return formattedRecord;
    }
  }

  async getDailyRecord(dateStr) {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(dateStr);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } else {
      const all = this._getLS();
      return all[dateStr] || null;
    }
  }

  async deleteDailyRecord(dateStr) {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(dateStr);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } else {
      const all = this._getLS();
      delete all[dateStr];
      localStorage.setItem('asistencia_records', JSON.stringify(all));
      return true;
    }
  }

  async getAllRecords() {
    await this.initPromise;
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } else {
      const all = this._getLS();
      return Object.values(all);
    }
  }

  async getRecordsByMonthYear(year, month) {
    // year: 2026, month: 1-12 or '01'-'12'
    const records = await this.getAllRecords();
    const monthFormatted = String(month).padStart(2, '0');
    const prefix = `${year}-${monthFormatted}`;

    const monthRecords = records.filter(r => r.date.startsWith(prefix));
    monthRecords.sort((a, b) => a.date.localeCompare(b.date));
    return monthRecords;
  }

  // --- CÁLCULO DE RESUMEN MENSUAL ---

  calculateMonthlySummary(records) {
    let totalDiasLectivos = 0;
    let totalDiasSinClases = 0;

    let sumaAsistenciaNinos = 0;
    let sumaAsistenciaNinas = 0;
    let sumaAsistenciaTotal = 0;

    let totalIntegradosNinos = 0;
    let totalIntegradosNinas = 0;

    let totalRetiradosNinos = 0;
    let totalRetiradosNinas = 0;

    const noClassDays = [];

    records.forEach(r => {
      totalIntegradosNinos += (r.ninosIntegrados || 0);
      totalIntegradosNinas += (r.ninasIntegradas || 0);
      totalRetiradosNinos += (r.ninosRetirados || 0);
      totalRetiradosNinas += (r.ninasRetiradas || 0);

      if (r.isNoClass) {
        totalDiasSinClases++;
        noClassDays.push({
          date: r.date,
          reason: r.noClassReason || 'Sin motivo especificado'
        });
      } else {
        totalDiasLectivos++;
        const ninos = r.ninos || 0;
        const ninas = r.ninas || 0;
        sumaAsistenciaNinos += ninos;
        sumaAsistenciaNinas += ninas;
        sumaAsistenciaTotal += (ninos + ninas);
      }
    });

    const promedioNinos = totalDiasLectivos > 0 ? (sumaAsistenciaNinos / totalDiasLectivos) : 0;
    const promedioNinas = totalDiasLectivos > 0 ? (sumaAsistenciaNinas / totalDiasLectivos) : 0;
    const promedioTotal = totalDiasLectivos > 0 ? (sumaAsistenciaTotal / totalDiasLectivos) : 0;

    return {
      totalRegistros: records.length,
      totalDiasLectivos,
      totalDiasSinClases,

      // Asistencias acumuladas
      sumaAsistenciaNinos,
      sumaAsistenciaNinas,
      sumaAsistenciaTotal,

      // Promedios diarios
      promedioNinos: Number(promedioNinos.toFixed(1)),
      promedioNinas: Number(promedioNinas.toFixed(1)),
      promedioTotal: Number(promedioTotal.toFixed(1)),

      // Integrados / Retirados totales del mes
      totalIntegradosNinos,
      totalIntegradosNinas,
      totalIntegradosTotal: totalIntegradosNinos + totalIntegradosNinas,

      totalRetiradosNinos,
      totalRetiradosNinas,
      totalRetiradosTotal: totalRetiradosNinos + totalRetiradosNinas,

      // Días sin clase con mensaje
      noClassDays
    };
  }

  // --- CONFIGURACIÓN E INFORMACIÓN DE LA ESCUELA ---

  async saveSettings(settings) {
    localStorage.setItem('asistencia_settings', JSON.stringify(settings));
    return settings;
  }

  async getSettings() {
    const raw = localStorage.getItem('asistencia_settings');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return {
      teacherName: 'Profesor(a)',
      gradeSection: 'Grado / Sección',
      schoolName: 'Unidad Educativa'
    };
  }

  // --- RESPALDO Y DATOS DE PRUEBA ---

  async exportBackupJSON() {
    const records = await this.getAllRecords();
    const settings = await this.getSettings();
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      records
    }, null, 2);
  }

  async importBackupJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || !Array.isArray(data.records)) {
        throw new Error('Formato de archivo de respaldo no válido.');
      }

      if (data.settings) {
        await this.saveSettings(data.settings);
      }

      for (const rec of data.records) {
        if (rec.date) {
          await this.saveDailyRecord(rec);
        }
      }
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async loadSampleDemoData() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Generar un mes completo de prueba
    const daysInMonth = new Date(year, new Date().getMonth() + 1, 0).getDate();

    const sampleReasons = [
      'Consejo Técnico Docente y Jornada Pedagógica',
      'Mantenimiento General e Fumigación de Aulas',
      'Día Feriado Nacional / Aniversario de la Institución',
      'Suspensión por evento climático (Lluvias intensas)',
      'Reunión Administrativa con Apoderados y Representantes'
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(year, new Date().getMonth(), day).getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Fin de semana, no registrar o registrar sin clases opcional
        continue;
      }

      // 10% de probabilidad de ser día sin clase
      const isNoClass = (day === 12 || day === 24);
      const record = {
        date: dateStr,
        isNoClass: isNoClass,
        noClassReason: isNoClass ? sampleReasons[day % sampleReasons.length] : '',
        ninos: isNoClass ? 0 : Math.floor(Math.random() * 5) + 12, // 12-16 niños
        ninas: isNoClass ? 0 : Math.floor(Math.random() * 5) + 13, // 13-17 niñas
        ninosIntegrados: (day === 3) ? 1 : 0,
        ninasIntegradas: (day === 18) ? 1 : 0,
        ninosRetirados: (day === 22) ? 1 : 0,
        ninasRetiradas: 0
      };

      await this.saveDailyRecord(record);
    }
    return true;
  }

  _getLS() {
    const raw = localStorage.getItem('asistencia_records');
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }
}

window.attendanceDB = new AttendanceDB();
