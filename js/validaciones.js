'use strict';

/* validaciones.js
 * Validaciones del formulario de contacto (contacto.html).
 * Cinco funciones independientes (una por campo) que retornan true/false.
 * Eventos: blur (validación al perder foco), input/change (limpieza al escribir),
 * submit (validación global con preventDefault si hay errores).
 * Estas validaciones COMPLEMENTAN los atributos HTML5 (required, type="email"),
 * no los reemplazan.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Si no estamos en contacto.html, salimos sin hacer nada.
  var form = document.querySelector('form');
  if (!form) return;

  // Referencias a los campos del formulario
  var campoNombre = document.getElementById('nombre');
  var campoEmail = document.getElementById('email');
  var campoTelefono = document.getElementById('telefono');
  var campoAsunto = document.getElementById('asunto');
  var campoMensaje = document.getElementById('mensaje');

  // ---------- Helpers de UI ----------
  // Marca el campo como inválido y escribe el mensaje en su contenedor de error.
  function mostrarError(campo, idError, mensaje) {
    campo.classList.add('input-error');
    var contenedor = document.getElementById(idError);
    if (contenedor) {
      contenedor.textContent = mensaje;
    }
  }

  // Quita la marca de inválido y limpia el mensaje del campo.
  function limpiarError(campo, idError) {
    campo.classList.remove('input-error');
    var contenedor = document.getElementById(idError);
    if (contenedor) {
      contenedor.textContent = '';
    }
  }

  // ---------- Funciones de validación (una por campo) ----------
  // Nombre: obligatorio + mínimo 3 caracteres.
  function validarNombre() {
    var valor = campoNombre.value.trim();
    if (valor.length === 0) {
      mostrarError(campoNombre, 'error-nombre', 'El nombre es obligatorio.');
      return false;
    }
    if (valor.length < 3) {
      mostrarError(campoNombre, 'error-nombre', 'El nombre debe tener al menos 3 caracteres.');
      return false;
    }
    limpiarError(campoNombre, 'error-nombre');
    return true;
  }

  // Email: obligatorio + formato básico (texto@texto.texto).
  function validarEmail() {
    var valor = campoEmail.value.trim();
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (valor.length === 0) {
      mostrarError(campoEmail, 'error-email', 'El correo electrónico es obligatorio.');
      return false;
    }
    if (!regexEmail.test(valor)) {
      mostrarError(campoEmail, 'error-email', 'Ingrese un correo electrónico válido (ej: nombre@dominio.cl).');
      return false;
    }
    limpiarError(campoEmail, 'error-email');
    return true;
  }

  // Teléfono: opcional. Si hay contenido, valida formato.
  function validarTelefono() {
    var valor = campoTelefono.value.trim();
    if (valor.length === 0) {
      // Vacío es válido porque el campo no es obligatorio.
      limpiarError(campoTelefono, 'error-telefono');
      return true;
    }
    var regexTelefono = /^[0-9+\-\s]{7,15}$/;
    if (!regexTelefono.test(valor)) {
      mostrarError(
        campoTelefono,
        'error-telefono',
        'El teléfono debe tener entre 7 y 15 caracteres y solo puede contener números, espacios, + o -.'
      );
      return false;
    }
    limpiarError(campoTelefono, 'error-telefono');
    return true;
  }

  // Asunto: debe haber una opción distinta a la opción vacía por defecto.
  function validarAsunto() {
    var valor = campoAsunto.value;
    if (valor === '' || valor === null) {
      mostrarError(campoAsunto, 'error-asunto', 'Seleccione un asunto.');
      return false;
    }
    limpiarError(campoAsunto, 'error-asunto');
    return true;
  }

  // Mensaje: obligatorio + mínimo 10 caracteres.
  function validarMensaje() {
    var valor = campoMensaje.value.trim();
    if (valor.length === 0) {
      mostrarError(campoMensaje, 'error-mensaje', 'El mensaje es obligatorio.');
      return false;
    }
    if (valor.length < 10) {
      mostrarError(campoMensaje, 'error-mensaje', 'El mensaje debe tener al menos 10 caracteres.');
      return false;
    }
    limpiarError(campoMensaje, 'error-mensaje');
    return true;
  }

  // ---------- Asignación de eventos ----------
  // blur: validar al perder el foco
  campoNombre.addEventListener('blur', validarNombre);
  campoEmail.addEventListener('blur', validarEmail);
  campoTelefono.addEventListener('blur', validarTelefono);
  campoAsunto.addEventListener('blur', validarAsunto);
  campoMensaje.addEventListener('blur', validarMensaje);

  // input / change: limpiar el error mientras el usuario corrige
  campoNombre.addEventListener('input', function () {
    limpiarError(campoNombre, 'error-nombre');
  });
  campoEmail.addEventListener('input', function () {
    limpiarError(campoEmail, 'error-email');
  });
  campoTelefono.addEventListener('input', function () {
    limpiarError(campoTelefono, 'error-telefono');
  });
  campoAsunto.addEventListener('change', function () {
    limpiarError(campoAsunto, 'error-asunto');
  });
  campoMensaje.addEventListener('input', function () {
    limpiarError(campoMensaje, 'error-mensaje');
  });

  // submit: validar todo y bloquear el envío si hay errores
  form.addEventListener('submit', function (event) {
    // Llamamos a las 5 funciones (no cortocircuitamos) para mostrar todos los errores a la vez.
    var nombreOk = validarNombre();
    var emailOk = validarEmail();
    var telefonoOk = validarTelefono();
    var asuntoOk = validarAsunto();
    var mensajeOk = validarMensaje();

    if (!nombreOk || !emailOk || !telefonoOk || !asuntoOk || !mensajeOk) {
      event.preventDefault();
    }
  });
});