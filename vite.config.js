import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VITE_APP_TITLE': JSON.stringify(process.env.VITE_APP_TITLE),
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'chartjs-adapter-moment'],
          ui: ['lucide-react', '@radix-ui/react-popover', 'react-day-picker']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  } 
})
