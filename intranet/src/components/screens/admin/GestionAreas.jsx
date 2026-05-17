/**
 * GestionAreas
 *
 * Pantalla CRUD del rol admin para gestionar las areas tecnicas de la
 * empresa. Clona la maqueta GestionDepartamentos.tsx adaptada al dominio
 * Sanchez e Hijos (terminologia "area tecnica" en lugar de "departamento",
 * campo `responsableId` en lugar de `gerente`).
 *
 * Funcionalidades:
 *   - Tabla listado con ID, nombre, responsable y acciones.
 *   - Busqueda en vivo por nombre del area.
 *   - Filtro avanzado por responsable (modal): "Todos" | 8 personas
 *     | "Sin responsable asignado".
 *   - Crear nueva area (modal: nombre + select de responsable).
 *   - Editar area existente (mismo modal precargado).
 *   - Eliminar con confirmacion: el usuario debe tipear el nombre exacto.
 *
 * Datos: estado local inicializado desde AREAS_TECNICAS de constants.js.
 *
 * Limitacion conocida del scope academico (registrada en Devlog):
 *   Al eliminar un area no se desasigna automaticamente al personal ni a
 *   los proyectos que la referencian. La integridad referencial entre
 *   AREAS_TECNICAS, PERSONAL y PROYECTOS se gestionara cuando el sistema
 *   evolucione a un backend real.
 */

import React, { useState, useMemo } from 'react';
import {
  cargarAreas,
  guardarAreas,
  cargarPersonal,
} from '../../../utils/storage.js';
import { siguienteIdArea } from '../../../utils/idGenerator.js';
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

/**
 * Valida nombre de area:
 *   - Minimo 3 caracteres (sin contar espacios laterales)
 *   - Debe iniciar con letra (mayuscula, minuscula, o vocal acentuada)
 *   - No puede iniciar con espacio, numero o caracter especial
 *   - Despues del primer caracter se permiten letras, numeros y espacios
 */
const REGEX_NOMBRE_AREA = /^[A-Za-zÁÉÍÓÚáéíóúÑñ][A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]{2,}$/;

/* ============================================================
 * Helpers
 * ============================================================ */

/** Resuelve el nombre completo de una persona desde su id. */
function nombrePersonal(personalId, personas) {
  if (!personalId) return '—';
  const persona = personas.find(p => p.id === personalId);
  return persona ? persona.nombre : 'N/A';
}


/* ============================================================
 * Componente principal
 * ============================================================ */

