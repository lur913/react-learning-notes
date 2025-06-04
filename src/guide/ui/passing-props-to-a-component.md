# Props传递

## 🌟 概述
- 🎯 **核心概念**：Props是组件间通信的机制，允许父组件向子组件传递数据
- 🧩 **本质特点**：Props类似HTML属性，但可传递任何JavaScript值（对象、数组、函数等）
- 🔄 **数据流向**：单向数据流，从父组件流向子组件

## 📝 Props基础

### 🧠 理解Props的概念
- 💡 **原理**：组件就像JavaScript函数，Props就是它的参数
- 🔍 **特点**：只读性，子组件不能修改接收到的props
- 🛠️ **语法形式**：类似HTML标签属性，`<组件名 属性名=值 />`

```jsx
// 使用HTML预定义的props
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}
```

## 🔄 传递与接收Props

### 📤 向组件传递Props
- 📝 **基本语法**：在JSX标签中添加属性
- 🧰 **值类型**：可以传递字符串、数字、对象、数组、函数等任何JavaScript值
- 🔢 **传递多个props**：一个组件可接收任意数量的props

```jsx
// 传递多种类型的props
<Avatar
  person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
  size={100}
  isVerified={true}
  hobbies={['读书', '游泳']}
  onClick={() => alert('点击了头像')}
/>
```

### 📥 在组件中接收Props
- 🧰 **解构语法**：通过函数参数解构直接获取特定props
- 🔍 **访问props**：将props视为普通JavaScript变量使用
- 🎯 **默认参数**：可为props设定默认值，处理未传值情况

```jsx
// 解构接收props并设置默认值
function Avatar({ person, size = 100, isOnline }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
      style={{
        borderColor: isOnline ? 'green' : 'gray'
      }}
    />
  );
}
```

## 🧩 Props的高级用法

### 🔄 指定Props默认值
- 📝 **语法**：在参数解构中使用`=`设置默认值
- 🛡️ **作用**：当prop未提供或值为`undefined`时使用默认值
- ⚠️ **注意**：`null`和`false`被视为有效值，不会触发默认值

```jsx
function Avatar({ size = 100, person }) {
  // 当size未传递或为undefined时，使用100作为默认值
  return (
    // 组件实现
  );
}
```

### 📦 JSX展开语法传递Props
- 🔄 **语法**：使用`{...props}`将所有props一次性传递
- 🎯 **应用场景**：包装组件、高阶组件、转发props
- ⚠️ **使用建议**：谨慎使用，可能导致传递不必要的props

```jsx
function Profile(props) {
  return (
    <div className="profile">
      <Avatar {...props} />
    </div>
  );
}
```

### 👨‍👩‍👧‍👦 Children Props
- 🧩 **概念**：通过JSX标签内容传递的特殊prop
- 📝 **语法**：`<组件>内容</组件>`中的"内容"作为`children` prop传递
- 🎯 **应用**：创建容器组件、布局组件、高级组合模式

```jsx
// Card组件接收children prop
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

// 使用Card组件，传递children
<Card title="个人资料">
  <Avatar person={person} />
  <Biography person={person} />
</Card>
```

## ⏱️ Props的时间特性

### 🔄 Props的不可变性
- 📸 **快照特性**：Props是组件渲染时的快照，每次渲染接收新的props
- 🛑 **只读性**：组件不能修改自己的props
- 🔍 **纯函数原则**：对相同的props，组件应返回相同的JSX

### 📈 Props随时间变化
- 🧠 **变化机制**：Props本身不变，但父组件可以在不同渲染中传递不同的props
- 🔄 **更新流程**：父组件重新渲染 → 子组件接收新props → 子组件重新渲染
- 🎯 **交互响应**：通常通过状态（State）变化触发props的变化

```jsx
// Clock组件接收color和time props
function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}

// 父组件可能在不同时间点传递不同的color和time值
<Clock 
  color={selectedColor} // selectedColor可能随用户选择而变化
  time={new Date().toLocaleTimeString()} // time每秒都在变化
/>
```

## 💡 最佳实践

### 🎯 Props命名原则
- 🧩 **驼峰命名法**：与JavaScript变量命名保持一致（如`userName`）
- 🔍 **语义化**：名称应清晰表达prop的用途和含义
- 🧠 **常见约定**：布尔props通常使用`is`/`has`前缀（如`isActive`、`hasError`）

### ⚡ 性能考虑
- 🚫 **避免过度传递**：只传递组件真正需要的props
- 🔍 **扁平结构**：尽量避免过深的props嵌套
- 🧩 **组件分解**：当组件props过多时，考虑拆分成更小的组件

### 🔧 类型检查
- 🛡️ **PropTypes**：在开发环境验证props类型（React内置）
- 📝 **TypeScript**：使用静态类型系统提供更强的类型安全
- 📄 **文档**：明确记录每个prop的类型、用途和是否必须

## 📝 总结
- 🔄 **Props本质**：React组件间通信的方式，类似函数参数
- 🧩 **传递机制**：父组件提供props，子组件接收并读取props
- 🛠️ **常用技术**：
  - 解构接收：`function Component({ prop1, prop2 })`
  - 设置默认值：`function Component({ prop = defaultValue })`
  - 传递JSX：通过children prop
  - 展开语法：`<Component {...props} />`
- 🔒 **不变原则**：Props是只读的，组件不能修改自己的props
- 🎯 **时间维度**：Props可随时间变化，但每次渲染中都是不变的

> 参考：[React官方文档-将Props传递给组件](https://zh-hans.react.dev/learn/passing-props-to-a-component) 