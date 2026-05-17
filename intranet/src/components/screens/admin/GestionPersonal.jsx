/**
 * GestionPersonal
 *
 * Pantalla CRUD del rol admin para gestionar el personal de la empresa.
 * Clona la maqueta GestionEmpleados.tsx adaptada al dominio Sanchez e Hijos
 * (campo `areaId` en lugar de `depto`, `responsableId` en areas, terminologia
 * `personal` en lugar de `empleados`).
 *
 * Funcionalidades:
 *   - Tabla listado con ID, nombre, cargo, area, salario y acciones.
 *   - Busqueda en vivo por nombre o cargo (useMemo).
 *   - Filtro avanzado por area (modal): "Todas" | 5 areas | "Sin area".
 *   - Crear nuevo personal (modal con 8 campos).
 *   - Editar personal existente (mismo modal precargado).
 *   - Eliminar con confirmacion: el usuario debe tipear el nombre exacto.
 *
 * Datos: estado local inicializado desde PERSONAL de constants.js. No hay
 * lifting state al padre; cada pantalla mantiene su copia para CRUD en
 * memoria durante la sesion.
 */

import React, { useState, useMemo } from 'react';
import {
  cargarPersonal,
  guardarPersonal,
  cargarAreas,
} from '../../../utils/storage.js';
import { siguienteIdPersonal } from '../../../utils/idGenerator.js';
import {
  IconBuscar,
  IconFiltro,
  IconPlus,
  IconEditar,
  IconEliminar,
} from '../../Icons.jsx';
import Modal from '../../Modal.jsx';
import '../../../styles/tables.css';

