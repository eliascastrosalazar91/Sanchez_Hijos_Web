// LoginScreen.jsx
// Pantalla de inicio de sesion de la intranet. Implementa un formulario
// controlado con dos campos (usuario, clave), validacion local contra
// las credenciales mock definidas en constants.js, mensaje de error
// inline si la validacion falla, y un callback onLogin que notifica al
// componente raiz con (usuario, rol) cuando el login es exitoso.

import { useState } from 'react';
import { CREDENCIALES_MOCK } from '../constants.js';
import logoLogin from '../assets/login_intranet.png';
import '../styles/login.css';

function LoginScreen({ onLogin }) {
  // Campos controlados del formulario.
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  // Mensaje de error inline (cadena vacia = sin error visible).
  const [error, setError] = useState('');

  /**
   * Maneja el envio del formulario:
   *  1. Bloquea el submit nativo del navegador.
   *  2. Limpia el error previo.
   *  3. Busca un match exacto en CREDENCIALES_MOCK (usuario y clave
   *     case-sensitive; sin normalizacion).
   *  4. Si encuentra, invoca onLogin(usuario, rol).
   *  5. Si no, escribe un mensaje de error y limpia el campo clave.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const match = CREDENCIALES_MOCK.find(
      (c) => c.usuario === usuario && c.clave === clave
    );

    if (!match) {
      setError('Usuario o clave incorrectos.');
      setClave('');
      return;
    }

    onLogin(match.usuario, match.rol);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <header className="login-header">
          <img
            src={logoLogin}
            alt="Sánchez e Hijos SpA — Ingeniería y Mantenimiento Ferroviario"
            className="login-logo-img"
          />
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-campo">
            <label htmlFor="login-usuario">Usuario</label>
            <input
              id="login-usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
            />
          </div>

          <div className="login-campo">
            <label htmlFor="login-clave">Clave</label>
            <input
              id="login-clave"
              name="clave"
              type="password"
              autoComplete="current-password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Ingrese su clave"
            />
          </div>

          {/* Mensaje de error inline (visible solo cuando hay error). */}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-boton">
            Iniciar sesión
          </button>
        </form>

        <footer className="login-credenciales">
          <p className="login-credenciales-titulo">Credenciales de prueba</p>
          <p>
            Administrador: <strong>admin</strong> / <strong>admin</strong>
          </p>
          <p>
            Operario: <strong>operario</strong> / <strong>operario</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LoginScreen;