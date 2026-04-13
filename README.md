# EmbedLearner

一个可演示的“跨课程 AI 助教嵌入平台”项目，包含：
- `frontend`（Vue 教师/学生演示门户）
- `backend`（FastAPI 接口，支持真实模型 + mock 回退）
- `widget-react`（可被 iframe / SDK / 浏览器扩展复用的嵌入式助手）
- `extension`（浏览器扩展注入壳）

项目目标是快速展示“平台嵌入 + 课程问答 + 作业批注 + 练习与分析”闭环，不要求复杂运维即可本地跑通。

## 功能概览

- 课程管理：课程列表、新建课程、课程维度信息
- AI 助教：聊天问答（优先调用智谱，失败自动回退本地 mock）
- 作业批注：提交文本后返回评分/批注/建议
- 练习系统：拉取题目、提交答案、自动评分
- 嵌入演示：iframe、SDK、浏览器扩展三种接入路径

## 技术栈

- 前端：Vue 3 + Vite
- 嵌入组件：React 18 + Vite
- 后端：FastAPI + Uvicorn
- 模型：智谱 OpenAPI（可选），无 key 时自动 mock
- 容器：Docker + Docker Compose

## 目录结构

```text
EmbedLearner/
├── backend/               # FastAPI 后端
│   ├── app/
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/              # Vue 演示门户
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── widget-react/          # 可嵌入 React 助手
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── extension/             # Chrome 扩展注入壳
├── docker-compose.yml
└── README.md
```

---

## 启动方式 A：本地开发（推荐调试）

### 1) 启动后端

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
# 编辑 .env，填入你的 ZHIPU_API_KEY（可选）
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端健康检查：

```bash
curl http://127.0.0.1:8000/api/health
```

### 2) 启动 Vue 前端

```bash
cd frontend
npm install
npm run dev
```

默认地址：`http://127.0.0.1:5173`

### 3) 启动 React Widget

```bash
cd widget-react
npm install
npm run dev
```

默认地址：`http://127.0.0.1:5174`

### 4) （可选）加载浏览器扩展

Chrome 打开 `扩展程序` -> `开启开发者模式` -> `加载已解压的扩展程序` -> 选择 `extension/`。

---

## 启动方式 B：Docker Compose

> 适合快速演示，避免本地安装 Python/Node 依赖。

### 1) 准备环境变量

```bash
cp backend/.env.example backend/.env
# 编辑 backend/.env，填写你的 key（可选）
```

### 2) 启动

```bash
docker compose up -d --build
```

### 3) 访问

- Vue 前端：`http://127.0.0.1:5173`
- React Widget：`http://127.0.0.1:5174`
- 后端 API：`http://127.0.0.1:8000`

### 4) 停止

```bash
docker compose down
```

---

## 环境变量说明（`backend/.env`）

```env
ZHIPU_API_KEY=your_primary_key
ZHIPU_API_KEY_FALLBACK=your_secondary_key
ZHIPU_MODEL=glm-4.7-flash
```

说明：
- `ZHIPU_API_KEY` 可不填；不填或调用失败时，接口会回退到 mock。
- 推荐演示模型：`glm-4.7-flash`（响应快，成本低）。

---

## 常用接口

- `GET /api/health`
- `GET /api/overview`
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/agent/templates`
- `GET /api/agent/config`
- `POST /api/agent/config`
- `GET /api/analytics/dashboard`
- `POST /api/chat`
- `POST /api/homework/submit`
- `GET /api/practice`
- `POST /api/practice/submit`
- `GET /api/platforms`
- `GET /api/embed`

---

## 嵌入资源

- Widget 页面：`http://127.0.0.1:5174/`
- SDK 脚本：`http://127.0.0.1:5174/host-sdk.js`
- 扩展注入壳：`extension/`

---

## 故障排查

### 1) 聊天不回复

- 先检查后端：`http://127.0.0.1:8000/api/health`
- 看后端日志是否有 key / 网络错误
- 若智谱异常，系统会自动 mock 回退；仍无回复请重启后端

### 2) 前端请求失败（CORS/代理）

- 本地模式下，Vite 通过 `/api -> http://127.0.0.1:8000` 代理
- Docker 模式下，已通过 `VITE_API_PROXY_TARGET=http://backend:8000` 注入

### 3) 端口冲突

- 可改端口后启动，例如：
  - 前端：`npm run dev -- --port 5175`
  - Widget：`npm run dev -- --port 5176`
  - 后端：`uvicorn ... --port 8001`

---

## 开发建议

- 日常调试优先使用“本地开发模式”
- 演示/录屏使用“Docker 模式”保证环境一致
- 如果要接入真实 CopilotKit，建议先保持 `widget-react` 对外入口不变，仅替换内部交互层

