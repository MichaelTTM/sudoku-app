import Cell from './Cell.jsx'
import { SIZE } from '../game/generator.js'
import { DIAGONAL_CELLS } from '../game/variants.js'

// 9×9 盤面：負責把每格的高亮狀態算好後交給 Cell
export default function Board({
  board,
  notes,
  puzzle,
  selected,
  conflicts,
  activeValue,
  onSelect,
  variant = 'classic',
}) {
  const showDiagonal = variant === 'diagonal'
  const selR = selected != null ? Math.floor(selected / SIZE) : -1
  const selC = selected != null ? selected % SIZE : -1
  const selBox =
    selected != null
      ? Math.floor(selR / 3) * 3 + Math.floor(selC / 3)
      : -1

  return (
    <div className="grid grid-cols-9 w-full max-w-[min(92vw,30rem)] mx-auto rounded-md overflow-hidden border-2 border-[var(--line-strong)] bg-[var(--surface)] shadow-sm select-none">
      {board.map((value, i) => {
        const r = Math.floor(i / SIZE)
        const c = i % SIZE
        const box = Math.floor(r / 3) * 3 + Math.floor(c / 3)
        const inSameUnit =
          selected != null &&
          i !== selected &&
          (r === selR || c === selC || box === selBox)
        const sameValue =
          activeValue !== 0 && value === activeValue && i !== selected
        return (
          <Cell
            key={i}
            index={i}
            value={value}
            notes={notes[i]}
            given={puzzle[i] !== 0}
            selected={i === selected}
            inSameUnit={inSameUnit}
            sameValue={sameValue}
            conflict={conflicts.has(i)}
            diagonal={showDiagonal && DIAGONAL_CELLS.has(i)}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}
