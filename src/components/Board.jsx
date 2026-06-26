import Cell from './Cell.jsx'

// 盤面（9/12/16）：依 spec 算好每格高亮狀態後交給 Cell。
// sandwichClues: { rowClues: number[], colClues: number[] } | null
export default function Board({
  board,
  notes,
  puzzle,
  selected,
  conflicts,
  activeValue,
  onSelect,
  spec,
  cages,
  sandwichClues,
}) {
  const { size, boxRows, boxCols, regions, diagonalCells, symbols } = spec

  // killer：算每格所屬籠子、籠子加總標籤位置（籠內最小 index 的格），以及籠子邊界。
  let cageOf = null
  let cageSumAt = null
  if (spec.killer && cages) {
    cageOf = new Array(size * size).fill(-1)
    cageSumAt = new Array(size * size).fill(null)
    cages.forEach((cg, id) => {
      cg.cells.forEach((c) => (cageOf[c] = id))
      const labelCell = Math.min(...cg.cells)
      cageSumAt[labelCell] = cg.sum
    })
  }
  const selR = selected != null ? Math.floor(selected / size) : -1
  const selC = selected != null ? selected % size : -1
  // 同宮高亮的單位：不規則宮用所屬宮，否則用矩形宮（boxRows×boxCols）。
  const boxesPerRow = size / boxCols
  const boxIdOf = (r, c) => Math.floor(r / boxRows) * boxesPerRow + Math.floor(c / boxCols)
  const selUnit =
    selected == null ? -1 : regions ? regions[selected] : boxIdOf(selR, selC)

  const grid = (
    <div
      className="grid w-full rounded-md overflow-hidden border-2 border-[var(--line-strong)] bg-[var(--surface)] shadow-sm select-none"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {board.map((value, i) => {
        const r = Math.floor(i / size)
        const c = i % size
        const unit = regions ? regions[i] : boxIdOf(r, c)
        const inSameUnit =
          selected != null &&
          i !== selected &&
          (r === selR || c === selC || unit === selUnit)
        const sameValue = activeValue !== 0 && value === activeValue && i !== selected
        // killer 籠子邊界：鄰格不同籠（或盤邊）即為籠界
        let cage = null
        if (cageOf) {
          const id = cageOf[i]
          const diff = (j, edge) => edge || cageOf[j] !== id
          cage = {
            sum: cageSumAt[i],
            top: diff(i - size, r === 0),
            left: diff(i - 1, c === 0),
            right: diff(i + 1, c === size - 1),
            bottom: diff(i + size, r === size - 1),
          }
        }
        return (
          <Cell
            key={i}
            index={i}
            value={value}
            symbol={symbols[value]}
            notes={notes[i]}
            given={puzzle[i] !== 0}
            selected={i === selected}
            inSameUnit={inSameUnit}
            sameValue={sameValue}
            conflict={conflicts.has(i)}
            diagonal={diagonalCells ? diagonalCells.has(i) : false}
            cage={cage}
            spec={spec}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )

  // 三明治變體：盤外線索（上方 col clues、左側 row clues）
  if (!sandwichClues) return <div className="w-full max-w-[min(94vw,32rem)] mx-auto">{grid}</div>

  const { rowClues, colClues } = sandwichClues
  const clueStyle = {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: 1,
  }

  return (
    <div className="w-full max-w-[min(94vw,32rem)] mx-auto" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridTemplateRows: 'auto 1fr', gap: 2 }}>
      {/* 左上角空格 */}
      <div />
      {/* 上方 col clues */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {colClues.map((v, c) => (
          <div key={c} className="flex items-end justify-center pb-0.5" style={clueStyle}>{v}</div>
        ))}
      </div>
      {/* 左側 row clues */}
      <div style={{ display: 'grid', gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}>
        {rowClues.map((v, r) => (
          <div key={r} className="flex items-center justify-end pr-1" style={clueStyle}>{v}</div>
        ))}
      </div>
      {/* 主盤 */}
      {grid}
    </div>
  )
}
