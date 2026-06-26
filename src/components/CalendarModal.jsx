import { useState } from 'react'
import { dateStrToday } from '../hooks/useDaily.js'

const DOW_LABELS = ['日', '一', '二', '三', '四', '五', '六']

function starsColor(stars) {
  if (stars >= 3) return '#22c55e'
  if (stars >= 2) return '#f59e0b'
  return '#94a3b8'
}

export default function CalendarModal({ records, onSelectDate, onClose }) {
  const today = dateStrToday()
  const todayD = new Date(today + 'T00:00:00')

  const [viewYear, setViewYear] = useState(todayD.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayD.getMonth())

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isPastOrToday = (ds) => ds <= today
  const isViewingFuture = viewYear > todayD.getFullYear() ||
    (viewYear === todayD.getFullYear() && viewMonth > todayD.getMonth())

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl p-5 pb-8"
        style={{ backgroundColor: 'var(--surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 月份導航 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="text-xl px-2 text-[var(--ink-soft)] active:text-[var(--accent)]"
          >
            ‹
          </button>
          <span className="font-bold text-[var(--ink)]">
            {viewYear} 年 {viewMonth + 1} 月
          </span>
          <button
            onClick={nextMonth}
            disabled={isViewingFuture}
            className="text-xl px-2 text-[var(--ink-soft)] active:text-[var(--accent)] disabled:opacity-30"
          >
            ›
          </button>
        </div>

        {/* 星期標頭 */}
        <div className="grid grid-cols-7 mb-1">
          {DOW_LABELS.map((l) => (
            <div key={l} className="text-center text-[0.65rem] text-[var(--ink-soft)] py-1">
              {l}
            </div>
          ))}
        </div>

        {/* 日期格 */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = ds === today
            const done = records[ds]
            const available = isPastOrToday(ds)

            return (
              <button
                key={ds}
                disabled={!available}
                onClick={() => { onSelectDate(ds); onClose() }}
                className="flex flex-col items-center py-1 rounded-lg transition-opacity"
                style={{ opacity: available ? 1 : 0.25 }}
              >
                <span
                  className="text-xs font-semibold leading-none"
                  style={{
                    color: isToday ? '#06b6d4' : done ? 'var(--ink)' : 'var(--ink-soft)',
                  }}
                >
                  {day}
                </span>
                <span className="text-[0.55rem] leading-none mt-0.5">
                  {done ? (
                    <span style={{ color: starsColor(done.stars) }}>
                      {'★'.repeat(done.stars)}{'☆'.repeat(3 - done.stars)}
                    </span>
                  ) : isToday ? (
                    <span style={{ color: '#06b6d4' }}>今</span>
                  ) : (
                    <span className="opacity-0">···</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-center text-[0.65rem] text-[var(--ink-soft)] mt-4">
          點擊任一天可補做或重玩
        </p>
      </div>
    </div>
  )
}
