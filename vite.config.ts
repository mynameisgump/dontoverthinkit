import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/dontoverthinkit',
  resolve: {
    alias: {
      '@components': '/src/components',
      '@images': '/src/images'
    }
  },
  build: {
    outDir: 'build'
  },
  server: {
    port: 5173
  }
})
