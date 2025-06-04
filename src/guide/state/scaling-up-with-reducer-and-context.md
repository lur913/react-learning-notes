# 使用Reducer和Context拓展应用

## 🌟 为什么要结合使用Reducer和Context？

### 🧩 各自的优势
- 🔍 **Reducer优势**：整合组件状态更新逻辑，集中管理复杂状态
- 🌳 **Context优势**：将信息深入传递给其他组件，避免props逐级传递
- 💪 **组合使用**：强大的状态管理解决方案，特别适合复杂应用

## 🛠️ 结合使用Reducer和Context的三步走

### 1️⃣ 创建Context
```jsx
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

### 2️⃣ 将状态和dispatch函数放入Context
```jsx
export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {/* 子组件可以访问tasks和dispatch */}
        <components... />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

### 3️⃣ 在组件树中使用Context
```jsx
function Task({ task }) {
  const dispatch = useContext(TasksDispatchContext);
  
  return (
    <button onClick={() => {
      dispatch({
        type: 'deleted',
        id: task.id
      });
    }}>
      删除任务
    </button>
  );
}
```

## 📦 将相关逻辑迁移到单个文件

### 🗂️ 组织代码的最佳实践
- 🔧 **创建Provider组件**：封装状态管理和Context提供
- 🎯 **自定义Hook**：简化Context使用，提升代码可读性
- 📝 **统一管理**：将reducer、context、provider放在同一文件中

```jsx
// TasksContext.js
import { createContext, useContext, useReducer } from 'react';

// 1. 创建Context
export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

// 2. 创建Provider组件
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

// 3. 创建自定义Hook
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

// 4. 定义reducer函数
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    // 其他action处理...
  }
}
```

## 🚀 如何使用优化后的代码

### 💼 组件变得简洁明了
```jsx
// App.js
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>任务列表</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}

// TaskList.js
import { useTasks } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

// Task.js
import { useTasksDispatch } from './TasksContext.js';

function Task({ task }) {
  const dispatch = useTasksDispatch();
  // 使用dispatch...
}
```

## 🌈 核心优势

### 📈 可扩展性与可维护性
- 🔄 **状态集中管理**：所有状态更新逻辑在reducer中集中处理
- 🌐 **组件解耦**：组件不需要知道状态如何更新，只需分发action
- 🧩 **组件树深度无关**：无论组件层级多深，都可直接访问状态
- 📊 **模块化状态管理**：可以为应用不同部分创建不同的Context-Reducer组合

## ⚡ 最佳实践

### 🎯 设计考量
- 🧠 **粒度适中**：为不同的状态域创建不同的Context-Reducer对
- 🚧 **避免单一巨大Context**：防止不必要的重渲染
- 🔍 **明确职责划分**：每个Context应有明确的用途
- 📌 **自定义Hook封装**：使用`useTasks()`和`useTasksDispatch()`等函数简化访问

## 📝 总结

- 🔄 **强大组合**：Reducer管理状态逻辑，Context处理数据传递
- 🛠️ **三步实现**：创建Context → 提供状态和dispatch → 在组件中使用
- 📦 **模块化**：将相关逻辑整合到单个文件中，提高可维护性
- 🧩 **自定义Hook**：简化Context的使用，提高代码可读性
- 🚀 **适用场景**：复杂应用中多组件共享和操作相同的状态

> 参考：[React官方文档-使用Reducer和Context拓展应用](https://zh-hans.react.dev/learn/scaling-up-with-reducer-and-context) 