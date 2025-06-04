# 将事件从 Effect 中分开

## 🎯 事件处理函数vs Effect的本质区别

### 💡 事件处理函数特性
- 🖱️ **手动触发**：只在用户特定交互时运行（如点击按钮）
- 🚫 **非响应式**：不会因为其中使用的props或state变化而自动重新执行
- 🎮 **处理交互**：用于响应特定的用户操作

```jsx
function handleClick() {
  // 只在用户点击时运行
  sendMessage(message);
}
```

### 🔄 Effect特性
- 🤖 **自动触发**：在渲染后运行并在依赖变化时重新运行
- ✅ **响应式**：当其依赖的props或state变化时自动重新执行
- 🔄 **保持同步**：用于将组件与外部系统同步

```jsx
useEffect(() => {
  // 自动连接到聊天室，并在roomId变化时重新连接
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

## 🧪 响应式逻辑vs非响应式逻辑

### 📊 响应式值
在React中，以下值被视为"响应式"：
- ⚛️ **Props** - 可能在重新渲染时改变
- ⚛️ **State** - 可能在重新渲染时改变
- ⚛️ **由它们派生的值** - 依赖props或state计算出的值

### 🔍 代码中的响应性差异

**事件处理函数中的逻辑** - 非响应式：
```jsx
function ChatRoom({ roomId, theme }) {
  function handleSendMessage() {
    // 🔴 非响应式：theme变化不会触发重新发送
    sendMessage('Hello!', theme);
  }
  // ...
}
```

**Effect中的逻辑** - 响应式：
```jsx
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    // 🔴 响应式：theme变化会导致重新连接
    const connection = createConnection(serverUrl, roomId, theme);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]); // 依赖theme
  // ...
}
```

## 🪄 使用Effect Event分离响应式和非响应式逻辑

### 🛠️ useEffectEvent的用途
- 📦 在Effect中**封装非响应式逻辑**
- 🚫 使某些值**不触发Effect重新执行**
- 🔄 始终获取**最新的props/state**值而不使Effect重新执行

```jsx
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  // ✅ 非响应式逻辑，不会成为依赖
  const onConnected = useEffectEvent(roomName => {
    // 这里使用的theme始终是最新值
    showNotification(`连接到${roomName}`, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      // 调用Effect Event
      onConnected(connection.roomName);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // 不需要依赖theme和onConnected
  // ...
}
```

### 📝 useEffectEvent的注意事项
- 🚨 **仅实验性API**：目前尚未在React稳定版中发布
- 🏠 **仅在Effect内调用**：不要在其他地方调用Effect Event
- 🚫 **不能传递给其他组件**：只在定义它的组件内使用
- ⚡ **解决依赖项过多问题**：替代手动排除依赖项的方法

## 🔮 Effect Event的工作原理

Effect Event是对React中两种行为模式的融合：
- 📊 保留了**事件处理函数的非响应式特性**（可访问最新props/state）
- 🔄 可以在**Effect的响应式环境中调用**（与Effect生命周期绑定）

```jsx
// Effect Event可以读取到最新的值
const onTick = useEffectEvent(() => {
  // 读取到最新的count值
  setCount(count + 1);
});

// 在响应式Effect中使用
useEffect(() => {
  const id = setInterval(() => {
    onTick(); // 调用Effect Event
  }, 1000);
  return () => clearInterval(id);
}, []); // 不需要把count作为依赖项
```

## ⚠️ 适用场景示例

### 案例1：计时器计数
```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  // 使用Effect Event读取最新的increment值
  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // 使用最新的increment
    }, 1000);
    return () => clearInterval(id);
  }, []); // 不需要increment作为依赖
  // ...
}
```

### 案例2：记录页面访问
```jsx
function Page({ url }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logAnalytics('visit', { url: visitedUrl, sessionId });
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // sessionId不需要作为依赖项
  // ...
}
```

## 📝 总结

- 🎭 事件处理函数在特定交互时执行，Effect在需要同步时执行
- 🧩 事件处理函数中的逻辑是非响应式的，Effect中的逻辑是响应式的
- 🔀 有时候需要在Effect中混合使用响应式和非响应式逻辑
- 📦 `useEffectEvent` 允许你在Effect内部定义非响应式代码片段
- 🔍 Effect Event可以读取到最新的props和state而不成为Effect的依赖
- 🚫 只在Effect内部调用Effect Event，不要传递给其他组件
- 🧪 Effect Event是将非响应式逻辑从Effect中分离出来的最佳实践

> 参考：[React官方文档-将事件从Effect中分开](https://zh-hans.react.dev/learn/separating-events-from-effects) 