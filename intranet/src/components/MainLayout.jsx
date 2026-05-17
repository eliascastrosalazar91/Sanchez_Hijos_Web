/**
 * Layout principal de la intranet.
 * - Sidebar fijo a la izquierda.
 * - Área de contenido a la derecha con un header simple (sesión activa)
 *   y un cuerpo que, en esta tarea, muestra sólo un placeholder con el
 *   identificador de la pantalla activa. Tareas 24 y 25 reemplazan ese
 *   placeholder por los componentes de pantalla reales.
 *
 * Props:
 *   - rol           : 'admin' | 'operario'
 *   - usuario       : nombre de usuario logueado
 *   - activeScreen  : identificador de la pantalla activa
 *   - onNavigate    : (screenId) => void
 *   - onLogout      : () => void
 */

import React from 'react';
import Sidebar from './Sidebar.jsx';
import '../styles/layout.css';

function MainLayout({ rol, usuario, activeScreen, onNavigate, onLogout }) {
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
        </section>
      </main>
    </div>
  );
}

export default MainLayout;