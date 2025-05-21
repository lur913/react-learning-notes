# 💾 React：使用ref引用值

## 🌟 什么是ref？

### 💡 基本概念
- 🧠 **组件的"记忆"**：能在重新渲染之间保留数据
- 🚫 **不触发渲染**：更新ref不会像state一样触发组件重新渲染
- 🔄 **脱围机制**：让代码跳出React的数据流，直接操作值

```jsx
// 创建ref的基本方式
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(initialValue);
  // myRef.current可以读取和写入
}
```

## 📦 ref对象的结构

### 🏗️ 组成部分
- 📭 **容器对象**：`{ current: 初始值 }`
- 🔑 **current属性**：持有ref实际引用的值
- 🛠️ **可变性**：可以随时修改`current`属性

```jsx
// ref是一个带有current属性的普通JavaScript对象
const ref = useRef(0);
console.log(ref); // { current: 0 }

// 更新ref值
ref.current = 5;
console.log(ref.current); // 5
```

## 🔍 ref与state的区别

| 📊 state | 🔗 ref |
|---------|-------|
| 🔄 更新触发重新渲染 | 🚫 更新不触发重新渲染 |
| 🕰️ 在下一次渲染时更新 | ⚡ 立即更新 |
| 📸 渲染时是快照 | 📌 始终是同一个可变对象 |
| 🚫 不能在渲染期间修改 | ✅ 可以随时修改 |

```jsx
// 使用state - 更新触发重新渲染
const [count, setCount] = useState(0);
function handleClick() {
  setCount(count + 1); // 触发重新渲染
}

// 使用ref - 更新不触发重新渲染
const countRef = useRef(0);
function handleClick() {
  countRef.current++; // 不触发重新渲染
  console.log(countRef.current);
}
```

## 🚀 何时使用ref？

### ✅ 适合场景
- ⏱️ **存储timeout/interval ID**：方便清除
- 📊 **存储DOM元素**：直接操作DOM
- 🧰 **存储不影响渲染的其他对象**

```jsx
// 存储timeout ID
function DelayedMessage() {
  const timeoutRef = useRef(null);
  
  function handleSend() {
    timeoutRef.current = setTimeout(() => {
      alert('消息已发送！');
    }, 3000);
  }
  
  function handleCancel() {
    clearTimeout(timeoutRef.current);
  }
  
  return (
    <>
      <button onClick={handleSend}>发送</button>
      <button onClick={handleCancel}>取消</button>
    </>
  );
}
```

## 📚 实际应用示例

### ⏱️ 实现秒表功能
```jsx
function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());
    
    // 清除可能存在的interval
    clearInterval(intervalRef.current);
    
    // 设置新interval并保存ID
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }
  
  function handleStop() {
    // 清除interval
    clearInterval(intervalRef.current);
  }
  
  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }
  
  return (
    <>
      <h1>时间经过：{secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>开始</button>
      <button onClick={handleStop}>停止</button>
    </>
  );
}
```

## ⚠️ 使用ref的注意事项

### 🚫 避免的做法
- 🔴 **不要在渲染期间读取或写入ref.current**
- 🔴 **不要过度依赖ref**：如果大部分应用逻辑依赖ref，需要重新考虑设计

```jsx
function MyComponent() {
  const myRef = useRef(0);
  
  // 🚫 错误：在渲染过程中读取和修改ref
  return <div>{myRef.current++}</div>
  
  // ✅ 正确：在事件处理函数中修改
  function handleClick() {
    myRef.current++;
  }
}
```

### ✅ 最佳实践
- 🟢 **将ref视为脱围机制**：主要用于与外部系统和浏览器API交互
- 🟢 **事件处理函数中操作**：在事件处理函数内修改和读取ref
- 🟢 **useEffect中访问**：可以在effect中安全访问ref

```jsx
// ✅ 在事件处理函数中使用ref
function HandleButton() {
  const countRef = useRef(0);
  
  function handleClick() {
    countRef.current++;
    console.log(`点击了${countRef.current}次`);
  }
  
  return <button onClick={handleClick}>点击我</button>
}
```

## 🧵 ref在DOM中的应用

### 🔗 连接到DOM元素
- 创建ref并将其传递给JSX元素的ref属性
- React会自动设置`ref.current`为相应的DOM节点
- 元素移除时设置为`null`

```jsx
function FocusInput() {
  const inputRef = useRef(null);
  
  function handleClick() {
    inputRef.current.focus();
  }
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
```

## 🔬 深入理解useRef实现

### 🧩 工作原理
- useRef在内部使用useState实现
- 它返回的对象在渲染间保持稳定
- 本质上是一个没有设置函数的state变量

```jsx
// useRef的简化内部实现
function useRef(initialValue) {
  const [ref] = useState({ current: initialValue });
  return ref;
}
```

## 📝 总结

- 🔮 **Ref用途**：在渲染间持久保存值，但更新时不触发重新渲染
- 🔧 **访问方式**：通过`ref.current`访问和修改值
- 🚫 **与state区别**：ref更新不会触发组件重新渲染
- ⏱️ **常见用例**：存储timeout/interval ID、DOM元素引用、其他不影响UI的值
- ⚠️ **注意事项**：避免在渲染期间读写ref，主要在事件处理函数中使用
- 🧠 **记住**：ref是一种脱围机制，用于连接React外部的世界

> 参考：[React官方文档-使用ref引用值](https://zh-hans.react.dev/learn/referencing-values-with-refs) 