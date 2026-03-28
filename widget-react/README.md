# A25 React Widget

这个子项目专门负责“真实嵌入页面里的交互组件”。

## 为什么单独拆出来

- Vue 主前端继续做教师后台和演示控制台
- React widget 作为后续接 CopilotKit 的承载层
- iframe、SDK、浏览器扩展三种接入方式都可以直接复用

## 当前状态

- 已经接好了现有 mock API
- 可以独立运行，也可以被宿主页面 iframe 嵌入
- 还没有接入真实 AI / CopilotKit

## 启动

```bash
cd /Users/xrz/Home/Code/服创赛/widget-react
npm install
npm run dev
```

默认地址是 [http://127.0.0.1:5174](http://127.0.0.1:5174)。

## 后续接 CopilotKit 的建议

优先在 [src/App.jsx](/Users/xrz/Home/Code/服创赛/widget-react/src/App.jsx) 内部替换问答区，不动 SDK、iframe 和浏览器扩展入口。
