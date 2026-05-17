/**
 * DashboardAdmin
 *
 * Pantalla de inicio del rol admin. Muestra 4 graficos en grilla 2x2
 * calculados con los datos vigentes en localStorage:
 *
 *   1. Personal por Área (bar)         - personal agrupado por areaId.
 *   2. Proyectos por Estado (doughnut) - proyectos agrupado por estado.
 *   3. Horas Registradas Últimos 30 días (line) - registros sumados por fecha.
 *   4. Salarios por Cargo (bar horizontal) - personal agrupado por cargo,
 *      promedio de salario. Top 5 cargos en orden de aparicion.
 * Las constantes de opciones de Chart.js y la paleta de colores no
 * dependen de datos, asi que se mantienen a nivel de modulo para
 * conservar la misma referencia entre renders. Chart.jsx destruye y
 * recrea la instancia cuando cambian las referencias de data/options.
 */

import React, { useState } from 'react';
import Chart from '../../Chart.jsx';
import { ESTADOS_PROYECTO } from '../../../constants.js';
import {
  cargarPersonal,
  cargarAreas,
  cargarProyectos,
  cargarRegistrosHoras,
} from '../../../utils/storage.js';
import '../../../styles/tables.css';   // Reutilizamos .screen-title
import '../../../styles/dashboard.css';

/* ============================================================
 * Paleta de colores para los 4 charts.
 * Se derivan de la paleta del proyecto (--color-primario y --color-acento)
 * mas variantes para distinguir series cuando hay categorias multiples.
 * Chart.js no consume variables CSS, asi que duplicamos los hex aqui.
 * ============================================================ */

const COLOR_PRIMARIO  = '#1B2A4A';
const COLOR_ACENTO    = '#E67E22';
const COLOR_PALETA_5  = ['#1B2A4A', '#E67E22', '#4A5568', '#2563EB', '#16A34A'];
const COLOR_ESTADOS_4 = ['#94A3B8', '#2563EB', '#EAB308', '#16A34A']; // Planificado, En curso, Pausado, Finalizado

/* ============================================================
 * Opciones de los 4 charts (independientes de los datos).
 * Se declaran a nivel de modulo para mantener la misma referencia entre
 * renders del componente y evitar que Chart.jsx destruya/recrea la
 * instancia innecesariamente.
 * ============================================================ */

const OPCIONES_PERSONAL_POR_AREA = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title:  { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
  },
};

const OPCIONES_PROYECTOS_POR_ESTADO = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title:  { display: false },
  },
};

const OPCIONES_HORAS_ULTIMOS_30 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title:  { display: false },
  },
  scales: {
    y: { beginAtZero: true },
    x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } },
  },
};

const OPCIONES_SALARIOS_POR_CARGO = {
  indexAxis: 'y', // barras horizontales
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title:  { display: false },
    tooltip: {
      callbacks: {
        // Formatea el tooltip como moneda CLP (mas legible que ints).
        label: (ctx) => new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(ctx.parsed.x),
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      // Formato compacto en el eje X: 1.5M, 2M, etc.
      ticks: {
        callback: (value) =>
          new Intl.NumberFormat('es-CL', {
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format(value),
      },
    },
  },
};

/* ============================================================
 * Helpers puros (parametrizados por las colecciones recibidas).
 * ============================================================ */

/**
 * Suma horas por fecha para reducir una lista de registros a una serie
 * temporal ordenada cronologicamente.
 *
 * @param {Array<{ fecha: string, horas: number }>} registros
 * @returns {Array<{ fecha: string, total: number }>}
 */
function agruparHorasPorFecha(registros) {
  const mapa = new Map();
  registros.forEach(r => {
    mapa.set(r.fecha, (mapa.get(r.fecha) || 0) + r.horas);
  });
  return Array.from(mapa.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, total]) => ({ fecha, total }));
}

/* ============================================================
 * Componente
 * ============================================================ */

