import { useEffect, useState } from 'react'

const KEY = 'sudoku.theme'

// 主題切換：'dark' / 'light'，存 localStorage。預設深色（index.html 已先套用避免閃爍）。
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || localStorage.getItem(KEY) || 'dark'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
