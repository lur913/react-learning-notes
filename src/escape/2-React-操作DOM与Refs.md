# 🎯 React：使用ref操作DOM

## 🌟 什么是DOM Refs？

### 💡 基本概念
- 🔮 **Refs是脱围机制**：让你"跳出"React的声明式更新
- 🎯 **访问DOM节点**：获取由React渲染的真实DOM元素引用
- 🧩 **用途**：访问浏览器DOM API，如聚焦、滚动、测量等

## 📝 创建和使用DOM Refs的三个步骤

### 1️⃣ 引入并创建ref
```jsx
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(null); // 初始值为null
  // ...
}
```

### 2️⃣ 将ref连接到DOM元素
```jsx
<div ref={myRef}>内容</div>
```

### 3️⃣ 访问和操作DOM节点
```jsx
function handleButtonClick() {
  // 通过.current属性访问DOM节点
  myRef.current.scrollIntoView();
  // 使用任何浏览器DOM API
  myRef.current.focus();
  myRef.current.style.opacity = 0.5;
}
```

## 🚀 常见使用场景

### 🔍 聚焦输入框
```jsx
function Form() {
  const inputRef = useRef(null);
  
  function handleClick() {
    // 使输入框获得焦点
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

### 📜 滚动到特定元素
```jsx
function ScrollExample() {
  const listRef = useRef(null);
  
  function scrollToTop() {
    listRef.current.scrollTop = 0;
  }
  
  function scrollToBottom() {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
  
  return (
    <>
      <button onClick={scrollToTop}>滚动到顶部</button>
      <button onClick={scrollToBottom}>滚动到底部</button>
      <ul ref={listRef}>
        {/* 列表项 */}
      </ul>
    </>
  );
}
```

### 🎬 控制媒体播放
```jsx
function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  function handlePlayPause() {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
  
  return (
    <>
      <button onClick={handlePlayPause}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <video ref={videoRef} src="/video.mp4" />
    </>
  );
}
```

## 🧠 访问其他组件的DOM节点

### 🔀 React.forwardRef
组件默认不暴露其DOM节点。要访问子组件中的DOM节点，子组件需要:
1. 使用`forwardRef`包装
2. 将收到的ref转发到特定DOM元素

```jsx
// MyInput组件转发ref到内部的input元素
const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// 父组件可以访问MyInput内部的input DOM节点
function Form() {
  const inputRef = useRef(null);
  
  function handleClick() {
    inputRef.current.focus();
  }
  
  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦</button>
    </>
  );
}
```

## ⏱️ React何时设置refs

### 🔄 Ref的更新时机
- 🏗️ **提交阶段**：在DOM更新完成后设置ref.current
- 🧩 **渲染和提交**：先完成渲染、更新DOM，然后设置ref
- ⚠️ **不在渲染期间访问**：渲染函数中不应读取或写入ref.current

```jsx
// 在提交阶段结束后，ref.current包含DOM节点引用
useEffect(() => {
  // 这里可以安全地访问ref.current
  console.log(myRef.current.offsetHeight);
}, []);
```

## 🔄 结合state与refs进行DOM操作

### 📦 滚动到新添加的项目
```jsx
function TodoList() {
  const listRef = useRef(null);
  const [todos, setTodos] = useState([]);
  
  function handleAddTodo() {
    const newTodo = { id: nextId++, text: '新待办事项' };
    // 使用flushSync确保DOM更新后再访问
    flushSync(() => {
      setTodos([...todos, newTodo]);
    });
    // 此时DOM已更新，可以安全滚动
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth'
    });
  }
  
  return (
    <>
      <button onClick={handleAddTodo}>添加</button>
      <ul ref={listRef}>
        {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </>
  );
}
```

## ⚠️ 使用Refs操作DOM的注意事项

### 🛑 避免的操作
- 🚫 **不要修改React管理的DOM结构**：可能导致状态不一致
- 🚫 **不要添加/删除React管理的子元素**：会与React的渲染冲突
- 🚫 **不要修改内容**：优先使用state和props更新内容

### ✅ 安全的操作
- ✅ **聚焦/失焦**：`element.focus()`和`element.blur()`
- ✅ **滚动**：`element.scrollIntoView()`，`scrollTop`等
- ✅ **测量尺寸**：`getBoundingClientRect()`
- ✅ **播放/暂停**：媒体元素的`play()`和`pause()`
- ✅ **非破坏性样式调整**：动画、过渡等

```jsx
function SafeExample() {
  const divRef = useRef(null);
  
  // ✅ 安全的DOM操作
  function handleButtonClick() {
    // 测量
    const dimensions = divRef.current.getBoundingClientRect();
    console.log(dimensions);
    
    // 滚动
    divRef.current.scrollIntoView({ behavior: 'smooth' });
    
    // 动画
    divRef.current.style.transition = 'background-color 1s';
    divRef.current.style.backgroundColor = 'lightblue';
  }
  
  return (
    <>
      <button onClick={handleButtonClick}>安全操作</button>
      <div ref={divRef} style={{ height: '100px' }}>内容</div>
    </>
  );
}
```

## 📝 总结

- 🔮 **Refs作用**：访问React管理的DOM节点
- 🛠️ **基本用法**：`useRef` + `ref`属性连接DOM元素
- 🚪 **访问方式**：通过`ref.current`访问真实DOM节点
- 🔄 **组件转发**：使用`forwardRef`让组件转发ref到内部DOM
- ⚠️ **安全使用**：只进行非破坏性操作，不修改React管理的DOM结构
- 🔍 **常见场景**：聚焦、滚动、测量、媒体控制
- 📌 **时机**：在提交阶段后（如事件处理函数、useEffect中）访问refs

> 参考：[React官方文档-使用ref操作DOM](https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs) 