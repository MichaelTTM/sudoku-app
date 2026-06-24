// 故事與關卡資料：隨機漫步（黑色偵探 / 賽博朋克）
// 每一關有固定 seed（題目固定）、難度、變體（經典/對角線）、進場與過關劇情台詞。
import { VARIANTS } from './variants.js'

export const STORY = {
  title: '隨機漫步',
  subtitle: '切線過客的辦案手記',
  intro:
    '蒸氣與霓虹交織的矩陣城，正發生一連串連環失蹤案。現場沒有指紋，' +
    '只留下一張張沒填完的數字矩陣——死者的「死前訊息」。你是被稱為「切線過客」的私家偵探，' +
    '游走在城市邊緣。解開矩陣，特定座標上的數字會連成下一個犯罪現場的地址。',
}

export const CHAPTERS = [
  {
    id: 'ch1',
    name: '霓虹下城',
    emoji: '🌃',
    accent: '#ec4899',
    desc: '雨夜、霓虹與第一具失蹤者的線索。',
    levels: [
      { difficulty: 'starter', seed: 1101, intro: '霓虹下城的雨夜，失蹤者的公寓桌上留著一張沒填完的數字矩陣——他的死前訊息。', outro: '矩陣補完了。第 3 行第 5 列是 7：第三大道 5 號，你記下這個地址。' },
      { difficulty: 'starter', seed: 1102, intro: '第三大道 5 號的牆上，又是一張殘缺的數列。', outro: '數字接上了，座標指向下城一間地下酒吧。' },
      { difficulty: 'easy', seed: 1103, intro: '酒吧後巷，閃爍的招牌下躺著第三張矩陣。', outro: '解開的瞬間你明白：這些失蹤案，彼此相連。' },
      { difficulty: 'easy', seed: 1104, intro: '線索把你帶向一棟廢棄旅館，房卡上印著未完成的數列。', outro: '座標浮現——失蹤者全都來過同一個地方。' },
      { difficulty: 'medium', seed: 1105, intro: '下城最後一條線索，藏在當鋪的舊帳本裡。', outro: '帳本指向工業帶的鍋爐廠。霓虹漸遠，蒸氣與鏽味撲面而來。' },
    ],
  },
  {
    id: 'ch2',
    name: '蒸氣工業帶',
    emoji: '⚙️',
    accent: '#f59e0b',
    desc: '齒輪、鍋爐與越來越深的陰謀。',
    levels: [
      { difficulty: 'easy', seed: 2201, intro: '鍋爐廠的管線上，有人用粉筆畫下了數字矩陣。', outro: '齒輪般的座標咬合在一起，指向下一座車間。' },
      { difficulty: 'medium', seed: 2202, intro: '車間的蒸氣遮蔽視線，矩陣也更難辨認。', outro: '霧氣散去，數字連成一串通往地下的編號。' },
      { difficulty: 'medium', seed: 2203, intro: '工人都說沒看見什麼，但機台縫隙裡卡著一張紙條。', outro: '紙條上的數字對上了——有人在替這座城市「收集」人。' },
      { difficulty: 'medium', seed: 2204, intro: '工業帶深處，一扇鐵門上刻著扭曲的數列。', outro: '門開了，門後是通往地下迴路的階梯。' },
      { difficulty: 'hard', seed: 2205, intro: '鍋爐廠最後的謎題，守著整個工業帶的祕密。', outro: '蒸氣盡頭是一片漆黑的電纜叢林——數據暗網的入口。' },
    ],
  },
  {
    id: 'ch3',
    name: '地下迴路',
    emoji: '🔌',
    accent: '#06b6d4',
    desc: '連電路都走對角線——這裡的矩陣，斜線上也不能重複。',
    variant: 'diagonal',
    levels: [
      { difficulty: 'easy', seed: 3301, intro: '地下迴路裡，連電路都走對角線——這裡的矩陣，兩條主對角線也得各自填滿 1~9。', outro: '對角線接通，一段加密座標亮起。' },
      { difficulty: 'easy', seed: 3302, intro: '兩條主對角線像交錯的暗線，各自要完整。', outro: '暗線在中央交會，浮出一個門牌號。' },
      { difficulty: 'medium', seed: 3303, intro: '訊號干擾讓矩陣不斷閃爍。', outro: '雜訊平息，斜向的數字穩定下來。' },
      { difficulty: 'medium', seed: 3304, intro: '暗網深處沉著一段更複雜的死前訊息。', outro: '訊息還原——失蹤者，是被人「上傳」走的。' },
      { difficulty: 'hard', seed: 3305, intro: '迴路盡頭最後一道對角線謎題，最為棘手。', outro: '暗網被你打通，所有座標匯向城市中央那座發光的高塔。' },
    ],
  },
  {
    id: 'ch4',
    name: '矩陣核心',
    emoji: '🌐',
    accent: '#8b5cf6',
    desc: '天頂塔。經典與對角線的試煉交錯，直指幕後者。',
    levels: [
      { difficulty: 'hard', seed: 4401, intro: '矩陣核心，天頂塔。每一層樓都是一道更冷酷的謎題。', outro: '一整層的數字被你連起，真相又近了一步。' },
      { difficulty: 'hard', seed: 4402, variant: 'diagonal', intro: '這一層的對角線藏著主謀的簽名，別忽略它。', outro: '斜線拼出一個名字——操控全城的那道影子。' },
      { difficulty: 'hard', seed: 4403, intro: '塔的裂縫裡，無數失蹤者的死前訊息匯成一片。', outro: '碎片癒合，陰謀的輪廓終於清晰。' },
      { difficulty: 'hard', seed: 4404, variant: 'diagonal', intro: '只剩最後兩道門，對角線仍在低聲提示。', outro: '門後，幕後者的座標已無所遁形。' },
      { difficulty: 'hard', seed: 4405, variant: 'diagonal', intro: '最後一道矩陣，也是整起連環案的核心。', outro: '真相揭曉。切線過客在手記最後寫下一行：所謂命運，不過是一場隨機漫步——而我，剛剛走完了它。' },
    ],
  },
]

// 攤平成有序清單，補上 id / 章節資訊 / 變體 / 序號
export const LEVELS = CHAPTERS.flatMap((chapter, ci) =>
  chapter.levels.map((lv, li) => {
    const variant = lv.variant || chapter.variant || 'classic'
    return {
      ...lv,
      id: `${ci + 1}-${li + 1}`,
      chapterId: chapter.id,
      chapterName: chapter.name,
      accent: chapter.accent,
      variant,
      variantLabel: VARIANTS[variant]?.label || '經典',
      order: ci * 100 + li,
      label: `${ci + 1}-${li + 1}`,
    }
  })
)

export const LEVEL_ORDER = LEVELS.map((l) => l.id)

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null
}

export function nextLevelId(id) {
  const i = LEVEL_ORDER.indexOf(id)
  return i >= 0 && i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : null
}
