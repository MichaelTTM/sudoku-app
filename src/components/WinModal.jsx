import { formatTime } from './Header.jsx'
import { starThresholds } from '../hooks/useProgress.js'

function Stars({ count }) {
  return (
    <div className="flex justify-center gap-1 text-3xl">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={n <= count ? '' : 'opacity-25 grayscale'}
          style={{ transition: 'opacity 0.3s', transitionDelay: `${n * 0.12}s` }}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-[var(--bg)] py-2">
      <div className="text-lg font-bold tabular-nums text-[var(--ink)]">{value}</div>
      <div className="text-[0.7rem] text-[var(--ink-soft)]">{label}</div>
    </div>
  )
}

// 過關視窗：星等 + 成績 + 劇情結尾 + 下一關/回地圖
export default function WinModal({ level, stars, seconds, mistakes, hintsUsed, hasNext, onNext, onBack }) {
  const t = starThresholds(level.difficulty)
  const penalty = mistakes + hintsUsed
  // 距離下一顆星還差多少（失誤+提示要再少幾次）
  const nextStarHint =
    stars === 3
      ? null
      : stars === 2
      ? `再少 ${penalty - t.three} 次失誤/提示就能拿三星`
      : `再少 ${penalty - t.two} 次失誤/提示就能拿二星`
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6 animate-[fade_0.2s_ease]">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--surface)] p-6 text-center shadow-xl animate-[pop_0.25s_ease]">
        <h2 className="text-xl font-bold text-[var(--ink)]">關卡完成！</h2>
        <div className="mt-3">
          <Stars count={stars} />
        </div>

        <p className="mt-4 text-sm text-[var(--ink)] leading-relaxed">{level.outro}</p>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Stat label="時間" value={formatTime(seconds)} />
          <Stat label="錯誤" value={mistakes} />
          <Stat label="提示" value={hintsUsed} />
        </div>

        <p className="mt-3 text-xs text-[var(--ink-soft)] leading-relaxed">
          本關三星標準：失誤＋提示 ≤ {t.three}
          {nextStarHint && <span className="block mt-0.5">{nextStarHint}</span>}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl border border-[var(--line-soft)] py-3 font-medium text-[var(--ink-soft)] active:scale-[0.98] transition-transform"
          >
            回地圖
          </button>
          {hasNext && (
            <button
              onClick={onNext}
              className="flex-[2] rounded-xl py-3 font-semibold text-white active:scale-[0.98] transition-transform"
              style={{ backgroundColor: level.accent }}
            >
              下一關 →
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pop { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  )
}
