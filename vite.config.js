import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// 用相對路徑 base，同時相容兩種載入情境：
//   - GitHub Pages 子路徑 https://<user>.github.io/sudoku-app/
//   - Capacitor Android（APK 內從根目錄載入）
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
