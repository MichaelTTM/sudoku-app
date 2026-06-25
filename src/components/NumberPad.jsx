import { digitCounts } from '../game/generator.js'

// 符號鍵盤：依 spec 顯示 1~N（>9 用字母），已填滿 N 個的符號淡化。
// 9 排一列；12 排 6×2、16 排 8×2，避免按鍵過窄。
export default function NumberPad({ board, onInput, noteMode, spec }) {
  const { size, symbols } = spec
  const counts = digitCounts(board, size)
  const cols = size <= 9 ? size : size === 12 ? 6 : 8
  return (
    <div
      className="grid gap-1 w-full max-w-[min(94vw,32rem)] mx-auto mt-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {Array.from({ length: size }, (_, n) => {
        const d = n + 1
        const done = counts[d] >= size
        return (
          <button
            key={d}
            onClick={() => onInput(d)}
            disabled={done}
            className={`aspect-square rounded-md text-[clamp(1rem,4.5vw,1.5rem)] font-semibold transition-colors ${
              done
                ? 'bg-[var(--bg)] text-[var(--line-soft)] cursor-default'
                : noteMode
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] active:scale-95'
                : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line-soft)] active:bg-[var(--accent-soft)]'
            }`}
          >
            {symbols[d]}
          </button>
        )
      })}
    </div>
  )
}
