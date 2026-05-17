/**
 * storage.js
 *
 * Capa de persistencia local para las colecciones mutables de la intranet.
 * Tarea 24.bis: estado actual (Tarea 24) tiene contadores de IDs persistidos
 * en localStorage via utils/idGenerator.js, pero los registros mismos vivian
 * solo en el estado de cada pantalla y se perdian al refrescar. Este modulo
 * cierra esa brecha.
 *
 * Modelo:
 *   - Primer arranque (clave ausente en localStorage): se siembra desde
 *     constants.js, se guarda en localStorage y se devuelve la semilla.
 *   - Arranques siguientes: se lee directo desde localStorage.
 *   - Datos corruptos (JSON invalido o no-array): re-siembra desde constants
 *     y advierte en consola.
 *
 * Las semillas en constants.js son inmutables desde la UI: cualquier
 * creacion / edicion / eliminacion via interfaz persiste; los registros
 * "por defecto" solo se modifican editando constants.js y limpiando
 * localStorage manualmente.
 *
 * Las funciones cargar* / guardar* son simetricas. La intranet trabaja con
 * 4 colecciones:
 *   - personal           (semilla: PERSONAL)
 *   - areas tecnicas     (semilla: AREAS_TECNICAS)
 *   - proyectos          (semilla: PROYECTOS)
 *   - registros de horas (semilla: REGISTROS_HORAS)  <- usado en Tarea 25
 */

import {
  PERSONAL,
  AREAS_TECNICAS,
  PROYECTOS,
  REGISTROS_HORAS,
} from '../constants.js';

/* ============================================================
 * Claves de localStorage
 * Prefijo "sanchez_" para evitar colisiones si en el futuro se monta
 * mas de una app en el mismo dominio.
 * ============================================================ */

const KEY_PERSONAL          = 'sanchez_personal';
const KEY_AREAS             = 'sanchez_areas';
const KEY_PROYECTOS         = 'sanchez_proyectos';
const KEY_REGISTROS_HORAS   = 'sanchez_registros_horas';

/* ============================================================
 * Helpers privados (genericos)
 * ============================================================ */

/**
 * Carga una coleccion desde localStorage. Si la clave no existe (primer
 * arranque) o el contenido esta corrupto, siembra con la semilla y la
 * devuelve.
 *
 * @param {string} clave - clave de localStorage
 * @param {Array}  semilla - dataset inicial proveniente de constants.js
 * @returns {Array}
 */
function cargar(clave, semilla) {
  try {
    const raw = localStorage.getItem(clave);
    if (raw === null) {
      // Primer arranque: siembra y persiste.
      localStorage.setItem(clave, JSON.stringify(semilla));
      return semilla;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      // Contenido corrupto: re-siembra.
      console.warn(
        `[storage] El contenido de "${clave}" no es un array. Re-sembrando desde constants.js.`
      );
      localStorage.setItem(clave, JSON.stringify(semilla));
      return semilla;
    }
    return parsed;
  } catch (err) {
    // JSON.parse fallo o localStorage no disponible (modo privado, cuota
    // llena, etc.). Devolvemos la semilla en memoria para no romper la UI.
    console.error(`[storage] Error leyendo "${clave}":`, err);
    return semilla;
  }
}

/**
 * Persiste una coleccion en localStorage.
 *
 * @param {string} clave
 * @param {Array}  lista
 */
function guardar(clave, lista) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch (err) {
    console.error(`[storage] Error guardando "${clave}":`, err);
  }
}

/* ============================================================
 * API publica por coleccion
 * ============================================================ */

export function cargarPersonal()         { return cargar(KEY_PERSONAL, PERSONAL); }
export function guardarPersonal(lista)   { guardar(KEY_PERSONAL, lista); }

export function cargarAreas()            { return cargar(KEY_AREAS, AREAS_TECNICAS); }
export function guardarAreas(lista)      { guardar(KEY_AREAS, lista); }

export function cargarProyectos()        { return cargar(KEY_PROYECTOS, PROYECTOS); }
export function guardarProyectos(lista)  { guardar(KEY_PROYECTOS, lista); }

export function cargarRegistrosHoras()        { return cargar(KEY_REGISTROS_HORAS, REGISTROS_HORAS); }
export function guardarRegistrosHoras(lista)  { guardar(KEY_REGISTROS_HORAS, lista); }