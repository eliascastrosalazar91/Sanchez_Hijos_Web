/**
 * DashboardPersonal
 *
 * Pantalla de inicio del rol personal. Clona la maqueta DashboardEmpleado.tsx
 * adaptada al stack del proyecto (Chart.jsx + chart.js, sin Tailwind) y al
 * dominio Sanchez e Hijos (terminologia `personal`, `areaId`).
 *
 * Muestra dos graficos calculados sobre los REGISTROS_HORAS persistidos en
 * localStorage, filtrados al usuario logueado:
 *
 *   1. Mis Horas por Proyecto (pie)     - suma de horas del usuario en los
 *                                          ultimos 30 dias, agrupada por
 *                                          proyectoId. Si el usuario no tiene
 *                                          horas registradas a proyectos,
 *                                          muestra una sola tajada gris
 *                                          "Sin proyectos".
 *   2. Mis Horas Registradas (line)     - serie diaria de horas del usuario
 *                                          en los ultimos 30 dias.
 *
 * Patron de snapshot: hereda de DashboardAdmin. Las colecciones se cargan
 * una sola vez al montar la pantalla; MainLayout desmonta los componentes
 * al navegar, por lo que cada entrada al Dashboard refresca los datos
 * contra lo ultimo persistido.
 *
 * Las options de Chart.js no dependen de datos y se declaran a nivel de
 * modulo para mantener una referencia estable y evitar que Chart.jsx
 * destruya/recree la instancia entre renders.
 */

import React, { useState } from 'react';
import Chart from '../../Chart.jsx';
import { USUARIO_PERSONAL_MOCK_ID } from '../../../constants.js';
import {
  cargarPersonal,
  cargarProyectos,
  cargarRegistrosHoras,
} from '../../../utils/storage.js';
import '../../../styles/tables.css';   // .screen-title
import '../../../styles/dashboard.css'; // .dashboard-grid + .dashboard-card + canvas

/* ============================================================
 * Paleta y opciones (independientes de datos)
 * Mismos hex que DashboardAdmin para mantener consistencia visual.
 * ============================================================ */

const COLOR_PALETA_PIE = ['#1B2A4A', '#E67E22', '#2563EB', '#16A34A', '#EAB308'];
const COLOR_GRIS_VACIO = '#CBD5E1';
const COLOR_ACENTO     = '#E67E22';

const OPCIONES_PIE_HORAS_POR_PROYECTO = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title:  { display: false },
  },
};

const OPCIONES_LINE_HORAS_30_DIAS = {
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

/* ============================================================
 * Helpers puros
 * ============================================================ */

/**
 * Agrupa los registros del usuario por proyectoId, sumando horas. Solo
 * considera registros con horas > 0 y proyectoId asignado (los registros
 * sembrados de personas sin proyecto o de dias no laborables tienen
 * proyectoId = null o horas = 0, y se ignoran).
 *
 * @param {Array} registros - registros ya filtrados al usuario
 * @returns {Map<string, number>} proyectoId -> total horas
 */
function agruparHorasPorProyecto(registros) {
  const mapa = new Map();
  registros.forEach(r => {
    if (!r.proyectoId || !r.horas) return;
    mapa.set(r.proyectoId, (mapa.get(r.proyectoId) || 0) + r.horas);
  });
  return mapa;
}

/**
 * Reduce los registros a una serie ordenada cronologicamente por fecha,
 * sumando horas dentro de cada dia.
 *
 * @param {Array} registros - registros ya filtrados al usuario
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

function DashboardPersonal() {
  // Snapshot al montar: 3 colecciones desde localStorage.
  const [datos] = useState(() => ({
    personal:  cargarPersonal(),
    proyectos: cargarProyectos(),
    registros: cargarRegistrosHoras(),
  }));

  // Resolucion del usuario logueado contra el id mock fijo. Si por algun
  // motivo no se encuentra (constants.js mal sincronizado), caemos a un
  // objeto placeholder para no romper el render.
  const currentUser =
    datos.personal.find(p => p.id === USUARIO_PERSONAL_MOCK_ID) ||
    { nombre: 'Usuario', id: USUARIO_PERSONAL_MOCK_ID };

  // Primer nombre para el saludo (split por espacio, tomar el primero).
  const primerNombre = currentUser.nombre.split(' ')[0];

  // Registros del usuario actual.
  const registrosDelUsuario = datos.registros.filter(
    r => r.personalId === currentUser.id
  );

  /* ----------------------------------------------------------
   * Chart 1 - Pie: Mis Horas por Proyecto
   * ---------------------------------------------------------- */

  const horasPorProyecto = agruparHorasPorProyecto(registrosDelUsuario);
  const hayHorasConProyecto = horasPorProyecto.size > 0;

  // Si no hay horas asociadas a proyectos: tajada unica gris "Sin proyectos".
  const pieLabels = hayHorasConProyecto
    ? Array.from(horasPorProyecto.keys()).map(pid => {
        const pry = datos.proyectos.find(p => p.id === pid);
        return pry ? pry.nombre : pid;
      })
    : ['Sin proyectos'];

  const pieValores = hayHorasConProyecto
    ? Array.from(horasPorProyecto.values())
    : [1];

  const pieColores = hayHorasConProyecto
    ? COLOR_PALETA_PIE.slice(0, pieLabels.length)
    : [COLOR_GRIS_VACIO];

  const DATA_PIE_HORAS_POR_PROYECTO = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValores,
        backgroundColor: pieColores,
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  /* ----------------------------------------------------------
   * Chart 2 - Line: Mis Horas Registradas (Últimos 30 días)
   * ---------------------------------------------------------- */

  const horasPorFecha = agruparHorasPorFecha(registrosDelUsuario);
  // Etiqueta DD/MM para el eje X (consistente con DashboardAdmin).
  const lineLabels = horasPorFecha.map(p => {
    const [, mes, dia] = p.fecha.split('-');
    return `${dia}/${mes}`;
  });
  const lineValores = horasPorFecha.map(p => p.total);

  const DATA_LINE_HORAS_30_DIAS = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Horas',
        data: lineValores,
        fill: false,
        borderColor: COLOR_ACENTO,
        backgroundColor: COLOR_ACENTO,
        tension: 0.25,
        pointRadius: 2,
      },
    ],
  };

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <div>
      <h1 className="screen-title">Bienvenido, {primerNombre}</h1>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <h2 className="dashboard-card-title">Mis horas por proyecto (últimos 30 días)</h2>
          <div className="dashboard-chart-canvas">
            <Chart
              type="pie"
              data={DATA_PIE_HORAS_POR_PROYECTO}
              options={OPCIONES_PIE_HORAS_POR_PROYECTO}
            />
          </div>
        </article>

        <article className="dashboard-card">
          <h2 className="dashboard-card-title">Mis horas registradas (últimos 30 días)</h2>
          <div className="dashboard-chart-canvas">
            <Chart
              type="line"
              data={DATA_LINE_HORAS_30_DIAS}
              options={OPCIONES_LINE_HORAS_30_DIAS}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

export default DashboardPersonal;