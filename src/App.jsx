import { useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { useTheme } from './hooks/useTheme.js'
import { getLevel } from './game/levels.js'
import MapScreen from './components/MapScreen.jsx'
import GameScreen from './components/GameScreen.jsx'

export default function App() {
  const progress = useProgress()
  const { theme, toggle } = useTheme()
  const [activeLevel, setActiveLevel] = useState(null) // null = 顯示地圖
  const [mapReturn, setMapReturn] = useState(null) // { fromId, toId } 過關動畫用

  function handleWinNext(fromId, toId) {
    setActiveLevel(null)
    setMapReturn({ fromId, toId })
  }

  function handleMapReturnDone(nextLevel) {
    setMapReturn(null)
    setActiveLevel(nextLevel)
  }

  return activeLevel ? (
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
  ) : (
    <MapScreen
      progress={progress}
      theme={theme}
      onToggleTheme={toggle}
      onSelect={setActiveLevel}
      returnState={mapReturn}
      onReturnDone={handleMapReturnDone}
    />
  )
}
