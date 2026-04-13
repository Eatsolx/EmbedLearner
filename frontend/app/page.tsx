"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: "ri-question-answer-line",
    title: "课程问答",
    desc: "面向课程知识点提供上下文问答，帮助学生快速定位疑问并获得解释。",
    color: "bg-ink-primary-lighter text-ink-primary",
  },
  {
    icon: "ri-edit-2-line",
    title: "作业批注",
    desc: "针对代码、公式和文本作业给出可定位反馈，帮助学生快速修改并复盘。",
    color: "bg-ink-success-light text-ink-success",
  },
  {
    icon: "ri-file-list-3-line",
    title: "练习生成",
    desc: "根据课程内容和掌握度自动生成练习题，支持分层训练和个性化节奏。",
    color: "bg-ink-warning-light text-ink-warning",
  },
  {
    icon: "ri-alarm-warning-line",
    title: "学情预警",
    desc: "自动识别学生薄弱点与风险趋势，帮助教师更早介入教学支持。",
    color: "bg-ink-error-light text-ink-error",
  },
];

const introCards = [
  {
    title: "给谁用",
    content: "教师 / 学生 / 教学平台",
    icon: "ri-team-line",
  },
  {
    title: "能做什么",
    content: "问答、批注、练习、预警",
    icon: "ri-magic-line",
  },
  {
    title: "怎么接入",
    content: "网页嵌入 / iframe / 扩展 / API / 机器人",
    icon: "ri-plug-line",
  },
  {
    title: "适用哪些课",
    content: "C语言、数据结构、高数等",
    icon: "ri-book-open-line",
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "了解产品",
    desc: "先看产品说明，明确 EduAgent 不是单课机器人，而是可复用到多门课程的 AI 助教平台。",
    icon: "ri-compass-3-line",
  },
  {
    step: "02",
    title: "选择角色/场景",
    desc: "教师关注答疑和批改效率，学生关注学习反馈，平台关注快速嵌入和统一管理。",
    icon: "ri-user-settings-line",
  },
  {
    step: "03",
    title: "开始体验",
    desc: "你可以先注册账号体验，再按课程逐步配置问答、批注、练习和预警能力。",
    icon: "ri-rocket-line",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-ink-border bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-primary text-white">
              <i className="ri-brain-line text-lg" />
            </div>
            <span className="text-lg font-heading font-bold text-ink-text">
              EduAgent
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-ink-text-muted transition-colors hover:text-ink-primary"
            >
              功能
            </a>
            <a
              href="#guide"
              className="text-sm font-medium text-ink-text-muted transition-colors hover:text-ink-primary"
            >
              新手引导
            </a>
            <Link
              href="/embed/demo"
              className="text-sm font-medium text-ink-text-muted transition-colors hover:text-ink-primary"
            >
              嵌入演示
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-ink-text-muted transition-colors hover:text-ink-primary sm:inline-block"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-lg bg-ink-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-ink-primary-dark"
            >
              免费注册
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 sm:py-32">
          {/* Subtle gradient blob */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-ink-primary-lighter via-white to-white opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-primary/20 bg-ink-primary-lighter px-4 py-1.5 text-xs font-semibold text-ink-primary">
                <i className="ri-sparkling-2-fill text-sm" />
                可嵌入式跨课程 AI Agent 通用架构平台
              </span>
            </motion.div>

            <motion.h1
              className="mx-auto mt-6 max-w-3xl text-4xl font-heading font-extrabold leading-tight tracking-tight text-ink-text sm:text-5xl lg:text-6xl"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              让每门课程都拥有
              <br />
              <span className="text-ink-primary">AI 智能助教</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-text-muted"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              基于多Agent编排引擎，提供位置级批注、知识图谱追踪、自适应学习路径，
              助力教师高效教学，让学生获得个性化AI辅导体验。
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
            >
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink-primary px-6 text-base font-semibold text-white shadow-lg shadow-ink-primary/25 transition-all hover:bg-ink-primary-dark hover:shadow-xl hover:shadow-ink-primary/30"
              >
                <i className="ri-login-box-line text-xl" />
                登录平台
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-ink-border bg-white px-6 text-base font-semibold text-ink-text transition-all hover:border-ink-primary/30 hover:bg-ink-primary-lighter"
              >
                <i className="ri-user-add-line text-xl" />
                免费注册
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="bg-ink-surface py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold tracking-tight text-ink-text sm:text-4xl">
                核心能力
              </h2>
              <p className="mt-4 text-lg text-ink-text-muted">
                从Agent编排到知识追踪，覆盖教学全流程
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="group relative rounded-2xl border border-ink-border bg-white p-6 transition-all hover:border-ink-primary/20 hover:shadow-lg hover:shadow-ink-primary/5"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}
                  >
                    <i className={`${f.icon} text-2xl`} />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-ink-text">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-text-muted">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Beginner Guide ── */}
        <section id="guide" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-primary/20 bg-ink-primary-lighter px-4 py-1.5 text-xs font-semibold text-ink-primary">
                <i className="ri-map-pin-user-line text-sm" />
                新手引导
              </span>
              <h2 className="mx-auto mt-6 max-w-5xl text-2xl font-heading font-bold leading-relaxed tracking-tight text-ink-text sm:text-3xl">
                EduAgent 是一个面向高校课程的通用 AI Agent 平台。它不是单一课程的聊天机器人，而是一个可以快速配置到不同课程中的 AI 助教系统，支持课程答疑、作业批注、个性化练习生成、学情预警和平台嵌入。
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {introCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-ink-border bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-primary-lighter text-ink-primary">
                    <i className={`${card.icon} text-xl`} />
                  </div>
                  <h3 className="mt-4 text-base font-heading font-semibold text-ink-text">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-text-muted">{card.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {onboardingSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-ink-border bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-ink-primary">
                      STEP {item.step}
                    </span>
                    <i className={`${item.icon} text-xl text-ink-primary`} />
                  </div>
                  <h3 className="mt-3 text-lg font-heading font-semibold text-ink-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-text-muted">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-ink-border bg-ink-surface p-5 sm:p-6">
              <h3 className="text-base font-heading font-semibold text-ink-text">
                给教师 / 给学生
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-ink-border bg-white p-4">
                  <p className="text-sm font-semibold text-ink-text">给教师</p>
                  <p className="mt-1 text-sm text-ink-text-muted">
                    更快答疑、更高效批改、可视化学情预警，减少重复劳动，把时间留给教学设计。
                  </p>
                </div>
                <div className="rounded-xl border border-ink-border bg-white p-4">
                  <p className="text-sm font-semibold text-ink-text">给学生</p>
                  <p className="mt-1 text-sm text-ink-text-muted">
                    随时问、即时反馈、按掌握度生成练习，形成“练习-纠错-再练习”的学习闭环。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-ink-border bg-white p-5 sm:p-6">
              <h3 className="text-base font-heading font-semibold text-ink-text">
                平台适配能力
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["iframe", "网页嵌入", "浏览器扩展", "飞书/钉钉机器人", "Open API"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-ink-border bg-ink-surface px-3 py-1 text-xs font-medium text-ink-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-ink-border bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-heading font-bold text-ink-text">
              工程能力与部署方式
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-ink-border bg-ink-surface p-4">
                <p className="text-sm font-semibold text-ink-text">快速部署</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-text-muted">
                  支持容器化部署与模块化扩展，适配教学平台接入节奏。
                </p>
              </div>
              <div className="rounded-xl border border-ink-border bg-ink-surface p-4">
                <p className="text-sm font-semibold text-ink-text">跨课程复用</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-text-muted">
                  同一套能力可快速配置到不同学科，降低重复建设成本。
                </p>
              </div>
              <div className="rounded-xl border border-ink-border bg-ink-surface p-4">
                <p className="text-sm font-semibold text-ink-text">可演示可落地</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-text-muted">
                  提供前端演示壳层与后端接口能力，便于答辩演示与后续工程化。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-ink-border bg-ink-primary-lighter py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-heading font-bold text-ink-text sm:text-3xl">
              准备好开始了吗？
            </h2>
            <p className="mt-3 text-ink-text-muted">
              注册教师账号，3分钟内为你的课程部署AI助教。
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-ink-primary px-8 text-base font-semibold text-white shadow-lg shadow-ink-primary/25 transition-all hover:bg-ink-primary-dark"
            >
              <i className="ri-rocket-2-line text-xl" />
              立即开始
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-ink-border bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-primary text-white">
                <i className="ri-brain-line text-sm" />
              </div>
              <span className="text-sm font-heading font-semibold text-ink-text">
                EduAgent
              </span>
            </div>
            <p className="text-sm text-ink-text-light">
              可嵌入式跨课程 AI 助教平台
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
