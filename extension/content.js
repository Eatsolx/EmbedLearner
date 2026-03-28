(function () {
  const ROOT_ID = "a25-extension-root";
  if (document.getElementById(ROOT_ID)) {
    return;
  }

  const platform = location.hostname.includes("zhihuishu") ? "zhihuishu" : "chaoxing";
  const widgetUrl = new URL("http://127.0.0.1:5174/");
  widgetUrl.searchParams.set("platform", platform);
  widgetUrl.searchParams.set("courseId", "1");
  widgetUrl.searchParams.set("hostUrl", location.href);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  document.documentElement.appendChild(root);

  const shadow = root.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      .a25-toggle {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 2147483646;
        border: 0;
        border-radius: 6px;
        padding: 12px 16px;
        background: #1d4f91;
        color: #fff;
        font: 600 14px/1.2 "Avenir Next", "PingFang SC", sans-serif;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        cursor: pointer;
      }

      .a25-panel {
        position: fixed;
        top: 16px;
        right: 16px;
        width: min(420px, calc(100vw - 24px));
        height: calc(100vh - 32px);
        z-index: 2147483645;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
        transform: translateX(calc(100% + 20px));
        transition: transform 180ms ease;
      }

      .a25-panel.open {
        transform: translateX(0);
      }

      .a25-panel iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    </style>
    <button class="a25-toggle" type="button">打开课程助教</button>
    <aside class="a25-panel" aria-label="A25 Agent Panel">
      <iframe src="${widgetUrl.toString()}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </aside>
  `;

  const toggle = shadow.querySelector(".a25-toggle");
  const panel = shadow.querySelector(".a25-panel");
  toggle?.addEventListener("click", () => {
    panel?.classList.toggle("open");
  });
})();
