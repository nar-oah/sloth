# Sloth

Sloth 是一个基于 uni-app、Vue 3、TypeScript 和 Vite 的任务规划应用。应用围绕月度目标、周度计划和每日任务展开，通过远端接口生成建议、任务书和待办拆解，并在本地保存进度数据。

## 功能概览

- 录入月度计划和周度计划。
- 根据目标调用接口生成计划建议。
- 根据周目标生成任务列表，并把任务拆分为待办事项。
- 记录待办完成状态和任务难度点。
- 使用“分钟赎罪券”兑换可用时间，并统计每日总量、怠惰量和差值。
- 通过图表查看本周数据。

## 技术栈

- uni-app
- Vue 3
- TypeScript
- Vite
- Sass
- axios
- date-fns
- 自定义 admUI 组件库

## 环境要求

建议使用 Node.js 18 或更高版本。

首次克隆仓库时，如果 `src/admUI` 没有内容，需要初始化子模块：

```bash
git submodule update --init --recursive
```

安装依赖：

```bash
npm install
```

## 本地开发

启动 H5 开发环境：

```bash
npm run dev:h5
```

常用平台命令：

```bash
npm run dev:mp-weixin
npm run dev:mp-alipay
npm run dev:mp-qq
```

完整脚本见 `package.json`。

## 构建

构建 H5：

```bash
npm run build:h5
```

构建微信小程序：

```bash
npm run build:mp-weixin
```

类型检查：

```bash
npm run type-check
```

## 目录结构

```text
.
├── src
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   ├── pages/index/index.vue
│   ├── components
│   │   ├── tab-wait.vue
│   │   ├── tab-todo.vue
│   │   ├── tab-analyze.vue
│   │   └── tab-chart.vue
│   ├── sdk
│   │   ├── api.ts
│   │   ├── call.ts
│   │   ├── db.ts
│   │   └── state.ts
│   └── admUI
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 核心模块

- `src/pages/index/index.vue`：主页面，负责计划录入、交易计时和底部页签切换。
- `src/components/tab-wait.vue`：待安排任务列表，可提前拆解任务或废除任务。
- `src/components/tab-todo.vue`：待办事项列表，记录完成状态和难度点。
- `src/components/tab-analyze.vue`：本周数据分析入口。
- `src/sdk/db.ts`：本地数据模型、初始化逻辑和 uni storage 持久化。
- `src/sdk/api.ts`：远端接口封装。
- `src/sdk/call.ts`：把本地目标数据组织成接口请求，并写回任务数据。

## 数据与接口

本地数据通过 uni storage 保存，key 为 `sloth-db`。

远端接口基础地址配置在 `src/sdk/api.ts`：

```text
https://aws.naroah.top/sloth
```

当前使用的接口：

- `POST /suggest`：根据月目标和历史周目标生成建议。
- `POST /writ`：根据月目标和本周目标生成任务列表。
- `POST /todo`：根据任务内容和周目标生成待办拆解。

## 注意事项

- `src/admUI` 是自定义 UI 组件库子模块，页面依赖其中的 `adm-*` 组件。
- 应用启动时会检查过期或未拆解任务，并自动调用待办拆解逻辑。
- 接口地址当前写在源码中，如需切换环境，可优先调整 `src/sdk/api.ts`。
