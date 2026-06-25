import { VARIANTS } from '../game/variants.js'

// 劇情台詞視窗：進關前顯示，按「開始」進入遊戲
export default function StoryModal({ level, onStart, onBack }) {
  const rule = VARIANTS[level.variant]?.rule
  const size = level.size || 9
  const sizeNote =
    size > 9
      ? `這是 ${size}×${size} 的大盤面，每行、列、宮都要不重複填滿 1~9 再接字母${
          size === 12 ? ' A、B、C' : ' A 到 G'
        }（共 ${size} 個符號）。`
      : null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6 animate-[fade_0.2s_ease]">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--surface)] p-6 shadow-xl animate-[pop_0.25s_ease]">
        <div
          className="text-xs font-semibold tracking-wide"
          style={{ color: level.accent }}
        >
          {level.chapterName} · 第 {level.label} 關
          {size > 9 && ` · ${size}×${size}`}
          {level.variant !== 'classic' && ` · ${level.variantLabel}`}
        </div>
        <p className="mt-3 text-[var(--ink)] leading-relaxed">{level.intro}</p>

        {sizeNote && (
          <div
            className="mt-3 rounded-xl p-3 text-sm leading-relaxed"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--ink)' }}
          >
            <span className="font-semibold" style={{ color: level.accent }}>
              大盤面：
            </span>
            {sizeNote}
          </div>
        )}

        {rule && (
          <div
            className="mt-3 rounded-xl p-3 text-sm leading-relaxed"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--ink)' }}
          >
            <span className="font-semibold" style={{ color: level.accent }}>
              新規則：
            </span>
            {rule}
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl border border-[var(--line-soft)] py-3 font-medium text-[var(--ink-soft)] active:scale-[0.98] transition-transform"
          >
            回地圖
          </button>
          <button
            onClick={onStart}
            className="flex-[2] rounded-xl py-3 font-semibold text-white active:scale-[0.98] transition-transform"
            style={{ backgroundColor: level.accent }}
          >
            開始
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pop { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  )
}
