import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base 對應 GitHub Pages 的 project page 路徑：https://<user>.github.io/sudoku-app/
export default defineConfig({
  base: '/sudoku-app/',
  plugins: [react(), tailwindcss()],
})
