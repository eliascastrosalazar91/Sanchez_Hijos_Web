/**
 * idGenerator
 *
 * Generador centralizado de IDs unicos para Personal, Areas Tecnicas
 * y Proyectos. Garantiza que los codigos NUNCA se reciclen, incluso
 * cuando se elimina un registro o se recarga la pagina.
 *
 * Para areas se usa un Set de codigos historicamente usados (no un
 * contador) porque el patron AREA-XX es nominal (2 letras del nombre).
 * Si el codigo base ya fue usado, se agrega sufijo numerico.
 */

import { PERSONAL, AREAS_TECNICAS, PROYECTOS } from '../constants.js';

const STORAGE_KEYS = {
  PERSONAL_COUNTER: 'sanchez_counter_personal',
  PROYECTO_COUNTER: 'sanchez_counter_proyecto',
  AREA_USED_IDS:    'sanchez_used_area_ids',
};

/* ============================================================
 * Inicializadores (lazy, solo en primera ejecucion)
 * ============================================================ */

function obtenerContadorPersonal() {
  const existente = localStorage.getItem(STORAGE_KEYS.PERSONAL_COUNTER);
  if (existente !== null) return Number(existente);

  const max = PERSONAL.reduce((acc, p) => {
    const n = parseInt(String(p.id).replace('SH-', ''), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  localStorage.setItem(STORAGE_KEYS.PERSONAL_COUNTER, String(max));
  return max;
}

function obtenerContadorProyecto() {
  const existente = localStorage.getItem(STORAGE_KEYS.PROYECTO_COUNTER);
  if (existente !== null) return Number(existente);

  const max = PROYECTOS.reduce((acc, p) => {
    const n = parseInt(String(p.id).replace('PRY-', ''), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  localStorage.setItem(STORAGE_KEYS.PROYECTO_COUNTER, String(max));
  return max;
}

function obtenerAreaIdsUsados() {
  const existente = localStorage.getItem(STORAGE_KEYS.AREA_USED_IDS);
  if (existente !== null) return new Set(JSON.parse(existente));

  const ids = AREAS_TECNICAS.map(a => a.id);
  localStorage.setItem(STORAGE_KEYS.AREA_USED_IDS, JSON.stringify(ids));
  return new Set(ids);
}

/* ============================================================
 * API publica: generadores
 * ============================================================ */

/** Genera el siguiente ID de Personal con patron SH-NNN, sin reciclar. */
export function siguienteIdPersonal() {
  const actual = obtenerContadorPersonal();
  const proximo = actual + 1;
  localStorage.setItem(STORAGE_KEYS.PERSONAL_COUNTER, String(proximo));
  return `SH-${String(proximo).padStart(3, '0')}`;
}

/** Genera el siguiente ID de Proyecto con patron PRY-NNN, sin reciclar. */
export function siguienteIdProyecto() {
  const actual = obtenerContadorProyecto();
  const proximo = actual + 1;
  localStorage.setItem(STORAGE_KEYS.PROYECTO_COUNTER, String(proximo));
  return `PRY-${String(proximo).padStart(3, '0')}`;
}

/**
 * Genera el siguiente ID de Area con patron AREA-XX donde XX son las
 * dos primeras letras del nombre (normalizadas: sin tildes, mayusculas).
 * Si el codigo base ya fue usado historicamente, agrega sufijo numerico.
 *
 * Ejemplos:
 *   "Vias" -> AREA-VI (primera vez)
 *   "Vias" -> AREA-VI2 (segunda vez, aunque la primera area fue borrada)
 *   "Vialidad" -> AREA-VI3 (el codigo base sigue tomado)
 */
export function siguienteIdArea(nombre) {
  const usados = obtenerAreaIdsUsados();

  // Normaliza: sin tildes, mayusculas, solo letras.
  const normalizado = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase();

  const prefijo = normalizado.slice(0, 2) || 'XX';
  const base = `AREA-${prefijo}`;

  let candidato = base;
  let sufijo = 2;
  while (usados.has(candidato)) {
    candidato = `${base}${sufijo}`;
    sufijo++;
  }

  usados.add(candidato);
  localStorage.setItem(
    STORAGE_KEYS.AREA_USED_IDS,
    JSON.stringify(Array.from(usados))
  );
  return candidato;
}

/**
 * Utilidad de debug. Resetea los contadores a su valor inicial calculado
 * desde constants.js. 
 * Uso desde consola del navegador:
 *   import('./src/utils/idGenerator.js').then(m => m.resetCounters())
 */
export function resetCounters() {
  localStorage.removeItem(STORAGE_KEYS.PERSONAL_COUNTER);
  localStorage.removeItem(STORAGE_KEYS.PROYECTO_COUNTER);
  localStorage.removeItem(STORAGE_KEYS.AREA_USED_IDS);
}