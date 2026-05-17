/**
 * Sidebar de la intranet.
 * - Muestra el logo de la marca en la parte superior.
 * - Renderiza los enlaces de navegacion segun el rol (admin / personal).
 * - Incluye boton "Cerrar sesion" en el pie.
 *
 * Props:
 *   - rol           : 'admin' | 'personal'
 *   - activeScreen  : identificador de la pantalla activa
 *   - onNavigate    : (screenId) => void
 *   - onLogout      : () => void
 */

import React from 'react';
import logoSidebar from '../assets/logo_centrado_oscuro.png';
import '../styles/sidebar.css';

// Enlaces de navegacion expuestos por rol. El orden de aparicion en la lista
// corresponde al orden visual en el sidebar.
const ENLACES_POR_ROL = {
  admin: [
    { id: 'admin-dashboard', label: 'Dashboard' },
    { id: 'admin-personal', label: 'Personal' },
    { id: 'admin-areas', label: 'Áreas Técnicas' },
    { id: 'admin-proyectos', label: 'Proyectos' },
    { id: 'admin-informes', label: 'Informes' },
  ],
  personal: [
    { id: 'personal-dashboard', label: 'Dashboard' },
    { id: 'personal-mis-proyectos', label: 'Mis Proyectos' },
    { id: 'personal-mi-perfil', label: 'Mi Perfil' },
  ],
};

function Sidebar({ rol, activeScreen, onNavigate, onLogout }) {
  // Si el rol llega vacio o desconocido, la lista queda vacia y se evita romper el render.
  const enlaces = ENLACES_POR_ROL[rol] || [];

  return (
    <aside className="sidebar" aria-label="Barra lateral de la intranet">
      {/* Logo de marca de la intranet */}
      <div className="sidebar-header">
        <img
          src={logoSidebar}
          alt="Intranet Sánchez e Hijos SpA"
          className="sidebar-logo"
        />
      </div>

      {/* Enlaces de navegacion */}
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {enlaces.map((enlace) => {
          const esActivo = enlace.id === activeScreen;
          const clases = esActivo
            ? 'sidebar-link sidebar-link--activo'
            : 'sidebar-link';
          return (
            <button
              key={enlace.id}
              type="button"
              className={clases}
              onClick={() => onNavigate(enlace.id)}
              aria-current={esActivo ? 'page' : undefined}
            >
              {enlace.label}
            </button>
          );
        })}
      </nav>

      {/* Pie del sidebar con cierre de sesion */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;