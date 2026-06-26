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
    id: 'ch6',
    name: '巨型矩陣',
    emoji: '🔢',
    accent: '#a3e635',
    desc: '案子才結，新訊息又冒出來——這回 12 格寬，數字不夠用，連字母都上了。',
    size: 12,
    levels: [
      { difficulty: 'starter', seed: 6601, intro: '案子才結沒幾天，桌上又冒出一張矩陣。這回攤開有一面牆寬——12 格，1 到 9 不夠填，A、B、C 也算數。', outro: '填滿了。比想像中好上手——只是大，規矩沒變。' },
      { difficulty: 'starter', seed: 6602, intro: '又一張寬矩陣，墨跡比上次工整。有人在練手。', outro: '對上了。這串座標，往城北的資料倉庫去。' },
      { difficulty: 'easy', seed: 6603, intro: '倉庫的鐵架上釘著張 12 格寬的表，邊角捲了。', outro: '解開了。他們把人，當成資料在歸檔。' },
      { difficulty: 'easy', seed: 6604, intro: '愈往裡走，矩陣愈大。像是故意要拖慢追的人。', outro: '拖不住我。下一格指向倉庫最底層。' },
      { difficulty: 'medium', seed: 6605, intro: '最底層那張表，A 到 C 排得密密麻麻，看久了發暈。', outro: '暈歸暈，數字老實。盡頭那串座標，指向城西一片塌了半邊的舊街區。' },
    ],
  },
  {
    id: 'ch5',
    name: '碎裂舊城',
    emoji: '🧩',
    accent: '#14b8a6',
    desc: '城西的舊街區，連格子都是碎的——宮歪歪扭扭，不再方正。',
    variant: 'jigsaw',
    levels: [
      { difficulty: 'easy', seed: 5501, intro: '舊街區的牆上釘著張矩陣，宮歪七扭八，不再是方的。', outro: '形狀變了，規矩沒變：每一塊照樣得填滿 1~9。' },
      { difficulty: 'easy', seed: 5502, intro: '碎掉的街區，碎掉的格子。', outro: '拼回去了。又一個座標浮出來。' },
      { difficulty: 'medium', seed: 5503, intro: '宮的邊界繞來繞去，看久了眼睛會花。', outro: '跟著邊界走，數字自己會對上。' },
      { difficulty: 'medium', seed: 5504, intro: '這張矩陣，像被人撕碎再黏回去。', outro: '黏痕底下，藏著下一個地址。' },
      { difficulty: 'hard', seed: 5505, intro: '最後一塊拼圖，也最不規則。', outro: '拼回最後一塊，磚縫底下露出一道往地下主機房的閘門。' },
    ],
  },
  {
    id: 'ch7',
    name: '終局矩陣',
    emoji: '🧠',
    accent: '#fb7185',
    desc: '主機房。16 格寬，A 到 G——整座城的祕密攤在一張表上。',
    size: 16,
    levels: [
      { difficulty: 'easy', seed: 7701, intro: '主機房冷得像冰庫。牆上那張表 16 格寬，1 到 9 配 A 到 G，填滿要命。', outro: '撐住了。第一塊面板亮起，露出底下更多的表。' },
      { difficulty: 'easy', seed: 7702, intro: '一整排終端機，每台螢幕都凍在一張沒填完的巨表上。', outro: '一台一台接上，城市的失蹤名單在我眼前捲動。' },
      { difficulty: 'medium', seed: 7703, intro: '核心那張表最大，也最冷。我搓了搓手，坐下。', outro: '對齊了。幕後者的代號，藏在第 16 列。' },
      { difficulty: 'medium', seed: 7704, intro: '警報開始響。剩下的表得在斷電前解完。', outro: '趕在黑掉前填完最後一格。門開了。' },
      { difficulty: 'hard', seed: 7705, intro: '最後一張，16 乘 16，整起案子的底牌。慢慢來，別填錯。', outro: '全亮了。我盯著那串座標，笑了——命運是場隨機漫步，可這一步，我自己選的。' },
    ],
  },
  {
    id: 'ch8',
    name: '致命結算',
    emoji: '🧮',
    accent: '#f43f5e',
    desc: '帳房先生死了，留下一本只有「組別總和」、沒有單筆數字的帳。',
    variant: 'killer',
    levels: [
      { difficulty: 'easy', seed: 8801, intro: '幫派的帳房先生倒在算盤旁。他的帳本怪得很——數字被圈成一組組，每組只標一個總和，單筆全空著。', outro: '湊出來了。原來他把每筆髒錢，都藏進加總裡。' },
      { difficulty: 'easy', seed: 8802, intro: '又一頁。圈圈裡的數字不能重複，加起來得剛好等於那個總和——就這麼一條線索。', outro: '對上了。這本帳，記的不只是錢，還有人。' },
      { difficulty: 'medium', seed: 8811, intro: '組越圈越大，總和越湊越難。帳房先生防的就是有人來讀。', outro: '防不住我。下一筆，指向碼頭的保險箱。' },
      { difficulty: 'medium', seed: 8812, intro: '保險箱裡又一本帳，墨跡未乾。看來他死前還在記。', outro: '記到一半被打斷的，往往最要命。我把缺口補上了。' },
      { difficulty: 'hard', seed: 8821, intro: '最後一本，總和咬得最緊，一個數字錯，整頁垮。深吸一口氣。', outro: '結清了。帳房先生用一本加總帳，替整座城留了底——而我，剛把它讀完。' },
    ],
  },
  {
    id: 'ch9',
    name: '夾層密碼',
    emoji: '🥪',
    accent: '#f59e0b',
    desc: '1 和 9 夾住的，才是真正的秘密。',
    variant: 'sandwich',
    levels: [
      { difficulty: 'medium', seed: 9901, intro: '密報夾在兩頁之間——頁碼 1 和 9。中間那段，才是真正要命的東西。盤面左側和上方各有一組數字，那是夾層的總和。', outro: '夾層裡的數字全出來了。1 和 9 之間，果然藏著最重要的那段。' },
      { difficulty: 'medium', seed: 9902, intro: '第二份密報。格式一樣：1 和 9 做邊，中間的數加起來等於旁邊的線索。', outro: '又對上了。每一行每一列，都有人故意把答案夾進去。' },
      { difficulty: 'medium', seed: 9903, intro: '這個藏法開始熟悉了。但每一題的夾法都不一樣，線索從不重複。', outro: '我記住了這個規律。不是所有秘密都藏在角落，有些就放在中間，等人來夾。' },
      { difficulty: 'medium', seed: 9904, intro: '密報越來越厚。夾層越多，代表越接近核心。', outro: '核心就在前面。夾層的總和指向的地址，我已經記下來了。' },
      { difficulty: 'hard', seed: 9905, intro: '最後一份。線索稀疏，夾的方式最刁。1 和 9 的位置，這一次真的要自己推。', outro: '推出來了。夾層密碼，是這座城裡最老派的藏法——但也最難破。切線過客，案子沒有結束，只有下一個現場。' },
    ],
  },
]

