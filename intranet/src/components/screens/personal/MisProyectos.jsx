/**
 * MisProyectos
 *
 * Pantalla del rol personal que lista los proyectos asignados al usuario
 * logueado y permite registrar horas trabajadas contra esos proyectos.
 * Clona la maqueta MisProyectos.tsx con dos adaptaciones al dominio:
 *
 *   - La relacion personal <-> proyecto vive en `proyecto.personalAsignado`
 *     (array de ids de personal). La maqueta la tenia inversa
 *     (`empleado.proyectos`), pero nuestro modelo (constants.js) la lleva
 *     desde el proyecto.
 *   - El submit del modal persiste el nuevo registro en localStorage via
 *     guardarRegistrosHoras (la maqueta solo hacia alert()).
 *
 * Tabla: 3 columnas (Nombre, Descripcion, Fecha de inicio). Caso vacio
 * con leyenda en una sola celda colSpan.
 *
 * Modal "Registrar horas": formulario con select de proyecto (solo los
 * asignados al usuario), fecha (input date), cantidad de horas (number
 * 0 < h <= 24) y descripcion (textarea no vacia, minimo 3 caracteres).
 * Validacion inline siguiendo el patron heredado de GestionPersonal:
 * STYLE_ERROR_MSG externo, REGEX_FECHA_ISO, errores por campo limpiados
 * al editar.
 */

import React, { useState } from 'react';
import Modal from '../../Modal.jsx';
import { USUARIO_PERSONAL_MOCK_ID } from '../../../constants.js';
import {
  cargarPersonal,
  cargarProyectos,
  cargarRegistrosHoras,
  guardarRegistrosHoras,
} from '../../../utils/storage.js';
import '../../../styles/tables.css';

/* ============================================================
 * Estilos inline declarados como constantes externas (regla operativa 13:
 * evita colision de placeholders ... con URLs comprimidas si se
 * declarara con sintaxis style= ... ).
 * ============================================================ */

const STYLE_ERROR_MSG = {
  fontSize: '12px',
  color: '#C0392B',
  margin: '4px 0 0 0',
};

const REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

/* ============================================================
 * Componente principal
 * ============================================================ */

