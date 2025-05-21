# 🔄 React State更新队列

## 📋 批处理机制

React通过**批处理**（batching）机制来处理多个状态更新，提高应用性能：

- 📦 批处理：React会等到**事件处理函数中的所有代码执行完毕**后，才一次性处理所有状态更新
- 🚀 这种机制使应用运行更快，避免不必要的重新渲染
- 🛡️ 防止出现"半成品"渲染，避免用户看到不完整的UI状态

```jsx
function handleClick() {
  // React会等这些代码全部执行完后，才进行一次渲染
  setCount(count + 1);
  setFlag(true);
  setName('Alex');
}
```

## 🔍 同一事件中多次更新相同状态

### ⚠️ 常规更新的局限性

当你在一个事件处理函数中多次更新同一个状态变量时，只有最后一次更新会生效：

```jsx
function handleClick() {
  setNumber(number + 1); // number是0
  setNumber(number + 1); // number还是0
  setNumber(number + 1); // number还是0
}
// 结果：number只增加到1，而不是3
```

这是因为在同一个渲染周期中，`number`的值保持不变。

### 🔢 更新函数解决方案

为了在单个事件中多次更新同一个状态，可以**传入更新函数**：

```jsx
function handleClick() {
  setNumber(n => n + 1); // 接收先前的状态作为参数
  setNumber(n => n + 1); // 在上一次更新的基础上继续更新
  setNumber(n => n + 1); // 再次更新
}
// 结果：number增加到3
```

### 🧮 更新函数的工作原理

当你使用`setNumber(n => n + 1)`这样的更新函数时：

1. ✉️ React将这个更新函数加入到队列中
2. 🔄 在下一次渲染时，React按顺序执行队列中的所有更新
3. 📊 每个更新函数的参数是前一个函数返回的结果

#### 更新队列处理示例：

| 更新队列 | 当前值 n | 返回值 |
|---------|---------|--------|
| n => n + 1 | 0 | 1 |
| n => n + 1 | 1 | 2 |
| n => n + 1 | 2 | 3 |

## 🔀 混合更新方式的效果

React处理更新队列的规则：
- 💼 **替换更新**：`setState(x)` 会将"替换为x"加入队列，丢弃之前排队的更新
- 🧩 **函数更新**：`setState(n => ...)` 会将更新函数加入队列，在渲染时按顺序执行

### 📝 混合更新示例

```jsx
function handleClick() {
  setNumber(number + 5); // "替换为5"加入队列
  setNumber(n => n + 1); // 函数更新加入队列
  setNumber(42);         // "替换为42"加入队列
}
```

处理过程：
1. "替换为5"：结果为5
2. n => n + 1：结果为6
3. "替换为42"：结果为42

最终，state更新为42。

## 💡 命名约定

通常，更新函数的参数可以用状态变量名的首字母命名：

```jsx
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setCount(c => c + 1);
```

更详细的风格可以使用完整状态名或带前缀的名称：
```jsx
setEnabled(enabled => !enabled);
setEnabled(prevEnabled => !prevEnabled);
```

## ⚠️ 注意事项

- 🧪 更新函数必须是**纯函数**：只计算并返回结果，不应有副作用
- 🔄 在严格模式下，React会执行每个更新函数两次（但丢弃第二次结果）以帮助发现错误
- 🌐 React只对同一事件内的更新进行批处理，不会跨多个事件（如多次点击）进行批处理

## 🚀 实用技巧

- 当需要根据状态的先前值进行更新时，总是使用更新函数：`setState(prev => /* 基于prev计算 */)`
- 当状态更新依赖于另一个状态的值时，考虑合并相关状态或使用reducer
- 对于需要合并的多个异步更新，必须使用更新函数以避免竞态条件

## 📝 总结

- 🔄 设置状态不会改变现有变量，而是请求新的渲染
- 📦 React在事件处理函数执行完成后批处理状态更新（批处理）
- 🔢 要在单个事件中多次更新同一状态，使用`setState(n => n + 1)`形式的更新函数
- 🧮 替换更新会覆盖队列中之前的更新，而函数更新会始终被添加到队列中
- 🧪 更新函数应该是纯函数，且只返回计算结果，不执行副作用

> 参考：[React官方文档-把一系列state更新加入队列](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates) 