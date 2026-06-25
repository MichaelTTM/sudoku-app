import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { generate, conflictsAt, isSolved } from '../game/generator.js'
import { makeRng } from '../game/rng.js'
import { makeSpec } from '../game/variants.js'
import { cageConflicts } from '../game/killer.js'
import { KILLER_PUZZLES } from '../game/killerData.js'

const SAVE_KEY = 'sudoku.save.v3'

const emptyNotes = (cells) => Array.from({ length: cells }, () => [])

// 緊湊籠子 [sum, ...cells] → { sum, cells }
const expandCages = (compact) => compact.map(([sum, ...cells]) => ({ sum, cells }))

// 還原同一關未完成的進度（只在 levelId 相符時使用）
function loadSave(levelId, cells) {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY))
    if (!raw || raw.levelId !== levelId) return null
    if (!Array.isArray(raw.board) || raw.board.length !== cells) return null
    return raw
  } catch {
    return null
  }
}

// 依關卡的固定 seed 產生題目（同一關永遠同一題）。
// killer 變體用預烘焙資料（runtime 產題太慢），其餘尺寸/變體即時由 seed 產生。
function createGame(level, spec) {
  const variant = level.variant || 'classic'
  let puzzle
  let solution
  let cages = null
  if (spec.killer) {
    const data = KILLER_PUZZLES[level.seed]
    solution = data.solution.slice()
    puzzle = new Array(spec.cells).fill(0)
    for (const [i, v] of data.givens) puzzle[i] = v
    cages = expandCages(data.cages)
  } else {
    ;({ puzzle, solution } = generate(level.difficulty, makeRng(level.seed), spec))
  }
  return {
    levelId: level.id,
    difficulty: level.difficulty,
    variant,
    puzzle,
    solution,
    cages,
    board: puzzle.slice(),
    notes: emptyNotes(spec.cells),
    seconds: 0,
    mistakes: 0,
    hintsUsed: 0,
    status: 'playing',
  }
}

export function useSudoku(level, { onWin } = {}) {
  const spec = useMemo(
    () => makeSpec(level.size || 9, level.variant || 'classic'),
    [level.size, level.variant]
  )
  const [game, setGame] = useState(
    () => loadSave(level.id, spec.cells) || createGame(level, spec)
  )
  const [selected, setSelected] = useState(null)
  const [noteMode, setNoteMode] = useState(false)
  const history = useRef([])
  const wonReported = useRef(false)
  const peers = spec.peers

  // 切換到不同關卡時，重建（或還原）該關的局面
  useEffect(() => {
    history.current = []
    wonReported.current = false
    setSelected(null)
    setNoteMode(false)
    setGame(loadSave(level.id, spec.cells) || createGame(level, spec))
  }, [level.id])

  // 計時器
  useEffect(() => {
    if (game.status !== 'playing') return
    const t = setInterval(() => {
      setGame((g) => (g.status === 'playing' ? { ...g, seconds: g.seconds + 1 } : g))
    }, 1000)
    return () => clearInterval(t)
  }, [game.status])

  // 自動保存目前這關進度
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game))
    } catch {
      /* ignore */
    }
  }, [game])

  // 過關時回報一次成績
  useEffect(() => {
    if (game.status === 'won' && !wonReported.current) {
      wonReported.current = true
      onWin?.({
        levelId: game.levelId,
        seconds: game.seconds,
        mistakes: game.mistakes,
        hintsUsed: game.hintsUsed,
      })
    }
  }, [game.status, game.levelId, game.seconds, game.mistakes, game.hintsUsed, onWin])

  const pushHistory = useCallback((g) => {
    history.current.push({
      board: g.board.slice(),
      notes: g.notes.map((n) => n.slice()),
      mistakes: g.mistakes,
    })
    if (history.current.length > 100) history.current.shift()
  }, [])

  const isGiven = useCallback((i) => game.puzzle[i] !== 0, [game.puzzle])

  const inputDigit = useCallback(
    (digit) => {
      if (selected == null || game.status !== 'playing') return
      if (isGiven(selected)) return

      setGame((g) => {
        pushHistory(g)
        const board = g.board.slice()
        const notes = g.notes.map((n) => n.slice())

        if (noteMode) {
          if (board[selected]) return g
          const cur = new Set(notes[selected])
          cur.has(digit) ? cur.delete(digit) : cur.add(digit)
          notes[selected] = [...cur].sort()
          return { ...g, notes }
        }

        board[selected] = board[selected] === digit ? 0 : digit
        notes[selected] = []
        let mistakes = g.mistakes
        if (board[selected] && board[selected] !== g.solution[selected]) {
          mistakes += 1
        }
        const status = isSolved(board, g.solution) ? 'won' : 'playing'
        return { ...g, board, notes, mistakes, status }
      })
    },
    [selected, noteMode, game.status, isGiven, pushHistory]
  )

  const erase = useCallback(() => {
    if (selected == null || game.status !== 'playing' || isGiven(selected)) return
    setGame((g) => {
      pushHistory(g)
      const board = g.board.slice()
      const notes = g.notes.map((n) => n.slice())
      board[selected] = 0
      notes[selected] = []
      return { ...g, board, notes }
    })
  }, [selected, game.status, isGiven, pushHistory])

  const hint = useCallback(() => {
    if (selected == null || game.status !== 'playing' || isGiven(selected)) return
    setGame((g) => {
      if (g.board[selected] === g.solution[selected]) return g
      pushHistory(g)
      const board = g.board.slice()
      const notes = g.notes.map((n) => n.slice())
      board[selected] = g.solution[selected]
      notes[selected] = []
      const status = isSolved(board, g.solution) ? 'won' : 'playing'
      return { ...g, board, notes, hintsUsed: g.hintsUsed + 1, status }
    })
  }, [selected, game.status, isGiven, pushHistory])

  const undo = useCallback(() => {
    const prev = history.current.pop()
    if (!prev) return
    setGame((g) => ({ ...g, ...prev, status: 'playing' }))
  }, [])

  const restart = useCallback(() => {
    history.current = []
    wonReported.current = false
    setSelected(null)
    setNoteMode(false)
    setGame(createGame(level, spec))
  }, [level, spec])

  // 衍生資訊：衝突高亮、同數字高亮
  const conflicts =
    selected != null ? new Set(conflictsAt(game.board, selected, peers)) : new Set()
  if (
    selected != null &&
    game.board[selected] &&
    game.board[selected] !== game.solution[selected]
  ) {
    conflicts.add(selected)
  }
  // killer：籠內重複 / 超過或不符總和的格子永遠標紅（不需先選取）
  if (spec.killer && game.cages) {
    for (const c of cageConflicts(game.board, game.cages)) conflicts.add(c)
  }
  const activeValue = selected != null ? game.board[selected] : 0

  return {
    game,
    selected,
    setSelected,
    noteMode,
    toggleNoteMode: () => setNoteMode((v) => !v),
    isGiven,
    inputDigit,
    erase,
    hint,
    undo,
    restart,
    conflicts,
    activeValue,
    spec,
  }
}
