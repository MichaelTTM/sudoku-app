import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CELLS,
  SIZE,
  generate,
  conflictsAt,
  isSolved,
} from '../game/generator.js'
import { makeRng } from '../game/rng.js'
import { VARIANTS, buildPeers } from '../game/variants.js'

const SAVE_KEY = 'sudoku.save.v3'

const emptyNotes = () => Array.from({ length: CELLS }, () => [])

// 還原同一關未完成的進度（只在 levelId 相符時使用）
function loadSave(levelId) {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY))
    if (!raw || raw.levelId !== levelId) return null
    if (!Array.isArray(raw.board) || raw.board.length !== CELLS) return null
    return raw
  } catch {
    return null
  }
}

// 依關卡的固定 seed 產生題目（同一關永遠同一題）
function createGame(level) {
  const variant = level.variant || 'classic'
  const { puzzle, solution } = generate(level.difficulty, makeRng(level.seed), variant)
  return {
    levelId: level.id,
    difficulty: level.difficulty,
    variant,
    puzzle,
    solution,
    board: puzzle.slice(),
    notes: emptyNotes(),
    seconds: 0,
    mistakes: 0,
    hintsUsed: 0,
    status: 'playing',
  }
}

export function useSudoku(level, { onWin } = {}) {
  const [game, setGame] = useState(() => loadSave(level.id) || createGame(level))
  const [selected, setSelected] = useState(null)
  const [noteMode, setNoteMode] = useState(false)
  const history = useRef([])
  const wonReported = useRef(false)
  const peers = useMemo(
    () => buildPeers(VARIANTS[level.variant] || VARIANTS.classic),
    [level.variant]
  )

  // 切換到不同關卡時，重建（或還原）該關的局面
  useEffect(() => {
    history.current = []
    wonReported.current = false
    setSelected(null)
    setNoteMode(false)
    setGame(loadSave(level.id) || createGame(level))
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
    setGame(createGame(level))
  }, [level])

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
    SIZE,
  }
}
