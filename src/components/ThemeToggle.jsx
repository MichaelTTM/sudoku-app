// 深色／淺色切換鈕
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="切換深色／淺色主題"
      className="h-9 w-9 flex items-center justify-center rounded-full text-base border border-[var(--line-soft)] bg-[var(--surface)] text-[var(--ink-soft)] active:scale-95 transition-transform"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
