import { useState, useCallback } from 'react'

const DAILY_KEY = 'sudoku.daily.v1'

// 每週輪換：週日/一/四=經典、週二/五=對角線、週三/六=不規則宮
const VARIANTS = ['classic', 'classic', 'diagonal', 'jigsaw', 'classic', 'diagonal', 'jigsaw']
// 難度：週一易、週二中、週三難、週四中、週五難、週六中、週日易
const DIFFS = ['easy', 'medium', 'medium', 'hard', 'medium', 'hard', 'medium']

export function dateStrToday() {
  return new Date().toISOString().slice(0, 10)
}

export function getDailyLevel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay()
  const variant = VARIANTS[dow]
  const difficulty = DIFFS[dow]
  // seed = 日期數字 mod large prime，確保在 mulberry32 安全範圍
  const num = parseInt(dateStr.replace(/-/g, ''), 10)
  const seed = num % 2147483647

  const variantLabel =
    variant === 'diagonal' ? '對角線' : variant === 'jigsaw' ? '不規則宮' : '經典'

  return {
    id: `daily-${dateStr}`,
    seed,
    difficulty,
    variant,
    size: 9,
    label: dateStr.slice(5),   // MM-DD，顯示用
    accent: '#06b6d4',
    chapterName: '每日謎題',
    variantLabel,
    isDaily: true,
    dateStr,
  }
}

export function useDaily() {
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DAILY_KEY)) || {}
    } catch {
      return {}
    }
  })

  const saveRecord = useCallback((dateStr, result) => {
    setRecords((prev) => {
      // 不覆蓋已有更好成績（stars 較高優先）
      const existing = prev[dateStr]
      if (existing && existing.stars >= result.stars) return prev
      const next = { ...prev, [dateStr]: result }
      try {
        localStorage.setItem(DAILY_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  function calcStreak(today) {
    let streak = 0
    const d = new Date(today + 'T00:00:00')
    if (!records[today]) d.setDate(d.getDate() - 1)
    while (true) {
      const ds = d.toISOString().slice(0, 10)
      if (!records[ds]) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }

  return { records, saveRecord, calcStreak }
}
