import { digitCounts } from '../game/generator.js'

// 數字鍵盤：顯示 1~9，已填滿 9 個的數字會淡化
export default function NumberPad({ board, onInput, noteMode }) {
  const counts = digitCounts(board)
  return (
    <div className="grid grid-cols-9 gap-1 w-full max-w-[min(92vw,30rem)] mx-auto mt-3">
      {Array.from({ length: 9 }, (_, n) => {
        const d = n + 1
        const done = counts[d] >= 9
        return (
          <button
            key={d}
            onClick={() => onInput(d)}
            disabled={done}
            className={`aspect-square rounded-md text-[clamp(1.1rem,5vw,1.6rem)] font-semibold transition-colors ${
              done
                ? 'bg-[var(--bg)] text-[var(--line-soft)] cursor-default'
                : noteMode
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] active:scale-95'
                : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line-soft)] active:bg-[var(--accent-soft)]'
            }`}
          >
            {d}
          </button>
        )
      })}
    </div>
  )
}
