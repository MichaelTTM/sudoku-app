// 單一格子：顯示正式符號或候選筆記，並依狀態套用高亮。
export default function Cell({
  index,
  value,
  symbol,
  notes,
  given,
  selected,
  inSameUnit,
  sameValue,
  conflict,
  diagonal,
  cage,
  spec,
  onSelect,
}) {
  const { size, boxRows, boxCols, regions, symbols } = spec
  const r = Math.floor(index / size)
  const c = index % size

  // 粗線：宮的邊界。不規則宮（有 regions）依「與左/上鄰格是否同宮」決定，
  // 否則用矩形宮（每 boxCols 欄 / boxRows 列一條粗線）。
  const thickLeft = regions
    ? c > 0 && regions[index] !== regions[index - 1]
    : c % boxCols === 0
  const thickTop = regions
    ? r > 0 && regions[index] !== regions[index - size]
    : r % boxRows === 0
  const borders = [
    'border-l',
    'border-t',
    thickLeft ? 'border-l-2 border-l-[var(--line-strong)]' : '',
    thickTop ? 'border-t-2 border-t-[var(--line-strong)]' : '',
    c === size - 1 ? 'border-r-2 border-r-[var(--line-strong)]' : '',
    r === size - 1 ? 'border-b-2 border-b-[var(--line-strong)]' : '',
  ].join(' ')

  let bg = 'bg-[var(--surface)]'
  if (diagonal) bg = 'bg-[var(--diag)]' // 對角線變體：淡色標示對角線格
  if (inSameUnit) bg = 'bg-[var(--accent-soft)]/40'
  if (sameValue) bg = 'bg-[var(--accent-soft)]'
  if (selected) bg = 'bg-[var(--accent-soft)]'

  let textColor = given ? 'text-[var(--given)] font-bold' : 'text-[var(--user)]'
  if (conflict) textColor = 'text-[var(--danger)] font-bold'

  // 盤越大格越小，字級對應縮小（9 / 12 / 16）。
  const valueFont =
    size <= 9 ? 'clamp(1rem,5.5vw,1.75rem)' : size <= 12 ? 'clamp(0.7rem,4vw,1.25rem)' : 'clamp(0.55rem,3vw,1rem)'

  return (
    <button
      onClick={() => onSelect(index)}
      className={`relative aspect-square w-full border-[var(--line-soft)] ${borders} ${bg} ${
        selected ? 'ring-2 ring-inset ring-[var(--accent)] z-10' : ''
      } transition-colors duration-100 flex items-center justify-center`}
    >
      {/* killer：籠子虛線外框（內縮）＋ 左上角加總 */}
      {cage && (
        <span
          className="pointer-events-none absolute z-[1]"
          style={{
            inset: '3px',
            borderTop: cage.top ? '1.5px dashed var(--ink-soft)' : 'none',
            borderLeft: cage.left ? '1.5px dashed var(--ink-soft)' : 'none',
            borderRight: cage.right ? '1.5px dashed var(--ink-soft)' : 'none',
            borderBottom: cage.bottom ? '1.5px dashed var(--ink-soft)' : 'none',
          }}
        />
      )}
      {cage && cage.sum != null && (
        <span className="pointer-events-none absolute left-[3px] top-[1px] z-[2] text-[0.5rem] font-bold leading-none text-[var(--ink)]">
          {cage.sum}
        </span>
      )}
      {value ? (
        <span className={`leading-none ${textColor}`} style={{ fontSize: valueFont }}>
          {symbol}
        </span>
      ) : notes.length ? (
        <span
          className="grid gap-0 w-full h-full p-[1px] text-[var(--ink-soft)]"
          style={{ gridTemplateColumns: `repeat(${boxCols}, minmax(0,1fr))` }}
        >
          {Array.from({ length: size }, (_, n) => (
            <span
              key={n}
              className="flex items-center justify-center leading-none"
              style={{ fontSize: 'clamp(0.4rem,1.7vw,0.65rem)' }}
            >
              {notes.includes(n + 1) ? symbols[n + 1] : ''}
            </span>
          ))}
        </span>
      ) : null}
    </button>
  )
}
