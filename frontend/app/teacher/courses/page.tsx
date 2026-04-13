"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { fetchCourses } from "@/lib/queries";
import type { Course } from "@/lib/queries";

type TemplateSubject = {
  id: string;
  name: string;
  icon: string;
  modules: { title: string; desc: string; icon: string }[];
};

const templateSubjects: TemplateSubject[] = [
  {
    id: "c-language",
    name: "C语言",
    icon: "ri-code-s-slash-line",
    modules: [
      { title: "语法问答", desc: "围绕语法与基础概念的问答模块", icon: "ri-question-answer-line" },
      { title: "代码批注", desc: "面向代码作业的智能批注模块", icon: "ri-markup-line" },
      { title: "编程练习", desc: "生成分层编程练习的模块", icon: "ri-terminal-box-line" },
      { title: "学习预警", desc: "基于提交行为的预警模块", icon: "ri-alarm-warning-line" },
    ],
  },
  {
    id: "data-structures",
    name: "数据结构",
    icon: "ri-git-merge-line",
    modules: [
      { title: "概念问答", desc: "面向结构与算法概念的问答模块", icon: "ri-question-line" },
      { title: "作业批注", desc: "对作业解法进行结构化批注", icon: "ri-file-edit-line" },
      { title: "题单生成", desc: "按难度生成训练题单", icon: "ri-list-check-3" },
      { title: "学习预警", desc: "识别薄弱知识点并预警", icon: "ri-error-warning-line" },
    ],
  },
  {
    id: "advanced-math",
    name: "高等数学",
    icon: "ri-function-line",
    modules: [
      { title: "定理问答", desc: "围绕定理、推导和证明的问答", icon: "ri-book-2-line" },
      { title: "解题批注", desc: "针对步骤与符号错误的批注模块", icon: "ri-edit-box-line" },
      { title: "分层练习", desc: "按掌握度生成基础到进阶练习", icon: "ri-stack-line" },
      { title: "学习预警", desc: "基于错题趋势触发预警", icon: "ri-alarm-line" },
    ],
  },
  {
    id: "college-physics",
    name: "大学物理",
    icon: "ri-flask-line",
    modules: [
      { title: "概念问答", desc: "物理概念与公式理解问答", icon: "ri-lightbulb-flash-line" },
      { title: "实验批注", desc: "实验报告结构化批注模块", icon: "ri-draft-line" },
      { title: "计算练习", desc: "力学与电磁学计算练习生成", icon: "ri-calculator-line" },
      { title: "学习预警", desc: "按章节难点生成预警提示", icon: "ri-radar-line" },
    ],
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const list = courses ?? [];

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(templateSubjects[0].id);

  const currentTemplate =
    templateSubjects.find((item) => item.id === activeTemplate) ?? templateSubjects[0];

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      apiFetch("/api/courses", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    },
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink-text">
            课程管理
          </h1>
          <p className="mt-1 text-sm text-ink-text-muted">
            管理你的所有课程与学习资源
          </p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-ink-primary px-4 text-sm font-medium text-white transition-colors hover:bg-ink-primary-dark self-start sm:self-auto"
        >
          <i className={showCreate ? "ri-close-line" : "ri-add-line"} />
          {showCreate ? "取消" : "新建课程"}
        </button>
      </div>

      {showCreate && (
        <div className="rounded-xl border border-ink-primary/20 bg-ink-primary-lighter/30 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-ink-text-light">
                课程名称
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="高等数学"
                className="mt-1 w-full rounded-lg border border-ink-border px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-text-light">
                课程描述
              </label>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="微积分、线性代数..."
                className="mt-1 w-full rounded-lg border border-ink-border px-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            onClick={() =>
              newName &&
              createMutation.mutate({ name: newName, description: newDesc })
            }
            disabled={!newName || createMutation.isPending}
            className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-ink-primary px-4 text-xs font-medium text-white hover:bg-ink-primary-dark disabled:opacity-50"
          >
            {createMutation.isPending ? "创建中..." : "创建课程"}
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-ink-border bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-heading font-semibold text-ink-text">
              课程模板
            </h2>
            <p className="mt-1 text-sm text-ink-text-muted">
              先用空壳模板快速展示跨课程能力，后续可接入真实配置
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink-primary/20 bg-ink-primary-lighter px-3 py-1 text-xs font-medium text-ink-primary">
            <i className="ri-shapes-line" />
            跨课程可切换
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {templateSubjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setActiveTemplate(subject.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                activeTemplate === subject.id
                  ? "border-ink-primary bg-ink-primary text-white"
                  : "border-ink-border bg-white text-ink-text-muted hover:border-ink-primary/40 hover:text-ink-text"
              }`}
            >
              <i className={subject.icon} />
              {subject.name}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {currentTemplate.modules.map((module) => (
            <div
              key={`${currentTemplate.id}-${module.title}`}
              className="rounded-xl border border-dashed border-ink-border bg-ink-surface/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-primary">
                  <i className={`${module.icon} text-lg`} />
                </div>
                <span className="rounded-full bg-ink-warning-light px-2 py-0.5 text-[11px] font-medium text-ink-warning">
                  模板占位
                </span>
              </div>
              <h3 className="mt-3 text-sm font-heading font-semibold text-ink-text">
                {module.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-text-muted">
                {module.desc}
              </p>
              <p className="mt-3 text-[11px] text-ink-text-light">即将配置</p>
            </div>
          ))}
        </div>
      </section>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((course) => (
            <motion.div key={course.id} variants={cardVariant}>
              <Link
                href={`/teacher/courses/${course.id}`}
                className="group block rounded-xl border border-ink-border bg-white p-5 transition-all hover:border-ink-primary/20 hover:shadow-lg hover:shadow-ink-primary/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-primary-lighter text-ink-primary">
                    <i className={`${course.icon || "ri-book-open-line"} text-xl`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-heading font-semibold text-ink-text group-hover:text-ink-primary transition-colors truncate">
                      {course.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-text-muted line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-ink-text-light">
                  <span className="flex items-center gap-1">
                    <i className="ri-user-3-line" />
                    {course.student_count} 名学生
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line" />
                    {formatDate(course.updated_at)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-ink-border bg-white p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-ink-primary-lighter text-ink-primary">
            <i className="ri-book-open-line text-xl" />
          </div>
          <p className="mt-3 text-sm font-medium text-ink-text">还没有课程</p>
          <p className="mt-1 text-xs text-ink-text-muted">
            你可以先新建课程，或先在上方切换课程模板快速演示跨课程能力。
          </p>
        </div>
      )}
    </motion.div>
  );
}
