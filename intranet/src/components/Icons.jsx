/**
 * Set de iconos SVG inline para la intranet.
 *
 * Decisiones de diseño:
 *  - Todos los iconos usan el mismo viewBox 24x24, stroke "currentColor"
 *    (heredan el color del contenedor), trazo 1.75 con remates y uniones
 *    redondeadas. Esto da consistencia visual y permite colorearlos via CSS.
 *  - Los iconos de seccion (Dashboard, Personal, Areas, Proyectos, Informes,
 *    MisProyectos, MiPerfil) tienen identidad ferroviaria / de mantenimiento
 *    industrial: cascos de seguridad, vias, caseta con antena, gauge de
 *    panel de control. Evitan el aspecto de plantilla generica.
 *  - Los iconos de accion (Editar, Eliminar, CerrarSesion, Close, Plus,
 *    Buscar) son utilitarios y se mantienen limpios y reconocibles.
 *
 * Uso:
 *   import { IconDashboard, IconClose } from './Icons.jsx';
 *   <IconDashboard size={20} className="sidebar-icon" />
 *
 * Props:
 *   - size      : numero en pixeles. Default 20.
 *   - className : clase CSS opcional para el <svg>.
 */

import React from 'react';

// Atributos comunes a todos los SVG. Centralizar evita repeticion y asegura
// que cualquier ajuste futuro (por ejemplo cambiar el strokeWidth) se aplique
// a todo el set de una sola vez.
const PROPS_BASE = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

// Wrapper interno: aplica props base + tamano + className proporcionados por
// el consumidor. No se exporta porque cada icono concreto se expone por
// nombre.
function Svg({ size, className, children, strokeWidth }) {
  const props = strokeWidth ? { ...PROPS_BASE, strokeWidth } : PROPS_BASE;
  return (
    <svg {...props} width={size} height={size} className={className}>
      {children}
    </svg>
  );
}

/* ============================================================
 * Iconos de seccion del sidebar
 * ============================================================ */

// Dashboard: panel rectangular con gauge / aguja indicadora.
// Representa el "panel de operaciones" mas que la tipica grilla 2x2.
export function IconDashboard({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 16a5 5 0 0 1 10 0" />
      <line x1="12" y1="16" x2="14.5" y2="12" />
      <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

// Personal: dos siluetas con casco de seguridad (figura delantera mas grande,
// figura trasera parcial). El casco es el rasgo distintivo del rubro.
export function IconPersonal({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      {/* Cordon en V */}
      <path d="M9 3 L12 6 L15 3" />
      {/* Tarjeta */}
      <rect x="5" y="6" width="14" height="15" rx="1.5" />
      {/* Lineas internas (registros) */}
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </Svg>
  );
}

// Areas Tecnicas: caseta con antena/poste tipo subestacion o caseta de control.
export function IconAreas({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      {/* Poste + aislador horizontal arriba */}
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="10" y1="3" x2="14" y2="3" />
      {/* Caseta con franja superior y dos ventanas */}
      <rect x="5" y="7" width="14" height="13" rx="1" />
      <line x1="5" y1="11" x2="19" y2="11" />
      <rect x="8" y="14" width="3" height="3" />
      <rect x="13" y="14" width="3" height="3" />
    </Svg>
  );
}

// Proyectos: tablilla (clipboard) con dos rieles paralelos y durmientes dentro.
export function IconProyectos({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <rect x="5" y="4.5" width="14" height="17" rx="1.5" />
      <rect x="9" y="3" width="6" height="3" rx="0.5" />
      {/* Vias internas */}
      <line x1="9" y1="11" x2="9" y2="19" />
      <line x1="15" y1="11" x2="15" y2="19" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="16" x2="16" y2="16" />
      <line x1="8" y1="19" x2="16" y2="19" />
    </Svg>
  );
}

// Informes: tres barras verticales ascendentes sobre linea base.
export function IconInformes({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <line x1="3" y1="20" x2="21" y2="20" />
      <rect x="5.5" y="13" width="3" height="7" />
      <rect x="10.5" y="9" width="3" height="11" />
      <rect x="15.5" y="5" width="3" height="15" />
    </Svg>
  );
}

// Mis Proyectos: carpeta con check superpuesto. Distinta del clipboard de
// IconProyectos para evitar confusion visual entre el menu admin y el menu
// personal.
export function IconMisProyectos({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <path d="M3 8a1.5 1.5 0 0 1 1.5-1.5H9l2 2h8.5A1.5 1.5 0 0 1 21 10v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V8z" />
      <path d="M8.5 14l2.5 2.5L15.5 12" />
    </Svg>
  );
}

// Mi Perfil: huella digital tipo loop. Cuatro trazos limpios que evocan
// los surcos papilares: arco externo, segunda capa, espiral central con
// curl hacia adentro, y cola izquierda. Lenguaje de identidad y control
// de acceso, coherente con la credencial usada en IconPersonal.
export function IconMiPerfil({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      {/* 1. Cabeza de la llave (círculo) */}
      <circle cx="7.5" cy="12" r="3.5" />
      {/* 2. Caña horizontal */}
      <line x1="11" y1="12" x2="20" y2="12" />
      {/* 3. Primer diente */}
      <line x1="17" y1="12" x2="17" y2="15.5" />
      {/* 4. Segundo diente (punta) */}
      <line x1="20" y1="12" x2="20" y2="14.5" />
    </Svg>
  );
}

/* ============================================================
 * Iconos de accion (modales, botones de tabla, sidebar footer)
 * ============================================================ */

// Editar: lapiz inclinado.
export function IconEditar({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <path d="M16.5 4.5l3 3-11 11H5.5v-3l11-11z" />
      <line x1="14.5" y1="6.5" x2="17.5" y2="9.5" />
    </Svg>
  );
}

// Eliminar: tacho con tapa, asa y dos lineas interiores.
export function IconEliminar({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
      <path d="M6 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5L17 7" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </Svg>
  );
}

// Cerrar sesion: flecha saliendo por el marco de una puerta.
export function IconCerrarSesion({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <path d="M10 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h4" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <path d="M16 8l4 4-4 4" />
    </Svg>
  );
}

// Cerrar (X dentro de circulo). Para el boton X del Modal.
export function IconClose({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </Svg>
  );
}

// Agregar (+ dentro de circulo). Para botones "Agregar" en GestionPersonal,
// GestionAreas, GestionProyectos de la Tarea 24.
export function IconPlus({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </Svg>
  );
}

// Buscar: lupa. Para campos de busqueda en tablas.
export function IconBuscar({ size = 20, className = '' }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="11" cy="11" r="6" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" />
    </Svg>
  );
}