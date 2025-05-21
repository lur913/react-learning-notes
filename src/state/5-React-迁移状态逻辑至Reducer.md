# 🧩 React：迁移状态逻辑至Reducer

## 🌟 什么是Reducer？

### 💡 基本概念
- 🧠 **状态管理方式**：集中处理组件的所有状态更新逻辑
- 📦 **独立函数**：接收当前状态和动作，返回新状态
- 🔄 **替代方案**：是useState的强大替代方案，适用于复杂状态逻辑

```jsx
// reducer函数的基本结构
function reducer(state, action) {
  // 根据action.type返回新的状态
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error('未知的action类型');
  }
}
```

## 🛠️ 为什么使用Reducer？

### 🔍 适用场景
- 📊 **状态逻辑复杂**：组件有多个状态更新场景
- 🧩 **状态更新相互关联**：多个状态需要一起更新
- 📈 **状态变更频繁**：防止意外引入bug
- 🔬 **逻辑需要测试**：reducer是纯函数，便于单元测试

## 🚀 从useState转换到useReducer的三步骤

### 1️⃣ 修改事件处理函数，dispatch action
```jsx
// ❌ 之前：直接修改状态
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

// ✅ 之后：dispatch一个描述用户行为的action
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}
```

### 2️⃣ 编写reducer函数
```jsx
// 创建一个处理所有状态更新的reducer函数
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error(`未知action类型: ${action.type}`);
    }
  }
}
```

### 3️⃣ 在组件中使用useReducer
```jsx
import { useReducer } from 'react';

// 用useReducer替换useState
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

// 不再直接修改状态，改用dispatch action
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}
```

## 🧪 useState与useReducer对比

| 📊 useState | 🧩 useReducer |
|------------|--------------|
| 🔍 **简单逻辑**：少量状态 | 🔬 **复杂逻辑**：大量或相关状态 |
| 📝 **代码量**：更少 | 📚 **代码量**：更多，但更有组织性 |
| 🏃‍♂️ **上手难度**：简单 | 🧠 **上手难度**：需要理解reducer模式 |
| 🪲 **调试难度**：状态更新分散 | 🔍 **调试便利**：集中处理，便于追踪 |
| 🧪 **可测试性**：一般 | ✅ **可测试性**：优秀，纯函数易测试 |

## ✨ 编写高质量reducer的原则

### 📜 最佳实践
- 🧪 **保持纯净**：reducer必须是纯函数
- 🚫 **无副作用**：不包含API调用、定时器等
- 🔄 **不可变更新**：不直接修改状态，而是返回新对象
- 🎯 **单一动作描述完整交互**：一个action可能引起多个数据变化

```jsx
// ❌ 错误做法：直接修改状态
function brokenReducer(state, action) {
  // 🚫 不要直接修改state
  state.count++;
  return state;
}

// ✅ 正确做法：返回新状态
function goodReducer(state, action) {
  // ✅ 创建新对象
  return {
    ...state,
    count: state.count + 1
  };
}
```

## 🔧 使用Immer简化reducer逻辑

### 🛠️ 更简洁的状态更新
```jsx
import { useImmerReducer } from 'use-immer';

// 使用Immer的reducer可以"直接修改"draft对象
function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      // 👍 可以直接push，Immer会负责创建不可变更新
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      // 👍 可以直接修改draft中的属性
      const index = draft.findIndex(t => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      // 👍 可以直接操作draft
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error(`未知action类型: ${action.type}`);
    }
  }
}

// 使用useImmerReducer替代useReducer
const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);
```

## 📝 总结

- 🔮 **Reducer优势**：将状态逻辑从组件中抽离，使代码更易维护
- 🔄 **使用步骤**：修改事件处理函数→编写reducer函数→使用useReducer
- 🧪 **减少错误**：集中处理状态更新，便于追踪和调试
- 📏 **规范**：每个action应描述一个完整的用户交互
- 🧠 **最佳选择**：复杂状态逻辑时选择reducer，简单逻辑时用useState
- 🛠️ **辅助工具**：Immer可以简化reducer中的不可变更新操作

> 参考：[React官方文档-迁移状态逻辑至Reducer中](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer) 