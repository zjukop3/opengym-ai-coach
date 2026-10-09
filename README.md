# openGym-AI-Coach

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](CONTRIBUTING.md)

> 🤖 基于 openGym 历史训练数据，微调 LLM 生成个性化训练建议与疲劳度预警，填补 AI 教练生态空缺。

---

## 为什么有这个项目

[openGym](https://github.com/DuarteSantos8/openGym) 是一个出色的自托管健身追踪器，它帮你记录了每一次训练、重量与体重。然而，数据本身并不会自动变成洞察。

**openGym-AI-Coach** 旨在填补这一生态空缺：通过接入 LLM（如 OpenAI），分析你的训练量（Volume）、PR（个人纪录）趋势与疲劳度，为你生成周期化训练建议与预警，就像拥有一位私人 AI 教练。

## 特性

- 📊 **数据解析**：解析 openGym 导出的 JSON 训练数据。
- 🧠 **AI 分析**：基于 OpenAI API 分析训练量、PR 趋势与肌肉群疲劳度。
- ⚠️ **疲劳预警**：识别过度训练风险与目标肌群滞后。
- 🗓️ **周期化建议**：生成下一周期的训练计划建议。
- 🚀 **独立运行**：作为独立 Node.js 服务运行，不侵入主项目代码库。

## 安装

确保你已安装 Node.js (>=18.0.0)。

```bash
git clone https://github.com/yourname/opengym-ai-coach.git
cd opengym-ai-coach
npm install
```

## 快速上手

1. 从你的 openGym 实例导出训练数据（JSON 格式）。
2. 设置 OpenAI API Key 环境变量：

```bash
export OPENAI_API_KEY="your_api_key_here"
```

3. 启动服务：

```bash
npm start
```

4. 在另一个终端使用 curl 测试：

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"workouts": [{"date": "2023-10-01", "exercise": "Bench Press", "sets": 3, "reps": 10, "weight": 80}]}'
```

## 与主项目的关系

本项目是 [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym) 的非官方生态补充项目。

- **不包含主项目代码**：本项目不包含也不修改 openGym 的核心源码。
- **数据独立**：通过读取 openGym 导出的数据文件工作，不直接连接其数据库。
- **定位补充**：openGym 专注于“记录”，本项目专注于“分析与建议”。

## Roadmap

- [x] 基础数据解析与 API 路由
- [ ] 支持更精细的疲劳度计算算法
- [ ] Web UI 仪表盘展示分析结果
- [ ] 支持本地开源 LLM（如 Llama 3）以实现完全自托管

## License

本项目基于 [MIT License](LICENSE) 开源。

---

# openGym-AI-Coach (English)

> 🤖 Fine-tuned LLM powered coaching layer for openGym, generating personalized training advice and fatigue warnings.

## Why this project?

[openGym](https://github.com/DuarteSantos8/openGym) is a fantastic self-hosted gym tracker. It records your workouts, weights, and body weight. However, data alone doesn't automatically turn into insight.

**openGym-AI-Coach** aims to fill this ecosystem gap: by integrating with LLMs (like OpenAI), it analyzes your training volume, PR trends, and muscle fatigue to generate periodized training suggestions and warnings, acting as your personal AI coach.

## Features

- 📊 **Data Parsing**: Parses JSON workout data exported from openGym.
- 🧠 **AI Analysis**: Analyzes volume, PR trends, and muscle group fatigue using OpenAI API.
- ⚠️ **Fatigue Warning**: Identifies overtraining risks and lagging muscle groups.
- 🗓️ **Periodization**: Generates training plan suggestions for the next cycle.
- 🚀 **Standalone**: Runs as a standalone Node.js service without invading the main project codebase.

## Installation

Ensure you have Node.js (>=18.0.0) installed.

```bash
git clone https://github.com/yourname/opengym-ai-coach.git
cd opengym-ai-coach
npm install
```

## Quick Start

1. Export your workout data (JSON format) from your openGym instance.
2. Set the OpenAI API Key environment variable:

```bash
export OPENAI_API_KEY="your_api_key_here"
```

3. Start the service:

```bash
npm start
```

4. Test it using curl in another terminal:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"workouts": [{"date": "2023-10-01", "exercise": "Bench Press", "sets": 3, "reps": 10, "weight": 80}]}'
```

## Relationship to the main project

This is an unofficial ecosystem add-on for [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym).

- **No Main Project Code**: Does not contain or modify openGym's core source code.
- **Data Independent**: Works by reading data files exported by openGym, without directly connecting to its database.
- **Complementary**: openGym focuses on "tracking", this project focuses on "analysis and advice".

## Roadmap

- [x] Basic data parsing and API routing
- [ ] Support for more granular fatigue calculation algorithms
- [ ] Web UI dashboard for analysis results
- [ ] Support for local open-source LLMs (e.g., Llama 3) for complete self-hosting

## License

This project is licensed under the [MIT License](LICENSE).