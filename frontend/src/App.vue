<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "./api";
import KnowledgeGraph from "./components/KnowledgeGraph.vue";
import MetricCard from "./components/MetricCard.vue";
import RadarChart from "./components/RadarChart.vue";
import SectionPanel from "./components/SectionPanel.vue";
import TrendChart from "./components/TrendChart.vue";

const tabs = [
  { id: "overview", label: "工作台" },
  { id: "teacher", label: "课程管理" },
  { id: "student", label: "学习助手" },
  { id: "embed", label: "接入管理" },
];

const activeTab = ref("overview");
const loading = ref(true);
const error = ref("");
const saveMessage = ref("");
const courseMessage = ref("");
const homeworkResult = ref(null);
const practiceResult = ref(null);
const chatLoading = ref(false);

const overview = ref({ metrics: [], milestones: [], highlights: [] });
const courses = ref([]);
const templates = ref([]);
const dashboard = ref({
  classHealth: [],
  radar: [],
  growth: [],
  errorDistribution: [],
  warnings: [],
  graph: { nodes: [], edges: [] },
});
const practice = ref({ questions: [] });
const platforms = ref([]);
const embedConfig = ref({ entryPoints: [] });

const agentForm = reactive({
  courseId: 1,
  templateId: "qa",
  persona: "",
  responseStyle: "",
  knowledgeScopeText: "",
  warningThreshold: 65,
  practiceIntensity: "medium",
});

const newCourseForm = reactive({
  name: "",
  teacher: "",
  platform: "超星",
  students: 60,
  description: "",
});

const studentState = reactive({
  selectedCourseId: 1,
  chatInput: "",
  homeworkText: "for i in range(10):\n    print(i)\nreturn total",
  chatMessages: [
    {
      role: "assistant",
      content: "你好，我是课程助手。你可以直接问知识点、作业问题或练习相关内容。",
    },
  ],
  suggestions: ["循环结构怎么学", "帮我看作业问题", "给我出三道练习题"],
  practiceAnswers: {},
});

const currentCourse = computed(
  () => courses.value.find((course) => course.id === studentState.selectedCourseId) || courses.value[0],
);

const overviewCards = computed(() => overview.value.metrics || []);
const healthCards = computed(() => dashboard.value.classHealth || []);
const realIntegrationSteps = [
  "开发阶段直接打开课程组件服务，先确认页面交互和消息链路正常。",
  "没有官方开放接口时，用 extension/ 浏览器扩展把入口注入超星、智慧树页面。",
  "宿主页面可控时，引入课程组件脚本，通过 window.A25Agent.mount() 挂载。",
  "后续替换问答内核时，不需要改宿主页面接入方式。",
];
const embedCode = computed(
  () =>
    `<iframe src="${embedConfig.value.iframeUrl || ""}" title="课程助手" style="width:100%;height:640px;border:0;"></iframe>`,
);
const sdkCode = computed(() => embedConfig.value.sdkEvent || "");

async function loadData() {
  loading.value = true;
  error.value = "";

  try {
    const [
      overviewData,
      courseData,
      templateData,
      agentConfigData,
      dashboardData,
      practiceData,
      platformData,
      embedData,
    ] = await Promise.all([
      api.getOverview(),
      api.getCourses(),
      api.getTemplates(),
      api.getAgentConfig(),
      api.getDashboard(),
      api.getPractice(),
      api.getPlatforms(),
      api.getEmbedConfig(),
    ]);

    overview.value = overviewData;
    courses.value = courseData;
    templates.value = templateData;
    dashboard.value = dashboardData;
    practice.value = practiceData;
    platforms.value = platformData;
    embedConfig.value = embedData;

    agentForm.courseId = agentConfigData.courseId;
    agentForm.templateId = agentConfigData.templateId;
    agentForm.persona = agentConfigData.persona;
    agentForm.responseStyle = agentConfigData.responseStyle;
    agentForm.knowledgeScopeText = agentConfigData.knowledgeScope.join("、");
    agentForm.warningThreshold = agentConfigData.warningThreshold;
    agentForm.practiceIntensity = agentConfigData.practiceIntensity;

    studentState.selectedCourseId = courseData[0]?.id || 1;
  } catch (err) {
    error.value = err.message || "加载失败";
  } finally {
    loading.value = false;
  }
}

