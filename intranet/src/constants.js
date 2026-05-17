// constants.js
// Fuente unica de datos mock para la intranet de Sanchez e Hijos.
// Centraliza credenciales, areas tecnicas, personal, proyectos
// ferroviarios y registros de horas para que todas las pantallas del
// Sprint 3 consuman el mismo set. La sesion vive solo en memoria; no hay
// persistencia.
//
// Tarea 24: se ampliaron los campos de PERSONAL (email, direccion,
// telefono, salario) y PROYECTOS (descripcion, fechaInicio) para clonar
// la maqueta de Google AI Studio sin recortes, y se agrego el dataset
// REGISTROS_HORAS (30 dias x 8 personas) para alimentar el chart de
// horas registradas del DashboardAdmin y el informe "Horas por Empleado".

/**
 * Credenciales mock para el LoginScreen.
 * Mapean usuario -> rol. Sin hash, sin backend; solo para demo.
 */
export const CREDENCIALES_MOCK = [
  { usuario: 'admin',    clave: 'admin',    rol: 'admin'    },
  { usuario: 'personal', clave: 'personal', rol: 'personal' },
];

/**
 * Id de PERSONAL al que corresponde el login mock `personal/personal`.
 * Se centraliza aqui para que las pantallas del rol personal
 * (DashboardPersonal, MisProyectos, MiPerfil) resuelvan al usuario actual
 * sin necesidad de propagarlo via props desde App.jsx / LoginScreen.
 *
 * Tarea 25: se elige SH-008 (Rodrigo Vega Espinoza, Jefe Telemetría)
 * porque tiene 2 proyectos asignados (PRY-005 en curso y PRY-008
 * finalizado), lo que produce un pie chart visualmente significativo
 * en el DashboardPersonal.
 */
export const USUARIO_PERSONAL_MOCK_ID = 'SH-008';


/**
 * Estados posibles de un proyecto ferroviario.
 * Se reutilizan en filtros, formularios y graficos del dashboard.
 */
export const ESTADOS_PROYECTO = ['Planificado', 'En curso', 'Pausado', 'Finalizado'];

/**
 * Areas tecnicas de la empresa (5).
 * `responsableId` apunta a un miembro del personal de PERSONAL.
 */
export const AREAS_TECNICAS = [
  { id: 'AREA-OC', nombre: 'Obras Civiles',        responsableId: 'SH-002' },
  { id: 'AREA-CA', nombre: 'Control Automático',   responsableId: 'SH-004' },
  { id: 'AREA-MC', nombre: 'Máquinas de Cambio',   responsableId: 'SH-006' },
  { id: 'AREA-BA', nombre: 'Barreras Automáticas', responsableId: 'SH-007' },
  { id: 'AREA-TM', nombre: 'Telemetría',           responsableId: 'SH-008' },
];

/**
 * Personal de Sanchez e Hijos (8 registros).
 * SH-001 representa al rol admin del login mock (Administrador de Contrato);
 * el resto representa al rol personal. `areaId` es null para SH-001 porque
 * la administracion de contrato no se asigna a una unica area tecnica.
 *
 * Campos:
 *   id            : codigo interno SH-NNN.
 *   nombre        : nombre completo.
 *   email         : correo corporativo @sanchezehijos.cl.
 *   direccion     : direccion particular en Santiago.
 *   telefono      : telefono movil chileno.
 *   fechaIngreso  : ISO YYYY-MM-DD, fecha de ingreso a la empresa.
 *   salario       : sueldo mensual bruto en CLP.
 *   cargo         : cargo o rol tecnico.
 *   areaId        : id de AREAS_TECNICAS (o null para administracion).
 */
