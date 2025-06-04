# 使用Context深层传递参数

## 🌟 Context的本质

### 💡 基本概念
- 🚀 **特殊功能**：让父组件向其下层组件树提供数据
- 🧠 **无需props**：跳过中间组件，直接传递数据
- 🔮 **解决问题**：避免"props逐级透传"的繁琐

## 🤔 为什么需要Context？

### 📊 传统的Props传递问题
- 🔄 **逐级透传（Prop Drilling）**：通过很多不使用该数据的中间组件传递props
- 🧩 **代码冗长**：需要在组件树的每一层都定义和传递相同的props
- 📉 **可维护性差**：修改数据结构时需要更新整个传递链路

```jsx
// 🔴 props逐级透传示例
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} />; // Layout不需要theme，但必须传递
}

function Layout({ theme }) {
  return <Sidebar theme={theme} />; // Sidebar不需要theme，但必须传递
}

function Sidebar({ theme }) {
  return <ThemeButton theme={theme} />; // 终于到达真正使用theme的组件
}
```

## 🛠️ 使用Context的三步骤

### 1️⃣ 创建Context
```jsx
// 创建一个Context对象
import { createContext } from 'react';

// 可以为Context设置一个默认值
export const ThemeContext = createContext('light');
```

### 2️⃣ 使用Context（消费）
```jsx
// 在需要使用Context的组件中
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemedButton() {
  // 使用useContext Hook读取上下文
  const theme = useContext(ThemeContext);
  
  return (
    <button 
      style={{ 
        background: theme === 'dark' ? 'black' : 'white',
        color: theme === 'dark' ? 'white' : 'black',
      }}
    >
      我使用了主题色！
    </button>
  );
}
```

### 3️⃣ 提供Context（Provider）
```jsx
// 在组件树的上层组件中
import { ThemeContext } from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    // Provider包裹的所有子组件都能访问到value值
    <ThemeContext.Provider value={theme}>
      <Page />
      <ThemedButton onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}>
        切换主题
      </ThemedButton>
    </ThemeContext.Provider>
  );
}
```

## 🔄 Context的工作原理

### 🔍 数据流动规则
- 🌳 **向下传递**：Context只能从上到下传递数据
- 🔍 **就近原则**：组件会使用树中最近的Provider提供的值
- 🧩 **穿透性**：Context会穿过中间的任何组件，无视层级深度
- 🔁 **动态更新**：当Provider的value变化时，所有消费该Context的组件都会重新渲染

```jsx
// Context会穿过任何中间组件
function Page() {
  // 这里没有使用theme
  return <Content />;
}

function Content() {
  // 这里也没有使用theme
  return <Sidebar />;
}

function Sidebar() {
  // 这里直接使用Context，无需从props获取
  const theme = useContext(ThemeContext);
  return <ThemedButton />;
}
```

## 🧩 在同一组件中使用并提供Context

### 💫 嵌套使用
```jsx
function MyComponent() {
  // 1. 使用上层的Context
  const theme = useContext(ThemeContext);
  
  // 2. 提供新的Context给下层组件
  return (
    <UserContext.Provider value={currentUser}>
      {/* 子组件可以使用UserContext和ThemeContext */}
      <UserPanel theme={theme} />
    </UserContext.Provider>
  );
}
```

## 📝 使用多个Context

### 🔄 互不干扰
```jsx
// 多个Context互相独立
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value="小明">
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Layout() {
  const theme = useContext(ThemeContext); // "dark"
  const user = useContext(UserContext);   // "小明"
  // ...
}
```

## ⚠️ Context使用前的思考

### 🤔 先考虑其他方案
1. 📦 **尝试普通的props传递**：对于不太深的组件树，props可能更清晰直观
2. 🧩 **抽象组件并传递JSX**：使用`children`或其他prop传递JSX内容
   ```jsx
   // ✅ 不用Context，使用组件组合
   <Layout>
     <Posts posts={posts} />
   </Layout>
   
   // 而不是
   // 🔴 避免无意义的props透传
   <Layout posts={posts} />
   ```

## 🎯 Context的常见使用场景

### 📋 适用情况
- 🎨 **主题切换**：深色/浅色模式等UI主题
- 👤 **用户信息**：当前登录用户的数据
- 🧭 **路由信息**：当前路由状态
- 🔧 **多语言**：国际化文本
- 📊 **状态管理**：与reducer结合使用管理复杂状态

```jsx
// 主题Context示例
export const ThemeContext = createContext('light');

// 用户Context示例
export const UserContext = createContext(null);

// 组合使用
function App() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={currentUser}>
        <Page />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
```

## 🚀 Context与状态结合

### 🔄 动态Context
- Context通常与state结合使用
- 传递state值和更新函数给下层组件
- 可以把reducer与context结合使用

```jsx
// 创建包含state和dispatch的Context
export const TodosContext = createContext(null);

function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);
  
  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      <TodoList />
      <AddTodo />
    </TodosContext.Provider>
  );
}

function AddTodo() {
  const { dispatch } = useContext(TodosContext);
  
  function handleAdd() {
    dispatch({ 
      type: 'added', 
      text: text 
    });
  }
  // ...
}
```

## 📝 总结

- 🌳 **Context作用**：允许父组件向深层组件提供数据，避免props逐级传递
- 🛠️ **使用步骤**：创建Context → 使用useContext消费 → 使用Provider提供
- 🧠 **适用场景**：主题、用户信息、全局状态等需要被多个组件使用的数据
- ⚠️ **谨慎使用**：过度使用Context会使组件复用性变差，数据流难以追踪
- 🔍 **权衡考虑**：在使用Context前先考虑props传递或组件组合等替代方案
- 🔄 **状态结合**：Context经常与useState或useReducer结合，实现全局状态管理

> 参考：[React官方文档-使用Context深层传递参数](https://zh-hans.react.dev/learn/passing-data-deeply-with-context) 