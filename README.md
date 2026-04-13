# EduAgent

EduAgent 是一个面向高校课程的通用 AI Agent 平台。它不是单一课程的聊天机器人，而是一个可以快速配置到不同课程中的 AI 助教系统，支持课程答疑、作业批注、个性化练习生成、学情预警和平台嵌入。

当前仓库已经包含：

- 首页新手引导与产品说明
- 教师端跨课程模板切换
- 智慧树页面内嵌演示
- 弹出式 AI 助手
- FastAPI 后端、Next.js 前端、LTI Provider
- 本地开发与 Docker 两套启动方式

## 项目结构

```text
.
├── backend/             # FastAPI 后端
├── frontend/            # Next.js 前端
├── lti-provider/        # Node.js LTI Provider
├── data/                # 种子数据与课程资料
├── extension/           # 浏览器扩展
├── tests/               # 测试与压测脚本
├── docker-compose.yml   # Docker 编排
├── nginx.conf           # Docker 反向代理配置
└── .env.example         # 环境变量模板
```

## 主要能力

- 跨课程 AI 助教：同一套能力可配置到不同课程
- 课程答疑：支持流式对话
- 作业批注：支持批改与反馈展示
- 个性化练习：按课程与场景生成练习
- 学情分析与预警：教师端查看学生风险与趋势
- 平台嵌入：支持演示页、LTI、iframe、扩展等接入形态

## 环境要求

- Python 3.12
- Node.js 22+
- npm 10+
- Docker Desktop / Docker Compose v2

## 环境变量

先复制一份环境变量：

```bash
cp .env.example .env
```

如果你使用智谱 OpenAI 兼容接口，可以这样填写：

```env
POSTGRES_USER=eduagent
POSTGRES_PASSWORD=eduagent_dev
POSTGRES_DB=eduagent

NEO4J_AUTH=neo4j/eduagent_dev
REDIS_URL=redis://localhost:26379
MONGODB_URL=mongodb://localhost:27018/lti

LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
LLM_API_KEY=你的 API Key
LLM_MODEL=glm-4-flash

JWT_SECRET=change_me_to_a_random_string
```

说明：

- 本地开发时，`.env` 里的 `REDIS_URL`、`MONGODB_URL` 建议写成 `localhost` 端口
- Docker 启动时，`docker-compose.yml` 会把服务名注入给容器内部使用
- 这里只建议用响应更快的演示模型，例如 `glm-4-flash`

## 方式一：本地开发启动

推荐日常调试使用这一套，改代码后无需每次重新构建镜像。

### 1. 先启动依赖服务

```bash
docker compose up -d postgres redis neo4j milvus mongo
```

### 2. 启动后端

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/pip install "setuptools<81"
```

```bash
cd backend
PYTHONPATH=. \
POSTGRES_HOST=localhost \
POSTGRES_PORT=25432 \
REDIS_URL=redis://localhost:26379 \
NEO4J_URI=bolt://localhost:27687 \
MILVUS_HOST=localhost \
MILVUS_PORT=29530 \
MONGODB_URL=mongodb://localhost:27018/lti \
../.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

后端默认地址：

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### 3. 启动前端

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev -- --port 3000
```

前端地址：

- Web: `http://localhost:3000`
- 嵌入演示: `http://localhost:3000/embed/demo`

### 4. 启动 LTI Provider（可选）

如果你要联调 LTI，再单独启动：

```bash
cd lti-provider
npm install
BACKEND_URL=http://localhost:8000 \
FRONTEND_URL=http://localhost:3000 \
MONGODB_URL=mongodb://localhost:27018/lti \
node index.js
```

LTI Provider 地址：

- `http://localhost:3000/health` 是前端，不是 LTI
- LTI Provider 默认跑在 `http://localhost:3000` 以外的独立进程端口 `3000` 配置里，如果本地联调与前端冲突，建议改成其他端口后再启动

如果需要避免和前端端口冲突，可临时把 `lti-provider/index.js` 里的 `port: 3000` 改成别的端口，例如 `3010`。

## 方式二：Docker 启动

适合整体验证与交付演示。

### 1. 准备环境变量

```bash
cp .env.example .env
```

按需修改其中的数据库密码、LLM 配置和 JWT。

### 2. 构建并启动

```bash
docker compose up -d --build
```

### 3. 访问地址

- 总入口：`http://localhost:9251`
- 前端直连：`http://localhost:9249`
- 后端 API：`http://localhost:9248`
- LTI Provider：`http://localhost:9250`
- PostgreSQL：`localhost:25432`
- Redis：`localhost:26379`
- MongoDB：`localhost:27018`
- Neo4j Browser：`http://localhost:27474`
- Neo4j Bolt：`bolt://localhost:27687`
- Milvus：`localhost:29530`

### 4. 停止服务

```bash
docker compose down
```

如果连卷一起清理：

```bash
docker compose down -v
```

## 演示建议

当前比较适合展示的页面：

- 首页：产品说明 + 新手引导
- 教师端课程页：跨课程模板切换
- 嵌入演示页：智慧树页面内 AI 助手

推荐演示路径：

1. 打开首页介绍产品定位
2. 进入教师端课程页切换不同课程模板
3. 打开 `embed/demo` 演示平台内唤起 AI 助手

## 常用命令

```bash
# 查看 Docker 服务状态
docker compose ps

# 只重启数据库依赖
docker compose restart postgres redis neo4j milvus mongo

# 查看后端日志
docker compose logs -f backend

# 查看前端日志
docker compose logs -f frontend
```

## 常见问题

### 1. 前端能打开，但 AI 不回答

优先检查：

- `.env` 中 `LLM_BASE_URL`、`LLM_API_KEY`、`LLM_MODEL` 是否正确
- 后端是否正常启动
- `NEXT_PUBLIC_API_URL` 是否指向正确后端地址

建议先访问：

- `http://localhost:8000/health`
- `http://localhost:8000/docs`

### 2. Docker 构建时报 `ENOSPC`

这是 Docker 磁盘空间不足，不是代码问题。可先清理：

```bash
docker system df
docker system prune -a
```

### 3. PostgreSQL unhealthy

通常是旧卷数据和新配置冲突，可尝试：

```bash
docker compose down -v
docker compose up -d postgres
```

### 4. 智慧树页面能嵌入，但 AI 浮窗异常

优先用本地开发方式启动前后端，这样改动最快、日志也最直观。

### 5. 后端启动报 `pkg_resources` 或 Milvus 相关错误

请确认已经安装：

```bash
.venv/bin/pip install "setuptools<81"
```

## 说明

- 当前仓库以演示和课程场景展示为主
- 部分课程模板与平台接入为前端壳层展示，不依赖后端真实配置
- 若你准备继续部署到线上，建议补充生产环境的 `.env`、鉴权策略和监控配置
