# Web Sánchez e Hijos

Sitio web estático para **Sánchez e Hijos SpA**, empresa dedicada al mantenimiento de sistemas ferroviarios: obras civiles menores, reparación de sistemas de control automático, máquinas de cambio, sistemas de protección con barreras automáticas, y telemetría aplicada al monitoreo de sistemas ferroviarios.

## Stack tecnológico

- **HTML5** — Estructura y semántica
- **CSS3** — Estilos personalizados
- **Bootstrap 4.5.2** — Framework CSS vía CDN
- **JavaScript Vanilla (ES6)** — Funcionalidades dinámicas y validaciones, sin frameworks ni bundlers
- **Google Fonts** — Roboto Slab + Open Sans vía CDN

## Estructura del proyecto

```
web-sanchez/
├── index.html              # Home del sitio
├── pages/
│   ├── servicios.html      # Página de servicios
│   ├── nosotros.html       # Página sobre la empresa
│   ├── contacto.html       # Formulario de contacto con validaciones JS
│   └── portafolio.html     # Portafolio de proyectos con funcionalidades dinámicas
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   ├── main.js             # Inicialización global (año dinámico en footer)
│   ├── validaciones.js     # Validaciones del formulario de contacto
│   └── portafolio.js       # Funcionalidades dinámicas del portafolio
├── img/                    # Imágenes y recursos gráficos
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

## Funcionalidades

### Validaciones JavaScript (contacto.html)

Formulario de contacto con 5 funciones de validación independientes (nombre, email, teléfono, asunto, mensaje), complementarias a la validación HTML5 nativa. Mensajes de error inline bajo cada campo, con feedback en eventos `blur`, `input` y `submit`.

### Portafolio dinámico (portafolio.html)

Tres funcionalidades dinámicas implementadas con manejo del DOM y eventos:

1. **Leer más / Leer menos** — alterna la descripción extendida de cada proyecto.
2. **Agregar nuevo proyecto** — mini-formulario con validaciones por campo que crea tarjetas dinámicamente vía `createElement` + `appendChild` + `textContent` (protegido contra XSS).
3. **Filtro por categoría** — botones que muestran/ocultan tarjetas según su categoría (5 categorías + «Todos»).

Las tres funcionalidades están implementadas con *event delegation*, por lo que las tarjetas creadas dinámicamente heredan automáticamente el comportamiento de «Leer más» y el filtro.

## Cómo abrir el sitio localmente

El sitio es 100 % estático: no requiere servidor, build ni instalación de dependencias.

1. Clonar el repositorio o descomprimir el archivo entregado.
2. Abrir `index.html` en el navegador (doble clic, o arrastrar al navegador).
3. Navegar entre las 5 páginas usando el menú superior.

> Para una experiencia óptima se recomienda servir el sitio con una extensión tipo *Live Server* (VS Code) o cualquier servidor HTTP local, ya que algunos navegadores aplican restricciones extra al protocolo `file://`.
> 

## Contexto

Proyecto desarrollado para la asignatura de **Programación Frontend** (INACAP).

- **Sprint 1** — Sitio estático con HTML5, CSS3 y Bootstrap.
- **Sprint 2** — Incorporación de JavaScript Vanilla (ES6): validaciones del formulario de contacto y 3 funcionalidades dinámicas en el portafolio.

## Autor

Elias Castro Salazar, para:

Sánchez e Hijos SpA — Mantenimiento de Sistemas Ferroviarios
