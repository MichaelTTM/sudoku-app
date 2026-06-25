// 數獨變體 + 盤面尺寸架構。
// 一道題的「幾何」由 spec 描述：盤邊長 N、宮的 rows×cols、符號集、所有 unit 與 peers。
// makeSpec(size, variantKey) 是唯一入口，引擎與 UI 都吃同一個 spec。
//
// unit = 一組必須各自填滿 1~N 不重複的格子（行、列、宮、對角線…）
// peers[i] = 與第 i 格共享任一 unit 的所有格子（用於驗證與衝突高亮）

// 盤面尺寸設定：宮的 rows×cols。盤邊長 N = boxRows × (N/boxRows)，三者自洽。
//  9×9：3×3 宮  ·  12×12：3×4 宮  ·  16×16：4×4 宮
export const SIZE_CONFIG = {
  9: { boxRows: 3, boxCols: 3 },
  12: { boxRows: 3, boxCols: 4 },
  16: { boxRows: 4, boxCols: 4 },
}

// 符號集：1~9 用數字，10 起用字母 A、B、C…（10→A、16→G）。symbols[v] 為第 v 個值的顯示字元（1-indexed）。
export function symbolsFor(size) {
  const arr = ['']
  for (let v = 1; v <= size; v++) {
    arr.push(v <= 9 ? String(v) : String.fromCharCode(65 + (v - 10)))
  }
  return arr
}

// 把鍵盤輸入字元（'1'~'9'、'a'~'g'）對應回數值；超出範圍回 0。
export function valueFromKey(key, size) {
  if (key >= '1' && key <= '9') {
    const v = key.charCodeAt(0) - 48
    return v <= size ? v : 0
  }
  const k = key.toLowerCase()
  if (k >= 'a' && k <= 'z') {
    const v = 10 + (k.charCodeAt(0) - 97)
    return v <= size ? v : 0
  }
  return 0
}

// 不規則宮固定佈局（length 81，值 0~8 代表所屬宮），僅用於 9×9 jigsaw。
// 此佈局由「最遠點種子 + 最受限優先」生長搜尋而得，刻意挑「塊狀、好解」的版本
//（完整解盤僅約 100 步回溯），確保 App 載入關卡時產題夠快。
export const JIGSAW_REGIONS = [
  1, 1, 1, 8, 8, 8, 8, 8, 2,
  1, 1, 1, 1, 8, 8, 8, 2, 2,
  1, 7, 7, 1, 4, 8, 2, 2, 2,
  7, 7, 7, 4, 4, 4, 2, 2, 2,
  7, 7, 7, 4, 4, 4, 5, 5, 5,
  3, 7, 6, 6, 4, 4, 5, 5, 5,
  3, 3, 6, 6, 6, 6, 5, 5, 5,
  3, 3, 3, 6, 6, 6, 0, 0, 0,
  3, 3, 3, 0, 0, 0, 0, 0, 0,
]

function regionsToBoxes(regions, count) {
  const boxes = Array.from({ length: count }, () => [])
  for (let i = 0; i < regions.length; i++) boxes[regions[i]].push(i)
  return boxes
}

// 變體定義（與尺寸正交）。jigsaw 只在 9×9 提供固定佈局。
export const VARIANTS = {
  classic: { key: 'classic', label: '經典', diagonals: false },
  diagonal: {
    key: 'diagonal',
    label: '對角線 X',
    diagonals: true,
    rule: '除了行、列、宮，兩條主對角線也各自要不重複填滿。',
  },
  jigsaw: {
    key: 'jigsaw',
    label: '不規則宮',
    diagonals: false,
    jigsaw: true,
    rule: '宮不再是方正的，而是不規則拼圖，每塊一樣要填滿不重複。',
  },
  killer: {
    key: 'killer',
    label: '殺手',
    diagonals: false,
    killer: true,
    rule: '沒有提示數字。每個粗框「籠子」左上角的數字是籠內總和——籠內數字不能重複，加起來要剛好等於它。',
  },
}

// 標準矩形宮（boxRows × boxCols 鋪滿 N×N）
function standardBoxes(size, boxRows, boxCols) {
  const boxes = []
  for (let br = 0; br < size; br += boxRows) {
    for (let bc = 0; bc < size; bc += boxCols) {
      const cells = []
      for (let dr = 0; dr < boxRows; dr++) {
        for (let dc = 0; dc < boxCols; dc++) {
          cells.push((br + dr) * size + (bc + dc))
        }
      }
      boxes.push(cells)
    }
  }
  return boxes
}

function diagonalCellSet(size) {
  const s = new Set()
  for (let i = 0; i < size; i++) {
    s.add(i * size + i)
    s.add(i * size + (size - 1 - i))
  }
  return s
}

function buildPeers(units, cells) {
  const peers = Array.from({ length: cells }, () => new Set())
  for (const unit of units) {
    for (const a of unit) {
      for (const b of unit) {
        if (a !== b) peers[a].add(b)
      }
    }
  }
  return peers.map((s) => [...s])
}

// 由 (尺寸, 變體) 產生完整 spec。所有幾何相關計算的唯一來源。
export function makeSpec(size = 9, variantKey = 'classic') {
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG[9]
  const { boxRows, boxCols } = cfg
  const variant = VARIANTS[variantKey] || VARIANTS.classic
  const cells = size * size

  // 不規則宮目前只支援 9×9；其餘尺寸退回經典宮。
  const useJigsaw = variant.jigsaw && size === 9
  const regions = useJigsaw ? JIGSAW_REGIONS : null
  const boxes = regions ? regionsToBoxes(regions, size) : standardBoxes(size, boxRows, boxCols)

  const units = []
  for (let r = 0; r < size; r++) {
    units.push(Array.from({ length: size }, (_, c) => r * size + c)) // 行
  }
  for (let c = 0; c < size; c++) {
    units.push(Array.from({ length: size }, (_, r) => r * size + c)) // 列
  }
  for (const box of boxes) units.push(box)
  const diagonalCells = variant.diagonals ? diagonalCellSet(size) : null
  if (variant.diagonals) {
    units.push(Array.from({ length: size }, (_, i) => i * size + i))
    units.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)))
  }

  return {
    size,
    boxRows,
    boxCols,
    cells,
    symbols: symbolsFor(size),
    variantKey: variant.key,
    variantLabel: variant.label,
    diagonals: !!variant.diagonals,
    jigsaw: useJigsaw,
    killer: !!variant.killer,
    regions,
    diagonalCells,
    boxes,
    peers: buildPeers(units, cells),
  }
}