function DashboardAdmin() {
  // Snapshot de las 4 colecciones al montar. MainLayout desmonta esta
  // pantalla al navegar, asi que cada entrada al Dashboard refresca los
  // datos contra lo ultimo persistido en localStorage.
  const [datos] = useState(() => ({
    personal:  cargarPersonal(),
    areas:     cargarAreas(),
    proyectos: cargarProyectos(),
    registros: cargarRegistrosHoras(),
  }));

  /* ----------------------------------------------------------
   * Chart 1 - Personal por Área (bar vertical)
   * ---------------------------------------------------------- */

  const personalPorAreaLabels  = datos.areas.map(a => a.nombre);
  const personalPorAreaValores = datos.areas.map(
    area => datos.personal.filter(p => p.areaId === area.id).length
  );

  const DATA_PERSONAL_POR_AREA = {
    labels: personalPorAreaLabels,
    datasets: [
      {
        label: 'Nº de personas',
        data: personalPorAreaValores,
        backgroundColor: COLOR_PRIMARIO,
        borderColor: COLOR_PRIMARIO,
        borderWidth: 1,
      },
    ],
  };

  /* ----------------------------------------------------------
   * Chart 2 - Proyectos por Estado (doughnut)
   * ---------------------------------------------------------- */

  const proyectosPorEstadoValores = ESTADOS_PROYECTO.map(
    estado => datos.proyectos.filter(p => p.estado === estado).length
  );

  const DATA_PROYECTOS_POR_ESTADO = {
    labels: ESTADOS_PROYECTO,
    datasets: [
      {
        data: proyectosPorEstadoValores,
        backgroundColor: COLOR_ESTADOS_4,
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  /* ----------------------------------------------------------
   * Chart 3 - Horas Registradas Últimos 30 días (line)
   * ---------------------------------------------------------- */

  const horasPorFecha = agruparHorasPorFecha(datos.registros);
  // Etiqueta abreviada DD/MM para el eje X (mas legible que ISO completo).
  const horasLabels = horasPorFecha.map(p => {
    const [, mes, dia] = p.fecha.split('-');
    return `${dia}/${mes}`;
  });
  const horasValores = horasPorFecha.map(p => p.total);

  const DATA_HORAS_ULTIMOS_30 = {
    labels: horasLabels,
    datasets: [
      {
        label: 'Horas totales',
        data: horasValores,
        fill: false,
        borderColor: COLOR_ACENTO,
        backgroundColor: COLOR_ACENTO,
        tension: 0.25,
        pointRadius: 2,
      },
    ],
  };

  /* ----------------------------------------------------------
   * Chart 4 - Salarios por Cargo (bar horizontal)
   * Top 5 cargos en orden de aparicion, salario promedio por cargo.
   * ---------------------------------------------------------- */

  const cargosUnicos = Array.from(new Set(datos.personal.map(p => p.cargo))).slice(0, 5);
  const salariosPromedio = cargosUnicos.map(cargo => {
    const personasConCargo = datos.personal.filter(p => p.cargo === cargo);
    if (personasConCargo.length === 0) return 0;
    const suma = personasConCargo.reduce((acc, p) => acc + p.salario, 0);
    return Math.round(suma / personasConCargo.length);
  });

  const DATA_SALARIOS_POR_CARGO = {
    labels: cargosUnicos,
    datasets: [
      {
        label: 'Salario promedio (CLP)',
        data: salariosPromedio,
        backgroundColor: COLOR_PALETA_5,
        borderColor: COLOR_PALETA_5,
        borderWidth: 1,
      },
    ],
  };

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <div>
      <h1 className="screen-title">Dashboard administrador</h1>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <h2 className="dashboard-card-title">Personal por área</h2>
          <div className="dashboard-chart-canvas">
            <Chart
              type="bar"
              data={DATA_PERSONAL_POR_AREA}
              options={OPCIONES_PERSONAL_POR_AREA}
            />
          </div>
        </article>

        <article className="dashboard-card">
          <h2 className="dashboard-card-title">Proyectos por estado</h2>
          <div className="dashboard-chart-canvas">
            <Chart
              type="doughnut"
              data={DATA_PROYECTOS_POR_ESTADO}
              options={OPCIONES_PROYECTOS_POR_ESTADO}
            />
          </div>
        </article>

        <article className="dashboard-card">
          <h2 className="dashboard-card-title">Horas registradas (últimos 30 días)</h2>
          <div className="dashboard-chart-canvas">
            <Chart
              type="line"
              data={DATA_HORAS_ULTIMOS_30}
              options={OPCIONES_HORAS_ULTIMOS_30}
            />
          </div>
        </article>

        <article className="dashboard-card">
          <h2 className="dashboard-card-title">Salarios por cargo (CLP)</h2>
          <div className="dashboard-chart-canvas">
            <Chart
              type="bar"
              data={DATA_SALARIOS_POR_CARGO}
              options={OPCIONES_SALARIOS_POR_CARGO}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

export default DashboardAdmin;