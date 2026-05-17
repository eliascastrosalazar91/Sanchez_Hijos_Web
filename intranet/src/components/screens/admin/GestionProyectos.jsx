/**
 * GestionProyectos
 *
 * Pantalla CRUD del rol admin para gestionar los proyectos ferroviarios
 * de la empresa. Clona la maqueta GestionProyectos.tsx y la amplia con los
 * campos del modelo de datos real (areaId, estado, personalAsignado) que
 * la maqueta original no editaba.
 *
 * Funcionalidades:
 *   - Tabla listado con ID, nombre, area, estado, fecha de inicio y acciones.
 *   - Busqueda en vivo por nombre o descripcion (useMemo).
 *   - Filtros avanzados (modal): estado + area.
 *   - Crear nuevo proyecto (modal con 6 campos, incluye checkboxes para
 *     asignar personal).
 *   - Editar proyecto existente (mismo modal precargado).
 *   - Eliminar con confirmacion: el usuario debe tipear el nombre exacto.
 *
 * Datos: estado local inicializado desde PROYECTOS de constants.js.
 */

import React, { useState, useMemo } from 'react';
import { ESTADOS_PROYECTO } from '../../../constants.js';
import {
  cargarProyectos,
  guardarProyectos,
  cargarAreas,
  cargarPersonal,
} from '../../../utils/storage.js';
import { siguienteIdProyecto } from '../../../utils/idGenerator.js';
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

const REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

/* ============================================================
 * Helpers
 * ============================================================ */

/** Resuelve el nombre del area desde su id. */
function nombreArea(areaId, areas) {
  if (!areaId) return '—';
  const area = areas.find(a => a.id === areaId);
  return area ? area.nombre : 'N/A';
}

/**
 * Convierte una fecha ISO (YYYY-MM-DD) a formato chileno DD/MM/YYYY.
 * Devuelve "—" si la fecha esta vacia o es invalida.
 */
function formatearFecha(iso) {
  if (!iso || typeof iso !== 'string') return '—';
  const partes = iso.split('-');
  if (partes.length !== 3) return iso;
  const [y, m, d] = partes;
  return `${d}/${m}/${y}`;
}

/* ============================================================
 * Componente principal
 * ============================================================ */

