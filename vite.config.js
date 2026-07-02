import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    /* manifest.json : mapping source -> chunk hashe, lu par prerender.mjs
       pour injecter le modulepreload du chunk de CHAQUE page dans son HTML
       prerendu (supprime la fenetre de loader entre hydratation du shell
       et arrivee du chunk de page sur les acces directs). */
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
});
