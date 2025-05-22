import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "React Learning Notes",
  description: "React learning notes generated with the help of AI",
  head: [
    [
      'link',
      {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}
    ]
  ],
  // base: '/react-learning-notes/',
  srcDir: './src',
  themeConfig: {
    logo: '/logo.svg',
    outline: {
      level: [2,3],
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/ui/1-React-第一个组件', activeMatch: '/ui|interaction|state|escape/' },
      { text: 'API解读', link: '/api/placeholder' },
    ],

    sidebar: [
      {
        text: '描述UI',
        items: [
          { text: '第一个组件', link: '/ui/1-React-第一个组件' },
          { text: '组件的导入与导出', link: '/ui/2-React-组件导入导出' },
          { text: '使用JSX书写标签语言', link: '/ui/3-React-使用JSX书写标签语言' },
          { text: 'JSX中使用JavaScript', link: '/ui/4-React-JSX中使用JavaScript' },
          { text: 'Props传递', link: '/ui/5-React-Props传递' },
          { text: '条件渲染', link: '/ui/6-React-条件渲染' },
          { text: '渲染列表', link: '/ui/7-React-渲染列表' },
          { text: '保持组件纯粹', link: '/ui/8-React-保持组件纯粹' },
          { text: '将UI视为树', link: '/ui/9-React-将UI视为树' },
        ]
      },
      {
        text: '添加交互',
        items: [
          { text: '响应事件', link: '/interaction/1-React-响应事件' },
          { text: 'State组件的记忆', link: '/interaction/2-React-State组件的记忆' },
          { text: '渲染和提交', link: '/interaction/3-React-渲染和提交' },
          { text: 'State如同快照', link: '/interaction/4-React-State如同快照' },
          { text: 'State更新队列', link: '/interaction/5-React-State更新队列' },
          { text: '更新State中的对象', link: '/interaction/6-React-更新State中的对象' },
          { text: '更新State中的数组', link: '/interaction/7-React-更新State中的数组' },
        ]
      },
      {
        text: '状态管理',
        items: [
          { text: '用state响应输入', link: '/state/1-React-用State响应输入' },
          { text: '选择State结构', link: '/state/2-React-选择State结构' },
          { text: '在组件间共享状态', link: '/state/3-React-在组件间共享状态' },
          { text: 'State的保留和重置', link: '/state/4-React-State的保留和重置' },
          { text: '迁移状态逻辑至Reducer', link: '/state/5-React-迁移状态逻辑至Reducer' },
          { text: '使用Context深层传递参数', link: '/state/6-React-使用Context深层传递参数' },
          { text: '使用Reducer和Context拓展应用', link: '/state/7-React-使用Reducer和Context拓展应用' },
        ]
      },
      {
        text: '脱围机制',
        items: [
          { text: '使用ref引用值', link: '/escape/1-React-Refs引用值' },
          { text: '操作DOM与Refs', link: '/escape/2-React-操作DOM与Refs' },
          { text: 'Effect副作用同步', link: '/escape/3-React-Effect副作用同步' },
          { text: '你可能不需要Effect', link: '/escape/4-React-你可能不需要Effect' },
          { text: '响应式Effect的生命周期', link: '/escape/5-React-响应式Effect的生命周期' },
          { text: '将事件从Effect中分开', link: '/escape/6-React-将事件从Effect中分开' },
          { text: '移除Effect依赖', link: '/escape/7-React-移除Effect依赖' },
          { text: '使用自定义Hook复用逻辑', link: '/escape/8-React-使用自定义Hook复用逻辑' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lur913/react-learning-notes' }
    ]
  }
})
