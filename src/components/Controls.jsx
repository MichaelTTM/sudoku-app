// 操作列：復原、清除、筆記模式、提示
function IconButton({ label, sub, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-[var(--accent)] text-white'
          : 'bg-[var(--surface)] border border-[var(--line-soft)] text-[var(--ink)] active:bg-[var(--accent-soft)]'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      <span className="text-base leading-none">{label}</span>
      {sub != null && <span className="text-[0.65rem] leading-none">{sub}</span>}
    </button>
  )
}

export default function Controls({ onUndo, onErase, onToggleNote, onHint, noteMode }) {
  return (
    <div className="flex gap-2 w-full max-w-[min(92vw,30rem)] mx-auto mt-3">
      <IconButton label="↶" sub="復原" onClick={onUndo} />
      <IconButton label="⌫" sub="清除" onClick={onErase} />
      <IconButton label="✎" sub="筆記" active={noteMode} onClick={onToggleNote} />
      <IconButton label="💡" sub="提示" onClick={onHint} />
    </div>
  )
}
