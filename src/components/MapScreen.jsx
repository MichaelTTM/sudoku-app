import { forwardRef, useRef, useEffect, useState, useMemo } from 'react'
import { CHAPTERS, STORY, LEVELS } from '../game/levels.js'
import { DIFFICULTIES } from '../game/generator.js'
import ThemeToggle from './ThemeToggle.jsx'
import DailyEntryCard from './DailyEntryCard.jsx'

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

const LevelNode = forwardRef(function LevelNode(
  { level, index, state, record, onSelect, pulsing, glowing },
  ref
) {
  const locked = state === 'locked'
  const done = state === 'done'
  const open = state === 'open'
  const side = index % 2 === 0 ? 'self-start ml-6' : 'self-end mr-6'
  const isVariant = level.variant && level.variant !== 'classic'

  return (
    <button
      ref={ref}
      disabled={locked}
      onClick={() => onSelect(level)}
      className={`${side} flex flex-col items-center transition-transform ${
        locked ? 'cursor-default' : 'active:scale-95'
      }`}
    >
      <div className="relative">
        {/* Outer glow ring for open/current node */}
        {(glowing || open) && !done && !locked && (
          <span
            className="absolute -inset-2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${level.accent}30 0%, transparent 70%)`,
              animation: 'breathe 2s ease-in-out infinite',
            }}
          />
        )}
        {/* Ping ring for post-win animation */}
        {pulsing && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-50"
            style={{ backgroundColor: level.accent }}
          />
        )}
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold border-2"
          style={{
            backgroundColor: locked ? 'var(--bg)' : done ? level.accent : 'var(--surface)',
            borderColor: locked ? 'var(--line-soft)' : level.accent,
            color: locked ? 'var(--line-soft)' : done ? '#fff' : level.accent,
            boxShadow: open && !done
              ? `0 0 0 3px ${level.accent}40, 0 0 16px ${level.accent}30`
              : done
              ? `0 2px 8px ${level.accent}50`
              : 'none',
          }}
        >
          {locked ? '🔒' : done ? '✓' : level.label}
        </div>
        {isVariant && !locked && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold text-white shadow z-10"
            style={{ backgroundColor: level.accent }}
          >
            {level.variant === 'jigsaw' ? '▦' : level.variant === 'killer' ? '∑' : level.variant === 'sandwich' ? '🥪' : '✕'}
          </span>
        )}
      </div>
      {done ? (
        <MiniStars count={record?.stars || 0} />
      ) : (
        <span
          className="mt-1 text-[0.6rem] leading-tight text-center"
          style={{ color: pulsing ? level.accent : 'var(--ink-soft)', fontWeight: pulsing ? 600 : 400 }}
        >
          {locked
            ? '未解鎖'
            : pulsing
            ? '點我繼續 →'
            : isVariant
            ? level.variantLabel
            : DIFFICULTIES[level.difficulty].label}
        </span>
      )}
    </button>
  )
})

// 元素中心相對於 container 的座標（走 offsetParent 鏈）
function offsetInContainer(el, container) {
  let x = el.offsetWidth / 2
  let y = el.offsetHeight / 2
  let cur = el
  while (cur && cur !== container) {
    x += cur.offsetLeft
    y += cur.offsetTop
    cur = cur.offsetParent
  }
  return { x, y }
}

// 計算 bezier 控制點（垂直偏移造成弧線）
function bezierCtrl(x1, y1, x2, y2, amount = 32) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  return { cx: mx + (-dy / len) * amount, cy: my + (dx / len) * amount }
}

