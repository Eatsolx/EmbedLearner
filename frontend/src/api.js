async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeout ?? 25000);
  let response;

  try {
    response = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getOverview: () => request("/api/overview"),
  getCourses: () => request("/api/courses"),
  createCourse: (payload) =>
    request("/api/courses", { method: "POST", body: JSON.stringify(payload) }),
  getTemplates: () => request("/api/agent/templates"),
  getAgentConfig: () => request("/api/agent/config"),
  saveAgentConfig: (payload) =>
    request("/api/agent/config", { method: "POST", body: JSON.stringify(payload) }),
  getDashboard: () => request("/api/analytics/dashboard"),
  chat: (payload) => request("/api/chat", { method: "POST", body: JSON.stringify(payload) }),
  submitHomework: (payload) =>
    request("/api/homework/submit", { method: "POST", body: JSON.stringify(payload) }),
  getPractice: () => request("/api/practice"),
  submitPractice: (payload) =>
    request("/api/practice/submit", { method: "POST", body: JSON.stringify(payload) }),
  getPlatforms: () => request("/api/platforms"),
  getEmbedConfig: () => request("/api/embed"),
};