async function saveAgentConfig() {
  saveMessage.value = "";
  const payload = {
    courseId: Number(agentForm.courseId),
    templateId: agentForm.templateId,
    persona: agentForm.persona,
    responseStyle: agentForm.responseStyle,
    knowledgeScope: agentForm.knowledgeScopeText
      .split(/[、,，]/)
      .map((item) => item.trim())
      .filter(Boolean),
    warningThreshold: Number(agentForm.warningThreshold),
    practiceIntensity: agentForm.practiceIntensity,
  };

  try {
    const result = await api.saveAgentConfig(payload);
    saveMessage.value = result.message;
  } catch (err) {
    saveMessage.value = err.message || "保存失败";
  }
}

async function addCourse() {
  courseMessage.value = "";

  try {
    const result = await api.createCourse({
      ...newCourseForm,
      students: Number(newCourseForm.students),
    });
    courses.value.push(result.course);
    courseMessage.value = result.message;
    newCourseForm.name = "";
    newCourseForm.teacher = "";
    newCourseForm.platform = "超星";
    newCourseForm.students = 60;
    newCourseForm.description = "";
  } catch (err) {
    courseMessage.value = err.message || "创建失败";
  }
}

async function sendMessage(message = studentState.chatInput) {
  if (!message.trim()) {
    return;
  }

  chatLoading.value = true;
  studentState.chatMessages.push({ role: "user", content: message });
  studentState.chatInput = "";

  try {
    const result = await api.chat({
      courseId: studentState.selectedCourseId,
      message,
    });
    studentState.chatMessages.push({
      role: "assistant",
      content: result.reply,
      source: result.source,
    });
    studentState.suggestions = result.suggestions;
  } catch (err) {
    studentState.chatMessages.push({
      role: "assistant",
      content: `接口调用失败：${err.message || "未知错误"}`,
    });
  } finally {
    chatLoading.value = false;
  }
}

async function submitHomework() {
  homeworkResult.value = await api.submitHomework({
    courseId: studentState.selectedCourseId,
    content: studentState.homeworkText,
  });
}

async function submitPractice() {
  const answers = practice.value.questions.map(
    (question) => Number(studentState.practiceAnswers[question.id] ?? -1),
  );
  practiceResult.value = await api.submitPractice({
    practiceId: practice.value.id,
    answers,
  });
}