// 攤平成有序清單，補上 id / 章節資訊 / 變體 / 序號。
// 重要：關卡 id（存檔 key）用章節「穩定編號」chapter.id（'ch5'→5）計算，
// 與章節在陣列中的顯示位置脫鉤——這樣調整章節順序也不會改到已上線版本的存檔 key。
// label（地圖/標題顯示）則用顯示位置，讓畫面上的「第 X-Y 關」自然遞增。
export const LEVELS = CHAPTERS.flatMap((chapter, ci) => {
  const num = Number(String(chapter.id).replace('ch', '')) // 穩定章節編號
  return chapter.levels.map((lv, li) => {
    const variant = lv.variant || chapter.variant || 'classic'
    const size = lv.size || chapter.size || 9
    return {
      ...lv,
      id: `${num}-${li + 1}`, // 穩定存檔 key
      chapterId: chapter.id,
      chapterName: chapter.name,
      accent: chapter.accent,
      variant,
      variantLabel: VARIANTS[variant]?.label || '經典',
      size,
      order: ci * 100 + li,
      label: `${ci + 1}-${li + 1}`, // 顯示用（依地圖順序）
    }
  })
})

export const LEVEL_ORDER = LEVELS.map((l) => l.id)

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || null
}

export function nextLevelId(id) {
  const i = LEVEL_ORDER.indexOf(id)
  return i >= 0 && i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : null
}
