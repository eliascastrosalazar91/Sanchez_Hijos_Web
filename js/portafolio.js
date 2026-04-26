'use strict';

/*
 * portafolio.js
 * -------------
 * Funcionalidades dinámicas del portafolio de proyectos.
 * Se carga únicamente en pages/portafolio.html.
 *
 * Sprint 2 — Tarea 14: implementación de "Leer más / Leer menos".
 *   - Tareas 15 (agregar proyecto) y 16 (ver/ocultar ficha técnica) se
 *     incorporarán en hilos posteriores sobre este mismo archivo.
 *
 * Patrón: event delegation sobre el contenedor #lista-proyectos.
 *   - Esto permite que las tarjetas creadas dinámicamente en Tarea 15
 *     hereden la funcionalidad sin necesidad de re-enganchar listeners.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Marca de vida (se eliminará en Tarea 17 — revisión integral)
  console.log('[Sánchez e Hijos] portafolio.js cargado correctamente.');

  // Contenedor del listado de tarjetas. Si no existe, no hay nada que
  // engancha (defensa para que el script no rompa si se carga por error
  // en otra página).
  var listaProyectos = document.getElementById('lista-proyectos');
  if (!listaProyectos) {
    return;
  }

  // Event delegation: escuchamos clics en todo el contenedor y filtramos
  // por la clase del botón. Así soporta tarjetas estáticas y dinámicas.
  listaProyectos.addEventListener('click', function (event) {
    var boton = event.target;

    // Solo nos interesan los clics en botones "Leer más / Leer menos".
    if (!boton.classList.contains('js-leer-mas')) {
      return;
    }

    // El botón apunta a su descripción extendida vía data-target="ext-N".
    var idDescripcion = boton.getAttribute('data-target');
    if (!idDescripcion) {
      return;
    }

    var descripcion = document.getElementById(idDescripcion);
    if (!descripcion) {
      return;
    }

    // Alternar visibilidad usando el atributo HTML "hidden" + el texto del botón.
    if (descripcion.hasAttribute('hidden')) {
      descripcion.removeAttribute('hidden');
      boton.textContent = 'Leer menos';
    } else {
      descripcion.setAttribute('hidden', '');
      boton.textContent = 'Leer más';
    }
  });

// ============================================================
// Una sola barra de botones (Todos + 5 categorías) controla la
// visibilidad de las tarjetas del listado. Usamos delegation
// sobre #filtros-categoria; en cada clic recorremos los wrappers
// con [data-categoria] y alternamos el atributo "hidden". Como
// el recorrido se hace sobre el DOM en cada clic, las tarjetas
// dinámicas (Tarea 15) se filtran automáticamente sin necesidad
// de re-enganchar listeners.
// ============================================================

var contenedorFiltros = document.getElementById('filtros-categoria');
if (contenedorFiltros) {

  contenedorFiltros.addEventListener('click', function (event) {
    var boton = event.target;

    // Solo nos interesan los clics en botones de filtro.
    if (!boton.classList.contains('js-filtro-categoria')) {
      return;
    }

    var filtro = boton.getAttribute('data-filtro');
    if (!filtro) {
      return;
    }

    // 1) Estado visual del botón activo: limpiamos en todos y
    //    marcamos el clicado.
    var botonesFiltro = contenedorFiltros.getElementsByClassName('js-filtro-categoria');
    for (var i = 0; i < botonesFiltro.length; i++) {
      botonesFiltro[i].classList.remove('active');
    }
    boton.classList.add('active');

    // 2) Recorremos todas las tarjetas del listado y mostramos
    //    u ocultamos según su data-categoria.
    var tarjetas = listaProyectos.querySelectorAll('[data-categoria]');
    for (var j = 0; j < tarjetas.length; j++) {
      var categoria = tarjetas[j].getAttribute('data-categoria');
      if (filtro === 'todos' || categoria === filtro) {
        tarjetas[j].removeAttribute('hidden');
      } else {
        tarjetas[j].setAttribute('hidden', '');
      }
    }
  });

}
  
// ============================================================
// - 5 funciones de validación por campo (mismo patrón que
//   validaciones.js de contacto.html).
// - Crea una nueva tarjeta replicando la estructura de las
//   estáticas y la inserta en #lista-proyectos.
// - El event delegation ya montado más arriba cubre
//   automáticamente "Leer más / Leer menos" en la tarjeta nueva.
// ============================================================

var formNuevoProyecto = document.getElementById('form-nuevo-proyecto');
if (!formNuevoProyecto) {
  return;
}

// Contador para asignar IDs únicos a las descripciones extendidas
// de las tarjetas dinámicas (las estáticas ocupan ext-1 … ext-5).
var contadorProyectos = 6;

// ------- Helpers de marcado / limpieza de error por campo -------
function mostrarError(idCampo, mensaje) {
  var campo = document.getElementById(idCampo);
  var error = document.getElementById('error-' + idCampo);
  if (campo) { campo.classList.add('input-error'); }
  if (error) { error.textContent = mensaje; }
}

function limpiarError(idCampo) {
  var campo = document.getElementById(idCampo);
  var error = document.getElementById('error-' + idCampo);
  if (campo) { campo.classList.remove('input-error'); }
  if (error) { error.textContent = ''; }
}

// ------- Funciones de validación (una por campo requerido) -------
function validarTituloProyecto() {
  var valor = document.getElementById('np-titulo').value.trim();
  if (valor === '') {
    mostrarError('np-titulo', 'El título es obligatorio.');
    return false;
  }
  if (valor.length < 3) {
    mostrarError('np-titulo', 'El título debe tener al menos 3 caracteres.');
    return false;
  }
  limpiarError('np-titulo');
  return true;
}

function validarUbicacionProyecto() {
  var valor = document.getElementById('np-ubicacion').value.trim();
  if (valor === '') {
    mostrarError('np-ubicacion', 'La ubicación es obligatoria.');
    return false;
  }
  if (valor.length < 2) {
    mostrarError('np-ubicacion', 'La ubicación debe tener al menos 2 caracteres.');
    return false;
  }
  limpiarError('np-ubicacion');
  return true;
}

function validarAnioProyecto() {
  var valor = document.getElementById('np-anio').value.trim();
  if (valor === '') {
    mostrarError('np-anio', 'El año es obligatorio.');
    return false;
  }
  var anio = Number(valor);
  if (isNaN(anio) || anio < 1900 || anio > 2100) {
    mostrarError('np-anio', 'Ingresa un año entre 1900 y 2100.');
    return false;
  }
  limpiarError('np-anio');
  return true;
}

function validarCategoriaProyecto() {
  var valor = document.getElementById('np-categoria').value;
  if (valor === '') {
    mostrarError('np-categoria', 'Selecciona una categoría.');
    return false;
  }
  limpiarError('np-categoria');
  return true;
}

function validarBreveProyecto() {
  var valor = document.getElementById('np-breve').value.trim();
  if (valor === '') {
    mostrarError('np-breve', 'La descripción breve es obligatoria.');
    return false;
  }
  if (valor.length < 10) {
    mostrarError('np-breve', 'La descripción breve debe tener al menos 10 caracteres.');
    return false;
  }
  limpiarError('np-breve');
  return true;
}

// ------- Validación al perder foco (blur) -------
document.getElementById('np-titulo').addEventListener('blur', validarTituloProyecto);
document.getElementById('np-ubicacion').addEventListener('blur', validarUbicacionProyecto);
document.getElementById('np-anio').addEventListener('blur', validarAnioProyecto);
document.getElementById('np-categoria').addEventListener('change', validarCategoriaProyecto);
document.getElementById('np-breve').addEventListener('blur', validarBreveProyecto);

// ------- Limpieza inmediata del error mientras el usuario corrige -------
document.getElementById('np-titulo').addEventListener('input', function () { limpiarError('np-titulo'); });
document.getElementById('np-ubicacion').addEventListener('input', function () { limpiarError('np-ubicacion'); });
document.getElementById('np-anio').addEventListener('input', function () { limpiarError('np-anio'); });
document.getElementById('np-categoria').addEventListener('change', function () { limpiarError('np-categoria'); });
document.getElementById('np-breve').addEventListener('input', function () { limpiarError('np-breve'); });

// ------- Submit del formulario -------
formNuevoProyecto.addEventListener('submit', function (event) {
  event.preventDefault();

  // Llamamos a las 5 validaciones SIN cortocircuito para que
  // todos los errores se muestren simultáneamente.
  var ok1 = validarTituloProyecto();
  var ok2 = validarUbicacionProyecto();
  var ok3 = validarAnioProyecto();
  var ok4 = validarCategoriaProyecto();
  var ok5 = validarBreveProyecto();
  if (!(ok1 && ok2 && ok3 && ok4 && ok5)) {
    return;
  }

  // Lectura final (ya validada) de los valores
  var titulo    = document.getElementById('np-titulo').value.trim();
  var ubicacion = document.getElementById('np-ubicacion').value.trim();
  var anio      = Number(document.getElementById('np-anio').value.trim());
  var categoria = document.getElementById('np-categoria').value;
  var breve     = document.getElementById('np-breve').value.trim();
  var extendida = document.getElementById('np-extendida').value.trim();

  // Si el usuario no ingresó descripción extendida, reutilizamos la breve
  var textoExtendida = extendida === '' ? breve : extendida;

  // ID único para la descripción extendida (ext-6, ext-7, ...)
  var idExtendida = 'ext-' + contadorProyectos;
  contadorProyectos++;

  // -------- Construcción de la tarjeta nueva con createElement --------
  // Importante: usamos textContent (no innerHTML) para todos los datos
  // del usuario, evitando inyección de HTML/XSS.

  // Wrapper de columna (responsive 1/2/3 columnas)
  var wrapper = document.createElement('div');
  wrapper.className = 'col-md-6 col-lg-4 mb-4';
  wrapper.setAttribute('data-categoria', categoria);

  // Article (card)
  var article = document.createElement('article');
  article.className = 'card h-100 shadow-sm proyecto-card';

  // Imagen genérica para todos los proyectos agregados dinámicamente
  var img = document.createElement('img');
  img.className = 'card-img-top';
  img.src = '../img/nuevo_proyecto.jpg';
  img.alt = 'Imagen genérica de proyecto agregado por el usuario';
  article.appendChild(img);

  // Card body
  var cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex flex-column';

  // Título
  var h3 = document.createElement('h3');
  h3.className = 'card-title';
  h3.textContent = titulo;
  cardBody.appendChild(h3);

  // Badge de categoría (visible)
  var badge = document.createElement('span');
  badge.className = 'badge badge-categoria';
  badge.textContent = categoria;
  cardBody.appendChild(badge);

  // Meta: ubicación · año
  var meta = document.createElement('p');
  meta.className = 'card-meta';
  meta.textContent = ubicacion + ' · ' + anio;
  cardBody.appendChild(meta);

  // Descripción breve
  var pBreve = document.createElement('p');
  pBreve.className = 'card-text';
  pBreve.textContent = breve;
  cardBody.appendChild(pBreve);

  // Contenedor del botón "Leer más" — va ANTES de la descripción extendida
  // para que ésta se despliegue debajo del botón al expandir.
  var btnContainer = document.createElement('div');
  btnContainer.className = 'mb-2';

  var boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'btn btn-sm btn-accent js-leer-mas';
  boton.setAttribute('data-target', idExtendida);
  boton.textContent = 'Leer más';
  btnContainer.appendChild(boton);

  cardBody.appendChild(btnContainer);

  // Descripción extendida (oculta inicialmente con atributo hidden)
  var pExtendida = document.createElement('p');
  pExtendida.className = 'proyecto-extendida';
  pExtendida.id = idExtendida;
  pExtendida.setAttribute('hidden', '');
  pExtendida.textContent = textoExtendida;
  cardBody.appendChild(pExtendida);

  // Ensamblado final
  article.appendChild(cardBody);
  wrapper.appendChild(article);

  // Inserta la tarjeta nueva al final del listado
  listaProyectos.appendChild(wrapper);

  // Limpia el formulario y hace scroll suave hasta la nueva tarjeta
  formNuevoProyecto.reset();
  wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
});