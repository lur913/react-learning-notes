# 🔄 React 更新 State 中的数组

## 🚫 数组不可变原则

在React中，state中的数组也应当视为**不可变的(immutable)**：
- 🧊 即使JavaScript数组在技术上是可变的，也应将state中的数组视为只读
- ⚠️ 直接修改数组不会触发重新渲染
- 🆕 应创建新数组替代修改现有数组

## 📋 不可变更新操作对照表

| 操作目的 | ❌ 避免使用 (会修改原数组) | ✅ 推荐使用 (返回新数组) |
|----------|---------------------------|------------------------|
| 添加元素 | `push()`, `unshift()`     | `concat()`, 展开语法`[...arr]` |
| 删除元素 | `pop()`, `shift()`, `splice()` | `filter()`, `slice()` |
| 替换元素 | `splice()`, `arr[i] = ...` | `map()` |
| 排序     | `reverse()`, `sort()`     | 先复制数组，再排序 |

## ➕ 添加元素到数组

### ❌ 错误方式：直接修改

```jsx
// ❌ 不推荐：直接修改state数组
function handleClick() {
  artists.push({ id: nextId++, name: name });
  // 数组已修改，但React不知道需要重新渲染
}
```

### ✅ 正确方式：创建包含新元素的新数组

```jsx
// ✅ 推荐：创建新数组
function handleClick() {
  setArtists([
    ...artists, // 复制所有现有元素
    { id: nextId++, name: name } // 添加新元素
  ]);
}
```

### 📌 添加位置

- **添加到末尾**：`setItems([...items, newItem])`
- **添加到开头**：`setItems([newItem, ...items])`

## ➖ 从数组中删除元素

使用`filter()`方法创建不包含要删除元素的新数组：

```jsx
// 删除id为3的元素
function handleDeleteItem(id) {
  setArtists(artists.filter(artist => artist.id !== id));
}
```

`filter()`会创建一个新数组，其中只包含满足条件的元素。

## 🔄 转换数组

使用`map()`创建一个新数组，其中每个元素都经过转换：

```jsx
// 将每首诗歌转换为大写
function handlePoetryEdit() {
  setPoems(poems.map(poem => ({
    ...poem,
    content: poem.content.toUpperCase()
  })));
}
```

## 🔁 替换数组中的元素

也可以使用`map()`来替换特定元素，同时保持其他元素不变：

```jsx
// 将id为2的元素标记为已完成
function handleToggleComplete(id) {
  setTodos(todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  }));
}
```

## 📥 插入元素到数组中

要在数组中间插入元素，可以使用展开语法和`slice()`：

```jsx
// 在索引2处插入新元素
function handleInsert(index, newItem) {
  setItems([
    ...items.slice(0, index), // 复制前半部分
    newItem,                  // 插入新元素
    ...items.slice(index)     // 复制后半部分
  ]);
}
```

## 🔃 其它数组操作

对于排序和反转等操作，需先复制数组，再进行操作：

```jsx
// 正确方式：先复制，再排序
function handleSort() {
  const nextList = [...list]; // 创建数组副本
  nextList.sort(); // 排序副本
  setList(nextList); // 用新数组更新state
}
```

## 🧩 更新数组内部的对象

当数组中包含对象时，更新这些对象也需要保持不可变原则：

```jsx
// 更新数组中特定对象的属性
function handleArtworkSeen(artworkId, nextSeen) {
  setArtworks(artworks.map(artwork => {
    if (artwork.id === artworkId) {
      // 创建包含变更的新对象
      return { ...artwork, seen: nextSeen };
    } else {
      // 保持其他对象不变
      return artwork;
    }
  }));
}
```

## 🧰 使用Immer简化数组更新

**Immer**库可以大幅简化不可变数组更新逻辑：

1. 安装Immer：`npm install use-immer`
2. 导入：`import { useImmer } from 'use-immer'`
3. 将`useState`替换为`useImmer`

```jsx
import { useImmer } from 'use-immer';

function BucketList() {
  const [myList, updateMyList] = useImmer(initialList);
  
  function handleToggle(artworkId, nextSeen) {
    updateMyList(draft => {
      // 可以直接"修改" draft
      const artwork = draft.find(a => a.id === artworkId);
      artwork.seen = nextSeen;
    });
  }
}
```

Immer的优势：
- 📝 代码更简洁，可读性更好
- 🧠 可以使用熟悉的修改语法，如`push()`和`pop()`
- 🛡️ 内部确保创建新数组，维持不可变性

## 📊 常见数组操作示例

### 1️⃣ 添加元素
```jsx
// 在末尾添加
setArray([...array, newItem]);
// 在开头添加
setArray([newItem, ...array]);
```

### 2️⃣ 删除元素
```jsx
// 按索引删除
setArray(array.filter((_, index) => index !== indexToRemove));
// 按条件删除
setArray(array.filter(item => item.id !== idToRemove));
```

### 3️⃣ 更新元素
```jsx
// 更新特定索引的元素
setArray(array.map((item, index) => {
  if (index === indexToUpdate) {
    return newItem; // 替换整个元素
  } else {
    return item;
  }
}));

// 更新匹配条件的元素
setArray(array.map(item => {
  if (item.id === idToUpdate) {
    return { ...item, ...updatedFields }; // 更新特定字段
  } else {
    return item;
  }
}));
```

## 📝 总结

- 🧊 将React中的所有state数组视为不可修改的
- 🔄 不要使用`push()`、`pop()`等修改原数组的方法
- 🆕 创建新数组替代修改，通过setState触发渲染
- 📋 使用`map()`、`filter()`、`slice()`和展开语法创建数组副本
- 🧩 更新数组内的对象时也需保持不可变性
- 🧰 考虑使用Immer库简化深层嵌套数组的更新

> 参考：[React官方文档-更新state中的数组](https://zh-hans.react.dev/learn/updating-arrays-in-state) 