export default function MapScreen({ progress, onSelect, theme, onToggleTheme, returnState, onReturnDone, dailyRecords, dailyStreak, onPlayDaily }) {
  const nodeRefs = useRef({})
  const containerRef = useRef(null)
  const [nodePositions, setNodePositions] = useState({}) // { levelId: {x, y} }
  const [containerH, setContainerH] = useState(2000)
  const [animLine, setAnimLine] = useState(null) // { x1,y1,x2,y2,cx,cy,len,color,pathD }
  const [pulsingId, setPulsingId] = useState(null)

  // 量測所有節點座標（掛載後一次）
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => {
      const positions = {}
      LEVELS.forEach((lv) => {
        const el = nodeRefs.current[lv.id]
        if (el) positions[lv.id] = offsetInContainer(el, container)
      })
      setNodePositions(positions)
      setContainerH(container.scrollHeight)
    }
    const t = setTimeout(measure, 120)
    return () => clearTimeout(t)
  }, [])

  // 靜態路徑：由 nodePositions + progress 推導
  const staticPaths = useMemo(() => {
    if (Object.keys(nodePositions).length === 0) return []
    return LEVELS.slice(0, -1).map((lv, i) => {
      const nextLv = LEVELS[i + 1]
      const fp = nodePositions[lv.id]
      const tp = nodePositions[nextLv.id]
      if (!fp || !tp) return null
      const fromDone = !!progress.completed[lv.id]
      const toDone = !!progress.completed[nextLv.id]
      const toOpen = !toDone && progress.isUnlocked(nextLv.id)
      const type = fromDone && toDone ? 'done' : fromDone && toOpen ? 'active' : 'locked'
      const { cx, cy } = bezierCtrl(fp.x, fp.y, tp.x, tp.y)
      return { x1: fp.x, y1: fp.y, x2: tp.x, y2: tp.y, cx, cy, type, color: nextLv.accent }
    }).filter(Boolean)
  }, [nodePositions, progress])

  // 過關動畫
  useEffect(() => {
    if (!returnState) {
      setAnimLine(null)
      setPulsingId(null)
      return
    }
    const { fromId, toId } = returnState
    const container = containerRef.current
    if (!container) return

    const fromEl = nodeRefs.current[fromId]
    if (fromEl) fromEl.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const t1 = setTimeout(() => {
      const fromEl2 = nodeRefs.current[fromId]
      const toEl = nodeRefs.current[toId]
      if (!fromEl2 || !toEl) return

      setContainerH(container.scrollHeight)
      const fp = offsetInContainer(fromEl2, container)
      const tp = offsetInContainer(toEl, container)
      const len = Math.hypot(tp.x - fp.x, tp.y - fp.y)
      const { cx, cy } = bezierCtrl(fp.x, fp.y, tp.x, tp.y)
      const pathD = `M ${fp.x} ${fp.y} Q ${cx} ${cy} ${tp.x} ${tp.y}`
      const toLevel = LEVELS.find((l) => l.id === toId)

      setAnimLine({ x1: fp.x, y1: fp.y, x2: tp.x, y2: tp.y, cx, cy, len: len * 1.1, color: toLevel?.accent ?? '#38bdf8', pathD })

      const t2 = setTimeout(() => {
        nodeRefs.current[toId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setPulsingId(toId)
      }, 950)
      return () => clearTimeout(t2)
    }, 450)
    return () => clearTimeout(t1)
  }, [returnState])

  // 找最靠前的 open（可玩）節點 id
  const firstOpenId = useMemo(() => {
    const lv = LEVELS.find(l => !progress.completed[l.id] && progress.isUnlocked(l.id))
    return lv?.id ?? null
  }, [progress])

  function handleSelect(level) {
    if (returnState) {
      if (level.id === returnState.toId) {
        setAnimLine(null)
        setPulsingId(null)
        onReturnDone(level)
      }
    } else {
      onSelect(level)
    }
  }

  const showSvg = staticPaths.length > 0 || !!animLine

  let flatIndex = 0
  return (
    <div ref={containerRef} className="relative min-h-full w-full max-w-[min(92vw,30rem)] mx-auto px-3 py-6">

      {showSvg && (
        <svg
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ zIndex: 5, width: '100%', height: containerH }}
        >
          <defs>
            <filter id="pathGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 靜態路徑：done=實線，active=虛線彩色，locked=灰色虛線 */}
          {staticPaths.map((p, i) => {
            const d = `M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`
            if (p.type === 'done') {
              return (
                <path key={i} d={d} fill="none"
                  stroke={p.color} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
              )
            }
            if (p.type === 'active') {
              return (
                <path key={i} d={d} fill="none"
                  stroke={p.color} strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="6 5" opacity="0.65" />
              )
            }
            return (
              <path key={i} d={d} fill="none"
                stroke="var(--line-soft)" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="3 7" opacity="0.35" />
            )
          })}

          {/* 過關動畫路線 */}
          {animLine && (
            <>
              {/* 底層暈光虛線 */}
              <path
                d={animLine.pathD} fill="none"
                stroke={animLine.color} strokeWidth="6"
                strokeLinecap="round" opacity="0.15"
                strokeDasharray={animLine.len} strokeDashoffset={animLine.len}
                style={{ animation: 'mapDrawPath 0.8s ease forwards' }}
              />
              {/* 主線 */}
              <path
                d={animLine.pathD} fill="none"
                stroke={animLine.color} strokeWidth="3"
                strokeLinecap="round"
                filter="url(#pathGlow)"
                strokeDasharray={animLine.len} strokeDashoffset={animLine.len}
                style={{ animation: 'mapDrawPath 0.8s ease forwards' }}
              />
              {/* 移動小點 */}
              <circle r="5" fill={animLine.color} filter="url(#pathGlow)">
                <animateMotion dur="0.8s" fill="freeze" path={animLine.pathD} />
              </circle>
              {/* 終點爆閃 */}
              <circle cx={animLine.x2} cy={animLine.y2} r="9"
                fill={animLine.color} opacity="0"
                style={{ animation: 'mapDotPop 0.4s ease 0.8s forwards' }}
              />
              <circle cx={animLine.x2} cy={animLine.y2} r="5"
                fill={animLine.color} opacity="0"
                style={{ animation: 'mapDotAppear 0.3s ease 0.85s forwards' }}
              />
            </>
          )}
        </svg>
      )}

      <div className="absolute right-3 top-6">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-[var(--ink)]">{STORY.title}</h1>
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

      {onPlayDaily && (
        <DailyEntryCard
          records={dailyRecords || {}}
          streak={dailyStreak || 0}
          onPlay={onPlayDaily}
        />
      )}

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
            {LEVELS.filter((l) => l.chapterId === chapter.id).map((level) => {
              const record = progress.completed[level.id]
              const state = record
                ? 'done'
                : progress.isUnlocked(level.id)
                ? 'open'
                : 'locked'
              const node = (
                <LevelNode
                  key={level.id}
                  ref={(el) => { nodeRefs.current[level.id] = el }}
                  level={level}
                  index={flatIndex}
                  state={state}
                  record={record}
                  onSelect={handleSelect}
                  pulsing={pulsingId === level.id}
                  glowing={level.id === firstOpenId && !pulsingId}
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
