import { BOX, SIZE } from '../game/generator.js'

// 單一格子：顯示正式數字或候選筆記，並依狀態套用高亮
export default function Cell({
  index,
  value,
  notes,
  given,
  selected,
  inSameUnit,
  sameValue,
  conflict,
  diagonal,
  onSelect,
}) {
  const r = Math.floor(index / SIZE)
  const c = index % SIZE

  // 粗線：宮的邊界
  const borders = [
    'border-l',
    'border-t',
    c % BOX === 0 ? 'border-l-2 border-l-[var(--line-strong)]' : '',
    r % BOX === 0 ? 'border-t-2 border-t-[var(--line-strong)]' : '',
    c === SIZE - 1 ? 'border-r-2 border-r-[var(--line-strong)]' : '',
    r === SIZE - 1 ? 'border-b-2 border-b-[var(--line-strong)]' : '',
  ].join(' ')

  let bg = 'bg-[var(--surface)]'
  if (diagonal) bg = 'bg-[var(--diag)]' // 對角線變體：淡色標示對角線格
  if (inSameUnit) bg = 'bg-[var(--accent-soft)]/40'
  if (sameValue) bg = 'bg-[var(--accent-soft)]'
  if (selected) bg = 'bg-[var(--accent-soft)]'

  let textColor = given ? 'text-[var(--given)] font-bold' : 'text-[var(--user)]'
  if (conflict) textColor = 'text-[var(--danger)] font-bold'

  return (
    <button
      onClick={() => onSelect(index)}
      className={`relative aspect-square w-full border-[var(--line-soft)] ${borders} ${bg} ${
        selected ? 'ring-2 ring-inset ring-[var(--accent)] z-10' : ''
      } transition-colors duration-100 flex items-center justify-center`}
    >
      {value ? (
        <span
          className={`text-[clamp(1rem,5.5vw,1.75rem)] leading-none ${textColor}`}
        >
          {value}
        </span>
      ) : notes.length ? (
        <span className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full p-[2px] text-[var(--ink-soft)]">
          {Array.from({ length: 9 }, (_, n) => (
            <span
              key={n}
              className="flex items-center justify-center text-[clamp(0.45rem,2vw,0.7rem)] leading-none"
            >
              {notes.includes(n + 1) ? n + 1 : ''}
            </span>
          ))}
        </span>
      ) : null}
    </button>
  )
}
