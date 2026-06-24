// 故事與關卡資料：星塵旅人
// 每一關有固定 seed（題目固定）、難度、變體（經典/對角線）、進場與過關劇情台詞。
import { VARIANTS } from './variants.js'

export const STORY = {
  title: '星塵旅人',
  subtitle: '點亮失落的星圖',
  intro:
    '很久以前，世界的星光被一場風暴打散了。你是一位星塵旅人，' +
    '每解開一道數字謎題，就能重新點亮一顆星、修復一段星圖。',
}

export const CHAPTERS = [
  {
    id: 'ch1',
    name: '晨曦草原',
    emoji: '🌅',
    accent: '#f59e0b',
    desc: '旅程的起點，微光初現的草原。',
    levels: [
      { difficulty: 'starter', seed: 1101, intro: '草原上第一顆星黯淡無光，試著喚醒它。', outro: '星光亮起，草地泛起金色的漣漪。' },
      { difficulty: 'starter', seed: 1102, intro: '遠處的小丘上還有沉睡的星塵。', outro: '微光匯聚，照亮了前方的小徑。' },
      { difficulty: 'easy', seed: 1103, intro: '一條發光的小徑出現在你眼前。', outro: '你踏上小徑，腳步漸漸輕快。' },
      { difficulty: 'easy', seed: 1104, intro: '草叢間躲著幾顆害羞的星。', outro: '星星們探出頭來，向你眨眼。' },
      { difficulty: 'medium', seed: 1105, intro: '草原的盡頭，最後一顆星等著你。', outro: '晨曦草原重新閃耀！前方是一片迷霧森林。' },
    ],
  },
  {
    id: 'ch2',
    name: '迷霧森林',
    emoji: '🌲',
    accent: '#10b981',
    desc: '濃霧之中，星光更難尋覓。',
    levels: [
      { difficulty: 'easy', seed: 2201, intro: '霧很濃，但你聽見了星塵的低語。', outro: '一道光劈開濃霧，路漸漸清晰。' },
      { difficulty: 'medium', seed: 2202, intro: '林間的古樹上掛著破碎的星圖。', outro: '古樹甦醒，枝葉間灑下點點星光。' },
      { difficulty: 'medium', seed: 2203, intro: '溪水倒映著錯亂的星座。', outro: '水面恢復平靜，倒影重新對齊。' },
      { difficulty: 'medium', seed: 2204, intro: '霧中傳來迷路星塵的呼喚。', outro: '你為它們指引方向，霧也淡了幾分。' },
      { difficulty: 'hard', seed: 2205, intro: '森林深處，最頑強的謎題守著出口。', outro: '迷霧散去！眼前是一片波光粼粼的湖。' },
    ],
  },
  {
    id: 'ch3',
    name: '微光湖畔',
    emoji: '💧',
    accent: '#06b6d4',
    desc: '湖面映出交錯的星光，連對角線都藏著祕密。',
    variant: 'diagonal',
    levels: [
      { difficulty: 'easy', seed: 3301, intro: '湖面的倒影讓星光沿著對角線排列——這裡的規則不太一樣了。', outro: '你看懂了倒影的規律，湖面閃起斜斜的光帶。' },
      { difficulty: 'easy', seed: 3302, intro: '對角線上的星，也得各自完整。', outro: '兩道斜光在湖心交會，亮成一個十字。' },
      { difficulty: 'medium', seed: 3303, intro: '湖風吹皺水面，星圖又亂了。', outro: '漣漪平息，斜向的星座重新成形。' },
      { difficulty: 'medium', seed: 3304, intro: '湖底沉著一塊更複雜的星圖碎片。', outro: '碎片浮起，拼回原本的位置。' },
      { difficulty: 'hard', seed: 3305, intro: '湖畔最後一題，對角線的考驗最為嚴苛。', outro: '湖面整片發亮！遠方，星海在天際翻湧。' },
    ],
  },
  {
    id: 'ch4',
    name: '星海之巔',
    emoji: '🌌',
    accent: '#6366f1',
    desc: '旅程的終點，經典與對角線的試煉交錯。',
    levels: [
      { difficulty: 'hard', seed: 4401, intro: '星海翻湧，每一步都需要更專注。', outro: '一整片星座被你重新連起。' },
      { difficulty: 'hard', seed: 4402, variant: 'diagonal', intro: '這片星域的對角線格外明亮，別忽略它。', outro: '斜向的銀河重新流動起來。' },
      { difficulty: 'hard', seed: 4403, intro: '銀河的裂縫需要被縫合。', outro: '裂縫癒合，光河奔流不息。' },
      { difficulty: 'hard', seed: 4404, variant: 'diagonal', intro: '只剩最後兩座星圖，對角線仍在低語。', outro: '群星齊鳴，天空逐漸完整。' },
      { difficulty: 'hard', seed: 4405, variant: 'diagonal', intro: '最後一顆星，也是最亮的一顆。', outro: '星圖完整了！世界重新被星光點亮，旅人的傳說就此流傳。' },
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
