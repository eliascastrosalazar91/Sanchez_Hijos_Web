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

// Estilo de la nota informativa sobre persistencia local en localStorage.
// Se declara como constante externa siguiendo el patron del proyecto
// (estilos inline JSX nunca embebidos directamente en el render).
// El marginTop simula los "dos espacios" pedidos respecto al ultimo
// renglon del bloque de credenciales; el fontSize lo deja en letra
// pequena para que no compita visualmente con las credenciales.
const STYLE_LOGIN_NOTA = {
  marginTop: '24px',
  fontSize: '11px',
  color: '#718096',
  lineHeight: 1.5,
  textAlign: 'center',
};

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
            Operador técnico: <strong>personal</strong> / <strong>personal</strong>
          </p>
          <p style={STYLE_LOGIN_NOTA}>
            Esta intranet incluye datos de ejemplo precargados (personal,
            áreas técnicas, proyectos y registros de horas). Cualquier
            creación, edición o eliminación que realices dentro de la
            aplicación se guarda automáticamente en tu navegador y se
            mantiene aunque cierres sesión o cierres la pestaña. Si deseas
            volver al estado inicial con los datos de ejemplo, abre las
            herramientas de desarrollo del navegador (tecla F12), entra a
            la pestaña <strong>Application</strong> (o{' '}
            <strong>Aplicación</strong>), expande <strong>Local Storage</strong>{' '}
            en el panel izquierdo, haz clic derecho sobre el sitio listado
            y elige <strong>Clear</strong> (o <strong>Borrar</strong>). Al
            recargar la página verás nuevamente los datos iniciales.
          </p>
                </footer>
      </div>

      {/* Footer del sitio (réplica visual del footer del sitio público).
          Solo visible en la pantalla de login; las pantallas internas usan
          el MainLayout con su propio chrome (sidebar + topbar). Tarea 26.

          NOTA SOBRE LA RUTA: '../../index.html' resuelve correctamente
          cuando la intranet se abre como build empaquetado:
              proyecto/index.html
              proyecto/intranet/dist/index.html   <-- aquí estamos
          En `npm run dev` Vite sirve desde un dev server en localhost,
          por lo que ese path no apunta al sitio público. Es esperable:
          el retorno al sitio público es una funcionalidad del entregable,
          no del modo desarrollo. */}
      <footer className="login-site-footer">
        <p>
          &copy; {new Date().getFullYear()} Sánchez e Hijos SpA. Todos los derechos reservados.
        </p>
        <p>
          <a
            href="../../index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acceso sitio principal
          </a>
          <span className="footer-sep" aria-hidden="true">·</span>
          <a
            href="https://github.com/eliascastrosalazar91/Sanchez_Hijos_Web"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver repositorio en GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default LoginScreen;