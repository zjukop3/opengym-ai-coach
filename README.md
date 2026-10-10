# openGym AI Coach

[![Tests](https://img.shields.io/github/actions/workflow/status/zjukop3/opengym-ai-coach/test.yml?branch=main&label=tests&style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen?style=flat-square)]()

**中文** | [English](#english)

## 🧠 openGym AI 教练

一个基于 openGym 的轻量级 AI 训练助手。它分析你过去几周的训练数据，通过 LLM 生成周期化训练建议，并在疲劳累积时发出预警。

**为什么需要这个项目？**

[openGym](https://github.com/DuarteSantos8/openGym) 是出色的自托管健身追踪器，让你完全掌控训练数据。但它缺少一个智能教练 —— 能告诉你何时该加重、何时该减载、何时该休息。openGym AI Coach 正是为此而生，作为生态补充，不修改主项目分毫。

### ✨ 特性

- 🤖 **AI 驱动建议**：基于实际训练量、PR 趋势和恢复状态，由 OpenAI 模型生成个性化周计划
- ⚠️ **疲劳度预警**：自动检测连续高强度训练、睡眠不足（若接入）等情况，发出预警
- 🔌 **开箱即用的 API**：REST 接口，可轻松集成到 openGym 的 Webhook 或定时任务中
- 🧩 **可定制提示模板**：提供默认提示，也可通过环境变量注入你自己的教练风格
- 📊 **数据可视化**：简单的 Web 页面查看最近建议与疲劳分（可选）
- 📦 **自托管友好**：Docker 一键部署，独立于 openGym 运行，只读访问训练数据

### 📦 安装

确保已安装 Node.js ≥ 18。

```bash
git clone https://github.com/zjukop3/opengym-ai-coach.git
cd opengym-ai-coach
npm install
```

### ⚙️ 配置

在项目根目录创建 `.env` 文件：

```env
OPENGYM_URL=https://your-opengym-instance.com
OPENGYM_API_KEY=your_opengym_api_key
OPENAI_API_KEY=sk-your-key-here
PORT=3000
```

`OPENGYM_API_KEY` 是 openGym 的 API 访问令牌（可在管理后台生成）。

### 🚀 快速上手

```bash
npm start
```

服务将运行在 `http://localhost:3000`。

**生成训练建议**

```bash
curl -X POST http://localhost:3000/api/coach/advice -H 'Content-Type: application/json' -d '{"weeks": 4}'
```

返回 JSON 格式的建议：

```json
{
  "advice": "基于你最近4周的训练数据...",
  "fatigueLevel": "moderate",
  "nextWeekPlan": { "monday": "...", ... }
}
```

openGym 可配置 Webhook 在每周日自动调用该接口，将建议发送到你的通知渠道。

### 🔗 与主项目的关系

- **openGym**（[DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym)）是数据源，负责记录训练、体重和日程。
- **openGym AI Coach** 是独立的附加服务，**仅读取** openGym 数据进行分析，**绝不写入或修改**训练记录。
- 本项目的目标是填补 openGym 在智能教练方面的空白，而不是替代或分流它的任何功能。
- 请继续使用 openGym 作为你的主训练记录应用，AI Coach 只是一个聪明的“旁观者”。

### 🗺️ Roadmap

- [ ] 支持更多 LLM（本地 Ollama、Claude）
- [ ] 疲劳度模型改进（结合心率、睡眠数据）
- [ ] openGym 插件式集成（无需单独服务）
- [ ] 多语言支持
- [ ] 训练计划自动生成与导出

### 📜 License

MIT License，详见 [LICENSE](LICENSE) 文件。

---

## English

### openGym AI Coach

A lightweight AI training assistant built on top of openGym. It analyzes your recent workout history, uses an LLM to generate periodized training advice, and warns you when fatigue is accumulating.

**Why this project?**

[openGym](https://github.com/DuarteSantos8/openGym) is an excellent self-hosted fitness tracker. However, it lacks an intelligent coach that tells you when to push harder, when to deload, and when to rest. openGym AI Coach fills that gap as an ecosystem add-on, without altering the main project.

### ✨ Features

- 🤖 **AI-Powered Advice** – Generates personalized weekly plans based on actual volume, PR trends, and recovery status via OpenAI.
- ⚠️ **Fatigue Alerts** – Detects consecutive high-intensity sessions or insufficient sleep (if available) and issues warnings.
- 🔌 **Plug-and-Play API** – REST endpoints that easily integrate with openGym webhooks or cron jobs.
- 🧩 **Customizable Prompts** – Default templates included; override via environment variables with your own coaching style.
- 📊 **Visual Dashboard** – Simple web UI to view recent advice and fatigue scores.
- 📦 **Self-Hosted Friendly** – One-command Docker deployment, runs independently, read-only access to openGym data.

### 📦 Installation

Node.js ≥ 18 required.

```bash
git clone https://github.com/zjukop3/opengym-ai-coach.git
cd opengym-ai-coach
npm install
```

### ⚙️ Configuration

Create a `.env` file:

```env
OPENGYM_URL=https://your-opengym-instance.com
OPENGYM_API_KEY=your_opengym_api_key
OPENAI_API_KEY=sk-your-key-here
PORT=3000
```

### 🚀 Quick Start

```bash
npm start
```

Service listens on `http://localhost:3000`.

**Get training advice**

```bash
curl -X POST http://localhost:3000/api/coach/advice -H 'Content-Type: application/json' -d '{"weeks": 4}'
```

Example response:

```json
{
  "advice": "Based on your last 4 weeks of training...",
  "fatigueLevel": "moderate",
  "nextWeekPlan": { "monday": "...", ... }
}
```

You can configure openGym to call this endpoint weekly and relay the advice to your notification channels.

### 🔗 Relation to the Main Project

- **openGym** ([DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym)) is the data source – it tracks your workouts, weight, and schedule.
- **openGym AI Coach** is an independent sidecar service that **only reads** from openGym, **never writes** or alters your logs.
- This project aims to enhance the openGym experience with intelligent coaching, without duplicating or competing with its core features.
- Keep using openGym as your primary workout log; AI Coach is just a smart observer.

### 🗺️ Roadmap

- [ ] Support for additional LLMs (local Ollama, Claude)
- [ ] Improved fatigue models (heart rate, sleep data)
- [ ] Native openGym plugin (no separate service)
- [ ] Internationalization
- [ ] Automated training plan generation and export

### 📜 License

MIT License – see [LICENSE](LICENSE).