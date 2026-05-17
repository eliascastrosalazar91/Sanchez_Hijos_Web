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
    // dist/index.html como bloques inline//.
    viteSingleFile(),
  ],
})