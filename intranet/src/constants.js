// constants.js
// Fuente unica de datos mock para la intranet de Sanchez e Hijos.
// Centraliza credenciales, areas tecnicas, operarios y proyectos
// ferroviarios para que todas las pantallas del Sprint 3 consuman el
// mismo set. La sesion vive solo en memoria; no hay persistencia.

/**
 * Credenciales mock para el LoginScreen.
 * Mapean usuario -> rol. Sin hash, sin backend; solo para demo.
 */
export const CREDENCIALES_MOCK = [
  { usuario: 'admin',    clave: 'admin',    rol: 'admin'    },
  { usuario: 'operario', clave: 'operario', rol: 'operario' },
];

/**
 * Estados posibles de un proyecto ferroviario.
 * Se reutilizan en filtros, formularios y graficos del dashboard.
 */
export const ESTADOS_PROYECTO = ['Planificado', 'En curso', 'Pausado', 'Finalizado'];

/**
 * Areas tecnicas de la empresa (5).
 * `responsableId` apunta a un operario de OPERARIOS.
 */
export const AREAS_TECNICAS = [
  { id: 'AREA-OC', nombre: 'Obras Civiles',        responsableId: 'SH-002' },
  { id: 'AREA-CA', nombre: 'Control Automático',   responsableId: 'SH-004' },
  { id: 'AREA-MC', nombre: 'Máquinas de Cambio',   responsableId: 'SH-006' },
  { id: 'AREA-BA', nombre: 'Barreras Automáticas', responsableId: 'SH-007' },
  { id: 'AREA-TM', nombre: 'Telemetría',           responsableId: 'SH-008' },
];

/**
 * Operarios de Sanchez e Hijos (8 registros).
 * SH-001 representa al rol admin del login mock (Administrador de Contrato);
 * el resto representa al rol operario. `areaId` es null para SH-001 porque
 * la administracion de contrato no se asigna a una unica area tecnica.
 */
export const OPERARIOS = [
  { id: 'SH-001', nombre: 'Carlos Pérez Soto',      areaId: null,      cargo: 'Administrador de Contrato',        fechaIngreso: '2018-03-15' },
  { id: 'SH-002', nombre: 'María Fernández Rojas',  areaId: 'AREA-OC', cargo: 'Ingeniera de Proyecto',            fechaIngreso: '2019-07-01' },
  { id: 'SH-003', nombre: 'Jorge Muñoz Lagos',      areaId: 'AREA-OC', cargo: 'Constructor Civil',                fechaIngreso: '2020-01-20' },
  { id: 'SH-004', nombre: 'Andrea Salinas Vidal',   areaId: 'AREA-CA', cargo: 'Jefe de Faena P5.1',               fechaIngreso: '2019-11-05' },
  { id: 'SH-005', nombre: 'Diego Torres Maldonado', areaId: 'AREA-BA', cargo: 'Técnico Motorización de Barreras', fechaIngreso: '2021-04-12' },
  { id: 'SH-006', nombre: 'Pablo Henríquez Bravo',  areaId: 'AREA-MC', cargo: 'Técnico Mecánico',                 fechaIngreso: '2020-09-08' },
  { id: 'SH-007', nombre: 'Camila Reyes Acuña',     areaId: 'AREA-BA', cargo: 'Técnica Eléctrica',                fechaIngreso: '2022-02-14' },
  { id: 'SH-008', nombre: 'Rodrigo Vega Espinoza',  areaId: 'AREA-TM', cargo: 'Jefe Telemetría',                  fechaIngreso: '2021-08-30' },
];

/**
 * Proyectos ferroviarios (8 registros).
 * `areaId` apunta a AREAS_TECNICAS; `operariosAsignados` lista ids de OPERARIOS.
 */
export const PROYECTOS = [
  { id: 'PRY-001', nombre: 'Reposición de durmientes Estación Alameda',  areaId: 'AREA-OC', estado: 'En curso',    operariosAsignados: ['SH-002', 'SH-003'] },
  { id: 'PRY-002', nombre: 'Reparación enclavamiento Tramo Norte',       areaId: 'AREA-CA', estado: 'En curso',    operariosAsignados: ['SH-004', 'SH-005'] },
  { id: 'PRY-003', nombre: 'Mantención Máquina de Cambio Km 42',         areaId: 'AREA-MC', estado: 'Finalizado',  operariosAsignados: ['SH-006'] },
  { id: 'PRY-004', nombre: 'Instalación barrera automática San Bernardo', areaId: 'AREA-BA', estado: 'Planificado', operariosAsignados: ['SH-007'] },
  { id: 'PRY-005', nombre: 'Despliegue sensores telemetría Línea 5',     areaId: 'AREA-TM', estado: 'En curso',    operariosAsignados: ['SH-008'] },
  { id: 'PRY-006', nombre: 'Refuerzo terraplén sector Buin',             areaId: 'AREA-OC', estado: 'Pausado',     operariosAsignados: ['SH-003'] },
  { id: 'PRY-007', nombre: 'Actualización software de control Tramo Sur', areaId: 'AREA-CA', estado: 'Planificado', operariosAsignados: ['SH-005'] },
  { id: 'PRY-008', nombre: 'Calibración telemetría Patio Maestranza',    areaId: 'AREA-TM', estado: 'Finalizado',  operariosAsignados: ['SH-008'] },
];