export const PERSONAL = [
  { id: 'SH-001', nombre: 'Carlos Pérez Soto',      email: 'carlos.perez@sanchezehijos.cl',     direccion: 'Av. Vicuña Mackenna 4321, Macul',          telefono: '+56 9 8123 4567', fechaIngreso: '2018-03-15', salario: 2500000, cargo: 'Administrador de Contrato',        areaId: null      },
  { id: 'SH-002', nombre: 'María Fernández Rojas',  email: 'maria.fernandez@sanchezehijos.cl',  direccion: 'Av. Pedro Aguirre Cerda 1850, San Miguel', telefono: '+56 9 7234 5678', fechaIngreso: '2019-07-01', salario: 2200000, cargo: 'Ingeniera de Proyecto',            areaId: 'AREA-OC' },
  { id: 'SH-003', nombre: 'Jorge Muñoz Lagos',      email: 'jorge.munoz@sanchezehijos.cl',      direccion: 'Calle Maipú 215, Estación Central',       telefono: '+56 9 6345 6789', fechaIngreso: '2020-01-20', salario: 1700000, cargo: 'Constructor Civil',                areaId: 'AREA-OC' },
  { id: 'SH-004', nombre: 'Andrea Salinas Vidal',   email: 'andrea.salinas@sanchezehijos.cl',   direccion: 'Av. Departamental 2210, La Florida',      telefono: '+56 9 5456 7890', fechaIngreso: '2019-11-05', salario: 1900000, cargo: 'Jefe de Faena P5.1',               areaId: 'AREA-CA' },
  { id: 'SH-005', nombre: 'Diego Torres Maldonado', email: 'diego.torres@sanchezehijos.cl',     direccion: 'Av. Recoleta 1880, Recoleta',             telefono: '+56 9 4567 8901', fechaIngreso: '2021-04-12', salario: 1200000, cargo: 'Técnico Motorización de Barreras', areaId: 'AREA-BA' },
  { id: 'SH-006', nombre: 'Pablo Henríquez Bravo',  email: 'pablo.henriquez@sanchezehijos.cl',  direccion: 'Av. Las Industrias 540, San Bernardo',    telefono: '+56 9 3678 9012', fechaIngreso: '2020-09-08', salario: 1150000, cargo: 'Técnico Mecánico',                 areaId: 'AREA-MC' },
  { id: 'SH-007', nombre: 'Camila Reyes Acuña',     email: 'camila.reyes@sanchezehijos.cl',     direccion: 'Av. Macul 3950, Macul',                   telefono: '+56 9 2789 0123', fechaIngreso: '2022-02-14', salario: 1180000, cargo: 'Técnico Eléctrico',                areaId: 'AREA-BA' },
  { id: 'SH-008', nombre: 'Rodrigo Vega Espinoza',  email: 'rodrigo.vega@sanchezehijos.cl',     direccion: 'Av. Independencia 2640, Independencia',   telefono: '+56 9 1890 1234', fechaIngreso: '2021-08-30', salario: 1950000, cargo: 'Jefe Telemetría',                  areaId: 'AREA-TM' },
];

/**
 * Proyectos ferroviarios (8 registros).
 *
 * Campos:
 *   id               : codigo interno PRY-NNN.
 *   nombre           : nombre corto del proyecto.
 *   descripcion      : descripcion tecnica del alcance.
 *   fechaInicio      : ISO YYYY-MM-DD, fecha de kick-off del proyecto.
 *   areaId           : id de AREAS_TECNICAS responsable.
 *   estado           : uno de ESTADOS_PROYECTO.
 *   personalAsignado : array de ids de PERSONAL asignados al proyecto.
 */
export const PROYECTOS = [
  { id: 'PRY-001', nombre: 'Reposición de durmientes Estación Alameda',   descripcion: 'Reemplazo de 480 durmientes de madera por durmientes de hormigón en andenes 3 y 4 de la Estación Central, con cambio parcial de balasto.', fechaInicio: '2026-02-10', areaId: 'AREA-OC', estado: 'En curso',    personalAsignado: ['SH-002', 'SH-003'] },
  { id: 'PRY-002', nombre: 'Reparación enclavamiento Tramo Norte',         descripcion: 'Diagnóstico y reparación de fallas intermitentes en el sistema de enclavamiento eléctrico del tramo Quinta Normal-Yungay.',           fechaInicio: '2026-03-01', areaId: 'AREA-CA', estado: 'En curso',    personalAsignado: ['SH-004', 'SH-005'] },
  { id: 'PRY-003', nombre: 'Mantención Máquina de Cambio Km 42',           descripcion: 'Mantenimiento preventivo mayor de la máquina de cambio MC-42, incluye reemplazo de motor eléctrico y calibración mecánica.',          fechaInicio: '2025-11-15', areaId: 'AREA-MC', estado: 'Finalizado',  personalAsignado: ['SH-006'] },
  { id: 'PRY-004', nombre: 'Instalación barrera automática San Bernardo',  descripcion: 'Instalación de barreras automáticas tipo SBL-3000 con sistema de detección de vehículos y luces de advertencia en cruce ferroviario.', fechaInicio: '2026-05-20', areaId: 'AREA-BA', estado: 'Planificado', personalAsignado: ['SH-007'] },
  { id: 'PRY-005', nombre: 'Despliegue sensores telemetría Línea 5',       descripcion: 'Instalación de 24 sensores de telemetría inalámbrica para monitoreo continuo de vibración y temperatura en rieles de la Línea 5.',     fechaInicio: '2026-01-08', areaId: 'AREA-TM', estado: 'En curso',    personalAsignado: ['SH-008'] },
  { id: 'PRY-006', nombre: 'Refuerzo terraplén sector Buin',               descripcion: 'Obra civil de refuerzo de terraplén con geotextil y muro de contención en kilómetro 34 sector Buin, en pausa por permisos.',          fechaInicio: '2025-09-22', areaId: 'AREA-OC', estado: 'Pausado',     personalAsignado: ['SH-003'] },
  { id: 'PRY-007', nombre: 'Actualización software de control Tramo Sur',  descripcion: 'Migración del firmware de los controladores PLC del Tramo Sur a la versión 4.2, con validación en banco de pruebas previa.',         fechaInicio: '2026-06-01', areaId: 'AREA-CA', estado: 'Planificado', personalAsignado: ['SH-005'] },
  { id: 'PRY-008', nombre: 'Calibración telemetría Patio Maestranza',      descripcion: 'Calibración de 12 sensores de telemetría instalados en Patio Maestranza, incluye reporte de desviaciones y plan de mantenimiento.',     fechaInicio: '2025-12-05', areaId: 'AREA-TM', estado: 'Finalizado',  personalAsignado: ['SH-008'] },
];

