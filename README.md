# 隨機漫步 · Sudoku（數獨）

一款結合**黑色偵探劇情**的數獨遊戲。在蒸氣與霓虹交織的「矩陣城」，連環失蹤案的現場只留下沒填完的數字矩陣——死者的「死前訊息」。你是私家偵探「切線過客」，每解開一張矩陣，特定座標上的數字就連成下一個犯罪現場的地址。

以 React 19 + Vite + Tailwind CSS v4 打造，純前端、無後端，進度自動存在瀏覽器 `localStorage`。

## 玩法特色

- **故事地圖模式**：四個案件章節（霓虹下城、蒸氣工業帶、地下迴路、矩陣核心），每章 5 關，難度循序漸進。
- **進場／過關劇情**：每一關有專屬辦案台詞，過關後揭開下一條線索。
- **固定題目**：每關用固定 seed 生成，題目可重現。
- **數獨變體架構**：以「unit / peers」抽象描述規則，內建經典與對角線 X 變體，未來可擴充不規則宮、殺手數獨。
- **多難度**：starter / easy / medium / hard。
- **進度保存**：通關紀錄自動存檔，重開瀏覽器不流失。

## 技術棧

| 項目 | 內容 |
| --- | --- |
| 前端框架 | React 19 |
| 建置工具 | Vite 8 |
| 樣式 | Tailwind CSS v4（`@tailwindcss/vite`） |
| Lint | Oxlint |

## 專案結構

```
src/
├─ game/          # 純邏輯：不含 UI
│  ├─ rng.js        # 可重現的亂數產生器（seed）
│  ├─ variants.js   # unit/peers 規則抽象、變體定義
│  ├─ generator.js  # 數獨題目生成與挖洞
│  └─ levels.js     # 故事文本與關卡資料（章節／seed／難度）
├─ hooks/
│  ├─ useSudoku.js   # 單局遊戲狀態（填字、衝突、勝利判定）
│  └─ useProgress.js # 通關進度（localStorage）
└─ components/     # 畫面：MapScreen / GameScreen / Board / Cell / NumberPad …
```

## 本地開發

```bash
npm install
npm run dev      # 啟動開發伺服器
npm run build    # 產出 production 版本到 dist/
npm run preview  # 預覽 build 結果
npm run lint     # Oxlint 檢查
```

需要 Node.js 18+。

## Roadmap

- [ ] 更多章節與劇情
- [ ] 不規則宮 / 殺手數獨變體
- [ ] 提示（hint）與計時
- [ ] Android 打包（Capacitor / TWA）
- [ ] GitHub Pages 線上試玩

---

以 [Claude Code](https://claude.com/claude-code) 協作開發。
