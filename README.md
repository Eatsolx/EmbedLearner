# A25 跨课程 AI Agent Demo

一个可演示的前后端样板项目，面向“可嵌入式跨课程 AI Agent 通用架构平台”赛题做了可录屏、可讲解、可交互的 Demo。

## 技术栈

- 前端：Vue 3 + Vite
- 嵌入组件：React + Vite
- 后端：Python + FastAPI
- 数据：纯 mock 数据，不依赖真实 AI 或外部模型

## Demo 功能

- 教师后台
  - 课程管理：查看课程、资料、平台接入情况，支持新建演示课程
  - Agent 配置：切换模板、人设、回答风格、知识范围和预警阈值
  - 学情可视化：雷达图、成长曲线、共性错误分析、预警名单
- 学生端
  - 聊天式答疑：多轮问答、快捷问题建议
  - 作业提交与批注：输入作业文本，返回批注摘要和建议
  - 增量练习：做题、自动评分、给出学习建议
- 嵌入式演示
  - iframe 接入示意
  - SDK 挂载示意
  - 浏览器扩展内容脚本注入
  - 模拟超星/智慧树/钉钉三种接入模式
  - React 独立 widget，便于后续接入 CopilotKit

## 启动方式

### 1. 启动后端

```bash
cd /Users/xrz/Home/Code/服创赛/backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 启动前端

```bash
cd /Users/xrz/Home/Code/服创赛/frontend
npm install
npm run dev
```

前端默认运行在 [http://localhost:5173](http://localhost:5173)，并通过 Vite 代理访问后端接口。

### 3. 启动 React 嵌入组件

```bash
cd /Users/xrz/Home/Code/服创赛/widget-react
npm install
npm run dev
```

React widget 默认运行在 [http://localhost:5174](http://localhost:5174)。

### 4. 可选：加载浏览器扩展，直接注入超星/智慧树页面

扩展目录在 [extension/README.md](/Users/xrz/Home/Code/服创赛/extension/README.md)。

## 可嵌入资源

- React iframe 页面：`http://127.0.0.1:5174/`
- React SDK 脚本：`http://127.0.0.1:5174/host-sdk.js`
- 浏览器扩展：`/extension`

## 接口说明

后端接口全部在 `/api/*` 下，包含：

- `/api/overview`
- `/api/courses`
- `/api/agent/templates`
- `/api/agent/config`
- `/api/analytics/dashboard`
- `/api/chat`
- `/api/homework/submit`
- `/api/practice`
- `/api/practice/submit`
- `/api/platforms`
- `/api/embed`

## 说明

- 当前版本重点是“展示完整功能闭环”，不接入真实大模型。
- 如果后续要接 CopilotKit，建议保留现在的 iframe / SDK / 浏览器扩展入口，只替换 `widget-react` 内部交互层。
- 如果后续需要，可以把 mock 接口逐步替换成真实知识库、模型编排和平台适配逻辑。