const STYLE_ERROR_MSG = {
  fontSize: '12px',
  color: '#C0392B',
  margin: '4px 0 0 0',
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

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
 * Componente principal
 * ============================================================ */

function GestionPersonal() {
  // Copia local mutable del dataset, hidratada desde localStorage. La primera
  // vez se siembra con PERSONAL de constants.js; en arranques siguientes lee
  // los datos persistidos por sesiones anteriores.
  const [personas, setPersonas] = useState(() => cargarPersonal());

  // Areas tecnicas vigentes al montar la pantalla. Solo lectura: las muta
  // GestionAreas. MainLayout desmonta al navegar, asi que esta lista queda
  // refrescada cada vez que se entra a Gestion de personal.
  const [areas] = useState(() => cargarAreas());

  // Termino de busqueda libre (nombre o cargo).
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro avanzado: id de area, '' = sin filtro, 'SIN_AREA' = solo admin.
  const [filtroArea, setFiltroArea] = useState('');

  // Modales abiertos.
  const [modalCRUDAbierto, setModalCRUDAbierto] = useState(false);
  const [modalFiltroAbierto, setModalFiltroAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  // Entidad en edicion / eliminacion.
  const [personaEditando, setPersonaEditando] = useState(null);
  const [personaAEliminar, setPersonaAEliminar] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');

  /* ----------------------------------------------------------
   * Handlers
   * ---------------------------------------------------------- */

  const abrirModalCrear = () => {
    setPersonaEditando(null);
    setModalCRUDAbierto(true);
  };

  const abrirModalEditar = (persona) => {
    setPersonaEditando(persona);
    setModalCRUDAbierto(true);
  };

  const guardarPersona = (formData) => {
  // Calcular la nueva lista una sola vez para poder hacer set + persist.
  let nuevaLista;
  if (personaEditando) {
    // Editar: conserva el id existente.
    nuevaLista = personas.map(p =>
      p.id === personaEditando.id ? { ...formData, id: p.id } : p
    );
  } else {
    // Crear: id nuevo desde idGenerator (no recicla, Tarea 24).
    nuevaLista = [...personas, { ...formData, id: siguienteIdPersonal() }];
  }
  setPersonas(nuevaLista);
  guardarPersonal(nuevaLista);
  setModalCRUDAbierto(false);
};

  const abrirModalEliminar = (persona) => {
    setPersonaAEliminar(persona);
    setConfirmInput('');
    setModalEliminarAbierto(true);
  };

  const confirmarEliminar = () => {
  if (personaAEliminar && confirmInput === personaAEliminar.nombre) {
    const nuevaLista = personas.filter(p => p.id !== personaAEliminar.id);
    setPersonas(nuevaLista);
    guardarPersonal(nuevaLista);
    setModalEliminarAbierto(false);
    setPersonaAEliminar(null);
  }
};

  /* ----------------------------------------------------------
   * Listado filtrado (busqueda + filtro de area)
   * ---------------------------------------------------------- */

  const personasFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return personas.filter(persona => {
      // Filtro de busqueda
      const coincideBusqueda =
        !term ||
        persona.nombre.toLowerCase().includes(term) ||
        persona.cargo.toLowerCase().includes(term);

      // Filtro avanzado de area
      let coincideArea = true;
      if (filtroArea === 'SIN_AREA') coincideArea = persona.areaId === null;
      else if (filtroArea) coincideArea = persona.areaId === filtroArea;

      return coincideBusqueda && coincideArea;
    });
  }, [personas, searchTerm, filtroArea]);

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <div>
      <header className="screen-header">
        <h1 className="screen-title">Gestión de personal</h1>
        <div className="screen-actions">
          <div className="search-wrapper">
            <IconBuscar size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre o cargo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {(searchTerm || filtroArea) && (
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => { setSearchTerm(''); setFiltroArea(''); }}
            >
              Limpiar filtros
            </button>
          )}          
          <button
            type="button"
            className="btn btn-secundario"
            onClick={() => setModalFiltroAbierto(true)}
            aria-label="Filtros avanzados"
            title="Filtros avanzados"
          >
            <IconFiltro size={18} />
            Filtros
          </button>
          <button
            type="button"
            className="btn btn-primario"
            onClick={abrirModalCrear}
          >
            <IconPlus size={18} />
            Nuevo personal
          </button>
        </div>
      </header>

      <div className="table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Área</th>
                <th>Salario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    No hay personal que coincida con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                personasFiltradas.map(persona => (
                  <tr key={persona.id}>
                    <td className="col-id">{persona.id}</td>
                    <td>{persona.nombre}</td>
                    <td>{persona.cargo}</td>
                    <td>{nombreArea(persona.areaId, areas)}</td>
                    <td>{formatearCLP(persona.salario)}</td>
                    <td className="col-acciones">
                      <button
                        type="button"
                        className="action-btn action-btn-editar"
                        onClick={() => abrirModalEditar(persona)}
                      >
                        <IconEditar size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn-eliminar"
                        onClick={() => abrirModalEliminar(persona)}
                      >
                        <IconEliminar size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear / editar */}
      {modalCRUDAbierto && (
        <ModalCrearEditarPersona
          isOpen={modalCRUDAbierto}
          onClose={() => setModalCRUDAbierto(false)}
          onSave={guardarPersona}
          personaToEdit={personaEditando}
          areas={areas}
        />
      )}

      {/* Modal filtros avanzados */}
      <Modal
        isOpen={modalFiltroAbierto}
        onClose={() => setModalFiltroAbierto(false)}
        title="Filtros avanzados"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => setFiltroArea('')}
            >
              Limpiar filtros
            </button>
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => setModalFiltroAbierto(false)}
            >
              Aplicar filtros
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div>
            <label htmlFor="filtro-area" className="form-label">
              Área técnica
            </label>
            <select
              id="filtro-area"
              className="form-select"
              value={filtroArea}
              onChange={e => setFiltroArea(e.target.value)}
            >
              <option value="">Todas las áreas</option>
              <option value="SIN_AREA">Sin área (Administración)</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminacion */}
      <Modal
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        title="Confirmar eliminación"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => setModalEliminarAbierto(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-destructivo"
              onClick={confirmarEliminar}
              disabled={confirmInput !== (personaAEliminar?.nombre || '')}
            >
              Eliminar definitivamente
            </button>
          </>
        }
      >
        <p className="confirm-text">
          Esta acción no se puede deshacer. Para confirmar, escriba el nombre
          exacto: <strong>{personaAEliminar?.nombre}</strong>
        </p>
        <input
          type="text"
          className="form-input"
          value={confirmInput}
          onChange={e => setConfirmInput(e.target.value)}
          placeholder="Tipee el nombre del personal"
        />
      </Modal>
    </div>
  );
}

/* ============================================================
 * Sub-componente: modal de creacion / edicion
 * Aislar el formulario reduce el peso de re-renders del padre.
 * ============================================================ */

