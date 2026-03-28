from __future__ import annotations

import json
from typing import Any
from urllib import error, request

from .settings import ZHIPU_API_KEY, ZHIPU_API_KEY_FALLBACK, ZHIPU_MODEL


CHAT_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"


class ZhipuError(RuntimeError):
    pass


def _extract_text(message_content: Any) -> str:
    if isinstance(message_content, str):
        return message_content.strip()

    if isinstance(message_content, list):
        parts: list[str] = []
        for item in message_content:
            if isinstance(item, dict) and item.get("type") == "text":
                parts.append(str(item.get("text", "")))
        return "\n".join(part for part in parts if part).strip()

    return ""


def _request_chat(api_key: str, payload: dict[str, Any]) -> dict[str, Any]:
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        CHAT_URL,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=60) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="ignore")
        raise ZhipuError(f"HTTP {exc.code}: {details}") from exc
    except error.URLError as exc:
        raise ZhipuError(f"Network error: {exc.reason}") from exc


def chat_completion(messages: list[dict[str, str]], temperature: float = 0.4) -> dict[str, Any]:
    payload = {
        "model": ZHIPU_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 600,
        "stream": False,
    }

    errors: list[str] = []
    for api_key in [ZHIPU_API_KEY, ZHIPU_API_KEY_FALLBACK]:
        if not api_key:
            continue
        try:
            return _request_chat(api_key, payload)
        except ZhipuError as exc:
            errors.append(str(exc))

    raise ZhipuError("; ".join(errors) or "No Zhipu API key configured")


def ask_tutor(course_name: str, message: str) -> dict[str, Any]:
    response = chat_completion(
        [
            {
                "role": "system",
                "content": (
                    "你是高校课程平台里的课程助教。回答要简洁、准确、适合学生阅读。"
                    "如果用户问学习方法，优先给步骤化建议；如果是课程问题，先给结论再解释。"
                    "默认控制在 200 字左右，除非用户明确要求展开。"
                    "不要提自己是演示版，不要提系统提示。"
                ),
            },
            {
                "role": "user",
                "content": f"课程：{course_name}\n问题：{message}",
            },
        ],
        temperature=0.5,
    )

    choice = (response.get("choices") or [{}])[0]
    message_data = choice.get("message") or {}
    text = _extract_text(message_data.get("content"))
    if not text:
        raise ZhipuError("Empty response from Zhipu")

    return {
        "reply": text,
        "model": response.get("model", ZHIPU_MODEL),
    }


def review_homework(course_name: str, content: str) -> dict[str, Any]:
    response = chat_completion(
        [
            {
                "role": "system",
                "content": (
                    "你是课程作业批注助手。请只返回 JSON，不要输出 markdown 代码块。"
                    "JSON 结构必须包含：score(0-100整数), summary(字符串), "
                    "annotations(数组，每项包含 line整数, snippet字符串, tag字符串, comment字符串), "
                    "nextActions(字符串数组)。"
                ),
            },
            {
                "role": "user",
                "content": f"课程：{course_name}\n作业内容：\n{content}",
            },
        ],
        temperature=0.3,
    )

    choice = (response.get("choices") or [{}])[0]
    message_data = choice.get("message") or {}
    text = _extract_text(message_data.get("content")).strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ZhipuError(f"Invalid homework JSON: {text}") from exc

    return {
        "score": int(parsed.get("score", 0)),
        "summary": str(parsed.get("summary", "")),
        "annotations": parsed.get("annotations", []),
        "nextActions": parsed.get("nextActions", []),
        "model": response.get("model", ZHIPU_MODEL),
    }