function GestionProyectos() {
  // Copia local mutable del dataset, hidratada desde localStorage. Primer
  // arranque siembra con PROYECTOS de constants.js; arranques siguientes
  // leen los cambios persistidos por sesiones anteriores.
  const [proyectos, setProyectos] = useState(() => cargarProyectos());

  // Areas y personal vigentes al montar (solo lectura). Los mutan sus
  // propias pantallas; aqui solo se usan para combos y resoluciones de
  // nombre. MainLayout desmonta al navegar, asi que se refrescan cada
  // vez que se entra a Gestion de proyectos.
  const [areas]    = useState(() => cargarAreas());
  const [personal] = useState(() => cargarPersonal());

  // Termino de busqueda libre (nombre o descripcion).
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros avanzados.
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroArea, setFiltroArea] = useState('');

  // Modales.
  const [modalCRUDAbierto, setModalCRUDAbierto] = useState(false);
  const [modalFiltroAbierto, setModalFiltroAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  // Entidad en edicion / eliminacion.
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');

  /* ----------------------------------------------------------
   * Handlers
   * ---------------------------------------------------------- */

  const abrirModalCrear = () => {
    setProyectoEditando(null);
    setModalCRUDAbierto(true);
  };

  const abrirModalEditar = (proyecto) => {
    setProyectoEditando(proyecto);
    setModalCRUDAbierto(true);
  };

  const guardarProyecto = (formData) => {
  let nuevaLista;
  if (proyectoEditando) {
    // Editar: conserva el id existente.
    nuevaLista = proyectos.map(p =>
      p.id === proyectoEditando.id ? { ...formData, id: p.id } : p
    );
  } else {
    // Crear: id nuevo desde idGenerator (no recicla).
    nuevaLista = [...proyectos, { ...formData, id: siguienteIdProyecto() }];
  }
  setProyectos(nuevaLista);
  guardarProyectos(nuevaLista);
  setModalCRUDAbierto(false);
};

  const abrirModalEliminar = (proyecto) => {
    setProyectoAEliminar(proyecto);
    setConfirmInput('');
    setModalEliminarAbierto(true);
  };

  const confirmarEliminar = () => {
  if (proyectoAEliminar && confirmInput === proyectoAEliminar.nombre) {
    const nuevaLista = proyectos.filter(p => p.id !== proyectoAEliminar.id);
    setProyectos(nuevaLista);
    guardarProyectos(nuevaLista);
    setModalEliminarAbierto(false);
    setProyectoAEliminar(null);
  }
};

  const limpiarFiltros = () => {
    setFiltroEstado('');
    setFiltroArea('');
  };

  /* ----------------------------------------------------------
   * Listado filtrado
   * ---------------------------------------------------------- */

  const proyectosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return proyectos.filter(proyecto => {
      const coincideBusqueda =
        !term ||
        proyecto.nombre.toLowerCase().includes(term) ||
        (proyecto.descripcion || '').toLowerCase().includes(term);

      const coincideEstado = !filtroEstado || proyecto.estado === filtroEstado;
      const coincideArea   = !filtroArea   || proyecto.areaId === filtroArea;

      return coincideBusqueda && coincideEstado && coincideArea;
    });
  }, [proyectos, searchTerm, filtroEstado, filtroArea]);

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <div>
      <header className="screen-header">
        <h1 className="screen-title">Gestión de proyectos</h1>
        <div className="screen-actions">
          <div className="search-wrapper">
            <IconBuscar size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {(searchTerm || filtroEstado || filtroArea) && (
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => { setSearchTerm(''); setFiltroEstado(''); setFiltroArea(''); }}
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
            Nuevo proyecto
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
                <th>Área</th>
                <th>Estado</th>
                <th>Inicio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    No hay proyectos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                proyectosFiltrados.map(proyecto => (
                  <tr key={proyecto.id}>
                    <td className="col-id">{proyecto.id}</td>
                    <td>{proyecto.nombre}</td>
                    <td>{nombreArea(proyecto.areaId, areas)}</td>
                    <td>{proyecto.estado}</td>
                    <td>{formatearFecha(proyecto.fechaInicio)}</td>
                    <td className="col-acciones">
                      <button
                        type="button"
                        className="action-btn action-btn-editar"
                        onClick={() => abrirModalEditar(proyecto)}
                      >
                        <IconEditar size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn-eliminar"
                        onClick={() => abrirModalEliminar(proyecto)}
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
        <ModalCrearEditarProyecto
          isOpen={modalCRUDAbierto}
          onClose={() => setModalCRUDAbierto(false)}
          onSave={guardarProyecto}
          proyectoToEdit={proyectoEditando}
          areas={areas}
          estados={ESTADOS_PROYECTO}
          personal={personal}
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
              onClick={limpiarFiltros}
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
        <div className="form-grid form-grid-2col">
          <div>
            <label htmlFor="filtro-estado" className="form-label">
              Estado
            </label>
            <select
              id="filtro-estado"
              className="form-select"
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {ESTADOS_PROYECTO.map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

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
              disabled={confirmInput !== (proyectoAEliminar?.nombre || '')}
            >
              Eliminar definitivamente
            </button>
          </>
        }
      >
        <p className="confirm-text">
          Esta acción no se puede deshacer. Para confirmar, escriba el nombre
          exacto: <strong>{proyectoAEliminar?.nombre}</strong>
        </p>
        <input
          type="text"
          className="form-input"
          value={confirmInput}
          onChange={e => setConfirmInput(e.target.value)}
          placeholder="Tipee el nombre del proyecto"
        />
      </Modal>
    </div>
  );
}

/* ============================================================
 * Sub-componente: modal de creacion / edicion
 * ============================================================ */

function ModalCrearEditarProyecto({
  isOpen, onClose, onSave, proyectoToEdit, areas, estados, personal,
}) {
  const [formData, setFormData] = useState({
    nombre:           proyectoToEdit?.nombre           ?? '',
    descripcion:      proyectoToEdit?.descripcion      ?? '',
    fechaInicio:      proyectoToEdit?.fechaInicio      ?? '',
    areaId:           proyectoToEdit?.areaId           ?? '',
    estado:           proyectoToEdit?.estado           ?? 'Planificado',
    personalAsignado: proyectoToEdit?.personalAsignado ?? [],
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => {
        const nuevo = { ...prev };
        delete nuevo[name];
        return nuevo;
      });
    }
  };

  const togglePersonal = (personalId) => {
    setFormData(prev => ({
      ...prev,
      personalAsignado: prev.personalAsignado.includes(personalId)
        ? prev.personalAsignado.filter(id => id !== personalId)
        : [...prev.personalAsignado, personalId],
    }));
    if (errores.personalAsignado) {
      setErrores(prev => {
        const nuevo = { ...prev };
        delete nuevo.personalAsignado;
        return nuevo;
      });
    }
  };

  /**
   * Reglas:
   *   - nombre: obligatorio, minimo 3 caracteres
   *   - fechaInicio: obligatoria, formato ISO completo (dia, mes, ano)
   *   - estado: obligatorio
   *   - personalAsignado: minimo 1 persona
   *   - descripcion y areaId son opcionales
   */
  const validar = () => {
    const err = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) {
      err.nombre = 'El nombre del proyecto es obligatorio (minimo 3 caracteres).';
    }
    if (!formData.fechaInicio || !REGEX_FECHA_ISO.test(formData.fechaInicio)) {
      err.fechaInicio = 'La fecha de inicio es obligatoria (dia, mes y ano).';
    }
    if (!formData.estado) {
      err.estado = 'El estado es obligatorio.';
    }
    if (!formData.personalAsignado || formData.personalAsignado.length === 0) {
      err.personalAsignado = 'Debe asignar al menos una persona al proyecto.';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    const datosLimpios = {
      ...formData,
      areaId: formData.areaId === '' ? null : formData.areaId,
    };
    onSave(datosLimpios);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proyectoToEdit ? 'Editar proyecto' : 'Crear nuevo proyecto'}
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
          <label htmlFor="f-pry-nombre" className="form-label">Nombre del proyecto *</label>
          <input id="f-pry-nombre" name="nombre" className="form-input"
            value={formData.nombre} onChange={handleChange}
            placeholder="Ej: Reposición de durmientes Estación Alameda" />
          {errores.nombre && <p style={STYLE_ERROR_MSG}>{errores.nombre}</p>}
        </div>

        <div className="form-field-full">
          <label htmlFor="f-pry-descripcion" className="form-label">Descripción</label>
          <textarea id="f-pry-descripcion" name="descripcion" className="form-textarea" rows={3}
            value={formData.descripcion} onChange={handleChange}
            placeholder="Descripción técnica del alcance del proyecto." />
        </div>

        <div>
          <label htmlFor="f-pry-fecha" className="form-label">Fecha de inicio *</label>
          <input id="f-pry-fecha" name="fechaInicio" type="date" className="form-input"
            value={formData.fechaInicio} onChange={handleChange} />
          {errores.fechaInicio && <p style={STYLE_ERROR_MSG}>{errores.fechaInicio}</p>}
        </div>

        <div>
          <label htmlFor="f-pry-estado" className="form-label">Estado *</label>
          <select id="f-pry-estado" name="estado" className="form-select"
            value={formData.estado} onChange={handleChange}>
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {errores.estado && <p style={STYLE_ERROR_MSG}>{errores.estado}</p>}
        </div>

        <div className="form-field-full">
          <label htmlFor="f-pry-area" className="form-label">Área técnica responsable</label>
          <select id="f-pry-area" name="areaId" className="form-select"
            value={formData.areaId ?? ''} onChange={handleChange}>
            <option value="">Sin área asignada</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </div>

        <div className="form-field-full">
          <label className="form-label">
            Personal asignado * ({formData.personalAsignado.length} seleccionados)
          </label>
          <div className="checkbox-list">
            {personal.map(persona => (
              <label key={persona.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.personalAsignado.includes(persona.id)}
                  onChange={() => togglePersonal(persona.id)}
                />
                <span>{persona.nombre} — {persona.cargo}</span>
              </label>
            ))}
          </div>
          {errores.personalAsignado && <p style={STYLE_ERROR_MSG}>{errores.personalAsignado}</p>}
        </div>
      </div>
    </Modal>
  );
}

export default GestionProyectos;