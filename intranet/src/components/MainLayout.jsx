/**
 * Layout principal de la intranet.
 * - Sidebar fijo a la izquierda.
 * - Área de contenido a la derecha con un header simple (sesión activa)
 *   y un cuerpo que, en esta tarea, muestra sólo un placeholder con el
 *   identificador de la pantalla activa. Tareas 24 y 25 reemplazan ese
 *   placeholder por los componentes de pantalla reales.
 *
 * Props:
 *   - rol           : 'admin' | 'personal'
 *   - usuario       : nombre de usuario logueado
 *   - activeScreen  : identificador de la pantalla activa
 *   - onNavigate    : (screenId) => void
 *   - onLogout      : () => void
 */

import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Modal from './Modal.jsx';
import Chart from './Chart.jsx';
import '../styles/layout.css';

// ============================================================
// SANDBOX TAREA 23 - Eliminar en Tarea 24
// Constantes y datos estaticos para validar Modal.jsx y Chart.jsx
// antes de integrarlos en las pantallas reales de Tareas 24 y 25.
// Datos y opciones declarados fuera del componente para que no
// cambien de referencia en cada render (ver Chart.jsx).
// ============================================================

const DATOS_CHART_SANDBOX = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Proyectos completados',
      data: [4, 7, 5, 9],
      backgroundColor: '#E67E22',
      borderColor: '#1B2A4A',
      borderWidth: 1,
    },
  ],
};

const OPCIONES_CHART_SANDBOX = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: 'Proyectos completados por trimestre (demo)',
    },
  },
};

const SANDBOX_WRAPPER_STYLE = { marginTop: '2rem' };
const SANDBOX_INTRO_STYLE = { marginTop: 0 };
const SANDBOX_CHART_CONTAINER_STYLE = { height: 280 };

const SANDBOX_BTN_PRIMARIO_STYLE = {
  padding: '0.65rem 1.1rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: 'var(--color-acento)',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

const SANDBOX_BTN_SECUNDARIO_STYLE = {
  padding: '0.5rem 1rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: 'var(--color-primario)',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

// ============================================================ END SANDBOX

function MainLayout({ rol, usuario, activeScreen, onNavigate, onLogout }) {
  // SANDBOX TAREA 23 - Eliminar en Tarea 24
  const [sandboxAbierto, setSandboxAbierto] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        rol={rol}
        activeScreen={activeScreen}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="layout-content">
        <header className="layout-content-header">
          <span className="layout-content-sesion">
            Sesión activa: <strong>{usuario}</strong> ({rol})
          </span>
        </header>

        <section className="layout-content-body">
          {/* Placeholder por pantalla. Se reemplaza en Tareas 24 y 25. */}
          <h1 className="layout-content-titulo">{activeScreen}</h1>
          <p className="layout-content-mensaje">
            Pantalla en construcción. El contenido real se implementa en las próximas tareas.
          </p>

          {/* ============================================================
            * SANDBOX TAREA 23 - Eliminar en Tarea 24
            * Boton que abre un Modal con un Chart adentro para validar
            * visualmente Modal.jsx y Chart.jsx.
            * ============================================================ */}
          <div style={SANDBOX_WRAPPER_STYLE}>
            <button
              type="button"
              onClick={() => setSandboxAbierto(true)}
              style={SANDBOX_BTN_PRIMARIO_STYLE}
            >
              Probar componentes (Modal + Chart)
            </button>
          </div>

          <Modal
            isOpen={sandboxAbierto}
            onClose={() => setSandboxAbierto(false)}
            title="Sandbox de validación - Tarea 23"
            footer={
              <button
                type="button"
                onClick={() => setSandboxAbierto(false)}
                style={SANDBOX_BTN_SECUNDARIO_STYLE}
              >
                Cerrar
              </button>
            }
          >
            <p style={SANDBOX_INTRO_STYLE}>
              Datos de demostración. La integración real de gráficos en pantallas de Informes se hace en Tarea 24.
            </p>
            <div style={SANDBOX_CHART_CONTAINER_STYLE}>
              <Chart
                type="bar"
                data={DATOS_CHART_SANDBOX}
                options={OPCIONES_CHART_SANDBOX}
              />
            </div>
          </Modal>
          {/* ============================================================ END SANDBOX */}
        </section>
      </main>
    </div>
  );
}

export default MainLayout;