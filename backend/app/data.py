from __future__ import annotations

from copy import deepcopy


STATE = {
    "overview": {
        "title": "课程教学辅助平台",
        "subtitle": "面向课程教学场景的统一工作台",
        "summary": "集中处理课程资料、学习互动、作业反馈和接入管理。",
        "metrics": [
            {"label": "活跃课程", "value": "12", "delta": "+3 本周"},
            {"label": "接入平台", "value": "3", "delta": "超星 / 智慧树 / 钉钉"},
            {"label": "在线学生", "value": "486", "delta": "今日累计"},
            {"label": "待处理提醒", "value": "28", "delta": "近 7 天"},
        ],
        "milestones": [
            {"name": "平台公告", "status": "更新", "detail": "本周新增智慧树接入入口"},
            {"name": "课程资料", "status": "处理中", "detail": "2 份资料待同步到课程库"},
            {"name": "作业反馈", "status": "正常", "detail": "今日新增 31 份批注记录"},
            {"name": "学习提醒", "status": "待确认", "detail": "有 8 名学生进入重点关注列表"},
        ],
        "highlights": [
            "教师侧统一查看课程、资料、互动和提醒信息",
            "学生侧支持课程问答、作业反馈和练习入口",
            "页面入口可挂载到超星、智慧树和钉钉场景中",
        ],
    },
    "courses": [
        {
            "id": 1,
            "name": "Python 程序设计",
            "teacher": "王老师",
            "platform": "超星",
            "students": 126,
            "knowledgeCoverage": 0.87,
            "warningCount": 8,
            "materials": ["课程导学.pdf", "循环与函数.pptx", "OJ 错题汇总.docx"],
            "description": "以编程基础为核心，覆盖答疑、练习和作业反馈。",
        },
        {
            "id": 2,
            "name": "数据结构",
            "teacher": "李老师",
            "platform": "钉钉",
            "students": 94,
            "knowledgeCoverage": 0.81,
            "warningCount": 11,
            "materials": ["线性表.pdf", "树与图.pptx"],
            "description": "适合展示跨课程知识迁移与学习预警。",
        },
        {
            "id": 3,
            "name": "大学物理",
            "teacher": "周老师",
            "platform": "超星",
            "students": 158,
            "knowledgeCoverage": 0.79,
            "warningCount": 9,
            "materials": ["力学专题.pdf", "实验指导书.docx"],
            "description": "适合展示多学科扩展能力。",
        },
    ],
    "agent_templates": [
        {
            "id": "qa",
            "name": "课程问答",
            "tag": "课堂问答",
            "description": "针对知识点问答、多轮追问和课堂答疑设计。",
            "features": ["多轮对话", "知识点追踪", "课堂语气"],
        },
        {
            "id": "grading",
            "name": "作业反馈",
            "tag": "作业反馈",
            "description": "突出作业评价、问题定位与改进建议。",
            "features": ["批注摘要", "错误标签", "改进建议"],
        },
        {
            "id": "practice",
            "name": "练习推荐",
            "tag": "增量训练",
            "description": "根据掌握度生成适配练习与推荐顺序。",
            "features": ["分层难度", "错题回流", "举一反三"],
        },
    ],
    "agent_config": {
        "courseId": 1,
        "templateId": "qa",
        "persona": "耐心、鼓励式、适合大一学生",
        "responseStyle": "先给结论，再给步骤，必要时补例子",
        "knowledgeScope": ["课程资料", "历年错题", "实验指导"],
        "warningThreshold": 65,
        "practiceIntensity": "medium",
    },
    "analytics": {
        "classHealth": [
            {"label": "知识掌握度", "value": 84},
            {"label": "作业完成率", "value": 91},
            {"label": "课堂互动率", "value": 76},
            {"label": "风险预警率", "value": 18},
        ],
        "radar": [
            {"label": "概念理解", "value": 82},
            {"label": "编程实现", "value": 74},
            {"label": "调试能力", "value": 69},
            {"label": "表达总结", "value": 77},
            {"label": "迁移应用", "value": 71},
        ],
        "growth": [
            {"week": "第1周", "score": 58},
            {"week": "第2周", "score": 64},
            {"week": "第3周", "score": 70},
            {"week": "第4周", "score": 73},
            {"week": "第5周", "score": 79},
            {"week": "第6周", "score": 83},
        ],
        "errorDistribution": [
            {"type": "循环边界", "count": 18},
            {"type": "变量作用域", "count": 11},
            {"type": "函数返回值", "count": 14},
            {"type": "输入输出格式", "count": 9},
        ],
        "warnings": [
            {"student": "张同学", "reason": "近两次练习成绩连续下降", "level": "中"},
            {"student": "陈同学", "reason": "作业未按时提交且互动率偏低", "level": "高"},
            {"student": "刘同学", "reason": "循环与函数知识点错题重复出现", "level": "中"},
        ],
        "graph": {
            "nodes": [
                {"id": "syntax", "label": "语法基础", "x": 110, "y": 90, "group": "基础"},
                {"id": "loop", "label": "循环结构", "x": 280, "y": 70, "group": "核心"},
                {"id": "func", "label": "函数设计", "x": 440, "y": 125, "group": "核心"},
                {"id": "debug", "label": "调试定位", "x": 250, "y": 220, "group": "能力"},
                {"id": "ds", "label": "数据结构迁移", "x": 470, "y": 250, "group": "跨课"},
                {"id": "physics", "label": "物理建模应用", "x": 620, "y": 150, "group": "跨课"},
            ],
            "edges": [
                {"source": "syntax", "target": "loop"},
                {"source": "loop", "target": "func"},
                {"source": "loop", "target": "debug"},
                {"source": "func", "target": "ds"},
                {"source": "func", "target": "physics"},
            ],
        },
    },
    "practice_set": {
        "id": "practice-20260328",
        "title": "循环与函数增量练习",
        "description": "根据最近错题自动推荐，难度从基础到迁移逐步提升。",
        "questions": [
            {
                "id": "q1",
                "type": "single",
                "prompt": "以下哪种写法最适合表示“从 0 到 9 的十次循环”？",
                "options": ["for i in range(10):", "for i in range(1, 10):", "while i <= 10:", "loop(10)"],
                "answer": 0,
            },
            {
                "id": "q2",
                "type": "single",
                "prompt": "函数没有显式 return 时，Python 默认返回什么？",
                "options": ["0", "False", "None", "空字符串"],
                "answer": 2,
            },
            {
                "id": "q3",
                "type": "single",
                "prompt": "哪一项最有助于定位循环中的逻辑错误？",
                "options": ["删除全部注释", "增加 print 调试信息", "直接重写全部代码", "修改文件名"],
                "answer": 1,
            },
        ],
    },
    "platforms": [
        {
            "name": "超星学习通",
            "mode": "iframe / content-script",
            "status": "运行中",
            "description": "通过课程详情页嵌入学生问答与练习组件。",
        },
        {
            "name": "智慧树",
            "mode": "iframe / content-script",
            "status": "运行中",
            "description": "通过课程页右侧悬浮入口挂载智能助教面板。",
        },
        {
            "name": "钉钉教学群",
            "mode": "SDK / 侧边栏",
            "status": "配置中",
            "description": "通过消息卡片与侧边栏挂载智能助教入口。",
        },
    ],
    "embed_demo": {
        "iframeUrl": "http://127.0.0.1:5174/?platform=chaoxing&courseId=1",
        "sdkUrl": "http://127.0.0.1:5174/host-sdk.js",
        "sdkEvent": (
            "<script src=\"http://127.0.0.1:5174/host-sdk.js\"></script>\n"
            "<div id=\"a25-agent-root\"></div>\n"
            "<script>\n"
            "  window.A25Agent.mount('#a25-agent-root', {\n"
            "    platform: 'chaoxing',\n"
            "    courseId: 1,\n"
            "    mode: 'sidebar'\n"
            "  });\n"
            "</script>"
        ),
        "entryPoints": ["超星课程页侧栏", "智慧树课程详情页右侧", "作业详情页", "班级群消息卡片"],
    },
}