function GestionAreas() {
  // Copia local mutable del dataset, hidratada desde localStorage. Primer
  // arranque siembra con AREAS_TECNICAS de constants.js; arranques siguientes
  // leen los cambios persistidos por sesiones anteriores.
  const [areas, setAreas] = useState(() => cargarAreas());

  // Personal vigente al montar (solo lectura). Lo muta GestionPersonal.
  // Se refresca cada vez que se entra a esta pantalla porque MainLayout
  // desmonta los componentes al navegar.
  const [personal] = useState(() => cargarPersonal());

  // Termino de busqueda libre (nombre del area).
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro avanzado: id de responsable, '' = sin filtro,
  // 'SIN_RESPONSABLE' = solo areas sin responsable.
  const [filtroResponsable, setFiltroResponsable] = useState('');

  // Modales.
  const [modalCRUDAbierto, setModalCRUDAbierto] = useState(false);
  const [modalFiltroAbierto, setModalFiltroAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  // Entidad en edicion / eliminacion.
  const [areaEditando, setAreaEditando] = useState(null);
  const [areaAEliminar, setAreaAEliminar] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');

  /* ----------------------------------------------------------
   * Handlers
   * ---------------------------------------------------------- */

  const abrirModalCrear = () => {
    setAreaEditando(null);
    setModalCRUDAbierto(true);
  };

  const abrirModalEditar = (area) => {
    setAreaEditando(area);
    setModalCRUDAbierto(true);
  };

  const guardarArea = (formData) => {
  let nuevaLista;
  if (areaEditando) {
    // Editar: mantiene el id existente.
    nuevaLista = areas.map(a =>
      a.id === areaEditando.id ? { ...formData, id: a.id } : a
    );
  } else {
    // Crear: genera id nuevo desde el nombre.
    const nuevoId = siguienteIdArea(formData.nombre);
    nuevaLista = [...areas, { ...formData, id: nuevoId }];
  }
  setAreas(nuevaLista);
  guardarAreas(nuevaLista);
  setModalCRUDAbierto(false);
};

  const abrirModalEliminar = (area) => {
    setAreaAEliminar(area);
    setConfirmInput('');
    setModalEliminarAbierto(true);
  };

  const confirmarEliminar = () => {
  if (areaAEliminar && confirmInput === areaAEliminar.nombre) {
    const nuevaLista = areas.filter(a => a.id !== areaAEliminar.id);
    setAreas(nuevaLista);
    guardarAreas(nuevaLista);
    setModalEliminarAbierto(false);
    setAreaAEliminar(null);
  }
};

  /* ----------------------------------------------------------
   * Listado filtrado
   * ---------------------------------------------------------- */

  const areasFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return areas.filter(area => {
      const coincideBusqueda =
        !term || area.nombre.toLowerCase().includes(term);

      let coincideResponsable = true;
      if (filtroResponsable === 'SIN_RESPONSABLE') {
        coincideResponsable = !area.responsableId;
      } else if (filtroResponsable) {
        coincideResponsable = area.responsableId === filtroResponsable;
      }

      return coincideBusqueda && coincideResponsable;
    });
  }, [areas, searchTerm, filtroResponsable]);

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <div>
      <header className="screen-header">
        <h1 className="screen-title">Gestión de áreas técnicas</h1>
        <div className="screen-actions">
          <div className="search-wrapper">
            <IconBuscar size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre de área..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {(searchTerm || filtroResponsable) && (
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => { setSearchTerm(''); setFiltroResponsable(''); }}
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
            Nueva área
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
                <th>Responsable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-empty">
                    No hay áreas que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                areasFiltradas.map(area => (
                  <tr key={area.id}>
                    <td className="col-id">{area.id}</td>
                    <td>{area.nombre}</td>
                    <td>{nombrePersonal(area.responsableId, personal)}</td>
                    <td className="col-acciones">
                      <button
                        type="button"
                        className="action-btn action-btn-editar"
                        onClick={() => abrirModalEditar(area)}
                      >
                        <IconEditar size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn-eliminar"
                        onClick={() => abrirModalEliminar(area)}
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
        <ModalCrearEditarArea
          isOpen={modalCRUDAbierto}
          onClose={() => setModalCRUDAbierto(false)}
          onSave={guardarArea}
          areaToEdit={areaEditando}
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
              onClick={() => setFiltroResponsable('')}
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
            <label htmlFor="filtro-resp" className="form-label">
              Responsable del área
            </label>
            <select
              id="filtro-resp"
              className="form-select"
              value={filtroResponsable}
              onChange={e => setFiltroResponsable(e.target.value)}
            >
              <option value="">Todos los responsables</option>
              <option value="SIN_RESPONSABLE">Sin responsable asignado</option>
              {personal.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre}
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
              disabled={confirmInput !== (areaAEliminar?.nombre || '')}
            >
              Eliminar definitivamente
            </button>
          </>
        }
      >
        <p className="confirm-text">
          Esta acción no se puede deshacer. Para confirmar, escriba el nombre
          exacto: <strong>{areaAEliminar?.nombre}</strong>
        </p>
        <input
          type="text"
          className="form-input"
          value={confirmInput}
          onChange={e => setConfirmInput(e.target.value)}
          placeholder="Tipee el nombre del área"
        />
      </Modal>
    </div>
  );
}

/* ============================================================
 * Sub-componente: modal de creacion / edicion
 * ============================================================ */

function ModalCrearEditarArea({ isOpen, onClose, onSave, areaToEdit, personal }) {
  const [formData, setFormData] = useState({
    nombre:        areaToEdit?.nombre        ?? '',
    responsableId: areaToEdit?.responsableId ?? '',
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

  const validar = () => {
    const err = {};
    const nombre = formData.nombre;

    if (!nombre || nombre.length === 0) {
      err.nombre = 'El nombre del area es obligatorio.';
    } else if (nombre !== nombre.trimStart()) {
      err.nombre = 'El nombre no puede iniciar con espacios.';
    } else if (/^[0-9]/.test(nombre)) {
      err.nombre = 'El nombre no puede iniciar con un numero.';
    } else if (/^[^A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(nombre)) {
      err.nombre = 'El nombre debe iniciar con una letra.';
    } else if (nombre.trim().length < 3) {
      err.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!REGEX_NOMBRE_AREA.test(nombre.trim())) {
      err.nombre = 'El nombre solo puede contener letras, numeros y espacios.';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    const datosLimpios = {
      ...formData,
      nombre: formData.nombre.trim(),
      responsableId: formData.responsableId === '' ? null : formData.responsableId,
    };
    onSave(datosLimpios);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={areaToEdit ? 'Editar área' : 'Crear nueva área'}
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
      <div className="form-grid">
        <div className="form-field-full">
          <label htmlFor="f-area-nombre" className="form-label">Nombre del área *</label>
          <input
            id="f-area-nombre"
            name="nombre"
            className="form-input"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Vías y Estructuras"
          />
          {errores.nombre && <p style={STYLE_ERROR_MSG}>{errores.nombre}</p>}
        </div>

        <div className="form-field-full">
          <label htmlFor="f-area-resp" className="form-label">Responsable del área</label>
          <select
            id="f-area-resp"
            name="responsableId"
            className="form-select"
            value={formData.responsableId ?? ''}
            onChange={handleChange}
          >
            <option value="">Sin responsable asignado</option>
            {personal.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} — {p.cargo}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

export default GestionAreas;