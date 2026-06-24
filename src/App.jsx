import { useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import MapScreen from './components/MapScreen.jsx'
import GameScreen from './components/GameScreen.jsx'

export default function App() {
  const progress = useProgress()
  const [activeLevel, setActiveLevel] = useState(null) // null = 顯示地圖

  return activeLevel ? (
    <GameScreen
      key={activeLevel.id}
      level={activeLevel}
      alreadyDone={!!progress.completed[activeLevel.id]}
      onWin={progress.recordWin}
      onExit={() => setActiveLevel(null)}
      onGoLevel={(lv) => setActiveLevel(lv)}
    />
  ) : (
    <MapScreen progress={progress} onSelect={setActiveLevel} />
  )
}