def snapshot() -> dict:
    return deepcopy(STATE)


def mock_chat_reply(message: str) -> dict:
    lowered = message.lower()
    if "循环" in message or "for" in lowered:
        reply = (
            "你可以先把问题拆成“循环次数”和“循环体要做什么”两部分。"
            "如果是 Python，最常见的写法是 `for i in range(...)`。我已经顺手给你关联了"
            " 一道循环边界练习，做完会更稳。"
        )
        suggestions = ["再给我一个循环例题", "帮我解释 range(1, 10)", "生成两道基础题"]
    elif "函数" in message:
        reply = (
            "函数最重要的是输入、处理和返回值。你这类问题通常会卡在“参数传什么”和"
            "“return 什么时候写”上，我建议先看一个最小例子再练一题。"
        )
        suggestions = ["举一个带 return 的例子", "怎么设计函数参数", "给我出一道练习"]
    elif "作业" in message or "批注" in message:
        reply = (
            "系统会根据作业文本给出问题定位、风险标签和修改建议。"
            "你可以直接提交一段答案查看结果。"
        )
        suggestions = ["批注会关注哪些问题", "怎么查看批注结果", "生成改进建议"]
    else:
        reply = (
            "我是课程助手，可以结合课程内容、练习和作业场景回答问题。"
            "你可以问我课程知识点、作业反馈或练习推荐。"
        )
        suggestions = ["循环结构怎么学", "帮我看作业问题", "给我出三道练习题"]

    return {
        "reply": reply,
        "source": ["课程资料库", "错题回流知识中间件", "学情规则引擎"],
        "suggestions": suggestions,
    }


