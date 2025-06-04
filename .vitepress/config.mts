import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "React Learning Notes",
  description: "去繁就简，快速掌握 React 19 核心概念",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "baidu-site-verification", content: "codeva-2UoDvTjQL9" }],
    // google analytics 添加 谷歌分析
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-0GMC4XZSTP",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-0GMC4XZSTP');`,
    ],
  ],

  // base: '/react-learning-notes/',
  srcDir: "./src",
  sitemap: {
    hostname: 'https://react.luryan.me'
  },
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    outline: {
      level: [2, 3],
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "指南",
        link: "/guide/ui/your-first-component",
        activeMatch: "guide",
      },
      { 
        text: "API解读", 
        link: "/api/react/placeholder", 
        activeMatch: "api" 
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: "描述UI",
          collapsed: false,
          items: [
            { text: "第一个组件", link: "/guide/ui/your-first-component" },
            { text: "组件的导入与导出", link: "/guide/ui/importing-and-exporting-components" },
            {
              text: "使用JSX书写标签语言",
              link: "/guide/ui/writing-markup-with-jsx",
            },
            {
              text: "JSX中使用JavaScript",
              link: "/guide/ui/javascript-in-jsx-with-curly-braces",
            },
            { text: "Props传递", link: "/guide/ui/passing-props-to-a-component" },
            { text: "条件渲染", link: "/guide/ui/conditional-rendering" },
            { text: "渲染列表", link: "/guide/ui/rendering-lists" },
            { text: "保持组件纯粹", link: "/guide/ui/keeping-components-pure" },
            { text: "将UI视为树", link: "/guide/ui/understanding-your-ui-as-a-tree" },
          ],
        },
        {
          text: "添加交互",
          collapsed: false,
          items: [
            { text: "响应事件", link: "/guide/interaction/responding-to-events" },
            {
              text: "State组件的记忆",
              link: "/guide/interaction/state-a-components-memory",
            },
            { text: "渲染和提交", link: "/guide/interaction/render-and-commit" },
            { text: "State如同快照", link: "/guide/interaction/state-as-a-snapshot" },
            { text: "State更新队列", link: "/guide/interaction/queueing-a-series-of-state-updates" },
            {
              text: "更新State中的对象",
              link: "/guide/interaction/updating-objects-in-state",
            },
            {
              text: "更新State中的数组",
              link: "/guide/interaction/updating-arrays-in-state",
            },
          ],
        },
        {
          text: "状态管理",
          collapsed: false,
          items: [
            { text: "用state响应输入", link: "/guide/state/reacting-to-input-with-state" },
            { text: "选择State结构", link: "/guide/state/choosing-the-state-structure" },
            { text: "在组件间共享状态", link: "/guide/state/sharing-state-between-components" },
            {
              text: "State的保留和重置",
              link: "/guide/state/preserving-and-resetting-state",
            },
            {
              text: "迁移状态逻辑至Reducer",
              link: "/guide/state/extracting-state-logic-into-a-reducer",
            },
            {
              text: "使用Context深层传递参数",
              link: "/guide/state/passing-data-deeply-with-context",
            },
            {
              text: "使用Reducer和Context拓展应用",
              link: "/guide/state/scaling-up-with-reducer-and-context",
            },
          ],
        },
        {
          text: "脱围机制",
          collapsed: false,
          items: [
            { text: "使用ref引用值", link: "/guide/escape/referencing-values-with-refs" },
            { text: "操作DOM与Refs", link: "/guide/escape/manipulating-the-dom-with-refs" },
            {
              text: "Effect副作用同步",
              link: "/guide/escape/synchronizing-with-effects",
            },
            {
              text: "你可能不需要Effect",
              link: "/guide/escape/you-might-not-need-an-effect",
            },
            {
              text: "响应式Effect的生命周期",
              link: "/guide/escape/lifecycle-of-reactive-effects",
            },
            {
              text: "将事件从Effect中分开",
              link: "/guide/escape/separating-events-from-effects",
            },
            { text: "移除Effect依赖", link: "/guide/escape/removing-effect-dependencies" },
            {
              text: "使用自定义Hook复用逻辑",
              link: "/guide/escape/reusing-logic-with-custom-hooks",
            },
          ],
        },
      ],
      '/api/': [
        {
          text: 'React API',
          items: [
            { text: '相关api', link: '/api/react/placeholder' },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/lur913/react-learning-notes",
      },
    ],
  },
});
