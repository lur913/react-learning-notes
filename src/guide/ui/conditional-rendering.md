# 条件渲染

## 🌟 概述
- 🎯 **核心概念**：根据不同条件显示不同的内容
- 🛠️ **实现方式**：使用JavaScript的条件表达式来控制渲染
- 🧩 **常用场景**：登录/注销状态、权限控制、数据加载状态、特性开关

## 👆 条件返回JSX

### 🔄 使用if语句返回不同JSX
- 📝 **基本方式**：通过if条件分支返回不同的JSX元素
- 🧠 **工作原理**：由JavaScript控制流程，而非特殊模板语法

```jsx
function Item({ name, isPacked }) {
  // 根据isPacked属性条件返回不同的JSX
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}
```

### 🚫 返回null不渲染任何内容
- 💡 **应用场景**：当条件不满足时完全隐藏组件
- ⚠️ **注意事项**：组件必须返回某些内容，返回null表示不渲染任何内容

```jsx
function Item({ name, isPacked }) {
  // 当isPacked为true时不渲染任何内容
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}
```

## 🔀 条件包含JSX

### 🤔 条件(三元)运算符 (? :)
- 📏 **语法**：`condition ? trueExpression : falseExpression`
- 🎯 **适用场景**：简单条件选择，替代简单的if/else语句
- 💪 **优势**：可以内联在JSX中使用，代码更紧凑

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? name + ' ✅' : name}
    </li>
  );
}
```

- 🔄 **嵌套JSX**：可以在三元表达式的任意一侧使用更复杂的JSX

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}
```

### 🔗 逻辑与运算符 (&&)
- 📏 **语法**：`condition && expression`
- 🎯 **适用场景**：条件为真时才渲染内容，否则不渲染
- 🧠 **工作原理**：`true && expression`返回expression，`false && expression`返回false

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}
```

- ⚠️ **陷阱警告**：不要在`&&`左侧使用数字
  - 🚫 **错误示例**：`messageCount && <p>New messages</p>`
  - ✅ **正确示例**：`messageCount > 0 && <p>New messages</p>`
  - 📌 **原因**：当左侧为`0`时，React会渲染`0`而非不渲染

## 📦 变量赋值条件渲染

### 🧰 使用变量存储JSX
- 🎯 **适用场景**：复杂条件逻辑、多个条件分支
- 💪 **优势**：更灵活、可读性更高，适合复杂逻辑
- 🔄 **基本步骤**：声明变量 → 条件赋值 → 在JSX中引用

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  
  // 条件处理逻辑
  if (isPacked) {
    itemContent = name + " ✅";
  }
  
  // 在JSX中使用处理后的变量
  return <li className="item">{itemContent}</li>;
}
```

- 🧩 **复杂JSX**：变量可以存储任意复杂的JSX结构

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  
  return <li className="item">{itemContent}</li>;
}
```

## 💡 最佳实践

### 🔍 选择条件渲染方式
- 📊 **if/else语句**：适用于复杂条件逻辑或多个分支
- 🔄 **条件运算符 (? :)**：适用于简单的二选一场景，可内联使用
- 🔗 **逻辑与 (&&)**：适用于"有或无"的场景，条件为真时才渲染
- 📦 **变量赋值**：适用于复杂的条件逻辑，需要多次复用结果

### ⚖️ 可读性与简洁性平衡
- 📝 **代码格式**：适当使用换行和缩进增强可读性
- 🧩 **组件拆分**：当条件逻辑过于复杂时，考虑提取为独立组件
- 🧠 **语义清晰**：选择能最清晰表达意图的条件渲染方式

## 📝 总结
- 🔀 **React条件渲染本质**：使用JavaScript条件语句控制UI输出
- 🛠️ **常用技术**：
  - `if`语句返回不同JSX
  - 三元运算符`? :`内联条件
  - 逻辑与运算符`&&`条件存在时渲染
  - 变量赋值存储条件结果
- 🎯 **核心原则**：代码的清晰度和可维护性优先

> 参考：[React官方文档-条件渲染](https://zh-hans.react.dev/learn/conditional-rendering) 