function MisProyectos() {
  // Snapshot inicial: las 3 colecciones desde localStorage.
  const [personal]   = useState(() => cargarPersonal());
  const [proyectos]  = useState(() => cargarProyectos());
  const [registros, setRegistros] = useState(() => cargarRegistrosHoras());

  // Usuario logueado (id mock fijo en constants.js).
  const currentUser =
    personal.find(p => p.id === USUARIO_PERSONAL_MOCK_ID) ||
    { id: USUARIO_PERSONAL_MOCK_ID, nombre: 'Usuario' };

  // Proyectos donde aparece el usuario en personalAsignado.
  const proyectosAsignados = proyectos.filter(
    pry => pry.personalAsignado.includes(currentUser.id)
  );

  // Estado del modal y del formulario.
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  /**
   * Persiste el nuevo registro en localStorage y refresca el estado local
   * para que cualquier nuevo render lea la lista actualizada (por ahora
   * no hay tabla de historial en esta pantalla, pero queda preparado).
   */
  const guardarNuevoRegistro = (nuevoRegistro) => {
    const nuevaLista = [...registros, nuevoRegistro];
    setRegistros(nuevaLista);
    guardarRegistrosHoras(nuevaLista);
    setModalAbierto(false);
  };

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <div>
      <header className="screen-header">
        <h1 className="screen-title">Mis proyectos asignados</h1>
        <div className="screen-actions">
          <button
            type="button"
            className="btn btn-primario"
            onClick={abrirModal}
            disabled={proyectosAsignados.length === 0}
            title={
              proyectosAsignados.length === 0
                ? 'No tienes proyectos asignados para registrar horas.'
                : 'Registrar horas en un proyecto asignado.'
            }
          >
            Registrar horas
          </button>
        </div>
      </header>

      <div className="table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre del proyecto</th>
                <th>Descripción</th>
                <th>Fecha de inicio</th>
              </tr>
            </thead>
            <tbody>
              {proyectosAsignados.length === 0 ? (
                <tr>
                  <td colSpan="3" className="table-empty">
                    No tienes proyectos asignados actualmente.
                  </td>
                </tr>
              ) : (
                proyectosAsignados.map(pry => (
                  <tr key={pry.id}>
                    <td>{pry.nombre}</td>
                    <td>{pry.descripcion}</td>
                    <td>{pry.fechaInicio}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <ModalRegistrarHoras
          isOpen={modalAbierto}
          onClose={cerrarModal}
          onSave={guardarNuevoRegistro}
          currentUserId={currentUser.id}
          proyectosAsignados={proyectosAsignados}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Sub-componente: modal "Registrar horas"
 * Aislar el formulario reduce re-renders del padre y mantiene la
 * validacion encapsulada.
 * ============================================================ */

function ModalRegistrarHoras({
  isOpen,
  onClose,
  onSave,
  currentUserId,
  proyectosAsignados,
}) {
  // Estado controlado del formulario. proyectoId se inicializa con el
  // primero asignado (la maqueta hacia lo mismo) para que el select tenga
  // siempre un valor valido al abrir.
  const [formData, setFormData] = useState({
    proyectoId:    proyectosAsignados[0]?.id ?? '',
    fecha:         '',
    cantidadHoras: '',
    descripcion:   '',
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpia el error del campo apenas el usuario lo edita.
    if (errores[name]) {
      setErrores(prev => {
        const nuevo = { ...prev };
        delete nuevo[name];
        return nuevo;
      });
    }
  };

  /**
   * Valida el formulario completo. Reglas:
   *   - proyectoId  : obligatorio (debe estar en la lista de asignados)
   *   - fecha       : obligatoria, formato ISO YYYY-MM-DD
   *   - cantidadHoras: obligatoria, numerica, 0 < h <= 24
   *   - descripcion : obligatoria, minimo 3 caracteres no en blanco
   */
  const validar = () => {
    const err = {};

    if (!formData.proyectoId) {
      err.proyectoId = 'Debe seleccionar un proyecto.';
    } else if (!proyectosAsignados.find(p => p.id === formData.proyectoId)) {
      err.proyectoId = 'El proyecto seleccionado no esta en sus asignaciones.';
    }

    if (!formData.fecha || !REGEX_FECHA_ISO.test(formData.fecha)) {
      err.fecha = 'La fecha es obligatoria (dia, mes y ano).';
    }

    const horasNum = Number(formData.cantidadHoras);
    if (
      formData.cantidadHoras === '' ||
      Number.isNaN(horasNum) ||
      horasNum <= 0 ||
      horasNum > 24
    ) {
      err.cantidadHoras = 'Cantidad de horas debe ser mayor a 0 y maximo 24.';
    }

    if (!formData.descripcion.trim() || formData.descripcion.trim().length < 3) {
      err.descripcion = 'La descripcion es obligatoria (minimo 3 caracteres).';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    // Estructura del registro coherente con el esquema extendido en
    // constants.js: {fecha, personalId, proyectoId, horas, descripcion}.
    onSave({
      fecha:       formData.fecha,
      personalId:  currentUserId,
      proyectoId:  formData.proyectoId,
      horas:       Number(formData.cantidadHoras),
      descripcion: formData.descripcion.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar horas"
      footer={
        <>
          <button type="button" className="btn btn-secundario" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primario" onClick={handleSubmit}>
            Guardar
          </button>
        </>
      }
    >
      <div className="form-grid form-grid-2col">
        <div className="form-field-full">
          <label htmlFor="f-hor-proyecto" className="form-label">Proyecto *</label>
          <select
            id="f-hor-proyecto"
            name="proyectoId"
            className="form-select"
            value={formData.proyectoId}
            onChange={handleChange}
          >
            {proyectosAsignados.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          {errores.proyectoId && <p style={STYLE_ERROR_MSG}>{errores.proyectoId}</p>}
        </div>

        <div>
          <label htmlFor="f-hor-fecha" className="form-label">Fecha *</label>
          <input
            id="f-hor-fecha"
            name="fecha"
            type="date"
            className="form-input"
            value={formData.fecha}
            onChange={handleChange}
          />
          {errores.fecha && <p style={STYLE_ERROR_MSG}>{errores.fecha}</p>}
        </div>

        <div>
          <label htmlFor="f-hor-cantidad" className="form-label">Cantidad de horas *</label>
          <input
            id="f-hor-cantidad"
            name="cantidadHoras"
            type="number"
            min="0"
            max="24"
            step="0.5"
            className="form-input"
            value={formData.cantidadHoras}
            onChange={handleChange}
            placeholder="8"
          />
          {errores.cantidadHoras && <p style={STYLE_ERROR_MSG}>{errores.cantidadHoras}</p>}
        </div>

        <div className="form-field-full">
          <label htmlFor="f-hor-descripcion" className="form-label">Descripción de tareas *</label>
          <textarea
            id="f-hor-descripcion"
            name="descripcion"
            rows={3}
            className="form-input"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Detalle breve de las tareas realizadas"
          />
          {errores.descripcion && <p style={STYLE_ERROR_MSG}>{errores.descripcion}</p>}
        </div>
      </div>
    </Modal>
  );
}

export default MisProyectos;