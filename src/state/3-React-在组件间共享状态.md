# 🔄 React：在组件间共享状态

## 🌟 状态提升的概念

### 🧩 什么是状态提升？
- 🚀 **核心思想**：将组件的状态移动到它们最近的共同父组件中
- 🔄 **单一数据源**：创建一个"可信的唯一数据源"，避免状态同步问题
- 🌉 **信息流向**：状态存储在父组件，通过props向下传递给子组件

## 💡 为什么需要状态提升？

### 🎯 解决的问题
- 🔄 **组件同步**：当多个组件需要反映相同的变化数据时
- 🧩 **协调行为**：当一个组件的状态变化需要影响其他组件时
- 🌐 **集中管理**：更容易跟踪和调试应用程序的状态变化

## 🛠️ 状态提升的三步实现

### 1️⃣ 从子组件中移除状态
```jsx
// 🔴 移除前：状态在子组件内部
function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false); // 这个状态将被移除
  // ...
}

// ✅ 移除后：子组件不再管理自己的状态
function Panel({ title, children, isActive, onShow }) {
  // 不再有useState，只接收props
  // ...
}
```

### 2️⃣ 从公共父组件传递硬编码数据
```jsx
// 临时测试：传递固定数据验证组件是否正常工作
function Accordion() {
  return (
    <>
      <Panel
        title="关于"
        isActive={true} // 硬编码的值
        onShow={() => {}} // 空函数
      >
        内容...
      </Panel>
      {/* 其他Panel... */}
    </>
  );
}
```

### 3️⃣ 为公共父组件添加状态
```jsx
function Accordion() {
  // 状态提升到父组件
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <>
      <Panel
        title="关于"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        内容...
      </Panel>
      <Panel
        title="词源"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        内容...
      </Panel>
    </>
  );
}
```

## 🧩 受控组件与非受控组件

### 🎮 受控组件
- 📌 **定义**：组件的关键行为由props控制，而非内部state
- 🔍 **特点**：父组件可以完全控制子组件的行为
- 🛠️ **适用场景**：需要协调多个组件的状态时
- 🔄 **数据流**：单向数据流，从父组件流向子组件

```jsx
// 受控组件示例
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}
```

### 🔓 非受控组件
- 📌 **定义**：组件自己管理内部状态，不依赖父组件控制
- 🔍 **特点**：更简单，更独立，但灵活性较低
- 🛠️ **适用场景**：组件行为相对独立，不需要与其他组件协调
- 🏃 **即插即用**：使用更简单，不需要额外配置

```jsx
// 非受控组件示例
function UncontrolledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

## 🌟 真实案例：同步两个面板

### 📊 案例分析
```jsx
// 父组件控制多个面板的展开状态
export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <>
      <h2>哈萨克斯坦，阿拉木图</h2>
      <Panel 
        title="关于" 
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        阿拉木图人口约200万，是哈萨克斯坦最大的城市。
      </Panel>
      <Panel 
        title="词源" 
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        这个名字来自于哈萨克语中"苹果"的意思。
      </Panel>
    </>
  );
}

// 子组件接收控制属性
function Panel({ title, children, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          显示
        </button>
      )}
    </section>
  );
}
```

## 📋 状态位置的选择原则

### 🧭 确定状态位置的指南
- 🔍 **每个状态对应唯一数据源**：避免状态冗余和同步问题
- 🌲 **最近共同祖先**：将共享状态放在需要该状态的组件的最近共同父组件中
- 🔝 **自顶向下的数据流**：父组件通过props将状态和更新函数传递给子组件
- 🧠 **状态提升不意味着所有状态都在顶层**：每种状态都应该有自己合适的"家"

## 📝 总结

- 🔄 **状态提升**：将状态移至共同父组件，解决组件间状态同步问题
- 🛠️ **实现步骤**：移除子组件状态 → 传递测试数据 → 父组件添加状态管理
- 🎮 **受控与非受控**：受控组件由props驱动，非受控组件由内部state驱动
- 🧠 **单一数据源**：每个状态应该只存在于一个指定组件中
- 🌊 **数据流向**：状态向下流动，事件处理函数向上传递

> 参考：[React官方文档-在组件间共享状态](https://zh-hans.react.dev/learn/sharing-state-between-components) 