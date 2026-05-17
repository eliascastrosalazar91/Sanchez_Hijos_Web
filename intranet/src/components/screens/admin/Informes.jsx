/**
 * Informes
 *
 * Pantalla del rol admin para generar informes ejecutivos del estado de
 * la empresa. Clona la maqueta Informes.tsx y la reemplaza con datos
 * reales tomados desde localStorage via utils/storage.js.
 *
 * Tarea 24.bis: antes leia directo desde constants.js, lo que dejaba los
 * informes desincronizados frente al CRUD admin. Ahora lee las colecciones
 * persistidas al montar la pantalla; como MainLayout desmonta al navegar,
 * cada entrada a Informes refresca los datos.
 *
 * Tipos de informe soportados:
 *   1. Personal por area
 *   2. Proyectos por estado
 *   3. Horas por empleado (usa REGISTROS_HORAS con rango de fechas)
 *   4. Salarios
 *
 * Botones de exportacion (PDF / Excel): no implementados. Replica de la
 * maqueta original. Limitacion conocida registrada en Devlog.
 */

import React, { useState } from 'react';
import { ESTADOS_PROYECTO } from '../../../constants.js';
import {
  cargarPersonal,
  cargarAreas,
  cargarProyectos,
  cargarRegistrosHoras,
} from '../../../utils/storage.js';
import '../../../styles/tables.css';

/* ============================================================
 * Estilos inline declarados como constantes de modulo.
 * Se hace asi para evitar colisiones de sintaxis al pegar codigo desde
 * el chat (las llaves dobles de los estilos inline JSX pueden
 * interpretarse como URLs comprimidas).
 * ============================================================ */

const STYLE_CARD_FILTROS = {
  padding: '24px',
  marginBottom: '24px',
};

const STYLE_HELPER_LABEL = {
  fontSize: '11px',
  color: '#718096',
  fontWeight: 'normal',
};

const STYLE_BOTONERA = {
  display: 'flex',
  gap: '12px',
  marginTop: '16px',
  flexWrap: 'wrap',
};

const STYLE_PREVIEW_HEADER = {
  paddingBottom: '20px',
  marginBottom: '20px',
  borderBottom: '2px solid #E2E8F0',
};

const STYLE_PREVIEW_TITULO = {
  fontSize: '22px',
  fontWeight: 700,
  margin: 0,
  color: '#1B2A4A',
};

const STYLE_PREVIEW_FILTROS = {
  fontSize: '15px',
  color: '#2D3748',
  margin: '8px 0 0 0',
};

const STYLE_PREVIEW_SUMARIO = {
  fontSize: '15px',
  color: '#1B2A4A',
  margin: '8px 0 0 0',
  fontWeight: 700,
};

const STYLE_MENSAJE_VACIO = {
  padding: '40px 24px',
  textAlign: 'center',
  color: '#718096',
};

/* ============================================================
 * Helpers de formato
 * Ahora reciben las colecciones por parametro para no depender de
 * variables de modulo: las colecciones viven en el estado del componente.
 * ============================================================ */

function formatearCLP(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}

function nombreArea(areaId, areas) {
  if (!areaId) return 'Administración';
  const area = areas.find(a => a.id === areaId);
  return area ? area.nombre : 'N/A';
}

function nombrePersonal(personalId, personal) {
  const persona = personal.find(p => p.id === personalId);
  return persona ? persona.nombre : 'N/A';
}

function cargoPersonal(personalId, personal) {
  const persona = personal.find(p => p.id === personalId);
  return persona ? persona.cargo : '—';
}

/* ============================================================
 * Generadores de informe
 * Reciben siempre las colecciones (datos) y los filtros como argumentos
 * para mantener cero acoplamiento con constants.js.
 * ============================================================ */

function informePersonalPorArea(datos, filtroAreaId) {
  const { personal, areas } = datos;
  const areasParaInforme = filtroAreaId
    ? areas.filter(a => a.id === filtroAreaId)
    : areas;

  const filas = [];
  areasParaInforme.forEach(area => {
    const personasArea = personal.filter(p => p.areaId === area.id);
    personasArea.forEach(persona => {
      filas.push([
        area.nombre,
        persona.id,
        persona.nombre,
        persona.cargo,
        persona.email,
      ]);
    });
  });

  if (!filtroAreaId) {
    const sinArea = personal.filter(p => p.areaId === null);
    sinArea.forEach(persona => {
      filas.push([
        'Administración',
        persona.id,
        persona.nombre,
        persona.cargo,
        persona.email,
      ]);
    });
  }

  return {
    columnas: ['Área', 'ID', 'Nombre', 'Cargo', 'Email'],
    filas,
    sumario: `Total de personas listadas: ${filas.length}`,
  };
}

