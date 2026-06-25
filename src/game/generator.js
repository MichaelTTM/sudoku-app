// 數獨核心邏輯：產題、解題、唯一解驗證、難度分級。
// 盤面以一維陣列表示，0 代表空格，1~N 為填入數字。
// 幾何（盤邊長、宮、對角線、不規則宮）全部由 variants.js 的 spec 描述，
// 支援 9×9 / 12×12 / 16×16 與經典 / 對角線 / 不規則宮等變體。

import { makeSpec } from './variants.js'

// 難度設定：clues 為各尺寸保留的提示數量（越少越難）。
// 9×9 維持原值（既有關卡題目與存檔不可變動）；大盤面多留提示，兼顧可玩性與
// 唯一解驗證的效能上限。
export const DIFFICULTIES = {
  starter: { key: 'starter', label: '入門', clues: { 9: 50, 12: 92, 16: 170 } },
  easy: { key: 'easy', label: '簡單', clues: { 9: 44, 12: 82, 16: 154 } },
  medium: { key: 'medium', label: '中等', clues: { 9: 36, 12: 70, 16: 138 } },
  hard: { key: 'hard', label: '困難', clues: { 9: 30, 12: 62, 16: 124 } },
}

function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// MRV 啟發：挑「候選最少」的空格優先填，大幅減少回溯（不規則宮 / 大盤面尤其關鍵）。
// 回傳 { idx, cands } 或 null（已無空格）。cands 為空代表死路。
function pickCell(board, spec) {
  const { cells, size, peers } = spec
  let bestIdx = -1
  let bestCands = null
  for (let i = 0; i < cells; i++) {
    if (board[i] !== 0) continue
    const used = new Array(size + 1).fill(false)
    for (const p of peers[i]) if (board[p]) used[board[p]] = true
    const cands = []
    for (let v = 1; v <= size; v++) if (!used[v]) cands.push(v)
    if (bestCands === null || cands.length < bestCands.length) {
      bestIdx = i
      bestCands = cands
      if (cands.length <= 1) break // 0=死路、1=唯一，都無法更好
    }
  }
  return bestIdx === -1 ? null : { idx: bestIdx, cands: bestCands }
}

// 單次嘗試填滿（MRV + 隨機值序），超過步數預算就放棄，交由 fillBoard 重啟。
function tryFill(board, rng, spec, budget) {
  if (++budget.n > budget.cap) return false
  const sel = pickCell(board, spec)
  if (!sel) return true
  if (sel.cands.length === 0) return false
  for (const v of shuffle(sel.cands, rng)) {
    board[sel.idx] = v
    if (tryFill(board, rng, spec, budget)) return true
    board[sel.idx] = 0
  }
  return false
}

// 步數 / 節點預算依格數線性縮放（9×9 算出來剛好等於原本的 30000 / 8000，確保
// 既有 9×9 題目完全不變）；大盤面回溯較重，給更高的上限。
const fillCap = (spec) => Math.round((30000 * spec.cells) / 81)
const countCap = (spec) => Math.round((8000 * spec.cells) / 81)

// 填滿一個完整合法的解盤。少數變體 / seed 的隨機值序會讓回溯爆炸，因此每次嘗試
// 設步數上限；超過就用「已往前推進的 rng」重來 → 換一組值序，通常很快就成功。
// 同 seed → 同 rng 序列 → 結果仍固定（題目可重現）。
function fillBoard(board, rng, spec) {
  const cap = fillCap(spec)
  for (let attempt = 0; attempt < 2000; attempt++) {
    const work = board.slice()
    if (tryFill(work, rng, spec, { n: 0, cap })) {
      for (let i = 0; i < board.length; i++) board[i] = work[i]
      return true
    }
  }
  return false
}

// 計算解的數量，最多數到 limit 就停（驗證唯一解，效能可控）。
// budget 限制搜尋節點數：少數變體 seed 的解樹會爆炸，超過預算時保守回傳 limit
//（視為「非唯一」），讓上層保留該提示 → 產題時間有上限，題目仍保證唯一解。
function countSolutions(board, spec, limit, budget) {
  if (++budget.n > budget.cap) return limit
  const sel = pickCell(board, spec)
  if (!sel) return 1
  if (sel.cands.length === 0) return 0
  let count = 0
  for (const v of sel.cands) {
    board[sel.idx] = v
    count += countSolutions(board, spec, limit, budget)
    board[sel.idx] = 0
    if (count >= limit) return count
  }
  return count
}

// 產生一個完整合法解盤（依 rng 決定論）。killer 變體用來先有解再長籠子。
export function fullSolution(rng, spec) {
  const s = spec || makeSpec(9, 'classic')
  const board = new Array(s.cells).fill(0)
  return fillBoard(board, rng, s) ? board : null
}

// 求一個解（回傳新陣列，不改動輸入）
export function solve(input, spec) {
  const s = spec || makeSpec(9, 'classic')
  const board = input.slice()
  return fillBoard(board, Math.random, s) ? board : null
}

// 產生一道題目：回傳 { puzzle, solution }，保證在該 spec 下唯一解。
export function generate(difficultyKey = 'medium', rng = Math.random, spec) {
  const s = spec || makeSpec(9, 'classic')
  const difficulty = DIFFICULTIES[difficultyKey] || DIFFICULTIES.medium
  const targetClues = difficulty.clues[s.size] ?? difficulty.clues[9]

  const solution = new Array(s.cells).fill(0)
  fillBoard(solution, rng, s)

  const puzzle = solution.slice()
  const order = shuffle([...Array(s.cells).keys()], rng)
  let clues = s.cells
  const cap = countCap(s)

  for (const pos of order) {
    if (clues <= targetClues) break
    const backup = puzzle[pos]
    if (backup === 0) continue
    puzzle[pos] = 0
    if (countSolutions(puzzle.slice(), s, 2, { n: 0, cap }) !== 1) {
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
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0 || board[i] !== solution[i]) return false
  }
  return true
}

// 統計每個數字已填數量（用於數字鍵盤顯示剩餘）
export function digitCounts(board, size) {
  const counts = new Array(size + 1).fill(0)
  for (const v of board) if (v) counts[v]++
  return counts
}
