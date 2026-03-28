from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class CourseCreate(BaseModel):
    name: str
    teacher: str
    platform: str
    students: int = Field(default=60, ge=1)
    description: str = ""


class AgentConfigUpdate(BaseModel):
    courseId: int
    templateId: str
    persona: str
    responseStyle: str
    knowledgeScope: List[str]
    warningThreshold: int = Field(ge=0, le=100)
    practiceIntensity: str


class ChatRequest(BaseModel):
    courseId: int
    message: str


class HomeworkSubmitRequest(BaseModel):
    courseId: int
    content: str


class PracticeSubmitRequest(BaseModel):
    practiceId: str
    answers: List[int]