function informeProyectosPorEstado(datos, filtroAreaId) {
  const { proyectos, areas } = datos;
  const proyectosFiltrados = filtroAreaId
    ? proyectos.filter(p => p.areaId === filtroAreaId)
    : proyectos;

  const filas = [];
  ESTADOS_PROYECTO.forEach(estado => {
    proyectosFiltrados
      .filter(p => p.estado === estado)
      .forEach(proyecto => {
        filas.push([
          estado,
          proyecto.id,
          proyecto.nombre,
          nombreArea(proyecto.areaId, areas),
          String(proyecto.personalAsignado.length),
        ]);
      });
  });

  return {
    columnas: ['Estado', 'ID', 'Nombre', 'Área', 'Nº personal asignado'],
    filas,
    sumario: `Total de proyectos listados: ${filas.length}`,
  };
}

function informeHorasPorEmpleado(datos, fechaDesde, fechaHasta, filtroAreaId) {
  const { personal, areas, registros } = datos;
  const desde = fechaDesde || '0000-01-01';
  const hasta = fechaHasta || '9999-12-31';

  const registrosEnRango = registros.filter(
    r => r.fecha >= desde && r.fecha <= hasta
  );

  const personasConsideradas = filtroAreaId
    ? personal.filter(p => p.areaId === filtroAreaId)
    : personal;

  const sumaPorPersona = new Map();
  personasConsideradas.forEach(p => sumaPorPersona.set(p.id, 0));
  registrosEnRango.forEach(r => {
    if (sumaPorPersona.has(r.personalId)) {
      sumaPorPersona.set(r.personalId, sumaPorPersona.get(r.personalId) + r.horas);
    }
  });

  const filas = Array.from(sumaPorPersona.entries())
    .map(([personalId, total]) => [
      personalId,
      nombrePersonal(personalId, personal),
      cargoPersonal(personalId, personal),
      nombreArea(personal.find(p => p.id === personalId)?.areaId, areas),
      String(total),
    ])
    .sort((a, b) => Number(b[4]) - Number(a[4]));

  const totalGeneral = filas.reduce((acc, f) => acc + Number(f[4]), 0);

  return {
    columnas: ['ID', 'Nombre', 'Cargo', 'Área', 'Horas totales'],
    filas,
    sumario: `Total de horas en el rango: ${totalGeneral} h · Personal incluido: ${filas.length}`,
  };
}

function informeSalarios(datos, filtroAreaId) {
  const { personal, areas } = datos;
  const personasFiltradas = filtroAreaId
    ? personal.filter(p => p.areaId === filtroAreaId)
    : personal;

  const filas = personasFiltradas.map(persona => [
    persona.id,
    persona.nombre,
    persona.cargo,
    nombreArea(persona.areaId, areas),
    formatearCLP(persona.salario),
  ]);

  const sumaSalarios = personasFiltradas.reduce((acc, p) => acc + (p.salario || 0), 0);

  return {
    columnas: ['ID', 'Nombre', 'Cargo', 'Área', 'Salario bruto'],
    filas,
    sumario: `Total nómina mensual: ${formatearCLP(sumaSalarios)} · Personal: ${filas.length}`,
  };
}

function computarInforme(tipo, datos, filtros) {
  switch (tipo) {
    case 'personal-por-area':
      return informePersonalPorArea(datos, filtros.filtroArea);
    case 'proyectos-por-estado':
      return informeProyectosPorEstado(datos, filtros.filtroArea);
    case 'horas-por-empleado':
      return informeHorasPorEmpleado(
        datos,
        filtros.fechaDesde,
        filtros.fechaHasta,
        filtros.filtroArea
      );
    case 'salarios':
      return informeSalarios(datos, filtros.filtroArea);
    default:
      return null;
  }
}

/* ============================================================
 * Componente principal
 * ============================================================ */

const TIPOS_INFORME = [
  { id: 'personal-por-area',    label: 'Personal por área'    },
  { id: 'proyectos-por-estado', label: 'Proyectos por estado' },
  { id: 'horas-por-empleado',   label: 'Horas por empleado'   },
  { id: 'salarios',             label: 'Salarios'             },
];

