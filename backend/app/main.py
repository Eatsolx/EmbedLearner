from __future__ import annotations

from copy import deepcopy

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .data import STATE, grade_practice, mock_chat_reply, mock_homework_feedback, snapshot
from .schemas import AgentConfigUpdate, ChatRequest, CourseCreate, HomeworkSubmitRequest, PracticeSubmitRequest
from .zhipu import ZhipuError, ask_tutor, review_homework


app = FastAPI(
    title="A25 Course Assistant Backend",
    description="课程平台后端服务，支持真实模型问答与本地降级回退。",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/overview")
def overview() -> dict:
    return snapshot()["overview"]


@app.get("/api/courses")
def list_courses() -> list[dict]:
    return snapshot()["courses"]


@app.post("/api/courses")
def create_course(payload: CourseCreate) -> dict:
    next_id = max(course["id"] for course in STATE["courses"]) + 1
    course = {
        "id": next_id,
        "name": payload.name,
        "teacher": payload.teacher,
        "platform": payload.platform,
        "students": payload.students,
        "knowledgeCoverage": 0.76,
        "warningCount": 5,
        "materials": ["新上传资料待处理.pdf"],
        "description": payload.description or "新建演示课程",
    }
    STATE["courses"].append(course)
    return {"message": "课程已创建", "course": deepcopy(course)}


@app.get("/api/agent/templates")
def agent_templates() -> list[dict]:
    return snapshot()["agent_templates"]


@app.get("/api/agent/config")
def agent_config() -> dict:
    return snapshot()["agent_config"]


@app.post("/api/agent/config")
def update_agent_config(payload: AgentConfigUpdate) -> dict:
    STATE["agent_config"] = payload.model_dump()
    return {"message": "设置已保存", "config": snapshot()["agent_config"]}


@app.get("/api/analytics/dashboard")
def dashboard() -> dict:
    return snapshot()["analytics"]


@app.post("/api/chat")
def chat(payload: ChatRequest) -> dict:
    course = next((item for item in STATE["courses"] if item["id"] == payload.courseId), None)
    course_name = course["name"] if course else "通用课程"

    try:
        result = ask_tutor(course_name, payload.message)
        return {
            "courseId": payload.courseId,
            "reply": result["reply"],
            "source": [f"智谱 {result['model']}"],
            "suggestions": ["帮我总结这一题", "给我一个例子", "我还可以怎么练"],
            "provider": "zhipu",
        }
    except ZhipuError:
        return {
            "courseId": payload.courseId,
            **mock_chat_reply(payload.message),
            "provider": "mock",
        }


@app.post("/api/homework/submit")
def submit_homework(payload: HomeworkSubmitRequest) -> dict:
    course = next((item for item in STATE["courses"] if item["id"] == payload.courseId), None)
    course_name = course["name"] if course else "通用课程"

    try:
        result = review_homework(course_name, payload.content)
        return {
            "courseId": payload.courseId,
            **result,
            "provider": "zhipu",
        }
    except ZhipuError:
        return {
            "courseId": payload.courseId,
            **mock_homework_feedback(payload.content),
            "provider": "mock",
        }


@app.get("/api/practice")
def get_practice() -> dict:
    return snapshot()["practice_set"]


@app.post("/api/practice/submit")
def submit_practice(payload: PracticeSubmitRequest) -> dict:
    return grade_practice(payload.answers)


@app.get("/api/platforms")
def list_platforms() -> list[dict]:
    return snapshot()["platforms"]


@app.get("/api/embed")
def embed_config() -> dict:
    return snapshot()["embed_demo"]