/* ============================================================
 * REGISTROS_HORAS
 * ============================================================
 * Dataset granular de horas trabajadas por persona, por dia y por proyecto
 * para los ultimos 30 dias. Generado de forma deterministica al cargar el
 * modulo para que las pantallas y los charts muestren siempre los mismos
 * valores sin depender de Math.random ni de la fecha actual del sistema.
 *
 * Tarea 25: se extendio el esquema para incluir proyectoId y descripcion,
 * de modo que el DashboardPersonal pueda agrupar "Mis horas por proyecto"
 * y el modal "Registrar horas" persista contra el mismo esquema.
 *
 * Estructura: array de objetos
 *   { fecha, personalId, proyectoId, horas, descripcion }.
 *
 *   fecha       : ISO YYYY-MM-DD.
 *   personalId  : id de PERSONAL.
 *   proyectoId  : id de PROYECTOS, o null si la persona no tiene proyectos
 *                 asignados ese dia o si horas=0 (dia no laborable).
 *   horas       : numero de horas trabajadas ese dia (0 si feriado/domingo).
 *   descripcion : descripcion libre. Vacio en los registros sembrados;
 *                 se completa cuando el usuario crea un registro via el
 *                 modal "Registrar horas" del rol personal.
 *
 * Reglas del patron generador:
 *   - Domingo (getDay()===0): 0 horas, proyectoId=null.
 *   - Sabado (getDay()===6): 0 o 4 horas alternando por indice de persona.
 *   - Lunes a viernes: 8, 9 o 10 horas segun indice de persona.
 *   - Feriado 1 de mayo (Dia del Trabajador en Chile): 0 horas.
 *   - proyectoId rota deterministicamente entre los proyectos asignados a
 *     cada persona (segun PROYECTOS.personalAsignado). Personal sin
 *     proyectos asignados (caso SH-001 administracion) recibe proyectoId
 *     null en todos sus registros.
 */

/**
 * Fecha base para la generacion. Se hardcodea al cierre del Sprint 3
 * (17 de mayo de 2026) para que el dataset sea reproducible y no varie
 * con el reloj del sistema en futuras ejecuciones del proyecto.
 */
const FECHA_BASE_REGISTROS = '2026-05-17';

/**
 * Genera REGISTROS_HORAS de forma deterministica.
 * Recorre 30 dias hacia atras desde FECHA_BASE_REGISTROS (inclusive) y
 * para cada dia genera una entrada por cada persona del array PERSONAL.
 *
 * @returns {Array<{ fecha: string, personalId: string, horas: number }>}
 */
function generarRegistrosHoras() {
  const registros = [];
  const base = new Date(FECHA_BASE_REGISTROS + 'T00:00:00');

  // Pre-computar la lista de proyectos asignados a cada persona. Esto
  // permite rotar proyectoId de forma determinista por (persona, offset)
  // sin recorrer PROYECTOS dentro del bucle diario.
  const proyectosPorPersona = new Map();
  PERSONAL.forEach(persona => {
    const lista = PROYECTOS.filter(pry =>
      pry.personalAsignado.includes(persona.id)
    );
    proyectosPorPersona.set(persona.id, lista);
  });

  for (let offset = 29; offset >= 0; offset--) {
    const dia = new Date(base);
    dia.setDate(base.getDate() - offset);
    const iso = dia.toISOString().slice(0, 10);
    const diaSemana = dia.getDay(); // 0=domingo, 6=sabado
    const esFeriado1Mayo = iso === '2026-05-01';

    PERSONAL.forEach((persona, idx) => {
      // Calculo de horas (mismo patron que antes de la Tarea 25).
      let horas;
      if (esFeriado1Mayo) {
        horas = 0;
      } else if (diaSemana === 0) {
        horas = 0; // domingo
      } else if (diaSemana === 6) {
        horas = idx % 2 === 0 ? 4 : 0; // sabado alternado
      } else {
        horas = 8 + (idx % 3); // 8, 9 o 10 horas L-V
      }

      // Asignacion determinista de proyectoId rotando entre los proyectos
      // de la persona segun el offset del dia. Si la persona no tiene
      // proyectos asignados (SH-001) o el dia no es laborable (horas===0),
      // dejamos proyectoId en null.
      const proyectosAsignados = proyectosPorPersona.get(persona.id);
      let proyectoId = null;
      if (horas > 0 && proyectosAsignados && proyectosAsignados.length > 0) {
        proyectoId = proyectosAsignados[offset % proyectosAsignados.length].id;
      }

      registros.push({
        fecha:       iso,
        personalId:  persona.id,
        proyectoId,
        horas,
        descripcion: '',
      });
    });
  }

  return registros;
}

export const REGISTROS_HORAS = generarRegistrosHoras();