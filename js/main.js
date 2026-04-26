'use strict';

/*
 * main.js
 * -------
 * Inicialización global del sitio Sánchez e Hijos SpA.
 * Se carga en las 5 páginas del sitio.
 *
 * Funcionalidad: actualiza dinámicamente el año mostrado en el footer
 * (elemento con id="anio-footer"), tomando el año actual del sistema.
 * Esto evita tener que editar manualmente el footer cada año nuevo.
 *
 * Las funcionalidades específicas de cada página viven en
 * validaciones.js (contacto) y portafolio.js (portafolio).
 */

document.addEventListener('DOMContentLoaded', function () {
  // Año dinámico del footer.
  // Si la página no tiene el span (no debería pasar, todas lo tienen),
  // salimos sin hacer nada para no romper la consola.
  var anioFooter = document.getElementById('anio-footer');
  if (!anioFooter) {
    return;
  }
  anioFooter.textContent = new Date().getFullYear();
});