/**
 * Layout principal de la intranet.
 * - Sidebar fijo a la izquierda.
 * - Area de contenido a la derecha con un header simple (sesion activa)
 *   y un cuerpo que renderiza la pantalla activa segun activeScreen.
 *
 * Tarea 24: integra las 5 pantallas del rol admin (DashboardAdmin,
 * GestionPersonal, GestionAreas, GestionProyectos, Informes). Las
 * pantallas del rol personal (personal-*) muestran aun el placeholder
 * "En construccion" y se completan en Tarea 25.
 *
 * Props:
 *   - rol           : 'admin' | 'personal'
 *   - usuario       : nombre de usuario logueado
 *   - activeScreen  : identificador de la pantalla activa
 *   - onNavigate    : (screenId) => void
 *   - onLogout      : () => void
 */

import React from 'react';
import Sidebar from './Sidebar.jsx';
import DashboardAdmin from './screens/admin/DashboardAdmin.jsx';
import GestionPersonal from './screens/admin/GestionPersonal.jsx';
import GestionAreas from './screens/admin/GestionAreas.jsx';
import GestionProyectos from './screens/admin/GestionProyectos.jsx';
import Informes from './screens/admin/Informes.jsx';
import DashboardPersonal from './screens/personal/DashboardPersonal.jsx';
import MisProyectos from './screens/personal/MisProyectos.jsx';
import MiPerfil from './screens/personal/MiPerfil.jsx';
import '../styles/layout.css';

// Mapa identificador -> componente. Centralizar el dispatcher evita un
// switch largo dentro del JSX y permite agregar pantallas (rol personal
// en Tarea 25) cambiando solo este objeto.
const SCREEN_COMPONENTS = {
  'admin-dashboard':       DashboardAdmin,
  'admin-personal':        GestionPersonal,
  'admin-areas':           GestionAreas,
  'admin-proyectos':       GestionProyectos,
  'admin-informes':        Informes,
  'personal-dashboard':    DashboardPersonal,
  'personal-mis-proyectos': MisProyectos,
  'personal-mi-perfil':    MiPerfil,
};

function MainLayout({ rol, usuario, activeScreen, onNavigate, onLogout }) {
  // Resuelve el componente de pantalla a renderizar. Si activeScreen aun
  // no esta mapeado (caso tipico: pantallas personal-* hasta Tarea 25),
  // se muestra el placeholder "En construccion".
  const Pantalla = SCREEN_COMPONENTS[activeScreen];

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
          {Pantalla ? (
            <Pantalla />
          ) : (
            <PlaceholderEnConstruccion screenId={activeScreen} />
          )}
        </section>
      </main>
    </div>
  );
}

/**
 * Placeholder transitorio para pantallas aun no implementadas. En la Tarea 24
 * cubre las pantallas personal-*; en Tarea 25 se retira cuando el dispatcher
 * mapee los 8 ids de pantalla.
 */
function PlaceholderEnConstruccion({ screenId }) {
  return (
    <>
      <h1 className="layout-content-titulo">{screenId}</h1>
      <p className="layout-content-mensaje">
        Pantalla en construcción. El contenido real se implementa en la próxima tarea.
      </p>
    </>
  );
}

export default MainLayout;