# 🔄 React：JSX中使用JavaScript

## 🌟 概述
- 🎯 **核心概念**：JSX允许在标签中融入JavaScript逻辑和动态内容
- 🧩 **实现方式**：通过大括号`{}`连接JSX和JavaScript世界
- 🔍 **本质**：JSX是JavaScript的语法扩展，而非独立的模板语言

## 🔤 字符串与动态值

### 📝 传递静态字符串
- 🧠 **基本用法**：使用引号`""`传递字符串字面量
- 📋 **示例**：属性值直接使用双引号或单引号包裹

```jsx
// 传递静态字符串给属性
<img
  className="avatar"
  src="https://i.imgur.com/7vQD0fPs.jpg"
  alt="Gregorio Y. Zara"
/>
```

### 🔄 使用变量与表达式
- 🎯 **基本用法**：用大括号`{}`替代引号，插入JavaScript变量或表达式
- 🧩 **工作原理**：大括号告诉React"这里不是字符串，而是JavaScript代码"

```jsx
// 使用变量作为属性值
const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
const description = 'Gregorio Y. Zara';

<img
  className="avatar"
  src={avatar}  // 使用变量
  alt={description}  // 使用变量
/>
```

## 🧮 JSX中的JavaScript表达式

### 📊 在内容中使用表达式
- 🔍 **语法**：在JSX标签内部使用`{}`插入JavaScript表达式
- 🛠️ **能力**：可以使用变量、函数调用、数学计算等任何合法的JavaScript表达式

```jsx
// 在内容中插入变量
const name = 'Gregorio Y. Zara';
<h1>{name}的待办事项列表</h1>

// 在内容中插入函数调用结果
const today = new Date();
<h1>To Do List for {formatDate(today)}</h1>
```

### 🧭 大括号使用的位置限制
- 🎯 **仅两处可用**：
  1. 📝 **JSX标签内的文本**：`<h1>{name}</h1>`有效
  2. 📌 **属性赋值**：`src={avatar}`有效，紧跟在`=`符号后
- ⚠️ **不能用于**：标签名称、作为JSX标签本身（`<{tag}>`无效）

## 🎨 JSX中的对象和CSS

### 🖌️ 内联样式与双大括号
- 👁️‍🗨️ **双大括号解释**：实际是单层大括号内包含一个对象字面量
- 🎯 **常用场景**：传递内联样式对象给`style`属性

```jsx
// 内联样式示例 - 双大括号
<ul style={{
  backgroundColor: 'black',
  color: 'pink'
}}>
  <li>Improve the videophone</li>
  <li>Prepare aeronautics lectures</li>
</ul>

// 等同于（拆分来看更清晰）
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

### 📋 CSS属性命名规则
- 🔄 **驼峰命名法**：HTML的`background-color`在JSX中写作`backgroundColor`
- 🧠 **原因**：JSX会被转换为JavaScript，而连字符在JavaScript中是减法运算符

## 🧩 对象与JSX结合的高级用法

### 📦 使用对象组织数据
- 🎯 **优势**：将相关数据归类，方便管理和访问
- 🧰 **应用**：存储组件所需的各种属性、配置和值

```jsx
// 创建包含多种数据的对象
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

// 在JSX中引用对象的属性
<div style={person.theme}>
  <h1>{person.name}的待办事项</h1>
  {/* 其他内容 */}
</div>
```

### 🔍 属性访问与表达式组合
- 🛠️ **灵活性**：可以在大括号内使用点表示法访问对象属性
- 🔢 **表达式能力**：支持复杂表达式和计算属性

```jsx
// 复杂表达式示例
<h2>{person.name.split(' ')[0]}的档案</h2>
<p>物品数: {todos.length}</p>
<div title={`${person.name}创建于${formatDate(person.createdAt)}`}>
```

## ⚠️ 常见陷阱与注意事项

### 🛑 对象不能直接渲染
- ⚠️ **错误示例**：`<h1>{person}</h1>` 会报错：`Objects are not valid as a React child`
- ✅ **正确做法**：访问对象的特定属性，如`<h1>{person.name}</h1>`

### 🧠 JSX表达式的限制
- 📝 **不支持语句**：`if`、`for`、`switch`等语句不能直接用在大括号内
- 🔄 **替代方案**：使用三元运算符、&&、||等表达式，或在外部使用语句处理后再插入结果

```jsx
// 不能直接在大括号内使用if语句
{/* 🔴 这是错误的 */}
{ if (isLoggedIn) { <AdminPanel /> } }

// ✅ 可以使用条件表达式
{ isLoggedIn ? <AdminPanel /> : <LoginForm /> }
```

## 💡 最佳实践

### 🎯 保持JSX简洁
- 📊 **复杂逻辑外置**：将复杂的计算和处理放在JSX外部
- 🧩 **适度拆分**：抽取重复或复杂的部分为变量或辅助函数
- 🧠 **语义化**：使用有意义的变量名提升可读性

### 🔍 调试技巧
- 🐞 **查看变量内容**：使用`{JSON.stringify(obj)}`快速检查对象内容
- 🧪 **临时输出**：`{console.log(value)}` 可在渲染时将值输出到控制台

## 📝 总结
- 🔄 **JSX与JavaScript的桥梁**：大括号`{}`允许在JSX中嵌入JavaScript表达式
- 🎯 **用法场景**：
  - 文本内容中：`<h1>{name}</h1>`
  - 属性赋值中：`<img src={url} alt={description} />`
- 🧩 **数据类型**：
  - 字符串用引号：`alt="描述"`
  - 其他值用大括号：`src={avatar}`
  - 对象需要双大括号：<span v-pre>`style={{ color: 'red' }}`</span>
- ⚠️ **关键注意点**：
  - 只能使用表达式，不能使用语句
  - CSS属性使用驼峰命名法
  - 对象不能直接渲染，需要访问其属性

> 参考：[React官方文档-在JSX中通过大括号使用JavaScript](https://zh-hans.react.dev/learn/javascript-in-jsx-with-curly-braces) 