function Informes() {
  // Snapshot de las 4 colecciones al montar. MainLayout desmonta esta
  // pantalla al navegar, asi que cada entrada al modulo de Informes vuelve
  // a leer lo ultimo persistido en localStorage.
  const [datos] = useState(() => ({
    personal:  cargarPersonal(),
    areas:     cargarAreas(),
    proyectos: cargarProyectos(),
    registros: cargarRegistrosHoras(),
  }));

  const [tipoInforme, setTipoInforme] = useState('');
  const [fechaDesde,  setFechaDesde]  = useState('');
  const [fechaHasta,  setFechaHasta]  = useState('');
  const [filtroArea,  setFiltroArea]  = useState('');

  const [resultado,    setResultado]    = useState(null);
  const [tipoGenerado, setTipoGenerado] = useState('');

  const generar = () => {
    if (!tipoInforme) {
      alert('Por favor seleccione un tipo de informe antes de generar.');
      return;
    }

    // Validacion de rango de fechas (solo aplica al informe de horas).
    if (tipoInforme === 'horas-por-empleado') {
      const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaDesde || !regexFecha.test(fechaDesde)) {
        alert('La "Fecha desde" es obligatoria para el informe de horas (debe incluir día, mes y año).');
        return;
      }
      if (!fechaHasta || !regexFecha.test(fechaHasta)) {
        alert('La "Fecha hasta" es obligatoria para el informe de horas (debe incluir día, mes y año).');
        return;
      }
      if (fechaHasta < fechaDesde) {
        alert('La "Fecha hasta" debe ser igual o posterior a la "Fecha desde".');
        return;
      }
    }

    const res = computarInforme(tipoInforme, datos, {
      fechaDesde,
      fechaHasta,
      filtroArea,
    });
    setResultado(res);
    setTipoGenerado(tipoInforme);
  };

  const sumarioFiltros = () => {
    if (!resultado) return null;
    const partes = [];
    const tipoLabel = TIPOS_INFORME.find(t => t.id === tipoGenerado)?.label;
    if (tipoLabel) partes.push(`Tipo: ${tipoLabel}`);
    if (tipoGenerado === 'horas-por-empleado') {
      partes.push(
        `Rango: ${fechaDesde || 'inicio'} → ${fechaHasta || 'fin'}`
      );
    }
    if (filtroArea) {
      partes.push(`Área: ${nombreArea(filtroArea, datos.areas)}`);
    } else {
      partes.push('Área: todas');
    }
    return partes.join(' · ');
  };

  return (
    <div>
      <header className="screen-header">
        <h1 className="screen-title">Informes</h1>
      </header>

      <div className="table-card" style={STYLE_CARD_FILTROS}>
        <div className="form-grid form-grid-2col">
          <div className="form-field-full">
            <label htmlFor="inf-tipo" className="form-label">
              Tipo de informe
            </label>
            <select
              id="inf-tipo"
              className="form-select"
              value={tipoInforme}
              onChange={e => setTipoInforme(e.target.value)}
            >
              <option value="">Seleccione un tipo de informe...</option>
              {TIPOS_INFORME.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inf-desde" className="form-label">
              Fecha desde <span style={STYLE_HELPER_LABEL}>(solo horas)</span>
            </label>
            <input
              id="inf-desde"
              type="date"
              className="form-input"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="inf-hasta" className="form-label">
              Fecha hasta <span style={STYLE_HELPER_LABEL}>(solo horas)</span>
            </label>
            <input
              id="inf-hasta"
              type="date"
              className="form-input"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
            />
          </div>

          <div className="form-field-full">
            <label htmlFor="inf-area" className="form-label">
              Área técnica (opcional)
            </label>
            <select
              id="inf-area"
              className="form-select"
              value={filtroArea}
              onChange={e => setFiltroArea(e.target.value)}
            >
              <option value="">Todas las áreas</option>
              {datos.areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={STYLE_BOTONERA}>
          <button
            type="button"
            className="btn btn-primario"
            onClick={generar}
          >
            Generar informe
          </button>
          {(tipoInforme || fechaDesde || fechaHasta || filtroArea) && (
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => {
                setTipoInforme('');
                setFechaDesde('');
                setFechaHasta('');
                setFiltroArea('');
                setResultado(null);
                setTipoGenerado('');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {resultado && (
        <div className="table-card">
          <div style={STYLE_PREVIEW_HEADER}>
            <h2 style={STYLE_PREVIEW_TITULO}>
              Vista previa del informe
            </h2>
            <p style={STYLE_PREVIEW_FILTROS}>
              {sumarioFiltros()}
            </p>
            {resultado.sumario && (
              <p style={STYLE_PREVIEW_SUMARIO}>
                {resultado.sumario}
              </p>
            )}
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  {resultado.columnas.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultado.filas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={resultado.columnas.length}
                      className="table-empty"
                    >
                      El informe no contiene filas con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  resultado.filas.map((fila, fIdx) => (
                    <tr key={fIdx}>
                      {fila.map((celda, cIdx) => (
                        <td key={cIdx}>{celda}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!resultado && (
        <div
          className="table-card"
          style={STYLE_MENSAJE_VACIO}
        >
          Seleccione un tipo de informe y presione "Generar informe" para ver
          la vista previa.
        </div>
      )}
    </div>
  );
}

export default Informes;