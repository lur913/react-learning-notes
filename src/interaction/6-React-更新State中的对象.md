# 🔄 React 更新 State 中的对象

## 🚫 状态不可变原则

在React中，**状态(State)应被视为不可变的(immutable)**：
- 🧊 即使对象在技术上是可变的，也应将state中的对象视为只读
- ⚠️ 直接修改state中的对象不会触发重新渲染
- 🆕 应创建新对象替代修改现有对象

## ❌ 错误的更新方式：直接修改

```jsx
// ❌ 错误方式：直接修改state对象
function handleClick() {
  position.x = 100; // 直接修改state
  position.y = 100; // React不会知道需要重新渲染
}
```

直接修改问题：
- 🔄 不会触发组件重新渲染
- 🧩 破坏状态历史记录（之前渲染的"快照"）
- 🐞 导致难以调试的问题

## ✅ 正确的更新方式：替换对象

```jsx
// ✅ 正确方式：创建新对象并用setState更新
function handleClick() {
  setPosition({
    x: 100,
    y: 100
  }); // 完全替换对象，触发重新渲染
}
```

## 📋 使用展开语法复制对象

当你只想更新对象的部分属性，同时保留其他属性不变时，可以使用**展开语法**：

```jsx
// 只更新firstName，保留其他属性
setPerson({
  ...person, // 复制所有现有属性
  firstName: 'Jane' // 覆盖特定属性
});
```

## 🧠 记住你的展开语法

两种常用展开位置：

```jsx
// 在开头添加属性
setConfig({
  ...config,
  darkMode: true
});

// 在末尾添加属性
setConfig({
  darkMode: true,
  ...config
});
```

⚠️ 如果对象中有同名属性，**后面的会覆盖前面的**。

## 🔄 更新嵌套对象

嵌套对象需要特别小心处理：

```jsx
const person = {
  name: 'Niki',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg'
  }
};
```

要更新`city`属性，需要创建从修改位置开始的所有对象副本：

```jsx
setPerson({
  ...person, // 复制最外层对象
  artwork: {  // 替换artwork对象
    ...person.artwork, // 复制现有artwork属性
    city: 'New Delhi' // 仅覆盖city
  }
});
```

## 🌲 嵌套更深的对象

更新嵌套很深的对象会变得冗长：

```jsx
const nestedObj = {
  a: {
    b: {
      c: {
        d: {
          value: 5
        }
      }
    }
  }
};

// 更新value属性
setNestedObj({
  ...nestedObj,
  a: {
    ...nestedObj.a,
    b: {
      ...nestedObj.a.b,
      c: {
        ...nestedObj.a.b.c,
        d: {
          ...nestedObj.a.b.c.d,
          value: 10
        }
      }
    }
  }
});
```

## 🧰 使用Immer简化对象更新 

**Immer**库可以大幅简化不可变对象更新逻辑：

1. 安装Immer：`npm install use-immer`
2. 导入：`import { useImmer } from 'use-immer'`
3. 将`useState`替换为`useImmer`

```jsx
import { useImmer } from 'use-immer';

function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg'
    }
  });

  function handleCityChange(e) {
    updatePerson(draft => {
      // 可以直接"修改" draft对象
      draft.artwork.city = e.target.value;
    });
  }
  
  // ...
}
```

Immer的优势：
- 📝 代码更简洁，尤其对嵌套对象
- 🛡️ 内部会确保正确创建新对象，而非修改现有对象
- 🎯 允许使用熟悉的可变操作语法，但实际是不可变更新

## 🤔 为何不推荐直接修改state对象？

不直接修改state对象的理由：
- 🐞 **调试更容易**：历史状态保持不变，不会被新状态覆盖
- 🚀 **性能优化**：依赖引用相等检查的优化策略可以正常工作
- 🔄 **新功能兼容**：未来React特性依赖于状态不可变性
- ↩️ **撤销/重做**：保留历史状态副本使实现这类功能更简单
- 🧩 **实现更简单**：不需要对象代理或其他复杂机制

## 📝 总结

- 🧊 将React中的所有state视为不可修改的
- 🔄 在state中存储对象时，修改它们不会触发重新渲染且会改变"快照"
- 🆕 创建新对象替代修改，通过setState触发渲染
- 📋 使用`{...obj, prop: newValue}`展开语法创建对象副本
- ⚠️ 展开语法是浅拷贝，只复制一层
- 🌲 更新嵌套对象需要沿路径创建每一层的副本
- 🧰 使用Immer库可以大幅简化复杂的不可变更新

> 参考：[React官方文档-更新state中的对象](https://zh-hans.react.dev/learn/updating-objects-in-state) 