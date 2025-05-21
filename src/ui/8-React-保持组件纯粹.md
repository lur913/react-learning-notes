# 🧪 React：保持组件纯粹

## 🌟 纯函数：组件的基石

### 💎 什么是纯函数？
- 🔄 **输入相同，输出相同**：给定相同的输入，纯函数总是返回相同的结果
- 🛡️ **不改变外部状态**：不会修改在函数调用前就已存在的对象或变量
- 📊 **无副作用**：不会与外部世界交互（如修改DOM、发送网络请求等）

```jsx
// ✅ 纯函数示例
function double(number) {
  return 2 * number; // 输入相同时，总是返回相同结果
}

// ✅ 纯组件示例
function Greeting({ name }) {
  return <h1>你好，{name}</h1>; // 输入props相同时，总是返回相同JSX
}
```

### 🧮 组件作为公式
- 🔢 **类比数学公式**：就像`y = 2x`，输入确定，输出也确定
- 🎯 **可预测性**：相同的props和state，总是渲染出相同的UI
- 🧩 **声明式渲染**：你描述UI在各种状态下应该是什么样子，而不是如何更新DOM

```jsx
// 组件作为"公式"的示例
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>烧开 {drinkers} 杯水</li>
      <li>加入 {drinkers} 勺茶叶和 {0.5 * drinkers} 勺香料</li>
      <li>加入 {0.5 * drinkers} 杯牛奶和适量糖</li>
    </ol>
  );
}
```

## 🚫 副作用：危险的陷阱

### ⚠️ 渲染期间的常见错误
- 🔄 **修改已有变量**：修改函数外部声明的变量
- 📝 **修改props**：直接修改传入的props对象
- 🌐 **直接操作DOM**：在渲染过程中直接操作DOM
- 🕒 **依赖时间或随机值**：使渲染结果依赖于当前时间或随机数

```jsx
// 🔴 不纯的组件：修改了外部变量
let guest = 0;

function Cup() {
  // 错误：修改了预先存在的变量
  guest = guest + 1;
  return <h2>为客人 #{guest} 准备的茶杯</h2>;
}
```

### 📊 StrictMode的作用
- 🔍 **帮助发现问题**：通过重复调用函数暴露不纯的代码
- 🐞 **提前发现bug**：帮助开发者在早期发现潜在问题
- 📈 **性能优化**：纯函数更容易进行性能优化

## 🛠️ 保持组件纯粹的实践

### ✅ 如何编写纯组件
- 🧠 **使用计算**：通过计算生成组件需要的所有值和JSX
- 🔒 **保持props不可变**：永远不要尝试修改props
- 🔍 **使用不可变状态**：使用`useState`/`useReducer`更新状态，而非直接修改
- 📝 **避免修改预先存在的变量**：不要修改函数外部定义的变量

```jsx
// ✅ 纯组件示例
function TodoList({ todos, filter }) {
  // 计算派生值，而不是修改外部变量
  const visibleTodos = getFilteredTodos(todos, filter);
  return (
    <ul>
      {visibleTodos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### 🔧 局部突变：可接受的例外
- 🔄 **创建后再修改**：可以修改在渲染过程中新创建的对象和数组
- 🏷️ **局限于函数内部**：确保这些突变不会影响到外部状态
- 🎯 **保持可预测性**：局部突变后的结果仍应具有确定性

```jsx
// ✅ 局部突变示例（可接受）
function TeaGathering() {
  // 可以修改刚刚创建的数组
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

## 💊 处理副作用的正确方式

### 🎮 事件处理函数：适合的场所
- 👆 **用户交互**：响应用户点击、输入等操作
- 🌐 **网络请求**：发送API请求、获取数据
- 🕒 **定时器**：设置和清除定时器
- 📝 **DOM操作**：直接操作DOM节点

```jsx
function ProfileEditor() {
  const [profile, setProfile] = useState({});
  
  // ✅ 事件处理函数中的副作用
  function handleSubmit() {
    // 发送API请求 - 这是副作用，但在事件处理函数中是合适的
    saveProfile(profile).then(() => {
      alert('保存成功！');
    });
  }
  
  // ...渲染逻辑（应该是纯粹的）
}
```

### 🔄 useEffect：最后的手段
- 🧪 **不适合放在渲染中**：某些副作用无法放在事件处理函数中
- 🔄 **与外部系统同步**：当需要与React外部系统同步时使用
- ⚠️ **谨慎使用**：首先尝试将逻辑表达为渲染的一部分，其次考虑事件处理函数

```jsx
// ✅ 适合useEffect的情况
function ChatRoom({ roomId }) {
  useEffect(() => {
    // 连接到聊天服务器
    const connection = createConnection(roomId);
    connection.connect();
    // 清理函数
    return () => connection.disconnect();
  }, [roomId]); // 仅当roomId变化时重新连接
  
  return <h1>欢迎来到 {roomId} 聊天室</h1>;
}
```

## 🚀 纯组件的优势

### 📈 React优化的基础
- 🔄 **组件缓存**：相同的输入总是产生相同的输出，允许React缓存结果
- ⚡ **并发渲染**：React可以在多个环境中安全地渲染组件
- 🎯 **跳过不必要的渲染**：输入未改变时可以跳过渲染，提高性能
- 🧪 **更容易测试**：纯函数更容易进行单元测试

### 🧠 调试与维护
- 🔍 **可预测的行为**：使调试变得更容易，因为渲染结果与输入直接相关
- 🛡️ **隔离错误**：纯函数隔离了副作用，使错误更容易定位
- 📊 **更易理解**：代码行为更加透明和可预测

## 📝 总结

- 🧪 **纯组件原则**：组件应该是纯函数，相同输入产生相同输出，不产生副作用
- 🔍 **React的假设**：React设计假设所有组件都是纯函数
- 🚫 **避免渲染时的副作用**：不要修改预先存在的变量、直接操作DOM或依赖随机值
- ✅ **合理安排副作用**：
  - 事件处理函数中处理大多数副作用（首选）
  - 必要时使用useEffect（最后手段）
- 🔄 **局部突变**：只修改渲染过程中新创建的变量和对象是安全的
- 🚀 **保持纯粹的好处**：更好的性能优化、更容易测试和调试、更可靠的组件行为

> 参考：[React官方文档-保持组件纯粹](https://zh-hans.react.dev/learn/keeping-components-pure) 