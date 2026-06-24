// 數獨核心邏輯：產題、解題、唯一解驗證、難度分級
// 盤面以長度 81 的一維陣列表示，0 代表空格，1~9 為填入數字。
// 規則改用 variants.js 的 peers 抽象描述，支援經典 / 對角線 等變體。

import { VARIANTS, buildPeers } from './variants.js'

export const SIZE = 9
export const BOX = 3
export const CELLS = SIZE * SIZE

// 難度設定：targetClues 為保留的提示數量（越少越難）
export const DIFFICULTIES = {
  starter: { key: 'starter', label: '入門', targetClues: 50 },
  easy: { key: 'easy', label: '簡單', targetClues: 44 },
  medium: { key: 'medium', label: '中等', targetClues: 36 },
  hard: { key: 'hard', label: '困難', targetClues: 30 },
}

export function rowOf(i) {
  return Math.floor(i / SIZE)
}
export function colOf(i) {
  return i % SIZE
}
export function boxOf(i) {
  return Math.floor(rowOf(i) / BOX) * BOX + Math.floor(colOf(i) / BOX)
}

// 在 index 放 value 是否與任一 peer 衝突
function isValid(board, index, value, peers) {
  for (const p of peers[index]) {
    if (board[p] === value) return false
  }
  return true
}

function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 以回溯法填滿一個完整合法的解盤
function fillBoard(board, rng, peers) {
  const idx = board.indexOf(0)
  if (idx === -1) return true
  const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)
  for (const v of candidates) {
    if (isValid(board, idx, v, peers)) {
      board[idx] = v
      if (fillBoard(board, rng, peers)) return true
      board[idx] = 0
    }
  }
  return false
}

// 計算解的數量，最多數到 limit 就停（驗證唯一解，效能可控）
function countSolutions(board, peers, limit = 2) {
  const idx = board.indexOf(0)
  if (idx === -1) return 1
  let count = 0
  for (let v = 1; v <= SIZE; v++) {
    if (isValid(board, idx, v, peers)) {
      board[idx] = v
      count += countSolutions(board, peers, limit)
      board[idx] = 0
      if (count >= limit) return count
    }
  }
  return count
}

// 求一個解（回傳新陣列，不改動輸入）
export function solve(input, variantKey = 'classic') {
  const peers = buildPeers(VARIANTS[variantKey] || VARIANTS.classic)
  const board = input.slice()
  return fillBoard(board, Math.random, peers) ? board : null
}

// 產生一道題目：回傳 { puzzle, solution }，保證在該變體下唯一解
export function generate(difficultyKey = 'medium', rng = Math.random, variantKey = 'classic') {
  const difficulty = DIFFICULTIES[difficultyKey] || DIFFICULTIES.medium
  const variant = VARIANTS[variantKey] || VARIANTS.classic
  const peers = buildPeers(variant)

  const solution = new Array(CELLS).fill(0)
  fillBoard(solution, rng, peers)

  const puzzle = solution.slice()
  const order = shuffle([...Array(CELLS).keys()], rng)
  let clues = CELLS

  for (const pos of order) {
    if (clues <= difficulty.targetClues) break
    const backup = puzzle[pos]
    if (backup === 0) continue
    puzzle[pos] = 0
    if (countSolutions(puzzle.slice(), peers, 2) !== 1) {
      puzzle[pos] = backup
    } else {
      clues--
    }
  }

  return { puzzle, solution }
}

// 取得某格目前所有衝突的同伴 index（用於即時錯誤標示）
export function conflictsAt(board, index, peers) {
  const value = board[index]
  if (!value || !peers) return []
  const result = []
  for (const p of peers[index]) {
    if (board[p] === value) result.push(p)
  }
  return result
}

// 整盤是否填滿且完全正確
export function isSolved(board, solution) {
  for (let i = 0; i < CELLS; i++) {
    if (board[i] === 0 || board[i] !== solution[i]) return false
  }
  return true
}

// 統計每個數字已填數量（用於數字鍵盤顯示剩餘）
export function digitCounts(board) {
  const counts = new Array(SIZE + 1).fill(0)
  for (const v of board) if (v) counts[v]++
  return counts
}
