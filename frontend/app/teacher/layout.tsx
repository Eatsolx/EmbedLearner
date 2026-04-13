"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/teacher/Sidebar";
import CommandPalette from "@/components/teacher/CommandPalette";
import { MobileTabBar } from "@/components/shared/MobileTabBar";
import NotificationBell from "@/components/shared/NotificationBell";
import UserMenu from "@/components/shared/UserMenu";

const teacherTabs = [
  {
    href: "/teacher/dashboard",
    icon: "ri-dashboard-3-line",
    activeIcon: "ri-dashboard-3-fill",
    label: "总览",
  },
  {
    href: "/teacher/courses",
    icon: "ri-book-open-line",
    activeIcon: "ri-book-open-fill",
    label: "课程",
  },
  {
    href: "/teacher/grading",
    icon: "ri-file-check-line",
    activeIcon: "ri-file-check-fill",
    label: "批改",
  },
  {
    href: "/teacher/warnings",
    icon: "ri-bar-chart-box-line",
    activeIcon: "ri-bar-chart-box-fill",
    label: "学情",
  },
  {
    href: "/teacher/agents",
    icon: "ri-robot-2-line",
    activeIcon: "ri-robot-2-fill",
    label: "Agent",
  },
];

const pagePurposeTips = [
  {
    match: "/teacher/dashboard",
    text: "页面用途：快速查看课堂整体数据、知识点掌握趋势与预警学生。",
  },
  {
    match: "/teacher/courses",
    text: "页面用途：管理课程与模板，体现跨课程可复用能力。",
  },
  {
    match: "/teacher/grading",
    text: "页面用途：集中处理待批改作业并追踪 AI 批改结果。",
  },
  {
    match: "/teacher/warnings",
    text: "页面用途：识别高风险学生并优先安排教学干预。",
  },
  {
    match: "/teacher/agents",
    text: "页面用途：配置课程 Agent 策略与模型参数。",
  },
  {
    match: "/teacher/settings",
    text: "页面用途：查看账号信息与平台接入配置状态。",
  },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar: hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-[200px]">
          {/* Mobile header */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-border bg-white/80 px-4 backdrop-blur-md md:px-6">
            {/* Mobile logo + hamburger area */}
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/teacher/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-primary text-white">
                  <i className="ri-brain-line text-base" />
                </div>
                <span className="text-base font-heading font-bold text-ink-text">
                  EduAgent
                </span>
              </Link>
            </div>
            {/* Desktop spacer */}
            <div className="hidden md:block" />
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 rounded-lg border border-ink-border bg-ink-surface px-3 py-1.5 text-xs text-ink-text-light transition-colors hover:border-ink-primary/30 hover:text-ink-text"
                onClick={() => {
                  // Trigger CMD+K
                  document.dispatchEvent(
                    new KeyboardEvent("keydown", {
                      key: "k",
                      metaKey: true,
                      bubbles: true,
                    }),
                  );
                }}
              >
                <i className="ri-search-line" />
                <span className="hidden sm:inline">搜索...</span>
                <kbd className="ml-4 hidden rounded border border-ink-border bg-white px-1 text-[10px] font-medium sm:inline">
                  ⌘K
                </kbd>
              </button>
              <NotificationBell />
              <UserMenu />
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 pb-20 md:p-6 md:pb-6">
            <div className="mb-4 rounded-lg border border-ink-primary/20 bg-ink-primary-lighter/50 px-3 py-2 text-xs text-ink-text-muted sm:text-sm">
              <i className="ri-information-line mr-1.5 text-ink-primary" />
              {pagePurposeTips.find((tip) => pathname.startsWith(tip.match))?.text ||
                "页面用途：当前页面用于教学管理流程展示。"}
            </div>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <MobileTabBar tabs={teacherTabs} />

      <CommandPalette />
    </QueryClientProvider>
  );
}
