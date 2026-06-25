// Killer（殺手）數獨引擎。
// 規則：標準數獨（行/列/宮各 1~N 不重複）+ 盤面切成若干「籠子」(cage)，
// 每個籠子標一個加總，籠內數字不得重複、加起來等於該總和。殺手題通常沒有提示數字，
// 全靠籠子加總推出唯一解，因此需要一個會算籠加總的求解器來保證唯一。
//
// 籠子是「每題」資料（不像 jigsaw 宮是固定佈局），所以放在產出的 game 狀態裡，不在 spec。

import { fullSolution } from './generator.js'

// 難度：maxCage 籠子最大格數（越大越難推）；givens 不得已時補的提示數上限。
export const KILLER_DIFFICULTY = {
  easy: { key: 'easy', label: '簡單', maxCage: 3 },
  medium: { key: 'medium', label: '中等', maxCage: 4 },
  hard: { key: 'hard', label: '困難', maxCage: 5 },
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 第 i 格的上下左右鄰格（不跨邊界）
function neighbors(i, N) {
  const r = Math.floor(i / N)
  const c = i % N
  const out = []
  if (r > 0) out.push(i - N)
  if (r < N - 1) out.push(i + N)
  if (c > 0) out.push(i - 1)
  if (c < N - 1) out.push(i + 1)
  return out
}

// 由完整解盤長出連通籠子；籠內值保證互異（符合 killer 規則）。
function buildCages(solution, spec, rng, maxCage) {
  const { size: N, cells } = spec
  const cageOf = new Array(cells).fill(-1)
  const cages = []
  const order = shuffle([...Array(cells).keys()], rng)

  for (const seed of order) {
    if (cageOf[seed] !== -1) continue
    const id = cages.length
    const cage = [seed]
    cageOf[seed] = id
    const used = new Set([solution[seed]])
    const target = 2 + Math.floor(rng() * (maxCage - 1)) // 2..maxCage

    while (cage.length < target) {
      const cand = []
      for (const c of cage) {
        for (const nb of neighbors(c, N)) {
          if (cageOf[nb] === -1 && !used.has(solution[nb]) && !cand.includes(nb)) {
            cand.push(nb)
          }
        }
      }
      if (cand.length === 0) break
      const pick = cand[Math.floor(rng() * cand.length)]
      cage.push(pick)
      cageOf[pick] = id
      used.add(solution[pick])
    }
    cages.push({ cells: cage, sum: cage.reduce((s, x) => s + solution[x], 0) })
  }
  return { cages, cageOf }
}

// 某格在 killer 約束下的候選值：row/col/box peers + 籠內不重複 + 籠加總範圍剪枝。
function candidates(board, i, spec, cages, cageOf) {
  const { size: N, peers } = spec
  const blocked = new Array(N + 1).fill(false)
  for (const p of peers[i]) if (board[p]) blocked[board[p]] = true

  const cage = cages[cageOf[i]]
  let cageSum = 0
  let cageEmpty = 0
  const cageUsed = new Set()
  for (const c of cage.cells) {
    if (board[c]) {
      cageSum += board[c]
      cageUsed.add(board[c])
    } else cageEmpty++
  }
  // 籠內尚可用的數字（升冪），用來估剩餘空格的 min/max 加總
  const avail = []
  for (let v = 1; v <= N; v++) if (!cageUsed.has(v)) avail.push(v)
  const rem = cageEmpty - 1 // 放入 i 後，籠內還剩幾格要填

  const out = []
  for (let v = 1; v <= N; v++) {
    if (blocked[v] || cageUsed.has(v)) continue
    const newSum = cageSum + v
    if (rem === 0) {
      if (newSum === cage.sum) out.push(v)
      continue
    }
    // 從 avail 去掉 v 後，挑 rem 個最小 / 最大值估範圍
    let mn = 0
    let mx = 0
    let nLow = 0
    let nHigh = 0
    for (let k = 0; k < avail.length && nLow < rem; k++) {
      if (avail[k] === v) continue
      mn += avail[k]
      nLow++
    }
    for (let k = avail.length - 1; k >= 0 && nHigh < rem; k--) {
      if (avail[k] === v) continue
      mx += avail[k]
      nHigh++
    }
    if (nLow < rem) continue // 剩餘可用數字不足
    if (newSum + mn <= cage.sum && cage.sum <= newSum + mx) out.push(v)
  }
  return out
}

// 即時籠子衝突：籠內重複值、已超過總和、或填滿卻總和不符 → 回傳該標紅的格 index。
export function cageConflicts(board, cages) {
  const bad = new Set()
  if (!cages) return bad
  for (const cg of cages) {
    const seen = new Map()
    let sum = 0
    let filled = 0
    for (const c of cg.cells) {
      const v = board[c]
      if (!v) continue
      sum += v
      filled++
      if (seen.has(v)) {
        bad.add(c)
        bad.add(seen.get(v))
      } else seen.set(v, c)
    }
    if (sum > cg.sum || (filled === cg.cells.length && sum !== cg.sum)) {
      for (const c of cg.cells) if (board[c]) bad.add(c)
    }
  }
  return bad
}

// MRV 挑候選最少的空格
function pickCell(board, spec, cages, cageOf) {
  let bestIdx = -1
  let best = null
  for (let i = 0; i < spec.cells; i++) {
    if (board[i] !== 0) continue
    const cands = candidates(board, i, spec, cages, cageOf)
    if (best === null || cands.length < best.length) {
      bestIdx = i
      best = cands
      if (cands.length <= 1) break
    }
  }
  return bestIdx === -1 ? null : { idx: bestIdx, cands: best }
}

// 數解的數量（數到 limit 即停）；budget 限制節點數，超過保守回傳 limit（視為非唯一）。
export function countKiller(board, spec, cages, cageOf, limit = 2, budget = { n: 0, cap: 200000 }) {
  if (++budget.n > budget.cap) return limit
  const sel = pickCell(board, spec, cages, cageOf)
  if (!sel) return 1
  if (sel.cands.length === 0) return 0
  let count = 0
  for (const v of sel.cands) {
    board[sel.idx] = v
    count += countKiller(board, spec, cages, cageOf, limit, budget)
    board[sel.idx] = 0
    if (count >= limit) return count
  }
  return count
}

// 產生一道殺手題：{ puzzle, solution, cages }，保證唯一解（依 seed 決定論）。
// 先有完整解盤 → 反覆長不同籠子直到唯一；極少數情況補最少提示數保證唯一。
export function generateKiller(difficultyKey = 'medium', rng = Math.random, spec) {
  const diff = KILLER_DIFFICULTY[difficultyKey] || KILLER_DIFFICULTY.medium
  const solution = fullSolution(rng, spec)
  const empty = () => new Array(spec.cells).fill(0)

  // 每次嘗試設較低節點上限「快速放棄」：唯一籠法通常很快就能驗證，搜很久的多半
  // 模稜兩可。寧可多試幾組好驗證的籠法，也不要在難驗證的籠法上久耗 → 載入夠快。
  let chosen = null
  for (let attempt = 0; attempt < 120; attempt++) {
    const { cages, cageOf } = buildCages(solution, spec, rng, diff.maxCage)
    const n = countKiller(empty(), spec, cages, cageOf, 2, { n: 0, cap: 20000 })
    if (n === 1) {
      return { puzzle: empty(), solution, cages }
    }
    chosen = { cages, cageOf }
  }

  // 後備：用最後一組籠子，逐步補提示直到唯一（決定論：照 rng 打亂的順序）。
  const { cages, cageOf } = chosen
  const puzzle = empty()
  const order = shuffle([...Array(spec.cells).keys()], rng)
  for (const pos of order) {
    if (countKiller(puzzle.slice(), spec, cages, cageOf, 2, { n: 0, cap: 300000 }) === 1) break
    puzzle[pos] = solution[pos]
  }
  return { puzzle, solution, cages }
}
