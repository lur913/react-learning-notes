# 使用自定义 Hook 复用逻辑

## 📌 什么是自定义 Hook？

- 自定义 Hook 是 React 中用于在组件间共享逻辑的一种机制
- 自定义 Hook 基于内置 Hook (如 `useState`, `useEffect`, `useContext` 等) 构建
- 自定义 Hook 可以封装特定用途的逻辑，如获取数据、检测在线状态、动画效果等

## 🧩 创建自定义 Hook 的规则

1. **命名规则**：Hook 名必须以 `use` 开头，后跟大写字母（如 `useOnlineStatus`）
2. **位置规则**：和内置 Hook 一样，只能在组件顶层或其他 Hook 中调用
3. **功能规则**：应专注于特定的功能需求，而非泛用性抽象

## 💡 自定义 Hook 实例：检测网络状态

```jsx
// 提取到单独的文件 useOnlineStatus.js
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
```

## 🔍 在组件中使用自定义 Hook

```jsx
// 状态栏组件
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

// 保存按钮组件
function SaveButton() {
  const isOnline = useOnlineStatus();
  
  function handleSaveClick() {
    console.log('✅ 进度已保存');
  }
  
  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? '保存进度' : '重新连接中...'}
    </button>
  );
}
```

## ⚙️ 自定义 Hook 的关键特性

### 1️⃣ 共享逻辑而非状态
- 每个组件调用同一个 Hook 会获得**独立的状态**
- Hook 之间不共享状态，只共享状态逻辑
- 每次调用 Hook 都会获得隔离的状态空间

```jsx
function ChatRoom({ roomId }) {
  // 这两个组件有各自独立的状态
  const [message, setMessage] = useState('');
  // 这里的状态和上面的不共享
  const roomStatus = useRoomStatus(roomId);
}
```

### 2️⃣ 在 Hook 之间传递响应值
- Hook 可以接收参数并返回任何值
- 可以在多个 Hook 之间形成数据流
- 每次组件重新渲染，Hook 会重新运行，参数会更新

```jsx
function useFriendStatus(friendId) {
  const status = useStatus(friendId); // 使用一个自定义Hook
  const isOnline = useOnlineStatus(); // 使用另一个自定义Hook
  
  if (isOnline) {
    return status; // 组合多个Hook的结果
  } else {
    return 'offline';
  }
}
```

### 3️⃣ 传递事件处理函数到 Hook
- 可以将事件处理函数作为参数传递给自定义 Hook
- 应使用 `useEffectEvent` 包裹事件处理程序以避免依赖问题

```jsx
function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  // 使用 useEffectEvent 包裹回调函数（实验性API）
  const onMessage = useEffectEvent(onReceiveMessage);
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // onMessage 不需要添加到依赖数组
}
```

## 🚀 何时使用自定义 Hook

### ✅ 适合场景
- 提取重复逻辑到可重用单元
- 复杂的状态逻辑跨多个组件共享
- 与外部系统集成时需封装同步逻辑
- 复杂的数据获取和缓存逻辑

### ❌ 不适合场景
- 过早抽象简单逻辑
- 创建类似 `useMount` 这样的过于泛化的 Hook
- 强制特定模式而非解决实际问题

## 🧠 设计良好的自定义 Hook 原则

1. 🎯 **明确的目的**：专注解决特定问题
2. 🧰 **接口简洁**：参数和返回值设计合理
3. 🧩 **可组合**：能与其他 Hook 结合使用
4. 🚫 **无副作用**：保持纯粹，副作用在 useEffect 中处理
5. 📝 **良好命名**：名称清晰表达功能

## 🔀 多种实现方式

自定义 Hook 不是唯一的代码复用方式：
- 🧰 可以提取普通 JavaScript 函数
- 📦 可以创建独立的类或模块
- 🎨 有时使用 CSS 而非 JavaScript 更简单（如动画效果）

```jsx
// 有时普通函数比Hook更合适
function createConnection(serverUrl, roomId) {
  // 返回连接对象的纯函数
  return {
    connect() { /* ... */ },
    disconnect() { /* ... */ }
  };
}
```

## 📝 总结

- 🧩 自定义 Hook 可在组件间共享逻辑，但不共享状态
- 📏 命名必须以 `use` 开头，遵循 Hook 规则
- 🔄 每次组件重新渲染时，所有 Hook 会重新运行
- ✨ 保持 Hook 代码纯粹，副作用应放在 useEffect 中
- 🎯 创建有具体目标的 Hook，避免过度抽象
- 🔧 选择适合问题的解决方案，不一定总是需要自定义 Hook

> 参考：[React官方文档-使用自定义Hook复用逻辑](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks) 