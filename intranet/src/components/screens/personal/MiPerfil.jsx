/**
 * MiPerfil
 *
 * Pantalla del rol personal que muestra los datos del usuario logueado
 * en modo solo lectura. Clona la maqueta MiPerfil.tsx adaptada al modelo
 * del proyecto: `areaId` en lugar de `depto`, lookup contra AREAS_TECNICAS
 * desde localStorage, terminologia `personal`.
 *
 * No hay edicion. Si el usuario quiere actualizar sus datos, debe pedirlo
 * al admin (rol que mantiene GestionPersonal con CRUD completo). Esta
 * decision sigue exactamente la maqueta (todos los <input disabled>).
 */

import React, { useState } from 'react';
import { USUARIO_PERSONAL_MOCK_ID } from '../../../constants.js';
import {
  cargarPersonal,
  cargarAreas,
} from '../../../utils/storage.js';
import '../../../styles/tables.css'; // .screen-title + .form-grid + .form-label + .form-input

/* ============================================================
 * Helpers de formato
 * ============================================================ */

/** Formatea un numero como moneda CLP sin decimales. */
function formatearCLP(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}

/** Resuelve el nombre del area desde su id; muestra "—" para administracion. */
function nombreArea(areaId, areas) {
  if (!areaId) return '—';
  const area = areas.find(a => a.id === areaId);
  return area ? area.nombre : 'N/A';
}

/* ============================================================
 * Sub-componente: campo de formulario solo lectura
 * ============================================================ */

function FormFieldReadOnly({ id, label, value }) {
  return (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        type="text"
        className="form-input"
        value={value}
        disabled
        readOnly
      />
    </div>
  );
}

/* ============================================================
 * Componente principal
 * ============================================================ */

function MiPerfil() {
  // Snapshot inicial: PERSONAL + AREAS_TECNICAS desde localStorage.
  const [personal] = useState(() => cargarPersonal());
  const [areas]    = useState(() => cargarAreas());

  // Usuario logueado segun el id mock fijo. Si no se encuentra (constants
  // mal sincronizado), mostramos un placeholder en lugar de romper la UI.
  const currentUser = personal.find(p => p.id === USUARIO_PERSONAL_MOCK_ID);

  if (!currentUser) {
    return (
      <div>
        <h1 className="screen-title">Mis datos personales</h1>
        <p>No se pudo cargar la informacion del usuario.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="screen-title">Mis datos personales</h1>

      <div className="table-card" style={STYLE_CARD_PADDING}>
        <div className="form-grid form-grid-2col">
          <FormFieldReadOnly id="mp-id"        label="ID personal"      value={currentUser.id} />
          <FormFieldReadOnly id="mp-nombre"    label="Nombre completo"  value={currentUser.nombre} />
          <FormFieldReadOnly id="mp-cargo"     label="Cargo"            value={currentUser.cargo} />
          <FormFieldReadOnly id="mp-area"      label="Área técnica"     value={nombreArea(currentUser.areaId, areas)} />
          <FormFieldReadOnly id="mp-email"     label="Email"            value={currentUser.email} />
          <FormFieldReadOnly id="mp-telefono"  label="Teléfono"         value={currentUser.telefono} />
          <FormFieldReadOnly id="mp-direccion" label="Dirección"        value={currentUser.direccion} />
          <FormFieldReadOnly id="mp-fecha"     label="Fecha de ingreso" value={currentUser.fechaIngreso} />
          <FormFieldReadOnly id="mp-salario"   label="Salario bruto"    value={formatearCLP(currentUser.salario)} />
        </div>
      </div>
    </div>
  );
}

/* Estilo inline declarado como constante externa (regla operativa 13). */
const STYLE_CARD_PADDING = {
  padding: '1.25rem',
};

export default MiPerfil;