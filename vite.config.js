import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-hot-toast'],
          services: ['openai', 'axios', '@supabase/supabase-js', '@stripe/stripe-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
