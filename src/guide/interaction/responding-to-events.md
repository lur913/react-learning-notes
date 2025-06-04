# 响应事件

## 📌 事件处理函数基础

- React 允许在 JSX 中添加**事件处理函数**，响应用户交互（点击、悬停、输入等）。
- 事件处理函数通常在组件内部定义，并以 `handle` 开头命名，如 `handleClick`、`handleMouseEnter` 等。

## 👆 添加事件处理函数的方法

### 1. 组件内部定义函数
```jsx
function Button() {
  function handleClick() {
    alert('按钮被点击了！');
  }

  return <button onClick={handleClick}>点击我</button>;
}
```

### 2. 使用内联匿名函数
```jsx
function Button() {
  return (
    <button onClick={function handleClick() {
      alert('按钮被点击了！');
    }}>
      点击我
    </button>
  );
}
```

### 3. 使用箭头函数（更简洁）
```jsx
function Button() {
  return (
    <button onClick={() => {
      alert('按钮被点击了！');
    }}>
      点击我
    </button>
  );
}
```

## ⚠️ 常见陷阱：传递与调用

- **正确方式：传递函数引用** ✅
  ```jsx
  <button onClick={handleClick}>点击我</button>
  ```

- **错误方式：立即调用函数** ❌
  ```jsx
  <button onClick={handleClick()}>点击我</button>
  ```
  这会在渲染时立即执行函数，而不是等待点击事件！

## 🔄 在事件处理函数中读取 Props

- 由于事件处理函数声明在组件内部，它们可以访问组件的 props。
  ```jsx
  function AlertButton({ message, children }) {
    return (
      <button onClick={() => alert(message)}>
        {children}
      </button>
    );
  }
  ```

## 📤 将事件处理函数作为 Props 传递

- 父组件可以定义事件处理逻辑，并通过 props 传递给子组件。
  ```jsx
  function ParentComponent() {
    function handleClick() {
      alert('按钮被点击了！');
    }
    
    return <ChildButton onClick={handleClick} />;
  }
  
  function ChildButton({ onClick }) {
    return <button onClick={onClick}>点击我</button>;
  }
  ```

## 🔤 命名事件处理函数 Props

- 可以使用任何适合你应用程序的名称为事件处理函数的 props 命名。
- 通用组件通常使用与浏览器事件相同的命名（如 `onClick`）。
- 特定业务组件可使用更具体的名称（如 `onUpload`、`onDelete` 等）。

## 🌊 事件传播（冒泡）

- React 事件会向上传播（冒泡）到父元素，除非被停止。
- 当子元素触发事件时，父元素上对应的事件处理函数也会被触发。
  ```jsx
  <div onClick={() => alert('父元素被点击')}>
    <button onClick={() => alert('按钮被点击')}>
      点击我
    </button>
  </div>
  ```
  点击按钮会先显示"按钮被点击"，然后显示"父元素被点击"。

## 🛑 阻止事件传播

- 使用 `e.stopPropagation()` 阻止事件继续传播到父元素。
  ```jsx
  function Button() {
    return (
      <button onClick={(e) => {
        e.stopPropagation();
        alert('仅按钮被点击');
      }}>
        点击我
      </button>
    );
  }
  ```

## 🔍 捕获阶段事件

- 通过在事件名称末尾添加 `Capture` 来捕获下行阶段的事件（如 `onClickCapture`）。
- 事件传播的三个阶段：
  1. **向下**传播 - 触发所有 `onClickCapture` 处理函数
  2. **目标元素** - 执行被点击元素的 `onClick` 处理函数
  3. **向上**传播 - 触发所有父元素的 `onClick` 处理函数

## 🚫 阻止默认行为

- 某些浏览器事件有默认行为（如表单提交会刷新页面）。
- 使用 `e.preventDefault()` 阻止默认行为。
  ```jsx
  function Form() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        alert('表单提交，但页面不会刷新');
      }}>
        <input />
        <button>提交</button>
      </form>
    );
  }
  ```

## 🤔 `e.stopPropagation()` vs `e.preventDefault()`

- **`e.stopPropagation()`** - 阻止事件冒泡到父元素。
- **`e.preventDefault()`** - 阻止元素的默认浏览器行为（如链接跳转、表单提交等）。

## 🔄 事件处理函数与副作用

- 事件处理函数是**执行副作用的理想位置**。
- 不像渲染函数需要是纯函数，事件处理函数可以自由地修改状态、发送请求等。

## 📝 总结

- 🎯 事件处理函数通过 `onClick={handleClick}` 形式传递给元素。
- ⚠️ 必须传递函数引用，而非调用结果 - `onClick={handleClick}` 而非 `onClick={handleClick()}`。
- 📦 事件处理函数可以独立定义或内联编写。
- 🔄 事件处理函数可以访问组件的 props。
- 📤 可以从父组件向子组件传递事件处理函数。
- 🌊 事件会向上冒泡 - 使用 `e.stopPropagation()` 阻止冒泡。
- 🚫 使用 `e.preventDefault()` 阻止默认浏览器行为。
- 🧩 事件处理函数是执行副作用的理想位置。

> 参考：[React官方文档-响应事件](https://zh-hans.react.dev/learn/responding-to-events) 