import { useState } from 'react'
import { getDailyLevel, dateStrToday } from '../hooks/useDaily.js'
import { DIFFICULTIES } from '../game/generator.js'
import CalendarModal from './CalendarModal.jsx'

export default function DailyEntryCard({ records, streak, onPlay }) {
  const [showCal, setShowCal] = useState(false)
  const today = dateStrToday()
  const level = getDailyLevel(today)
  const record = records[today]
  const diffLabel = DIFFICULTIES[level.difficulty]?.label ?? level.difficulty

  const variantBadge =
    level.variant !== 'classic' ? (
      <span
        className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold"
        style={{ backgroundColor: '#06b6d420', color: '#06b6d4' }}
      >
        {level.variantLabel}
      </span>
    ) : null

  return (
    <>
      <div
        className="mb-6 rounded-2xl border p-4"
        style={{ borderColor: '#06b6d440', backgroundColor: '#06b6d408' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-[var(--ink)]">🗓️ 今日謎題</span>
              {streak > 0 && (
                <span className="text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                  🔥 {streak} 天連勝
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[0.7rem] text-[var(--ink-soft)]">
              <span>{today.slice(5).replace('-', '/')}</span>
              <span>·</span>
              <span>{diffLabel}</span>
              {variantBadge && <>{variantBadge}</>}
            </div>
            {record ? (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-sm" style={{ color: '#22c55e' }}>
                  {'★'.repeat(record.stars)}{'☆'.repeat(3 - record.stars)}
                </span>
                <span className="text-[0.65rem] text-[var(--ink-soft)]">已完成</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setShowCal(true)}
              className="text-[0.65rem] text-[var(--ink-soft)] underline underline-offset-2 active:text-[var(--accent)]"
            >
              月曆
            </button>
            <button
              onClick={() => onPlay(today)}
              className="px-4 py-1.5 rounded-full text-sm font-bold text-white active:opacity-80"
              style={{ backgroundColor: '#06b6d4' }}
            >
              {record ? '重玩' : '挑戰'}
            </button>
          </div>
        </div>
      </div>

      {showCal && (
        <CalendarModal
          records={records}
          onSelectDate={(ds) => onPlay(ds)}
          onClose={() => setShowCal(false)}
        />
      )}
    </>
  )
}
