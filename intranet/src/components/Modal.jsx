/**
 * Modal generico reutilizable.
 *
 * Características:
 *  - Render condicional segun isOpen. Si está cerrado no monta nada.
 *  - Cierre por click en el backdrop, boton X o tecla Escape.
 *  - Bloquea el scroll del <body> mientras está abierto para que el
 *    contenido de fondo no se desplace al hacer scroll dentro del modal.
 *  - Accesible: role="dialog", aria-modal, aria-labelledby al titulo y
 *    aria-label en el boton de cierre.
 *  - Footer opcional: si la prop footer es null/undefined, no se renderiza.
 *
 * Props:
 *   - isOpen   : boolean, controla visibilidad.
 *   - onClose  : () => void, callback de cierre.
 *   - title    : string, titulo del header.
 *   - children : contenido del cuerpo.
 *   - footer   : nodos React opcionales (botones de accion, etc.).
 */

import React, { useEffect } from 'react';
import { IconClose } from './Icons.jsx';
import '../styles/modal.css';

function Modal({ isOpen, onClose, title, children, footer }) {
  // Efecto: mientras el modal esta abierto, escucha la tecla Escape y bloquea
  // el scroll del body. Al desmontar (o cerrar) restaura el estado previo.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflowPrevio;
    };
  }, [isOpen, onClose]);

  // Si no esta abierto, no montamos nada en el DOM.
  if (!isOpen) return null;

  // Click en el backdrop cierra el modal solo cuando el target es el
  // propio backdrop. Asi un click dentro del modal-container no lo cierra,
  // sin necesidad de hacer stopPropagation en cada hijo.
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div className="modal-container">
        {/* Header: titulo + boton de cerrar */}
        <header className="modal-header">
          <h3 id="modal-title" className="modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <IconClose size={22} />
          </button>
        </header>

        {/* Cuerpo del modal: contenido provisto por el consumidor */}
        <div className="modal-body">{children}</div>

        {/* Footer opcional: solo se renderiza si el consumidor lo provee */}
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}

export default Modal;