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
function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);
  
  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
  
  return (
    <>
      <button onClick={handleScrollToFirstCat}>滚动到Neo</button>
      {/* 其他按钮... */}
      <div>
        <ul>
          <li>
            <img ref={firstCatRef} src="..." alt="Neo" />
          </li>
          {/* 其他图片... */}
        </ul>
      </div>
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

## 🔄 管理动态ref列表

### 🧩 使用ref回调处理列表项
当需要为列表中的每一项都绑定ref，但不知道会有多少项时，可以使用ref回调：

```jsx
function CatFriends() {
  // 存储所有列表项的ref映射
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState([...]);
  
  function getMap() {
    if (!itemsRef.current) {
      // 首次运行时初始化Map
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }
  
  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
  
  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        {/* 其他按钮... */}
      </nav>
      <ul>
        {catList.map(cat => (
          <li
            key={cat}
            ref={(node) => {
              // 将DOM节点存储在Map中
              const map = getMap();
              if (node) {
                map.set(cat, node);
              } else {
                map.delete(cat);
              }
            }}
          >
            <img src={cat} />
          </li>
        ))}
      </ul>
    </>
  );
}
```

> ⚠️ 注意：在React严格模式下，ref回调会被调用两次，这有助于发现内存泄漏问题。

## 🧠 访问其他组件的DOM节点

### ⚠️ 陷阱
Ref是一个脱围机制。手动操作其他组件的DOM节点可能会让代码变得脆弱。

### 🔍 将ref传递给子组件
默认情况下，组件不会暴露其内部DOM节点的引用。但有时需要访问子组件中的DOM节点，例如让输入框获得焦点。

可以像传递其他prop一样将ref从父组件传递给子组件：

```jsx
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function Form() {
  const inputRef = useRef(null);
  
  function handleClick() {
    inputRef.current.focus();
  }
  
  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
```

在上面的例子中，`Form`组件创建了一个ref并传递给`MyInput`组件。`MyInput`组件将这个ref传递给`<input>`DOM元素。这样，`Form`组件就可以访问到`<input>`DOM节点并调用`focus()`方法。

### 🛡️ 使用useImperativeHandle限制暴露的API
有时你可能希望限制父组件对子组件DOM节点的访问权限，只暴露特定功能：

```jsx
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  
  // 只暴露特定方法给父组件
  useImperativeHandle(ref, () => ({
    // 只暴露focus方法，不暴露整个DOM节点
    focus() {
      realInputRef.current.focus();
    }
  }));
  
  return <input ref={realInputRef} />;
}

function Form() {
  const inputRef = useRef(null);
  
  function handleClick() {
    // 只能调用focus()，无法访问其他DOM属性
    inputRef.current.focus();
  }
  
  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
```

在这个例子中，`MyInput`组件中的`realInputRef`保存了实际的input DOM节点。而`useImperativeHandle`指示React将你自己指定的对象作为父组件的ref值。这样，`Form`组件内的`inputRef.current`将只有`focus`方法，而不是整个DOM节点。

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

### 📦 使用flushSync同步更新DOM
当需要在状态更新后立即操作DOM时，可以使用`flushSync`：

```jsx
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

function TodoList() {
  const listRef = useRef(null);
  const [todos, setTodos] = useState([...]);
  
  function handleAddTodo() {
    const newTodo = { id: nextId++, text: '新待办事项' };
    
    // 使用flushSync确保DOM立即更新
    flushSync(() => {
      setTodos([...todos, newTodo]);
    });
    
    // 此时DOM已更新，可以安全滚动到新添加的项
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

```jsx
// ❌ 危险操作示例
function DangerousExample() {
  const divRef = useRef(null);
  
  function handleClick() {
    // 直接修改DOM会导致与React状态不同步
    divRef.current.remove(); // 危险！
    
    // 之后如果React尝试更新这个元素，会导致错误
  }
  
  return (
    <>
      <button onClick={handleClick}>删除元素</button>
      <div ref={divRef}>这个元素会被直接从DOM中移除</div>
    </>
  );
}
```

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
- 🔄 **组件传递ref**：可以像传递普通prop一样传递ref给子组件
- 🛡️ **限制访问**：使用`useImperativeHandle`控制暴露的API
- 📋 **动态列表**：使用ref回调处理多个列表项的引用
- ⏱️ **更新时机**：在提交阶段后设置refs，不在渲染期间访问
- 🔄 **同步DOM**：使用`flushSync`确保状态更新后立即更新DOM
- ⚠️ **安全使用**：只进行非破坏性操作，不修改React管理的DOM结构

> 参考：[React官方文档-使用ref操作DOM](https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs) 