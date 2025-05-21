# 📦 React：组件导入导出

## 🌟 概述
- 🎯 **核心概念**：组件的可复用性需要合理的文件组织和导入导出机制
- 🧩 **主要目的**：使组件可以跨文件使用，提高代码可维护性和可复用性
- 🔍 **关键优势**：让代码结构更清晰，便于查找和维护组件

## 📂 组件文件组织

### 🏗️ 根组件文件
- 📌 **定义**：应用的入口组件文件，通常命名为`App.js`或类似名称
- 🔄 **作用**：作为组件树的起点，导入并组合其他组件
- 💡 **特点**：在不同框架中可能有不同实现（如Next.js中每个页面都有自己的根组件）

```jsx
// App.js - 根组件示例
export default function App() {
  return (
    <div className="app">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
```

## 🔄 组件导出方式

### 📤 默认导出 (Default Export)
- 📋 **语法**：`export default function ComponentName() {...}`
- 🔢 **限制**：每个文件只能有一个默认导出
- 🎯 **适用场景**：文件中只包含一个主要组件时

```jsx
// Button.js
export default function Button() {
  return <button>点击我</button>;
}
```

### 📤 具名导出 (Named Export)
- 📋 **语法**：`export function ComponentName() {...}`
- 🔢 **特点**：一个文件可以有多个具名导出
- 🎯 **适用场景**：文件中包含多个相关组件或工具函数时

```jsx
// FormElements.js
export function Input() {
  return <input type="text" />;
}

export function Checkbox() {
  return <input type="checkbox" />;
}
```

### 📊 两种导出方式对比

| 特性 | 默认导出 | 具名导出 |
|------|----------|----------|
| 每个文件数量限制 | 最多一个 | 可以有多个 |
| 导出语法 | `export default function Name() {}` | `export function Name() {}` |
| 导入语法 | `import Name from './File'` | `import { Name } from './File'` |
| 导入时重命名 | 可以任意命名 | 需要使用`as`关键字 |
| 适用场景 | 文件的主要组件 | 辅助组件、工具函数 |

> 🧠 **团队实践**：有些团队会选择统一使用一种导出方式，避免混淆

## 📥 组件导入方式

### 🔍 默认导入 (Default Import)
- 📋 **语法**：`import ComponentName from './ComponentFile'`
- 🎯 **特点**：
  - 可以自由命名导入的组件
  - 对应默认导出的组件
- ⚠️ **注意**：导入名可以与导出名不同，但建议保持一致以避免混淆

```jsx
// 导入默认导出的组件
import Button from './Button';
import MyButton from './Button'; // 可以重命名，但不推荐
```

### 🔍 具名导入 (Named Import)
- 📋 **语法**：`import { ComponentName } from './ComponentFile'`
- 🎯 **特点**：
  - 必须使用与导出时相同的名称
  - 大括号`{}`是必需的
  - 可以同时导入多个组件
- 🔄 **重命名**：使用`as`关键字 - `import { Button as MyButton } from './Components'`

```jsx
// 导入具名导出的组件
import { Input, Checkbox } from './FormElements';
import { Button as SubmitButton } from './Buttons';
```

### 📦 混合导入
- 📋 **语法**：`import Default, { Named1, Named2 } from './File'`
- 🔀 **应用**：同时导入一个文件中的默认导出和具名导出

```jsx
// 同时导入默认导出和具名导出
import Form, { Input, Select } from './FormComponents';
```

## 🔄 组件拆分示例

### 📝 单文件多组件示例
```jsx
// Components.js
export function Profile() {
  return <img src="avatar.jpg" alt="用户头像" />;
}

export default function Gallery() {
  return (
    <section>
      <h1>用户画廊</h1>
      <Profile />
      <Profile />
    </section>
  );
}
```

### 📝 拆分为多文件
```jsx
// Profile.js
export default function Profile() {
  return <img src="avatar.jpg" alt="用户头像" />;
}

// Gallery.js
import Profile from './Profile';

export default function Gallery() {
  return (
    <section>
      <h1>用户画廊</h1>
      <Profile />
      <Profile />
    </section>
  );
}

// App.js
import Gallery from './Gallery';
import Profile from './Profile';

export default function App() {
  return (
    <>
      <Profile />
      <Gallery />
    </>
  );
}
```

## 💡 最佳实践

### 📏 文件命名和组织
- 🔤 **文件名**：使用组件名作为文件名，如`Button.js`包含`Button`组件
- 📂 **目录结构**：相关组件可以放在同一目录下，如`components/form/`
- 🧩 **组件拆分原则**：
  - 功能相似的小组件可以放在同一文件中
  - 复杂组件应单独放在一个文件中

### 🧠 导入导出策略
- 🎯 **单一职责**：每个文件应专注于一个主要功能或组件
- 🔄 **默认导出选择**：通常将文件的主要组件作为默认导出
- 🔍 **具名导出选择**：辅助组件、工具函数适合使用具名导出
- 📦 **避免过度导出**：只导出真正需要复用的组件，内部组件可保持文件私有

### ⚠️ 常见陷阱与注意事项
- 🔄 **循环依赖**：避免组件之间的循环导入
- 🔤 **保持一致性**：团队内保持统一的导入导出风格
- 🧩 **路径问题**：注意相对路径的正确性，特别是在调整文件结构时
- 📋 **文件扩展名**：根据项目配置，可能需要或不需要`.js`扩展名

```jsx
// 使用扩展名
import Button from './Button.js';
// 省略扩展名（需要项目配置支持）
import Button from './Button';
```

## 📝 总结
- 📦 **组件导出方式**：
  - **默认导出**：`export default function Name() {}`，每个文件一个
  - **具名导出**：`export function Name() {}`，可以有多个
- 📥 **组件导入方式**：
  - **默认导入**：`import Name from './File'`
  - **具名导入**：`import { Name } from './File'`
- 🧩 **组件组织原则**：
  - 根据功能和复用性拆分组件
  - 相关组件组织在一起
  - 主要组件使用默认导出，辅助组件使用具名导出
- 🚀 **核心价值**：
  - 提高代码可维护性
  - 增强组件可复用性
  - 使项目结构更清晰

> 参考：[React官方文档-组件的导入与导出](https://zh-hans.react.dev/learn/importing-and-exporting-components) 