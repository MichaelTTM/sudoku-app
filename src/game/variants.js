// 數獨變體架構：用「單位（unit）」與「peers」抽象描述規則，
// 之後要加不規則宮 / 殺手等變體，只要在這裡擴充單位定義即可。
//
// unit = 一組必須各自填入 1~9 不重複的格子（行、列、宮、對角線…）
// peers[i] = 與第 i 格共享任一 unit 的所有格子（用於驗證與衝突高亮）

const SIZE = 9
const BOX = 3
const CELLS = SIZE * SIZE

export const VARIANTS = {
  classic: {
    key: 'classic',
    label: '經典',
    diagonals: false,
  },
  diagonal: {
    key: 'diagonal',
    label: '對角線 X',
    diagonals: true,
    rule: '除了行、列、九宮格，兩條主對角線也各自要填滿 1~9。',
  },
}

// 標準 9 個 3×3 宮
function standardBoxes() {
  const boxes = []
  for (let br = 0; br < SIZE; br += BOX) {
    for (let bc = 0; bc < SIZE; bc += BOX) {
      const cells = []
      for (let dr = 0; dr < BOX; dr++) {
        for (let dc = 0; dc < BOX; dc++) {
          cells.push((br + dr) * SIZE + (bc + dc))
        }
      }
      boxes.push(cells)
    }
  }
  return boxes
}

// 主對角線（左上→右下）與反對角線（右上→左下）
export const DIAGONAL_CELLS = (() => {
  const s = new Set()
  for (let i = 0; i < SIZE; i++) {
    s.add(i * SIZE + i)
    s.add(i * SIZE + (SIZE - 1 - i))
  }
  return s
})()

// 依變體組出所有 unit
export function buildUnits(variant = VARIANTS.classic) {
  const units = []
  for (let r = 0; r < SIZE; r++) {
    units.push(Array.from({ length: SIZE }, (_, c) => r * SIZE + c)) // 行
  }
  for (let c = 0; c < SIZE; c++) {
    units.push(Array.from({ length: SIZE }, (_, r) => r * SIZE + c)) // 列
  }
  for (const box of standardBoxes()) units.push(box) // 宮
  if (variant.diagonals) {
    units.push(Array.from({ length: SIZE }, (_, i) => i * SIZE + i))
    units.push(Array.from({ length: SIZE }, (_, i) => i * SIZE + (SIZE - 1 - i)))
  }
  return units
}

// 依變體組出每格的 peers（陣列形式，方便迭代）
export function buildPeers(variant = VARIANTS.classic) {
  const units = buildUnits(variant)
  const peers = Array.from({ length: CELLS }, () => new Set())
  for (const unit of units) {
    for (const a of unit) {
      for (const b of unit) {
        if (a !== b) peers[a].add(b)
      }
    }
  }
  return peers.map((s) => [...s])
}
