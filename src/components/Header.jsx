import { DIFFICULTIES } from '../game/generator.js'

export function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// 頂部資訊列：章節·關卡、難度、計時、錯誤次數
export default function Header({
  difficulty,
  seconds,
  mistakes,
  chapterName,
  levelLabel,
  accent,
  variant,
  variantLabel,
}) {
  const isVariant = variant && variant !== 'classic'
  return (
    <div className="w-full mb-3">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-base font-bold tracking-tight text-[var(--ink)]">
          {chapterName}{' '}
          <span style={{ color: accent }}>第 {levelLabel} 關</span>
        </h1>
        <div className="flex items-center gap-1.5">
          {isVariant && (
            <span
              className="text-xs font-semibold rounded-full px-2.5 py-1 text-white"
              style={{ backgroundColor: accent }}
            >
              {variantLabel}
            </span>
          )}
          <span
            className="text-xs font-semibold rounded-full px-2.5 py-1"
            style={{ backgroundColor: 'var(--accent-soft)', color: accent }}
          >
            {DIFFICULTIES[difficulty].label}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--ink-soft)]">
        <span>
          錯誤 <span className="font-semibold text-[var(--ink)]">{mistakes}</span>
        </span>
        <span className="tabular-nums font-semibold text-[var(--ink)]">
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  )
}
