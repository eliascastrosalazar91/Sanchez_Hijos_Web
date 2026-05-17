// App.jsx
// Componente raiz de la intranet de Sanchez e Hijos.
// Tarea 22: introduce el estado activeScreen y delega el render al
// MainLayout cuando hay sesion activa. Sin sesion sigue mostrando
// el LoginScreen (sin cambios respecto a Tarea 21).

import { useState } from 'react';
import LoginScreen from './components/LoginScreen.jsx';
import MainLayout from './components/MainLayout.jsx';

// Pantalla por defecto al iniciar sesion, segun rol.
const PANTALLA_INICIAL_POR_ROL = {
  admin: 'admin-dashboard',
  personal: 'personal-dashboard',
};

function App() {
  // Estado de sesion. null = sin sesion. { usuario, rol } cuando hay sesion.
  const [sesion, setSesion] = useState(null);
  // Identificador de la pantalla activa dentro de la intranet.
  const [activeScreen, setActiveScreen] = useState(null);

  /**
   * Callback que LoginScreen invoca al validar las credenciales mock.
   * La sesion vive solo en memoria; al recargar la pagina se pierde.
   * Tras loguear, posiciona la pantalla inicial segun el rol.
   */
  const handleLogin = (usuario, rol) => {
    setSesion({ usuario, rol });
    setActiveScreen(PANTALLA_INICIAL_POR_ROL[rol] || null);
  };

  /** Cierra la sesion y vuelve al LoginScreen. */
  const handleLogout = () => {
    setSesion(null);
    setActiveScreen(null);
  };

  /** Cambia la pantalla activa dentro del MainLayout. */
  const navigateTo = (screen) => {
    setActiveScreen(screen);
  };

  // Render condicional segun el estado de sesion.
  if (!sesion) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  return (
    <MainLayout
      rol={sesion.rol}
      usuario={sesion.usuario}
      activeScreen={activeScreen}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    />
  );
}

export default App;