onMounted(loadData);
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Course Workspace</span>
        <h1>{{ overview.title || "课程教学辅助平台" }}</h1>
        <p class="hero-subtitle">
          {{ overview.summary || "集中处理课程资料、互动消息、作业反馈和平台接入。" }}
        </p>
        <div class="hero-tags">
          <span>课程空间</span>
          <span>作业反馈</span>
          <span>接入管理</span>
        </div>
      </div>
      <div class="hero-status">
        <p class="status-kicker">今日概览</p>
        <p class="status-value">运行正常</p>
        <p class="status-note">课程、互动、反馈和接入信息均可统一查看</p>
      </div>
    </header>

    <nav class="tab-row">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: tab.id === activeTab }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <p v-if="loading" class="page-state">正在加载数据...</p>
    <p v-else-if="error" class="page-state error">{{ error }}</p>

    <main v-else class="page-grid">
      <template v-if="activeTab === 'overview'">
        <section class="metrics-grid">
          <MetricCard
            v-for="metric in overviewCards"
            :key="metric.label"
            :label="metric.label"
            :value="metric.value"
            :delta="metric.delta"
          />
        </section>

        <div class="overview-grid">
          <SectionPanel
            title="近期动态"
            description="集中查看课程库、资料同步和反馈处理状态。"
          >
            <div class="milestones">
              <article v-for="item in overview.milestones" :key="item.name" class="milestone-item">
                <div>
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.detail }}</p>
                </div>
                <span class="status-pill">{{ item.status }}</span>
              </article>
            </div>
          </SectionPanel>

          <SectionPanel
            title="平台摘要"
            description="关注当前课程运行、提醒数量和重点事项。"
          >
            <ul class="feature-list">
              <li v-for="highlight in overview.highlights" :key="highlight">{{ highlight }}</li>
            </ul>
            <div class="mini-health">
              <div v-for="item in healthCards" :key="item.label" class="mini-health-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}%</strong>
              </div>
            </div>
          </SectionPanel>
        </div>

        <div class="chart-grid">
          <SectionPanel
            title="跨课程知识图谱"
            description="查看课程知识点之间的关联情况。"
          >
            <KnowledgeGraph :graph="dashboard.graph" />
          </SectionPanel>

          <SectionPanel
            title="班级能力成长曲线"
            description="查看班级近阶段学习表现变化。"
          >
            <TrendChart :points="dashboard.growth" />
          </SectionPanel>
        </div>
      </template>

      <template v-else-if="activeTab === 'teacher'">
        <div class="split-grid">
          <SectionPanel
            title="课程管理"
            description="查看课程、资料、平台来源和课程状态。"
          >
            <div class="course-list">
              <article v-for="course in courses" :key="course.id" class="course-card">
                <div class="course-head">
                  <div>
                    <h3>{{ course.name }}</h3>
                    <p>{{ course.teacher }} · {{ course.platform }}</p>
                  </div>
                  <span class="status-pill muted">{{ course.students }} 人</span>
                </div>
                <p class="course-desc">{{ course.description }}</p>
                <div class="course-meta">
                  <span>知识覆盖 {{ Math.round(course.knowledgeCoverage * 100) }}%</span>
                  <span>预警 {{ course.warningCount }}</span>
                </div>
                <div class="material-list">
                  <span v-for="material in course.materials" :key="material">{{ material }}</span>
                </div>
              </article>
            </div>

            <div class="form-grid">
              <input v-model="newCourseForm.name" placeholder="课程名称" />
              <input v-model="newCourseForm.teacher" placeholder="授课教师" />
              <select v-model="newCourseForm.platform">
                <option>超星</option>
                <option>钉钉</option>
              </select>
              <input v-model="newCourseForm.students" type="number" min="1" placeholder="学生人数" />
              <textarea
                v-model="newCourseForm.description"
                rows="3"
                placeholder="课程描述 / 知识库说明"
              />
              <button class="primary-button" @click="addCourse">新建课程</button>
            </div>
            <p v-if="courseMessage" class="inline-message">{{ courseMessage }}</p>
          </SectionPanel>

          <SectionPanel
            title="助手设置"
            description="设置课程助手的回答风格、内容范围和提醒阈值。"
          >
            <div class="form-grid">
              <select v-model="agentForm.courseId">
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
              <select v-model="agentForm.templateId">
                <option v-for="template in templates" :key="template.id" :value="template.id">
                  {{ template.name }}
                </option>
              </select>
              <textarea v-model="agentForm.persona" rows="3" placeholder="助手风格" />
              <textarea v-model="agentForm.responseStyle" rows="3" placeholder="回答风格" />
              <input
                v-model="agentForm.knowledgeScopeText"
                placeholder="知识范围，用顿号或逗号分隔"
              />
              <label class="slider-field">
                学情预警阈值
                <input v-model="agentForm.warningThreshold" type="range" min="40" max="95" />
                <strong>{{ agentForm.warningThreshold }}</strong>
              </label>
              <select v-model="agentForm.practiceIntensity">
                <option value="low">低频练习</option>
                <option value="medium">中频练习</option>
                <option value="high">高频练习</option>
              </select>
              <button class="primary-button" @click="saveAgentConfig">保存配置</button>
            </div>

            <div class="template-strip">
              <article v-for="template in templates" :key="template.id" class="template-card">
                <p class="template-tag">{{ template.tag }}</p>
                <h3>{{ template.name }}</h3>
                <p>{{ template.description }}</p>
                <div class="template-features">
                  <span v-for="feature in template.features" :key="feature">{{ feature }}</span>
                </div>
              </article>
            </div>
            <p v-if="saveMessage" class="inline-message">{{ saveMessage }}</p>
          </SectionPanel>
        </div>

        <div class="chart-grid">
          <SectionPanel
            title="学情雷达图"
            description="查看班级在不同学习能力维度上的整体表现。"
          >
            <RadarChart :items="dashboard.radar" />
          </SectionPanel>

          <SectionPanel
            title="共性错误分析"
            description="查看近期高频问题与重点关注学生。"
          >
            <div class="bar-list">
              <div v-for="item in dashboard.errorDistribution" :key="item.type" class="bar-item">
                <div class="bar-label-row">
                  <span>{{ item.type }}</span>
                  <strong>{{ item.count }}</strong>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: `${item.count * 4}%` }" />
                </div>
              </div>
            </div>
            <div class="warning-list">
              <article v-for="warning in dashboard.warnings" :key="warning.student" class="warning-card">
                <div>
                  <h3>{{ warning.student }}</h3>
                  <p>{{ warning.reason }}</p>
                </div>
                <span class="status-pill danger">{{ warning.level }}风险</span>
              </article>
            </div>
          </SectionPanel>
        </div>
      </template>

      <template v-else-if="activeTab === 'student'">
        <div class="split-grid">
          <SectionPanel
            title="课程问答"
            description="支持知识点解释、作业相关问题和练习建议。"
          >
            <template #actions>
              <select v-model="studentState.selectedCourseId" class="compact-select">
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
            </template>

            <div class="chat-shell">
              <div class="chat-meta">
                <strong>{{ currentCourse?.name }}</strong>
                <span>{{ currentCourse?.platform }} 课程入口</span>
              </div>
              <div class="chat-window">
                <article
                  v-for="(message, index) in studentState.chatMessages"
                  :key="`${message.role}-${index}`"
                  class="chat-message"
                  :class="message.role"
                >
                  <p>{{ message.content }}</p>
                  <small v-if="message.source">来源：{{ message.source.join(" / ") }}</small>
                </article>
              </div>
              <div class="suggestion-row">
                <button
                  v-for="suggestion in studentState.suggestions"
                  :key="suggestion"
                  class="suggestion-chip"
                  @click="sendMessage(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
              <div class="chat-input-row">
                <textarea
                  v-model="studentState.chatInput"
                  rows="3"
                  placeholder="输入想咨询的知识点或学习问题"
                />
                <button class="primary-button" :disabled="chatLoading" @click="sendMessage()">
                  {{ chatLoading ? "回答中..." : "发送" }}
                </button>
              </div>
            </div>
          </SectionPanel>

          <SectionPanel
            title="作业提交与批注"
            description="提交作业内容后查看反馈摘要、问题定位和修改建议。"
          >
            <div class="homework-shell">
              <textarea
                v-model="studentState.homeworkText"
                rows="10"
                placeholder="粘贴学生作业答案"
              />
              <button class="primary-button" @click="submitHomework">生成批注结果</button>
            </div>

            <div v-if="homeworkResult" class="homework-result">
              <div class="result-summary">
                <strong>批注得分 {{ homeworkResult.score }}</strong>
                <p>{{ homeworkResult.summary }}</p>
              </div>
              <article
                v-for="annotation in homeworkResult.annotations"
                :key="`${annotation.line}-${annotation.tag}`"
                class="annotation-card"
              >
                <div class="annotation-head">
                  <span>第 {{ annotation.line }} 行</span>
                  <span class="status-pill muted">{{ annotation.tag }}</span>
                </div>
                <code>{{ annotation.snippet }}</code>
                <p>{{ annotation.comment }}</p>
              </article>
              <ul class="feature-list compact">
                <li v-for="action in homeworkResult.nextActions" :key="action">{{ action }}</li>
              </ul>
            </div>
          </SectionPanel>
        </div>

          <SectionPanel
            title="增量练习"
            description="根据近期学习情况安排练习并返回结果。"
          >
          <div class="practice-head">
            <div>
              <h3>{{ practice.title }}</h3>
              <p>{{ practice.description }}</p>
            </div>
            <button class="primary-button" @click="submitPractice">提交练习</button>
          </div>

          <div class="practice-list">
            <article v-for="question in practice.questions" :key="question.id" class="question-card">
              <h4>{{ question.prompt }}</h4>
              <label v-for="(option, optionIndex) in question.options" :key="option" class="option-row">
                <input
                  v-model="studentState.practiceAnswers[question.id]"
                  :value="optionIndex"
                  type="radio"
                  :name="question.id"
                />
                <span>{{ option }}</span>
              </label>
            </article>
          </div>

          <div v-if="practiceResult" class="practice-result">
            <strong>得分 {{ practiceResult.score }} / 100</strong>
            <p>{{ practiceResult.summary }}</p>
            <ul class="feature-list compact">
              <li v-for="item in practiceResult.recommendations" :key="item">{{ item }}</li>
            </ul>
          </div>
        </SectionPanel>
      </template>

      <template v-else-if="activeTab === 'embed'">
        <div class="split-grid">
          <SectionPanel
            title="接入状态"
            description="查看不同平台下的页面入口和当前可用方式。"
          >
            <div class="platform-list">
              <article v-for="platform in platforms" :key="platform.name" class="platform-card">
                <div class="course-head">
                  <div>
                    <h3>{{ platform.name }}</h3>
                    <p>{{ platform.description }}</p>
                  </div>
                  <span class="status-pill">{{ platform.status }}</span>
                </div>
                <div class="embed-mode">{{ platform.mode }} 模式</div>
              </article>
            </div>
            <ul class="feature-list compact">
              <li v-for="entry in embedConfig.entryPoints" :key="entry">挂载位置：{{ entry }}</li>
            </ul>
            <ul class="feature-list compact">
              <li v-for="step in realIntegrationSteps" :key="step">{{ step }}</li>
            </ul>
          </SectionPanel>

          <SectionPanel
            title="页面预览"
            description="查看课程页面中的入口样式与侧边区域展示方式。"
          >
            <div class="embed-preview">
              <div class="fake-platform">
                <div class="platform-header">
                  <strong>超星课程页 · Python 程序设计</strong>
                  <span>章节：循环与函数</span>
                </div>
                <div class="platform-content">
                  <div class="platform-main">
                    <h3>本周任务</h3>
                    <ul class="feature-list compact">
                      <li>阅读《循环与函数》讲义</li>
                      <li>完成课后作业 2-1</li>
                      <li>进入侧边栏向助教提问</li>
                    </ul>
                  </div>
                  <aside class="widget-panel">
                    <p class="widget-title">课程助手</p>
                    <div class="widget-bubble">循环边界是本周高频错点，需要我给你一题练习吗？</div>
                    <button class="primary-button slim">一键进入答疑</button>
                  </aside>
                </div>
              </div>
            </div>
          </SectionPanel>
        </div>

        <div class="chart-grid">
          <SectionPanel
            title="页面嵌入代码"
            description="适合课程平台可直接挂载页面的场景。"
          >
            <pre class="code-block"><code>{{ embedCode }}</code></pre>
          </SectionPanel>

          <SectionPanel
            title="脚本挂载代码"
            description="适合能控制宿主页面结构或需要动态挂载的场景。"
          >
            <pre class="code-block"><code>{{ sdkCode }}</code></pre>
          </SectionPanel>
        </div>
      </template>
    </main>
  </div>
</template>
