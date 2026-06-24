// 故事與關卡資料：隨機漫步（黑色偵探 / 賽博朋克）
// 每一關有固定 seed（題目固定）、難度、變體（經典/對角線/不規則宮）、進場與過關台詞。
import { VARIANTS } from './variants.js'

export const STORY = {
  title: '隨機漫步',
  subtitle: '切線過客辦案手記',
  intro:
    '矩陣城又死了人。現場乾乾淨淨，只留下一張沒填完的數字矩陣——死者最後寫的東西。' +
    '他們叫我「切線過客」，一個不替任何幫派做事的偵探。把矩陣解開，對的座標就會指向下一個現場。',
}

export const CHAPTERS = [
  {
    id: 'ch1',
    name: '霓虹下城',
    emoji: '🌃',
    accent: '#ec4899',
    desc: '雨夜、霓虹，還有第一具屍體。',
    levels: [
      { difficulty: 'starter', seed: 1101, intro: '雨下了一整夜。死者桌上擺著這張矩陣，墨水還沒乾。', outro: '湊齊了。3 行 5 列是 7——第三大道 5 號。去看看。' },
      { difficulty: 'starter', seed: 1102, intro: '第三大道 5 號，牆上用粉筆抄著半串數字。', outro: '接上了。座標指向下城一間地下酒吧。' },
      { difficulty: 'easy', seed: 1103, intro: '酒吧後巷，招牌一閃一閃，第三張矩陣壓在屍體底下。', outro: '解開的瞬間我懂了：這些人，不是各自失蹤的。' },
      { difficulty: 'easy', seed: 1104, intro: '線索把我帶到一間廢棄旅館，房卡背面印著數列。', outro: '他們全來過這裡。同一個地方，同一段時間。' },
      { difficulty: 'medium', seed: 1105, intro: '當鋪的舊帳本，最後一頁夾著沒寫完的數字。', outro: '帳指向工業帶的鍋爐廠。霓虹在後照鏡裡愈縮愈小。' },
    ],
  },
  {
    id: 'ch2',
    name: '蒸氣工業帶',
    emoji: '⚙️',
    accent: '#f59e0b',
    desc: '齒輪、鍋爐，還有越挖越深的東西。',
    levels: [
      { difficulty: 'easy', seed: 2201, intro: '鍋爐廠的管線上，有人用粉筆畫了張矩陣。', outro: '齒輪咬上了。下一個座標在隔壁車間。' },
      { difficulty: 'medium', seed: 2202, intro: '蒸氣糊了視線，矩陣的數字也跟著模糊。', outro: '霧散了，數字連成一串往地下走的編號。' },
      { difficulty: 'medium', seed: 2203, intro: '工人都說沒看見什麼。機台縫裡卻卡著一張紙條。', outro: '對上了。有人在替這座城「收人」。' },
      { difficulty: 'medium', seed: 2204, intro: '工業帶最深處，一扇鐵門刻著扭曲的數列。', outro: '門開了。後面是往地下迴路的樓梯。' },
      { difficulty: 'hard', seed: 2205, intro: '鍋爐廠最後一道題，守著整個廠區的祕密。', outro: '蒸氣到底，是一片黑掉的電纜——數據暗網的入口。' },
    ],
  },
  {
    id: 'ch3',
    name: '地下迴路',
    emoji: '🔌',
    accent: '#06b6d4',
    desc: '連電路都走對角線——斜線上也不能重複。',
    variant: 'diagonal',
    levels: [
      { difficulty: 'easy', seed: 3301, intro: '連電路都走對角線。這裡的矩陣，兩條斜線上也不能重複。', outro: '對角線通了，一段加密座標亮起來。' },
      { difficulty: 'easy', seed: 3302, intro: '兩條對角線像交錯的暗線，各自得填滿。', outro: '它們在正中央交會，吐出一個門牌號。' },
      { difficulty: 'medium', seed: 3303, intro: '訊號一直干擾，矩陣閃個不停。', outro: '雜訊壓下去，斜向的數字穩住了。' },
      { difficulty: 'medium', seed: 3304, intro: '暗網更深處，沉著一段更難纏的死前訊息。', outro: '訊息還原——這些人，是被「上傳」走的。' },
      { difficulty: 'hard', seed: 3305, intro: '迴路盡頭，最後一道對角線的題。', outro: '暗網打通了。所有座標，指向城中央那座發光的塔。' },
    ],
  },
  {
    id: 'ch4',
    name: '矩陣核心',
    emoji: '🌐',
    accent: '#8b5cf6',
    desc: '天頂塔。經典與對角線交錯，直通幕後。',
    levels: [
      { difficulty: 'hard', seed: 4401, intro: '天頂塔。每上一層，題目就更冷一分。', outro: '一整層的數字接起來，真相又近了。' },
      { difficulty: 'hard', seed: 4402, variant: 'diagonal', intro: '這層的對角線藏著主謀的簽名。別漏看。', outro: '斜線拼出一個名字。操控全城的那道影子。' },
      { difficulty: 'hard', seed: 4403, intro: '塔的裂縫裡，塞滿了死者們的最後訊息。', outro: '碎片合上，陰謀的形狀清楚了。' },
      { difficulty: 'hard', seed: 4404, variant: 'diagonal', intro: '剩最後兩道門。對角線還在低聲提示。', outro: '門後，幕後者的座標再也藏不住。' },
      { difficulty: 'hard', seed: 4405, variant: 'diagonal', intro: '最後一張矩陣。整起案子的核心。', outro: '真相攤開了。我在手記最後寫下：命運不過是場隨機漫步——而我，剛走完它。' },
    ],
  },
  {
    id: 'ch5',
    name: '碎裂舊城',
    emoji: '🧩',
    accent: '#14b8a6',
    desc: '結案沒幾天，新的矩陣又冒出來——這次連格子都是碎的。',
    variant: 'jigsaw',
    levels: [
      { difficulty: 'easy', seed: 5501, intro: '案子才結，桌上又出現一張矩陣。這次的宮歪七扭八，不再是方的。', outro: '形狀變了，規矩沒變：每一塊照樣得填滿 1~9。' },
      { difficulty: 'easy', seed: 5502, intro: '碎掉的街區，碎掉的格子。', outro: '拼回去了。又一個座標浮出來。' },
      { difficulty: 'medium', seed: 5503, intro: '宮的邊界繞來繞去，看久了眼睛會花。', outro: '跟著邊界走，數字自己會對上。' },
      { difficulty: 'medium', seed: 5504, intro: '這張矩陣，像被人撕碎再黏回去。', outro: '黏痕底下，藏著下一個地址。' },
      { difficulty: 'hard', seed: 5505, intro: '最後一塊拼圖，也最不規則。', outro: '城市還在動，案子永遠結不完。我把帽簷壓低，走進雨裡。' },
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
