"use client";

import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

const ZHIHUISHU_EMBED_URL =
  "https://wisdomh5.zhihuishu.com/course/index/1807627860228313088?courseId=1000076607&mapVersion=0";

function ZhihuishuFrame() {
  return (
    <div className="h-full w-full bg-white">
      <iframe
        src={ZHIHUISHU_EMBED_URL}
        className="h-full w-full border-0"
        title="Zhihuishu Course Embed"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

function MockDingtalkUI() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
        <div className="w-8 h-8 bg-[#3370FF] rounded-lg flex items-center justify-center">
          <i className="ri-apps-line text-white text-sm" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-800">教务工作台</span>
          <p className="text-[10px] text-gray-400">钉钉</p>
        </div>
      </div>
      <div className="flex-1 bg-[#F5F6FA] p-4 space-y-3 overflow-auto">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: "ri-calendar-check-line", label: "考勤", color: "#10B981" },
            { icon: "ri-file-text-line", label: "成绩", color: "#F59E0B" },
            { icon: "ri-notification-3-line", label: "通知", color: "#EF4444" },
            { icon: "ri-user-settings-line", label: "管理", color: "#8B5CF6" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <i className={`${item.icon} text-lg`} style={{ color: item.color }} />
              </div>
              <span className="text-[11px] text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InlinePopupAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="absolute bottom-20 right-6 z-30 flex h-[560px] w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-ink-border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-ink-border px-4 py-3 bg-gradient-to-r from-ink-primary to-ink-primary-light">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white">
                <i className="ri-brain-line text-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">EduAgent 智能助教</span>
                <span className="text-[10px] text-white/70">人工智能引论</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface courseId="ai-101" className="h-full" />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-ink-primary text-white shadow-lg transition-all hover:bg-ink-primary-dark hover:shadow-xl active:scale-95"
      >
        <i className={`text-xl ${open ? "ri-close-line" : "ri-chat-smile-3-fill"}`} />
      </button>
    </>
  );
}

export default function EmbedDemoPage() {
  const [activeTab, setActiveTab] = useState<"zhihuishu" | "dingtalk">("zhihuishu");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-primary text-white">
              <i className="ri-brain-line text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">EduAgent 平台嵌入演示</h1>
              <p className="text-xs text-gray-500">展示 AI 智能助教如何嵌入教学平台</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-ink-primary/20 bg-ink-primary-lighter/40 p-3">
            <p className="text-xs font-medium text-ink-text">如何体验</p>
            <div className="mt-1 grid gap-1 text-[11px] text-ink-text-muted sm:grid-cols-3">
              <p>1. 选择平台模式（智慧树 / 钉钉）</p>
              <p>2. 点击右下角气泡，唤醒 AI 助教</p>
              <p>3. 直接提问验证答疑能力</p>
            </div>
          </div>

          <div className="flex gap-1 mt-4">
            {[
              { id: "zhihuishu" as const, label: "智慧树", icon: "ri-book-open-line" },
              { id: "dingtalk" as const, label: "钉钉工作台", icon: "ri-message-3-line" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-ink-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <i className={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "zhihuishu" && (
          <div className="max-w-6xl mx-auto rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-500 ml-2">智慧树 | 人工智能引论</span>
            </div>
            <div className="relative h-[760px]">
              <ZhihuishuFrame />
              <InlinePopupAssistant />
            </div>
          </div>
        )}

        {activeTab === "dingtalk" && (
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-500 ml-2">钉钉工作台 | 教务系统</span>
            </div>
            <div className="flex h-[700px]">
              <div className="flex-1">
                <MockDingtalkUI />
              </div>
              <iframe
                src="/embed/sidebar?course_id=ai-101"
                className="w-[380px] h-full border-0 border-l border-gray-200"
                title="EduAgent Sidebar Demo Full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
