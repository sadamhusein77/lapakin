import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@src/presentation/components': path.resolve(__dirname, './src/presentation/components'),
      '@src/shared': path.resolve(__dirname, './src/shared'),
      '@src/domain': path.resolve(__dirname, './src/domain'),
      '@src/data': path.resolve(__dirname, './src/data'),
      '@src/assets': path.resolve(__dirname, './src/assets')
    },
  },
})
