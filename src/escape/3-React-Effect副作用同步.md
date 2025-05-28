# 🔄 React：使用Effect进行同步

## 🌟 什么是Effect？

### 💡 Effect的基本概念
- 🔮 **Effect是React的脱围机制**：让你"走出"React的世界
- 🔄 **用于同步**：将React组件与外部系统同步
- 📡 **外部系统**：浏览器API、第三方库、网络请求等

### 🎭 Effect与事件的区别

|  🎮 事件处理函数 | 🔄 Effect |
|----------------|----------|
| 🖱️ 由特定用户交互触发 | 🔁 由渲染本身触发 |
| 📍 处理"发生了什么" | 📍 处理"变成了什么状态" |
| 🎯 一次性执行 | 🔄 需要持续同步 |

```jsx
// 🎮 事件处理函数 - 用户交互触发
function handleClick() {
  // 发送消息的点击事件
  sendMessage(message);
}

// 🔄 Effect - 渲染触发
useEffect(() => {
  // 连接到聊天室
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

## 📝 编写Effect的三个步骤

### 1️⃣ 声明Effect
```jsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Effect的代码将在每次渲染后执行
  });
  return <div />;
}
```

### 2️⃣ 指定Effect依赖项
```jsx
useEffect(() => {
  // 这段代码只会在依赖项变化时运行
  // ...
}, [依赖项1, 依赖项2]); // 👈 依赖项数组
```

依赖项的特殊情况：
- 🔍 **无依赖数组**：在每次渲染后都运行
- 📦 **空数组 `[]`**：只在组件挂载时运行一次
- 🧩 **有依赖项**：在组件挂载和依赖项变化时运行

```jsx
useEffect(() => {
  // 这里的代码会在每次渲染后运行
});

useEffect(() => {
  // 这里的代码只会在组件挂载（首次出现）时运行
}, []);

useEffect(() => {
  // 这里的代码不但会在组件挂载时运行，而且当 a 或 b 的值自上次渲染后发生变化后也会运行
}, [a, b]);
```

### 3️⃣ 添加清理函数
```jsx
useEffect(() => {
  // 设置逻辑
  const connection = createConnection();
  connection.connect();
  
  // 返回清理函数
  return () => {
    // 清理逻辑
    connection.disconnect();
  };
}, []);
```

## 🧠 Effect的执行时机

### 🔄 Effect的生命周期
1. 🎬 **组件渲染**：React更新DOM
2. 🧹 **执行清理函数**（如果是重新运行的Effect）
3. 🚀 **运行Effect主体**：执行新的设置逻辑

### ⏱️ 执行时间点
- ⏳ Effect在浏览器绘制后运行（`useEffect`是异步的）
- 🖼️ 不会阻塞浏览器渲染
- 🔄 在开发模式下，React会额外运行一次Effect以验证清理函数

```jsx
// 执行顺序示例
// 1. 组件挂载，渲染 roomId="general"
// 2. 浏览器绘制更新的UI
// 3. Effect运行：连接到"general"聊天室

// 如果roomId变为"travel"
// 1. 组件更新，渲染 roomId="travel"
// 2. 浏览器绘制更新的UI
// 3. 之前Effect的清理函数运行：断开"general"聊天室
// 4. 新Effect运行：连接到"travel"聊天室
```

## 🎯 依赖项的正确使用

### ✅ 依赖项规则
- 🔍 必须包含Effect中使用的所有响应式值（props、state等）
- 🚫 不能"选择"依赖项，它们由代码决定
- 🧪 React会验证依赖项是否正确声明

```jsx
function ChatRoom({ roomId }) { // roomId是props
  const [message, setMessage] = useState(''); // message是state
  
  useEffect(() => {
    const connection = createConnection(roomId, message);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, message]); // ✅ 必须包含所有使用的响应式值
}
```

### 🔍 常见依赖项问题
- 🚨 **依赖项过多**：Effect重新运行太频繁
- 🐞 **依赖项缺失**：会导致Effect使用过时的值
- 🔄 **无限循环**：Effect更新依赖项导致循环

## 🛠️ 常见使用场景

### 🔌 管理非React小部件
```jsx
useEffect(() => {
  const map = new MapWidget(mapElement, { zoom: zoom });
  return () => map.destroy();
}, [zoom]);
```

### 📡 订阅事件
```jsx
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 🎬 触发动画
```jsx
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 0;
  // 触发一个动画
  node.style.transition = 'opacity 1s';
  const timeoutId = setTimeout(() => {
    node.style.opacity = 1;
  }, 0);
  return () => clearTimeout(timeoutId);
}, []);
```

### 📊 数据获取
```jsx
useEffect(() => {
  let ignore = false;
  
  async function fetchData() {
    const result = await fetchFromAPI(query);
    if (!ignore) {
      setData(result);
    }
  }
  
  fetchData();
  return () => {
    ignore = true; // 防止竞态条件
  };
}, [query]);
```

## ⚠️ 开发环境特殊行为

### 🔄 React严格模式下Effect的行为
- 🔁 **模拟卸载和重新挂载**：验证清理函数正确性
- 🧪 **帮助发现问题**：如丢失的清理函数、竞态条件
- 🚧 **仅在开发环境**：生产环境中不会重复运行

解决方案：
```jsx
useEffect(() => {
  // 创建资源
  const resource = createResource();
  
  // ✅ 始终提供清理函数
  return () => {
    // 清理资源
    resource.release();
  };
}, []);
```

## 🚫 不适用于Effect的场景

### 🎯 应用初始化代码
- ✅ 适合放在组件外部而非Effect中：
```jsx
// ✅ 应用级初始化代码放在组件外
if (typeof window !== 'undefined') { // 检查是否在浏览器环境
  checkAuthToken();
  loadAnalytics();
}
```

### 🛒 购买商品等用户事件
- ✅ 放在事件处理函数中而非Effect中：
```jsx
function OrderButton({ productId, userId }) {
  // ✅ 用户事件应该放在事件处理函数中
  function handleClick() {
    placeOrder(productId, userId);
  }
  
  return <button onClick={handleClick}>购买</button>;
}
```

## 📝 总结

- 🔄 **Effect用于同步**：将组件与外部系统同步
- 🎭 **不同于事件**：Effect由渲染触发，事件由交互触发
- 📋 **三步编写**：声明Effect、指定依赖项、添加清理函数
- 🔍 **依赖项很重要**：必须包含Effect中用到的所有响应式值
- 🧹 **清理很关键**：要正确清理所创建的资源和订阅
- 🚫 **不滥用**：如果没有外部系统，可能不需要Effect

> 参考：[React官方文档-使用Effect进行同步](https://zh-hans.react.dev/learn/synchronizing-with-effects) 