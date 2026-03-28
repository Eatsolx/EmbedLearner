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
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export const widgetApi = {
  getCourses: () => request("/api/courses"),
  getPractice: () => request("/api/practice"),
  chat: (payload) =>
    request("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
