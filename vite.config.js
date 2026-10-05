import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    /* `esnext` emitted optional chaining and nullish coalescing verbatim,
       which throws a SyntaxError on iOS Safari < 13.4. es2019 downlevels both
       while still shipping modern output. */
    target: 'es2019',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        /* `three` / `fiber` / `drei` are deliberately absent. They are reachable
           only through the lazy() import of DynamicBackground, and App.jsx
           refuses to mount that at all on phones and reduced-motion clients.
           Naming them here forced Rollup to create them as eager chunks, which
           made Vite emit <link rel="modulepreload"> for all three in index.html
           — so every phone and reduced-motion visitor downloaded ~950KB of
           WebGL code that was then never used. Left unlisted, they follow the
           dynamic import boundary and only load when the scene actually mounts. */
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
