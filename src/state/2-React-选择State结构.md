# 🏗️ React：选择State结构

## 🌟 构建State的原则

### 🧠 好的State结构的重要性
- 🎯 **核心目标**：使状态易于更新而不引入错误
- 🧩 **设计思路**：尽可能简单，但不要过于简单
- 🛠️ **影响范围**：状态结构会影响组件的可维护性和调试难度

## 🔍 五大原则指南

### 1️⃣ 合并关联的状态
- 🔄 **识别标志**：两个状态变量总是一起更新
- 🧩 **解决方案**：将多个相关状态合并为一个对象或数组
- 🌟 **适用场景**：坐标位置(x,y)、表单的多个字段

```jsx
// ❌ 分离的关联状态
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// ✅ 合并为一个状态对象
const [position, setPosition] = useState({ x: 0, y: 0 });

// 更新合并状态
setPosition({ x: 100, y: 100 });
// 部分更新，记得使用展开语法
setPosition({ ...position, x: 100 });
```

### 2️⃣ 避免状态矛盾
- ⚠️ **潜在问题**：多个状态变量可能产生互相矛盾的值
- 🧠 **解决方案**：使用一个状态变量表示所有可能的情况
- 🎭 **典型例子**：使用一个status字段代替多个布尔值

```jsx
// ❌ 可能产生矛盾的状态
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);

// ✅ 使用一个status状态避免矛盾
const [status, setStatus] = useState('typing'); // 'typing', 'sending', 'sent'
```

### 3️⃣ 避免冗余状态
- 🔍 **关键问题**：是否可以从现有props或state计算出来？
- 🧮 **解决方案**：在渲染期间计算派生值，而不是存储
- 🚫 **避免存储**：从props派生的状态、可计算的列表属性等

```jsx
// ❌ 冗余状态
const [items, setItems] = useState(initialItems);
const [selectedItem, setSelectedItem] = useState(items[0]);

// ✅ 通过ID引用保持同步
const [items, setItems] = useState(initialItems);
const [selectedId, setSelectedId] = useState(items[0].id);

// 在渲染时计算派生值
const selectedItem = items.find(item => item.id === selectedId);
```

### 4️⃣ 避免状态重复
- 🔄 **重复问题**：同一数据在多个状态变量或嵌套对象中出现
- 🧠 **解决方案**：选择一个数据源作为"可信来源"
- 🌟 **最佳实践**：按ID引用对象，而非存储完整对象副本

```jsx
// ❌ 存储完整对象，导致重复
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);

// ✅ 只存储ID，避免重复
const [users, setUsers] = useState([]);
const [selectedUserId, setSelectedUserId] = useState(null);

// 在需要时通过ID查找完整对象
const selectedUser = users.find(user => user.id === selectedUserId);
```

### 5️⃣ 避免深度嵌套状态
- 🪆 **嵌套问题**：多层嵌套的状态难以更新和维护
- 📊 **解决方案**：将状态展平（扁平化/规范化）
- 🗂️ **推荐结构**：使用ID作为键的对象映射表

```jsx
// ❌ 深度嵌套的状态
const [nestedData, setNestedData] = useState({
  regions: {
    china: {
      cities: {
        beijing: { population: 21540000 },
        shanghai: { population: 24870000 }
      }
    }
  }
});

// ✅ 扁平化/规范化的状态
const [data, setData] = useState({
  regions: { 1: { name: 'china', cityIds: [101, 102] }},
  cities: {
    101: { id: 101, name: 'beijing', population: 21540000 },
    102: { id: 102, name: 'shanghai', population: 24870000 }
  }
});
```

## 🚀 实际案例分析

### 🧩 扁平化复杂嵌套结构
- 📊 **场景**：具有多层级的地点树形结构
- 🛠️ **解决方案**：使用"表"对象存储所有项，用ID相互引用
- 🔑 **优势**：更新操作更简单，不需要深层复制

```jsx
// 扁平化的数据结构示例
const placesById = {
  0: { id: 0, title: '地球', childIds: [1, 2, 3] },
  1: { id: 1, title: '亚洲', childIds: [4, 5] },
  4: { id: 4, title: '中国', childIds: [] },
  5: { id: 5, title: '日本', childIds: [] },
  // ...更多地点
};

// 更新嵌套项变得简单
function handleComplete(parentId, childId) {
  // 创建父项的新版本，过滤掉要删除的子项ID
  const nextParent = {
    ...placesById[parentId],
    childIds: placesById[parentId].childIds.filter(id => id !== childId)
  };
  
  // 更新根状态
  setPlacesById({
    ...placesById,
    [parentId]: nextParent
  });
}
```

## 🌟 配合Immer简化更新

### 🛠️ 使用Immer处理复杂状态
- 🔍 **问题**：即使使用扁平化状态，更新逻辑仍可能复杂
- 🧰 **工具**：Immer库可以让你使用简洁的可变语法编写不可变更新
- 🚀 **优势**：代码更简洁，更易于理解

```jsx
// 使用Immer简化更新
import { useImmer } from 'use-immer';

// 替代useState
const [places, updatePlaces] = useImmer(initialPlaces);

// 更简洁的更新逻辑
function handleComplete(parentId, childId) {
  updatePlaces(draft => {
    // 可以直接"修改" draft
    const parent = draft[parentId];
    parent.childIds = parent.childIds.filter(id => id !== childId);
  });
}
```

## 📝 总结

- 🧩 **合并关联状态**：相关的状态变量应合并为一个对象或数组
- ⚖️ **避免矛盾状态**：用单一状态变量表示互斥的UI状态
- 🧮 **避免冗余状态**：能从props或state计算出的值不要存入state
- 🔄 **避免重复状态**：同一数据不应在多处存储，应有唯一数据源
- 📊 **避免深度嵌套**：将复杂状态扁平化，使用ID相互引用
- 🛠️ **使用辅助工具**：考虑使用Immer等库简化复杂状态的更新逻辑

> 参考：[React官方文档-选择State结构](https://zh-hans.react.dev/learn/choosing-the-state-structure) 