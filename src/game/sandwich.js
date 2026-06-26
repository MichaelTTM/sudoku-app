// Sandwich（三明治）數獨引擎。
// 規則：標準 9×9 數獨 + 每行/列盤外各有一個「三明治」線索：
//   該行（或列）中，1 與 9 之間（不含 1、9）所有數字的加總。
// 做法：預烘焙。Runtime 由 sandwichData.js 讀取 solution + 18 個線索 + 少量提示。

import { fullSolution } from './generator.js'
import { makeSpec } from './variants.js'

const N = 9

// ─── 核心計算 ─────────────────────────────────────────────────────────────────

// 計算一整行/列的三明治加總（values 為長度 N 的完整陣列）。
export function sandwichSum(values) {
  const pos1 = values.indexOf(1)
  const pos9 = values.indexOf(9)
  if (pos1 === -1 || pos9 === -1) return null
  const lo = Math.min(pos1, pos9)
  const hi = Math.max(pos1, pos9)
  let sum = 0
  for (let i = lo + 1; i < hi; i++) sum += values[i]
  return sum
}

// 由完整解盤算出全部 18 個三明治線索（rowClues[9] + colClues[9]）。
export function computeClues(solution) {
  const rowClues = []
  const colClues = []
  for (let r = 0; r < N; r++) {
    rowClues.push(sandwichSum(Array.from({ length: N }, (_, c) => solution[r * N + c])))
  }
  for (let c = 0; c < N; c++) {
    colClues.push(sandwichSum(Array.from({ length: N }, (_, r) => solution[r * N + c])))
  }
  return { rowClues, colClues }
}

// ─── MRV 求解器（帶步數預算） ─────────────────────────────────────────────────

// 挑「候選最少」空格（MRV），回傳 { idx, cands } 或 null。
function pickCell(board, spec) {
  const { cells, peers } = spec
  let bestIdx = -1
  let bestCands = null
  for (let i = 0; i < cells; i++) {
    if (board[i] !== 0) continue
    const used = new Set()
    for (const p of peers[i]) if (board[p]) used.add(board[p])
    const cands = []
    for (let v = 1; v <= N; v++) if (!used.has(v)) cands.push(v)
    if (bestCands === null || cands.length < bestCands.length) {
      bestIdx = i
      bestCands = cands
      if (cands.length <= 1) break
    }
  }
  return bestIdx === -1 ? null : { idx: bestIdx, cands: bestCands }
}

// Sandwich-aware 唯一解計數（最多數到 maxCount 即停）。
// budget.cap 限制節點數；超過時保守回傳 maxCount（視為非唯一，保留該提示）。
export function countSandwich(board, rowClues, colClues, spec, maxCount = 2, budget = null) {
  const bud = budget || { n: 0, cap: 60_000 }
  if (++bud.n > bud.cap) return maxCount

  const sel = pickCell(board, spec)
  if (!sel) {
    // 盤面已填完：驗證全部三明治線索
    for (let r = 0; r < N; r++) {
      const row = Array.from({ length: N }, (_, c) => board[r * N + c])
      if (sandwichSum(row) !== rowClues[r]) return 0
    }
    for (let c = 0; c < N; c++) {
      const col = Array.from({ length: N }, (_, r) => board[r * N + c])
      if (sandwichSum(col) !== colClues[c]) return 0
    }
    return 1
  }

  if (sel.cands.length === 0) return 0

  const r = Math.floor(sel.idx / N)
  const c = sel.idx % N
  let count = 0

  for (const v of sel.cands) {
    board[sel.idx] = v

    // 若此行已填完，驗證三明治線索
    const row = Array.from({ length: N }, (_, j) => board[r * N + j])
    if (!row.includes(0) && sandwichSum(row) !== rowClues[r]) {
      board[sel.idx] = 0; continue
    }
    // 若此列已填完，驗證
    const col = Array.from({ length: N }, (_, i) => board[i * N + c])
    if (!col.includes(0) && sandwichSum(col) !== colClues[c]) {
      board[sel.idx] = 0; continue
    }

    count += countSandwich(board, rowClues, colClues, spec, maxCount, bud)
    board[sel.idx] = 0
    if (count >= maxCount) return count
  }
  return count
}

// ─── 產題（由 _sandwichbake.mjs 呼叫） ───────────────────────────────────────

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 由 seed rng 生成一道 sandwich 題目。
// 策略：全提示開始，逐格移除（只要仍唯一解就移除），步數預算控制速度。
export function generateSandwich(rng) {
  const spec = makeSpec(9, 'classic')
  const solution = fullSolution(rng, spec)
  if (!solution) throw new Error('fullSolution failed')
  const { rowClues, colClues } = computeClues(solution)

  const puzzle = solution.slice()
  const indices = shuffle(Array.from({ length: 81 }, (_, i) => i), rng)

  for (const idx of indices) {
    const saved = puzzle[idx]
    puzzle[idx] = 0
    // 用每格獨立的預算（不共享，保持移除嘗試速度一致）
    if (countSandwich(puzzle.slice(), rowClues, colClues, spec, 2) !== 1) {
      puzzle[idx] = saved
    }
  }

  return {
    solution,
    rowClues,
    colClues,
    puzzle,
    givenCount: puzzle.filter((v) => v !== 0).length,
  }
}
