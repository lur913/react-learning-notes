# 移除 Effect 依赖

## 🎯 依赖项的基本原则

- ⚖️ **依赖必须与代码保持一致**：不能任意选择依赖，必须包含Effect中使用的所有响应式值
- 🔍 **linter是你的朋友**：React的linter会验证你是否已包含所有必要的依赖项
- 🚫 **不要抑制依赖检查**：抑制lint规则会导致难以调试的问题

## 🛠️ 移除不必要依赖的策略

### 1️⃣ 验证依赖的必要性

当你想移除某个依赖时，需要向linter"证明"它不是必需的：

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId是必要依赖
}
```

### 2️⃣ 将交互相关逻辑移至事件处理程序

```jsx
function handleClick() {
  // ✅ 不需要在Effect中处理交互逻辑
  saveToDatabase(message);
  setIsSent(true);
}
```

### 3️⃣ 拆分多用途Effect

如果一个Effect因不同原因需要重新运行，将其拆分为多个独立Effect：

```jsx
// ✅ 拆分为两个独立Effect
useEffect(() => {
  logVisit(roomId);
}, [roomId]);

useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

### 4️⃣ 使用函数式更新

如果Effect基于之前的状态更新状态，使用函数式更新避免依赖该状态：

```jsx
// ❌ 依赖count
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);

// ✅ 不依赖count
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // 使用函数式更新
  }, 1000);
  return () => clearInterval(id);
}, []); // 不需要依赖count
```

### 5️⃣ 使用Effect Event分离响应式与非响应式逻辑

使用`useEffectEvent`（实验性API）封装不需要"响应"变化的代码：

```jsx
function ChatRoom({ roomId, theme }) {
  // ✅ 这不会成为依赖项
  const onConnected = useEffectEvent(roomName => {
    showNotification('已连接到 ' + roomName, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected(connection.roomName);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // 不需要依赖theme
}
```

### 6️⃣ 处理对象和函数依赖

#### 🔄 将对象移到Effect内部或组件外部

```jsx
// ❌ 父组件每次渲染创建新对象
<ChatRoom options={{ serverUrl, roomId }} />

// ✅ 在Effect外部解构对象，使用原始值
function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // 使用原始值作为依赖
}
```

#### 🧮 将函数移到Effect内部或组件外部

```jsx
// ✅ 在Effect内部定义函数
useEffect(() => {
  function createOptions() {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }
  
  const options = createOptions();
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [roomId, serverUrl]);
```

## 🚀 常见模式

### 1️⃣ 静态值不需要作为依赖

```jsx
// ✅ 组件外部的常量不是响应式值
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]); // 不需要包含serverUrl
}
```

### 2️⃣ 使用useEffectEvent处理最新的props和state

```jsx
function ChatRoom({ roomId, theme }) {
  const [message, setMessage] = useState('');
  
  // theme和message的变化不会触发Effect重新执行
  const onMessage = useEffectEvent(receivedMessage => {
    showNotification('新消息: ' + receivedMessage, theme);
    setMessage(receivedMessage);
  });
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // onMessage不是依赖项
}
```

## 📝 总结

- 🔄 依赖应与Effect使用的响应式值保持一致
- 🧹 要移除依赖，需修改代码而非忽略lint规则
- 🔀 将交互逻辑移到事件处理程序
- 📦 拆分多用途Effect
- 🔢 使用函数式更新避免状态依赖
- 🧪 使用useEffectEvent隔离非响应式逻辑
- 🏗️ 避免对象和函数依赖，将它们移到组件外部或Effect内部
- 📊 从对象中提取原始值作为依赖
- ⚡ 永远不要抑制依赖检查，这会导致bug

> 参考：[React官方文档-移除Effect依赖](https://zh-hans.react.dev/learn/removing-effect-dependencies) 