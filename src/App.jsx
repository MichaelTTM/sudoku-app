import { useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { useTheme } from './hooks/useTheme.js'
import { useDaily, getDailyLevel } from './hooks/useDaily.js'
import MapScreen from './components/MapScreen.jsx'
import GameScreen from './components/GameScreen.jsx'

export default function App() {
  const progress = useProgress()
  const { theme, toggle } = useTheme()
  const { records, saveRecord, calcStreak } = useDaily()
  const [activeLevel, setActiveLevel] = useState(null)   // null = 顯示地圖
  const [mapReturn, setMapReturn] = useState(null)        // { fromId, toId }
  const [activeDailyDate, setActiveDailyDate] = useState(null) // 'YYYY-MM-DD'

  function handleWinNext(fromId, toId) {
    setActiveLevel(null)
    setMapReturn({ fromId, toId })
  }

  function handleMapReturnDone(nextLevel) {
    setMapReturn(null)
    setActiveLevel(nextLevel)
  }

  function handleDailyWin(dateStr, result) {
    saveRecord(dateStr, result)
  }

  const today = new Date().toISOString().slice(0, 10)
  const streak = calcStreak(today)

  // 每日謎題畫面
  if (activeDailyDate) {
    const dailyLevel = getDailyLevel(activeDailyDate)
    return (
      <GameScreen
        key={dailyLevel.id}
        level={dailyLevel}
        alreadyDone={true}
        theme={theme}
        onToggleTheme={toggle}
        onWin={(id, r) => handleDailyWin(activeDailyDate, r)}
        onExit={() => setActiveDailyDate(null)}
        onGoLevel={() => setActiveDailyDate(null)}
        onWinNext={null}
      />
    )
  }

  // 章節關卡畫面
  if (activeLevel) {
    return (
      <GameScreen
        key={activeLevel.id}
        level={activeLevel}
        alreadyDone={!!progress.completed[activeLevel.id]}
        theme={theme}
        onToggleTheme={toggle}
        onWin={progress.recordWin}
        onExit={() => setActiveLevel(null)}
        onGoLevel={(lv) => setActiveLevel(lv)}
        onWinNext={handleWinNext}
      />
    )
  }

  return (
    <MapScreen
      progress={progress}
      theme={theme}
      onToggleTheme={toggle}
      onSelect={setActiveLevel}
      returnState={mapReturn}
      onReturnDone={handleMapReturnDone}
      dailyRecords={records}
      dailyStreak={streak}
      onPlayDaily={setActiveDailyDate}
    />
  )
}
