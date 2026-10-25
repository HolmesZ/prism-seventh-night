# 棱镜逆流 · 第七夜 | PRISM: The Seventh Night

> 一枚会记住光的棱镜，把射向星核的子弹，一颗一颗还回去。

一个在浏览器 / 手机上直接开玩的 2D 弹幕反射游戏。你是**阿镜**——星核的最后一位守夜人。她没有武器，只有一面弧形的棱镜护盾：**任何撞上来的光，都会原路返回**。

撑过**七夜**，灯就还亮着。第七夜之后，还有无尽守夜。

- 参赛：WaytoAGI **1024 切磋大会 · 游戏赛道**
- 形态：纯静态网页（HTML + CSS + Canvas 2D + WebAudio），零依赖、零构建
- 体积：三个文件 + 素材，双击 `index.html` 就能玩

## 在线游玩

| 入口 | 链接 |
| --- | --- |
| 🎮 **直接开玩** | **https://holmesz.github.io/prism-seventh-night/** |
| 🪪 主角卡（网页版） | https://holmesz.github.io/prism-seventh-night/docs/character-card.html |
| 💻 源码仓库 | https://github.com/HolmesZ/prism-seventh-night |
| 🖼️ 主角卡（PNG） | [assets/character-card.png](assets/character-card.png) |

---

## 一分钟上手

| 操作 | 桌面 | 手机 |
| --- | --- | --- |
| 旋转棱镜护盾 | 鼠标移动 / `←` `→` | 右摇杆 |
| 移动星核 | `W` `A` `S` `D` | 左摇杆 |
| 脉冲（震开贴身弹幕） | 鼠标左键 / `Space` | `◉` 按钮 |
| 棱镜新星（全场减速） | 鼠标右键 / `E` | `✦` 按钮 |
| 暂停 / 静音 / 全屏 / 操作提示 | `Esc` `P` / `M` / `F` / `H` | 右上角按钮 |

**核心循环**：子弹打在弧面护盾上被弹开 → 弹开的子弹变成追猎敌人的光 → 击杀得分并累积连击倍率 → 能量满格放「棱镜新星」把整个星图拖进慢动作。

- 星核完整度上限 5 点；每夜清场 +1；捡绿色碎片 +1；击破守卫者 +2。
- 第五夜与第七夜是守卫者之夜：第七夜的**终夜守卫**血量 ×1.7。
- 七夜通关后解锁「无尽守夜」，记录最高分与最远夜数（本地存档）。

---

## 本地运行

三种方式，任选其一：

```bash
# 1) 直接打开
start index.html            # Windows
open index.html             # macOS

# 2) 用仓库自带的零依赖服务器（推荐）
node serve.mjs              # http://127.0.0.1:4321/

# 3) 任意静态服务器
npx serve .                 # 或 python -m http.server 8080
```

没有构建步骤，没有 `npm install`。

### 调试参数（开发用）

| URL 参数 | 作用 |
| --- | --- |
| `?scene=boss` `?scene=nova` `?scene=dead` | 直接进入某个演示场景 |
| `?pose&clean` | 干净的主角立绘镜头（用于截图） |
| `?prologue` / `?codex` / `?lore` / `?ending` | 直接打开序章 / 主角卡 / 世界观 / 结局面板 |
| `?autostart&mode=endless` | 跳过菜单直接开始无尽模式 |
| `?selftest` | 运行内置自测（反射、护盾、触控、新星、治疗、结局流程） |
| `?debug` | 暴露 `window.__PRISM_DEBUG__` 调试 API |

---

## 部署到 GitHub Pages（本项目已完成部署）

线上地址：**https://holmesz.github.io/prism-seventh-night/** —— 由仓库自带的工作流自动发布，`main` 分支每次推送后会重新部署（约 40 秒）。

### 已完成的配置（本仓库现状）

| 项 | 值 |
| --- | --- |
| Pages 构建方式 | GitHub Actions（`build_type: workflow`） |
| 触发条件 | 推送到 `main` 或手动 `workflow_dispatch` |
| 发布流程 | `.github/workflows/pages.yml`：准备 `_site/` → configure-pages → upload-pages-artifact → deploy-pages |
| 站点根 | 仓库根目录（`.nojekyll` 已包含） |

### 换一个仓库时怎么重新做一遍

1. 新建仓库并推送：

   ```bash
   git init
   git add .
   git commit -m "feat: PRISM · The Seventh Night"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

2. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**（工作流里也带了 `enablement: true`，多数情况下会自动开启）。
3. 等待 `Deploy to GitHub Pages` 跑完（约 40 秒），地址即 `https://<你的用户名>.github.io/<仓库名>/`。

### 方式 B：直接从分支部署（不想用 Actions 时）

**Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`** 即可，仓库根目录就是站点根目录（已包含 `.nojekyll`）。

> 也可以把整个文件夹拖到 Netlify Drop / Vercel / Cloudflare Pages，同样即开即玩。

---

## 目录结构

```
.
├── index.html                  # 标题页 + 全部 UI 面板（序章 / 主角卡 / 世界观 / 结局）
├── styles.css                  # 视觉系统（霓虹 · 扫描线 · 响应式 · 触屏）
├── game.js                     # 游戏本体：状态机、关卡、战斗、渲染、音频、自测
├── assets/
│   ├── ajing.svg               # 主角立绘（AI 生成）
│   ├── ajing-sketch.svg        # 主角概念草图（AI 生成）
│   ├── character-card.png      # 主角卡（1920×1080，交付用）
│   └── shots/                  # 游戏截图（菜单 / 战斗 / 主角卡 / 世界观 / 结局 / 移动端）
├── docs/
│   ├── SUBMISSION.md           # 参赛提交说明：对照「交什么」逐条交付
│   ├── GAME-BACKGROUND.md      # 游戏背景 / 世界观设定
│   ├── CHARACTER-CARD.md       # 主角卡（文字版 + 生成 prompt）
│   ├── DESIGN-NOTES.md         # 设计说明与技术实现
│   └── character-card.html     # 主角卡排版源文件（导出 PNG 用）
├── .github/workflows/pages.yml # 自动部署到 GitHub Pages
└── LICENSE
```

---

## 设计要点

- **一看就会玩**：标题页写清四条操作；进入游戏后底部常驻操作提示条（`H` 收起），序章第三页再讲一遍目标。
- **主角有记忆点**：阿镜 = 竖立的棱镜身躯 + 两点青色眼睛 + 两条不听话的光带（前六位守夜人的残留）。她不攻击，只「归还」。
- **想再来一局**：七夜通关有结局与数据结算，随后直接进无尽模式；失败页一键重开；本地记录最高分与最远夜数。
- **零依赖**：没有任何框架、字体、构建工具；全部美术由 Canvas 2D 与 SVG 程序化绘制，主音频由 WebAudio 实时合成。

## 已知边界

- 需要支持 Canvas 2D + WebAudio 的现代浏览器（Chrome / Edge / Firefox / Safari 近两年版本）。
- 声音需要一次用户交互后才能播放（浏览器自动播放策略），点击「开始第七夜」即满足。
- 存档使用 `localStorage`；`file://` 下个别浏览器会禁用，此时仅本局有效。

## License

MIT © Holmes Zhi

---

**CREDITS**：策划 / 代码 / 美术 / 音频 —— AI 编程工具协作完成；角色与道具形象由 AI 生成。详见 [docs/DESIGN-NOTES.md](docs/DESIGN-NOTES.md)。
