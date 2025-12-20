import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'chart-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            return 'vendor';
          }

          // Application code splitting
          if (id.includes('/src/pages/')) {
            if (id.includes('AuthPage')) return 'auth-chunk';
            if (id.includes('StocksPage') || id.includes('ComparisonsPage')) return 'stocks-chunk';
            if (id.includes('PortfoliosPage') || id.includes('FDPage')) return 'portfolio-chunk';
            if (id.includes('ExpensesPage')) return 'expenses-chunk';
            if (id.includes('ChatbotPage')) return 'chatbot-chunk';
            return 'pages-chunk';
          }

          // Components
          if (id.includes('/src/components/')) {
            return 'components-chunk';
          }

          // Contexts and utilities
          if (id.includes('/src/contexts/') || id.includes('/src/utils/')) {
            return 'utils-chunk';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase limit to 600kB
  }
})