function ModalCrearEditarPersona({ isOpen, onClose, onSave, personaToEdit, areas }) {
  const [formData, setFormData] = useState({
    nombre:        personaToEdit?.nombre        ?? '',
    email:         personaToEdit?.email         ?? '',
    direccion:     personaToEdit?.direccion     ?? '',
    telefono:      personaToEdit?.telefono      ?? '',
    fechaIngreso:  personaToEdit?.fechaIngreso  ?? '',
    salario:       personaToEdit?.salario       ?? '',
    cargo:         personaToEdit?.cargo         ?? '',
    areaId:        personaToEdit?.areaId        ?? '',
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
   * Valida el formulario completo. Devuelve true si pasa.
   * Reglas:
   *   - nombre: obligatorio, minimo 3 caracteres no en blanco
   *   - email: obligatorio, formato valido
   *   - direccion: obligatorio
   *   - fechaIngreso: obligatorio, formato ISO completo (dia, mes, ano)
   *   - salario: obligatorio, numerico positivo
   *   - cargo: obligatorio
   *   - telefono y areaId son opcionales
   */
  const validar = () => {
    const err = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) {
      err.nombre = 'El nombre completo es obligatorio (minimo 3 caracteres).';
    }
    if (!formData.email.trim()) {
      err.email = 'El email es obligatorio.';
    } else if (!REGEX_EMAIL.test(formData.email.trim())) {
      err.email = 'Formato de email invalido. Ej: usuario@dominio.cl';
    }
    if (!formData.direccion.trim()) {
      err.direccion = 'La direccion es obligatoria.';
    }
    if (!formData.fechaIngreso || !REGEX_FECHA_ISO.test(formData.fechaIngreso)) {
      err.fechaIngreso = 'La fecha de ingreso es obligatoria (dia, mes y ano).';
    }
    const salarioNum = Number(formData.salario);
    if (formData.salario === '' || Number.isNaN(salarioNum) || salarioNum <= 0) {
      err.salario = 'El salario bruto es obligatorio y debe ser mayor a 0.';
    }
    if (!formData.cargo.trim()) {
      err.cargo = 'El cargo es obligatorio.';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    const datosLimpios = {
      ...formData,
      salario: Number(formData.salario),
      areaId: formData.areaId === '' ? null : formData.areaId,
    };
    onSave(datosLimpios);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={personaToEdit ? 'Editar personal' : 'Crear nuevo personal'}
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
          <label htmlFor="f-per-nombre" className="form-label">Nombre completo *</label>
          <input id="f-per-nombre" name="nombre" className="form-input"
            value={formData.nombre} onChange={handleChange}
            placeholder="Ej: Juan Pérez González" />
          {errores.nombre && <p style={STYLE_ERROR_MSG}>{errores.nombre}</p>}
        </div>

        <div>
          <label htmlFor="f-per-email" className="form-label">Email *</label>
          <input id="f-per-email" name="email" type="email" className="form-input"
            value={formData.email} onChange={handleChange}
            placeholder="usuario@sanchezehijos.cl" />
          {errores.email && <p style={STYLE_ERROR_MSG}>{errores.email}</p>}
        </div>

        <div>
          <label htmlFor="f-per-telefono" className="form-label">Teléfono</label>
          <input id="f-per-telefono" name="telefono" className="form-input"
            value={formData.telefono} onChange={handleChange}
            placeholder="+56 9 1234 5678" />
        </div>

        <div className="form-field-full">
          <label htmlFor="f-per-direccion" className="form-label">Dirección *</label>
          <input id="f-per-direccion" name="direccion" className="form-input"
            value={formData.direccion} onChange={handleChange}
            placeholder="Calle 123, Comuna, Ciudad" />
          {errores.direccion && <p style={STYLE_ERROR_MSG}>{errores.direccion}</p>}
        </div>

        <div>
          <label htmlFor="f-per-fecha" className="form-label">Fecha de ingreso *</label>
          <input id="f-per-fecha" name="fechaIngreso" type="date" className="form-input"
            value={formData.fechaIngreso} onChange={handleChange} />
          {errores.fechaIngreso && <p style={STYLE_ERROR_MSG}>{errores.fechaIngreso}</p>}
        </div>

        <div>
          <label htmlFor="f-per-salario" className="form-label">Salario bruto (CLP) *</label>
          <input id="f-per-salario" name="salario" type="number" min="0" className="form-input"
            value={formData.salario} onChange={handleChange} placeholder="1500000" />
          {errores.salario && <p style={STYLE_ERROR_MSG}>{errores.salario}</p>}
        </div>

        <div>
          <label htmlFor="f-per-cargo" className="form-label">Cargo *</label>
          <input id="f-per-cargo" name="cargo" className="form-input"
            value={formData.cargo} onChange={handleChange}
            placeholder="Ej: Técnico Mecánico" />
          {errores.cargo && <p style={STYLE_ERROR_MSG}>{errores.cargo}</p>}
        </div>

        <div>
          <label htmlFor="f-per-area" className="form-label">Área técnica</label>
          <select id="f-per-area" name="areaId" className="form-select"
            value={formData.areaId ?? ''} onChange={handleChange}>
            <option value="">Sin área (Administración)</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

export default GestionPersonal;