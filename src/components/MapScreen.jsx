import { CHAPTERS, STORY, LEVELS } from '../game/levels.js'
import { DIFFICULTIES } from '../game/generator.js'
import ThemeToggle from './ThemeToggle.jsx'

function MiniStars({ count }) {
  return (
    <div className="flex gap-0.5 text-[0.6rem] leading-none mt-1">
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= count ? '' : 'opacity-25 grayscale'}>
          ⭐
        </span>
      ))}
    </div>
  )
}

function LevelNode({ level, index, state, record, onSelect }) {
  const locked = state === 'locked'
  const done = state === 'done'
  // 蜿蜒排列：偶數靠左、奇數靠右
  const side = index % 2 === 0 ? 'self-start ml-6' : 'self-end mr-6'

  const isVariant = level.variant && level.variant !== 'classic'

  return (
    <button
      disabled={locked}
      onClick={() => onSelect(level)}
      className={`${side} flex flex-col items-center transition-transform ${
        locked ? 'cursor-default' : 'active:scale-95'
      }`}
    >
      <div className="relative">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold shadow-sm border-2"
          style={{
            backgroundColor: locked ? 'var(--bg)' : done ? level.accent : 'var(--surface)',
            borderColor: locked ? 'var(--line-soft)' : level.accent,
            color: locked ? 'var(--line-soft)' : done ? '#fff' : level.accent,
          }}
        >
          {locked ? '🔒' : done ? '★' : level.label}
        </div>
        {isVariant && !locked && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold text-white shadow"
            style={{ backgroundColor: level.accent }}
          >
            {level.variant === 'jigsaw' ? '▦' : '✕'}
          </span>
        )}
      </div>
      {done ? (
        <MiniStars count={record?.stars || 0} />
      ) : (
        <span className="mt-1 text-[0.6rem] text-[var(--ink-soft)]">
          {locked
            ? '未解鎖'
            : isVariant
            ? level.variantLabel
            : DIFFICULTIES[level.difficulty].label}
        </span>
      )}
    </button>
  )
}

export default function MapScreen({ progress, onSelect, theme, onToggleTheme }) {
  let flatIndex = 0
  return (
    <div className="relative min-h-full w-full max-w-[min(92vw,30rem)] mx-auto px-3 py-6">
      <div className="absolute right-3 top-6">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      {/* 故事標題與總進度 */}
      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[var(--ink)]">
          {STORY.title}
        </h1>
        <p className="text-sm text-[var(--ink-soft)]">{STORY.subtitle}</p>
        <div className="mt-3 flex justify-center gap-4 text-sm text-[var(--ink-soft)]">
          <span>
            進度{' '}
            <span className="font-semibold text-[var(--ink)]">
              {progress.clearedCount}/{LEVELS.length}
            </span>
          </span>
          <span>
            ⭐{' '}
            <span className="font-semibold text-[var(--ink)]">
              {progress.totalStars}/{LEVELS.length * 3}
            </span>
          </span>
        </div>
      </header>

      <p className="text-xs text-[var(--ink-soft)] leading-relaxed bg-[var(--surface)] rounded-xl p-3 mb-6 border border-[var(--line-soft)]">
        {STORY.intro}
      </p>

      {CHAPTERS.map((chapter) => (
        <section key={chapter.id} className="mb-8">
          <div
            className="flex items-center gap-2 mb-4 pl-1 border-l-4 py-1"
            style={{ borderColor: chapter.accent }}
          >
            <span className="text-xl">{chapter.emoji}</span>
            <div>
              <h2 className="font-bold text-[var(--ink)] leading-tight">{chapter.name}</h2>
              <p className="text-[0.7rem] text-[var(--ink-soft)]">{chapter.desc}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {chapter.levels.map((_, li) => {
              const level = LEVELS.find(
                (l) => l.id === `${CHAPTERS.indexOf(chapter) + 1}-${li + 1}`
              )
              const record = progress.completed[level.id]
              const state = record
                ? 'done'
                : progress.isUnlocked(level.id)
                ? 'open'
                : 'locked'
              const node = (
                <LevelNode
                  key={level.id}
                  level={level}
                  index={flatIndex}
                  state={state}
                  record={record}
                  onSelect={onSelect}
                />
              )
              flatIndex += 1
              return node
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
