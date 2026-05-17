// App.jsx
// Componente raiz de la intranet de Sanchez e Hijos.
// En la Tarea 21 introduce el estado de sesion en memoria y el render
// condicional: sin sesion -> LoginScreen; con sesion -> placeholder con
// usuario/rol y un boton "Cerrar sesion". El placeholder se reemplazara
// por MainLayout en la Tarea 22.

import { useState } from 'react';
import LoginScreen from './components/LoginScreen.jsx';

function App() {
  // Estado de sesion. null = sin sesion. { usuario, rol } cuando hay sesion.
  const [sesion, setSesion] = useState(null);

  /**
   * Callback que LoginScreen invoca al validar las credenciales mock.
   * La sesion vive solo en memoria; al recargar la pagina se pierde.
   */
  const handleLogin = (usuario, rol) => {
    setSesion({ usuario, rol });
  };

  /** Cierra la sesion y vuelve al LoginScreen. */
  const handleLogout = () => {
    setSesion(null);
  };

  // Render condicional segun el estado de sesion.
  if (!sesion) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <main className="app-placeholder">
      <h1>Intranet Sánchez e Hijos</h1>
      <p>
        Sesión activa como <strong>{sesion.usuario}</strong> (rol:{' '}
        <strong>{sesion.rol}</strong>).
      </p>
      <p className="placeholder-nota">
        Próximos pasos: MainLayout + Sidebar + pantallas por rol.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="placeholder-boton"
      >
        Cerrar sesión
      </button>
    </main>
  );
}

export default App;