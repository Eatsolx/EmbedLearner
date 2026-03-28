(function () {
  if (window.A25Agent) {
    return;
  }

  const STYLE_ID = "a25-agent-sdk-style";
  const SIDEBAR_ID = "a25-agent-sidebar";
  const TOGGLE_ID = "a25-agent-toggle";
  const DEFAULT_WIDGET_URL = "http://127.0.0.1:5174/";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${TOGGLE_ID} {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 2147483646;
        border: 0;
        border-radius: 4px;
        padding: 12px 16px;
        background: #1d4f91;
        color: #fff;
        font: 600 14px/1.2 "Avenir Next", "PingFang SC", sans-serif;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        cursor: pointer;
      }

      #${SIDEBAR_ID} {
        position: fixed;
        top: 16px;
        right: 16px;
        width: min(440px, calc(100vw - 24px));
        height: calc(100vh - 32px);
        z-index: 2147483645;
        background: #fff;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
        border: 1px solid rgba(15, 23, 42, 0.08);
        transform: translateX(calc(100% + 20px));
        transition: transform 180ms ease;
      }

      #${SIDEBAR_ID}.is-open {
        transform: translateX(0);
      }

      #${SIDEBAR_ID} iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function buildUrl(options = {}) {
    const url = new URL(options.baseUrl || DEFAULT_WIDGET_URL, window.location.href);
    url.searchParams.set("platform", options.platform || "chaoxing");
    url.searchParams.set("courseId", String(options.courseId || 1));
    if (options.hostUrl) {
      url.searchParams.set("hostUrl", options.hostUrl);
    }
    return url.toString();
  }

  function createFrame(options) {
    const iframe = document.createElement("iframe");
    iframe.src = buildUrl(options);
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.title = "A25 Agent Widget";
    return iframe;
  }

  function mountInline(target, options = {}) {
    const host = typeof target === "string" ? document.querySelector(target) : target;
    if (!host) {
      throw new Error("A25Agent.mount target not found");
    }

    host.innerHTML = "";
    host.appendChild(createFrame(options));
    host.style.minHeight = options.height || "640px";
    host.style.borderRadius = "4px";
    host.style.overflow = "hidden";
    host.style.border = "1px solid rgba(15, 23, 42, 0.08)";

    return {
      destroy() {
        host.innerHTML = "";
      },
    };
  }

  function mountSidebar(options = {}) {
    ensureStyles();

    let sidebar = document.getElementById(SIDEBAR_ID);
    let toggle = document.getElementById(TOGGLE_ID);

    if (!sidebar) {
      sidebar = document.createElement("aside");
      sidebar.id = SIDEBAR_ID;
      sidebar.appendChild(createFrame(options));
      document.body.appendChild(sidebar);
    }

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.id = TOGGLE_ID;
      toggle.type = "button";
      toggle.textContent = options.buttonText || "打开课程助手";
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("is-open");
      });
      document.body.appendChild(toggle);
    }

    if (options.open) {
      sidebar.classList.add("is-open");
    }

    return {
      destroy() {
        toggle?.remove();
        sidebar?.remove();
      },
    };
  }

  window.A25Agent = {
    mount(target, options = {}) {
      if (options.mode === "sidebar" || !target) {
        return mountSidebar(options);
      }
      return mountInline(target, options);
    },
  };
})();
