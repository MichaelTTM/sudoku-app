import { useEffect, useState } from 'react'
import { useSudoku } from '../hooks/useSudoku.js'
import { calcStars } from '../hooks/useProgress.js'
import { valueFromKey } from '../game/variants.js'
import { nextLevelId, getLevel } from '../game/levels.js'
import Header from './Header.jsx'
import Board from './Board.jsx'
import NumberPad from './NumberPad.jsx'
import Controls from './Controls.jsx'
import WinModal from './WinModal.jsx'
import StoryModal from './StoryModal.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function GameScreen({ level, alreadyDone, theme, onToggleTheme, onWin, onExit, onGoLevel, onWinNext }) {
  // 已通關過的關卡重玩時不再顯示進場劇情
  const [showIntro, setShowIntro] = useState(!alreadyDone)
  const [result, setResult] = useState(null)

  const s = useSudoku(level, {
    onWin: (r) => {
      const stars = calcStars(r.mistakes, r.hintsUsed, level.difficulty)
      setResult({ ...r, stars })
      onWin(level.id, { ...r, stars })
    },
  })
  const { game, selected, setSelected, spec } = s
  const N = spec.size

  // 換關卡時 App 會以 key 重新掛載本元件，showIntro/result 自然回到初始值，
  // 因此不需要（也不能）用 effect 重置，否則過關當下 alreadyDone 變動會把 result 清掉。

  // 鍵盤操作
  useEffect(() => {
    const onKey = (e) => {
      if (game.status !== 'playing' || showIntro) return
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') s.erase()
      else if (e.key === 'z' && (e.metaKey || e.ctrlKey)) s.undo()
      else if (e.key.toLowerCase() === 'n') s.toggleNoteMode()
      else if (e.key.toLowerCase() === 'h') s.hint()
      else if (selected != null && e.key.startsWith('Arrow')) {
        e.preventDefault()
        let r = Math.floor(selected / N)
        let c = selected % N
        if (e.key === 'ArrowUp') r = Math.max(0, r - 1)
        if (e.key === 'ArrowDown') r = Math.min(N - 1, r + 1)
        if (e.key === 'ArrowLeft') c = Math.max(0, c - 1)
        if (e.key === 'ArrowRight') c = Math.min(N - 1, c + 1)
        setSelected(r * N + c)
      } else {
        const v = valueFromKey(e.key, N)
        if (v) s.inputDigit(v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [s, game.status, selected, setSelected, showIntro, N])

  const next = nextLevelId(level.id)

  return (
    <div className="min-h-full flex flex-col items-center py-6 px-3">
      <div className="w-full max-w-[min(92vw,30rem)]">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={onExit}
            className="text-sm text-[var(--ink-soft)] active:text-[var(--accent)]"
          >
            ← 回地圖
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <Header
          difficulty={game.difficulty}
          seconds={game.seconds}
          mistakes={game.mistakes}
          chapterName={level.chapterName}
          levelLabel={level.label}
          accent={level.accent}
          variant={level.variant}
          variantLabel={level.variantLabel}
          size={N}
        />
      </div>

      <Board
        board={game.board}
        notes={game.notes}
        puzzle={game.puzzle}
        selected={selected}
        conflicts={s.conflicts}
        activeValue={s.activeValue}
        onSelect={setSelected}
        spec={spec}
        cages={game.cages}
      />

      <Controls
        onUndo={s.undo}
        onErase={s.erase}
        onToggleNote={s.toggleNoteMode}
        onHint={s.hint}
        noteMode={s.noteMode}
      />

      <NumberPad board={game.board} onInput={s.inputDigit} noteMode={s.noteMode} spec={spec} />

      <button
        onClick={s.restart}
        className="mt-4 text-sm text-[var(--ink-soft)] underline underline-offset-4 active:text-[var(--accent)]"
      >
        重新挑戰這一關
      </button>

      {showIntro && (
        <StoryModal
          level={level}
          onStart={() => setShowIntro(false)}
          onBack={onExit}
        />
      )}

      {game.status === 'won' && result && (
        <WinModal
          level={level}
          stars={result.stars}
          seconds={result.seconds}
          mistakes={result.mistakes}
          hintsUsed={result.hintsUsed}
          hasNext={!!next}
          onNext={() => onWinNext ? onWinNext(level.id, next) : onGoLevel(getLevel(next))}
          onBack={onExit}
        />
      )}
    </div>
  )
}
