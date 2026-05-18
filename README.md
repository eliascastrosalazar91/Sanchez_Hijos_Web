# Sánchez e Hijos SpA — Sitio web corporativo

Sitio web corporativo de **Sánchez e Hijos SpA**, empresa chilena dedicada al mantenimiento de sistemas ferroviarios: obras civiles menores, reparación de sistemas de control automático, máquinas de cambio, sistemas de protección con barreras automáticas y telemetría para monitoreo ferroviario.

## Evolución del producto

El sitio se construyó en tres entregas incrementales:

- **Sprint 1 — Sitio institucional estático.** Cinco páginas (home, servicios, nosotros, portafolio y contacto) maquetadas con HTML5, CSS3 y Bootstrap, navegables sin servidor.
- **Sprint 2 — Interactividad en el sitio público.** Validaciones del formulario de contacto y funcionalidades dinámicas en el portafolio (leer más, agregar proyecto y filtro por categoría), todo con JavaScript Vanilla.
- **Sprint 3 — Intranet de gestión.** Se suma una **intranet privada construida con React y Vite**, accesible desde el sitio público, con autenticación por roles (administrador y personal técnico), gestión de personal, gestión de proyectos y un panel con gráficos. La intranet se entrega como una única página HTML autocontenida, sin servidor.

## Cómo navegar el sitio

1. Abrir `index.html` (en la raíz) haciendo doble clic. Se abre el sitio público en el navegador.
2. Usar el menú superior para moverse entre las cinco secciones: **Inicio**, **Servicios**, **Nosotros**, **Portafolio** y **Contacto**.
3. Para entrar a la **Intranet**, hacer clic en el enlace correspondiente del menú (o abrir directamente `intranet/dist/index.html`). Se llega a una pantalla de inicio de sesión.
4. Credenciales de demostración:
   - Administrador → usuario `admin`, contraseña `admin`.
   - Personal → usuario `personal`, contraseña `personal`.
5. Una vez dentro, el menú lateral permite navegar entre las secciones de la intranet. El botón **Cerrar sesión** vuelve al inicio de la intranet; el enlace **Volver al sitio** regresa al sitio público.

## Mapa del sitio

```

Inicio  (index.html)
├── Servicios          (pages/servicios.html)
├── Nosotros           (pages/nosotros.html)
├── Portafolio         (pages/portafolio.html)
├── Contacto           (pages/contacto.html)
└── Intranet           (intranet/dist/index.html)
    ├── Inicio de sesión
    └── Panel privado
        ├── Dashboard      (resumen y gráficos)
        ├── Personal       (gestión de personal técnico)
        ├── Proyectos      (cartera de proyectos)
        └── Mi perfil
```

---

## Resumen técnico

El producto se compone de **dos piezas independientes que conviven en el mismo paquete**:

**1. Sitio público.** Capa institucional 100% estática, sin servidor, sin base de datos y sin paso de compilación. Se sirve directamente desde el sistema de archivos (`file://`) o cualquier hosting estático.

- **HTML5** para estructura semántica.
- **CSS3** propio en `css/styles.css`, sobre **Bootstrap 4.5.2** vía CDN para grid, componentes y responsividad.
- **JavaScript Vanilla (ES6)** modularizado por página: `main.js` (inicialización global), `validaciones.js` (formulario de contacto) y `portafolio.js` (interacciones del portafolio). jQuery solo aparece como dependencia de Bootstrap para el navbar responsive; no se escribe código jQuery propio.
- **Google Fonts** (Roboto Slab + Open Sans) vía CDN.
- Imágenes y recursos gráficos centralizados en `img/`.

**2. Intranet.** Aplicación de gestión en `intranet/`, desarrollada con **React 19** y **Vite**, empaquetada con `vite-plugin-singlefile` en un único `intranet/dist/index.html` autocontenido (HTML + CSS + JS + assets en línea). No requiere servidor en producción: se abre por doble clic.

- **Autenticación mock** con dos roles (administrador y personal técnico) y persistencia en `localStorage`.
- **Layout principal** con barra lateral y navegación basada en estado de React.
- **Gestión de personal y proyectos** con datos en memoria, formularios validados y operaciones CRUD locales.
- **Dashboard** con gráficos generados con **Chart.js 4**.
- **Estilos** mediante CSS y constantes JSX; la intranet no usa Bootstrap.

La integración entre ambas piezas es por enlaces HTML estándar: el sitio público apunta a `intranet/dist/index.html` y la intranet ofrece un enlace de retorno. No hay backend, ni API, ni dependencias en tiempo de ejecución más allá del navegador.

---

## Scripts de PowerShell

El repositorio incluye tres scripts en la raíz para reproducir el entorno de desarrollo de la intranet en Windows 11. **No son necesarios para usar el producto final** (que es estático), solo para regenerar el build desde el código fuente.

Requisito previo (una sola vez por equipo):

```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Los tres scripts se ejecutan desde PowerShell, ubicado en la raíz del repositorio.

### 1. `bootstrap-dev.ps1` — Preparar el equipo

Instala Node.js LTS (y npm) usando winget si aún no están presentes. Es el primer paso al clonar el repositorio en una máquina nueva.

```
.[bootstrap-dev.ps](http://bootstrap-dev.ps)1
```

### 2. `bootstrap-intranet.ps1` — Levantar el entorno de la intranet

Crea la carpeta `intranet/` con el scaffold de Vite + React si no existe, instala las dependencias (incluido Chart.js) y deja corriendo el servidor de desarrollo en `http://localhost:5173/`, abriendo el navegador automáticamente. Es idempotente: si `intranet/` ya existe, solo verifica dependencias y arranca el dev server.

```
.[bootstrap-intranet.ps](http://bootstrap-intranet.ps)1
```

Para detener el servidor de desarrollo: `Ctrl + C` en la misma ventana.

### 3. `build-intranet.ps1` — Generar el build de producción

Genera el paquete final de la intranet en `intranet/dist/`, que es el archivo que se entrega como parte del sitio. Limpia builds previos y reinstala dependencias si fuera necesario.

```
.[build-intranet.ps](http://build-intranet.ps)1
```

Al finalizar, `intranet/dist/index.html` queda listo para abrirse por doble clic.

---

Elias Castro Salazar
Estudiante Ingeniería en Informática
Inacap Santiago Centro.