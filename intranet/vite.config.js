import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  // base: './' fuerza rutas relativas en el index.html generado.
  // Aplica a los assets que NO se inlineen (ej. PNGs grandes).
  base: './',
  plugins: [
    react(),
    // viteSingleFile: empaqueta todo el JS y el CSS DENTRO del propio
    // dist/index.html como bloques inline. Resultado: un unico HTML
    // autocontenido que funciona al abrirse por doble click desde el
    // sistema de archivos (file://), sin necesidad de un servidor HTTP
    // local. Esto es obligatorio porque los <script type="module"> de
    // Vite estandar son bloqueados por CORS bajo file:// (origin null).
    // Los assets binarios pequenos (<4KB) tambien se inlinean como
    // base64; los grandes (PNGs) quedan en dist/assets/ y se referencian
    // por ruta relativa, lo cual SI funciona desde file://.
    viteSingleFile(),
  ],
})