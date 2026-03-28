import { useEffect, useMemo, useState } from "react";
import { widgetApi } from "./api";

function readSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    platform: params.get("platform") || "chaoxing",
    courseId: Number(params.get("courseId") || "1"),
    hostUrl: params.get("hostUrl") || "",
  };
}

const platformNameMap = {
  chaoxing: "超星学习通",
  zhihuishu: "智慧树",
  dingtalk: "钉钉",
};

export default function App() {
  const initial = useMemo(readSearchParams, []);
  const [courses, setCourses] = useState([]);
  const [practice, setPractice] = useState({ questions: [] });
  const [selectedCourseId, setSelectedCourseId] = useState(initial.courseId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "你好，这里是课程助手入口。你可以直接提问课程问题或查看练习建议。",
    },
  ]);
  const [suggestions, setSuggestions] = useState([
    "循环结构怎么学",
    "帮我看作业问题",
    "给我出三道练习题",
  ]);

  const currentCourse =
    courses.find((course) => course.id === selectedCourseId) || courses[0];

  useEffect(() => {
    async function bootstrap() {
      try {
        const [courseData, practiceData] = await Promise.all([
          widgetApi.getCourses(),
          widgetApi.getPractice(),
        ]);
        setCourses(courseData);
        setPractice(practiceData);
        if (!courseData.some((course) => course.id === initial.courseId) && courseData[0]) {
          setSelectedCourseId(courseData[0].id);
        }
      } catch (error) {
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content: `初始化失败：${error.message}`,
          },
        ]);
      }
    }

    bootstrap();
  }, [initial.courseId]);

  async function sendMessage(text) {
    const content = text.trim();
    if (!content) {
      return;
    }

    setLoading(true);
    setMessages((previous) => [...previous, { role: "user", content }]);
    setInput("");

    try {
      const result = await widgetApi.chat({
        courseId: selectedCourseId,
        message: content,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.reply,
          source: result.source,
        },
      ]);
      setSuggestions(result.suggestions || []);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: `当前后端不可用：${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="widget-shell">
      <header className="widget-header">
        <div>
          <p className="widget-platform">{platformNameMap[initial.platform] || initial.platform}</p>
          <h1>课程助手</h1>
          <p className="widget-subtitle">
            当前页面负责承载课程问答和学习辅助入口。
          </p>
        </div>
        <div className="widget-meta-box">
          <span className="meta-label">宿主页面</span>
          <strong>{initial.hostUrl ? "已传入" : "独立预览"}</strong>
        </div>
      </header>

      <section className="toolbar">
        <div className="toolbar-item">
          <label htmlFor="course-select">当前课程</label>
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(Number(event.target.value))}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-item stats">
          <span>知识覆盖</span>
          <strong>{currentCourse ? Math.round(currentCourse.knowledgeCoverage * 100) : 0}%</strong>
        </div>
        <div className="toolbar-item stats">
          <span>预警人数</span>
          <strong>{currentCourse?.warningCount || 0}</strong>
        </div>
      </section>

      <main className="content-layout">
        <section className="conversation-panel">
          <div className="section-head">
            <h2>课程问答</h2>
            <span>{currentCourse?.platform || "平台未选定"}</span>
          </div>

          <div className="suggestion-row">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="ghost-button"
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="message-list">
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`message-item ${message.role}`}
              >
                <p>{message.content}</p>
                {message.source ? <small>来源：{message.source.join(" / ")}</small> : null}
              </article>
            ))}
          </div>

          <div className="composer">
            <textarea
              value={input}
              rows={4}
              placeholder="输入课程问题、学习问题或希望推荐的练习类型"
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="button" className="primary-button" onClick={() => sendMessage(input)}>
              {loading ? "处理中..." : "发送"}
            </button>
          </div>
        </section>

        <aside className="sidebar-panel">
          <section className="side-section">
            <div className="section-head">
              <h2>推荐练习</h2>
            </div>
            <ol className="practice-list">
              {practice.questions.slice(0, 3).map((question) => (
                <li key={question.id}>{question.prompt}</li>
              ))}
            </ol>
          </section>

          <section className="side-section">
            <div className="section-head">
              <h2>后续接入位</h2>
            </div>
            <ul className="info-list">
              <li>当前入口可复用到超星、智慧树和钉钉页面。</li>
              <li>问答区支持替换为其他交互内核。</li>
              <li>宿主页面无需修改现有挂载方式。</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