def mock_homework_feedback(content: str) -> dict:
    snippets = [line.strip() for line in content.splitlines() if line.strip()]
    if not snippets:
        snippets = ["未提供具体作业文本，以下展示默认批注结果。"]

    annotations = []
    for index, snippet in enumerate(snippets[:3], start=1):
        if "while" in snippet or "for" in snippet:
            issue = "循环边界需要再确认，避免多执行或少执行一次。"
            tag = "逻辑风险"
        elif "return" in snippet:
            issue = "返回值表达清楚了，但建议补充异常输入处理。"
            tag = "可优化"
        else:
            issue = "表达基本完整，建议补充变量含义或示例说明。"
            tag = "表述建议"

        annotations.append(
            {
                "line": index,
                "snippet": snippet,
                "tag": tag,
                "comment": issue,
            }
        )

    return {
        "score": 86,
        "summary": "整体思路正确，主要问题集中在循环边界和结果说明不够完整。",
        "annotations": annotations,
        "nextActions": [
            "先修正循环边界，再补充 1 个自测样例",
            "复习 `range(start, end)` 的区间含义",
            "完成系统推荐的两道同类练习题",
        ],
    }


def grade_practice(answers: list[int]) -> dict:
    questions = STATE["practice_set"]["questions"]
    total = len(questions)
    correct = sum(1 for provided, question in zip(answers, questions) if provided == question["answer"])
    score = round(correct / total * 100) if total else 0
    return {
        "score": score,
        "correctCount": correct,
        "total": total,
        "summary": "基础循环掌握较好，函数返回值和调试意识还可以继续加强。" if score >= 67 else "建议先回顾基础知识点，再做一轮同类题。",
        "recommendations": [
            "复习函数默认返回值与显式 return",
            "针对错题重新练习 2 道基础题",
            "在下一次作业前完成一次调试演练",
        ],
    }
