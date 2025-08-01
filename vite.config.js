import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/neutaris/',
  server: {
    port: 3000,
    open: true,
    host: true // Ensures compatibility with mobile devices
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
