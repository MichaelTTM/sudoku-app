import { useCallback, useState } from 'react'
import { LEVEL_ORDER } from '../game/levels.js'

const KEY = 'sudoku.progress.v1'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return raw && typeof raw === 'object' ? raw : {}
  } catch {
    return {}
  }
}

// 各難度的星等門檻：門檻值 = 失誤次數 + 提示次數 的合計上限
// 越難的關卡越寬鬆（容許更多失誤/提示仍給高星）
export const STAR_THRESHOLDS = {
  starter: { three: 0, two: 2 },
  easy: { three: 1, two: 3 },
  medium: { three: 2, two: 5 },
  hard: { three: 3, two: 7 },
}

export function starThresholds(difficulty = 'medium') {
  return STAR_THRESHOLDS[difficulty] || STAR_THRESHOLDS.medium
}

// 依難度與「失誤+提示」合計計算星等（1~3）
export function calcStars(mistakes, hintsUsed, difficulty = 'medium') {
  const t = starThresholds(difficulty)
  const penalty = mistakes + hintsUsed
  if (penalty <= t.three) return 3
  if (penalty <= t.two) return 2
  return 1
}

export function useProgress() {
  const [completed, setCompleted] = useState(load) // { [levelId]: { stars, seconds, mistakes, hintsUsed } }

  const recordWin = useCallback((levelId, result) => {
    setCompleted((prev) => {
      const old = prev[levelId]
      // 只保留更好的成績（星等優先，其次時間）
      if (
        old &&
        (old.stars > result.stars ||
          (old.stars === result.stars && old.seconds <= result.seconds))
      ) {
        return prev
      }
      const next = { ...prev, [levelId]: result }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setCompleted({})
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }, [])

  // 第一關永遠解鎖；其餘關卡需前一關完成才解鎖
  const isUnlocked = useCallback(
    (levelId) => {
      const i = LEVEL_ORDER.indexOf(levelId)
      if (i <= 0) return true
      return !!completed[LEVEL_ORDER[i - 1]]
    },
    [completed]
  )

  const totalStars = Object.values(completed).reduce((s, r) => s + r.stars, 0)
  const clearedCount = Object.keys(completed).length

  return { completed, recordWin, reset, isUnlocked, totalStars, clearedCount }
}
