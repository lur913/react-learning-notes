# 📸 React State 如同快照

## 🔍 State的快照特性

React中的state并不像普通的JavaScript变量那样可以随时读写，它更像是一张**快照**：
- 设置state不会修改现有变量，而是触发一次新的渲染
- 在一次渲染内，state的值始终保持不变

## 🔄 设置State触发渲染过程

当你调用`setState`函数时：
1. 🚩 通知React状态已更新
2. 📦 React将新值存储起来
3. 🔄 触发组件重新渲染
4. 🖼️ 组件获取新的state值并生成新UI快照

```jsx
// 点击按钮时，setIsSent(true)会通知React重新渲染UI
function Form() {
  const [isSent, setIsSent] = useState(false);
  
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }

  return (
    <button onClick={() => setIsSent(true)}>
      Send
    </button>
  );
}
```

## 📷 渲染生成UI快照

React渲染组件时：
1. 📝 React调用你的函数组件
2. 👓 函数执行并返回JSX（UI快照）
3. 🖥️ React更新屏幕匹配此快照

关键概念：**每次渲染都能"看到"属于它那次渲染的state值**

## ⚡ State值在渲染内保持固定

同一次渲染中，**state值永远不会改变**，即使事件处理函数是异步执行的：

```jsx
function handleClick() {
  setNumber(number + 1); // number = 0 (当前渲染值)
  setNumber(number + 1); // number 仍然 = 0
  setNumber(number + 1); // number 仍然 = 0
}
```

上面的代码中，虽然`setNumber`被调用三次，但在该渲染的事件处理函数中，`number`的值始终是`0`。

### 🧩 示例解析

```jsx
// 点击+3按钮时
function Counter() {
  const [number, setNumber] = useState(0);
  
  return (
    <button onClick={() => {
      setNumber(number + 1); // 0 + 1 = 1
      setNumber(number + 1); // 仍然是 0 + 1 = 1
      setNumber(number + 1); // 仍然是 0 + 1 = 1
    }}>+3</button>
  );
}
```

为什么点击后计数器只增加到1？因为**在一次渲染内，`number`的值始终为0**。

## ⏱️ 随时间变化的State

状态值会随时间变化，但在特定的一次渲染中，它是固定的：

```jsx
function handleClick() {
  setNumber(number + 5);
  alert(number); // 这里始终显示原始值，不是更新后的值
}
```

即使在异步代码中，React也会保持状态的快照特性：

```jsx
function handleClick() {
  setNumber(number + 5);
  setTimeout(() => {
    alert(number); // 3秒后仍然显示原始值，而不是更新后的值
  }, 3000);
}
```

## 🎭 对比心智模型

### ❌ 错误理解：State作为可变变量
```jsx
// 这不是React的工作方式
onClick={() => {
  number = number + 1; // 直接修改变量
  number = number + 1; // 继续修改同一变量
  number = number + 1; // 变量最终增加3
}}
```

### ✅ 正确理解：State作为快照
```jsx
// React的实际工作方式
onClick={() => {
  setNumber(0 + 1); // 请求用1渲染
  setNumber(0 + 1); // 请求用1渲染
  setNumber(0 + 1); // 请求用1渲染
}}
```

## 💡 实际应用示例

思考一个表单提交场景：
1. 用户点击"发送"按钮，给Alice发消息
2. 在5秒延迟的消息发送完成前，用户将收件人改为Bob
3. 最终alert会显示什么？

```jsx
function handleSubmit() {
  // 用户点击时，to是"Alice"
  setTimeout(() => {
    alert(`你向 ${to} 说了${message}`);
    // 即使用户已将to改为"Bob"，
    // 这里仍然显示"你向Alice说了..."
  }, 5000);
}
```

**结论**：alert显示的是用户点击提交按钮时的状态值，而不是5秒后的最新值。

## 📝 总结

- 🔄 设置state会请求一次新的渲染，但不会改变已有的state变量
- 📸 每次渲染都有自己的state快照，不会随时间改变
- 🔒 在一次渲染的事件处理函数中，state值是固定的
- 🕰️ 即使事件处理函数中的代码是异步的，它也会"记住"创建它那一刻的state值
- 📊 心智模型：把JSX看作是state值快照的结果，而不是可以直接被修改的模板
- 📱 过去创建的事件处理函数拥有创建它们那次渲染中的state值

> 参考：[React官方文档-State如同快照](https://zh-hans.react.dev/learn/state-as-a-snapshot) 