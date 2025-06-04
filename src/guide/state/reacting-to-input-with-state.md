# 用State响应输入

## 🌟 声明式UI vs 命令式UI

### 🔄 两种编程范式的对比
- 🤖 **命令式编程**：直接操作UI元素，告诉计算机**如何**更新界面
  ```js
  // 命令式示例
  button.disabled = true;
  loadingMessage.style.display = 'block';
  errorMessage.style.display = 'none';
  ```
- 🧩 **声明式编程**：描述UI在不同状态下应该是什么样子，让React来决定如何更新
  ```jsx
  // 声明式示例
  return (
    <button disabled={isLoading}>
      {isLoading ? '加载中...' : '提交'}
    </button>
  );
  ```

### 🚕 形象类比
- 🚗 **命令式**：像给司机指路"往前100米右转，然后第二个路口左转..."
- 🗺️ **声明式**：告诉出租车司机"我要去购物中心"，由他决定如何到达

## 🧠 声明式思考UI的方法

### 🔍 五步法构建响应式UI
1. 🔎 **定位不同视图状态**：识别组件可能处于的所有可能状态
2. 🔄 **确定状态触发因素**：什么用户操作或事件会导致状态变化？
3. 💾 **在内存中表示状态**：使用useState定义必要的状态变量
4. 🧹 **删除不必要的状态**：移除冗余和可计算的状态
5. 🔌 **连接事件处理函数**：实现状态更新逻辑

## 🛠️ 步骤详解

### 1️⃣ 定位不同视图状态
- 📋 **罗列所有可能状态**：
  - 🖋️ **输入中**：显示空表单
  - ⏳ **提交中**：表单禁用，显示加载中
  - ✅ **成功时**：显示成功消息
  - ❌ **错误时**：显示错误消息和可编辑表单

```jsx
// 声明式方式的状态处理
if (status === 'success') {
  return <h1>提交成功！</h1>;
}

return (
  <form>
    {status === 'error' && <p className="error">{error.message}</p>}
    <textarea disabled={status === 'submitting'} />
    <button disabled={status === 'submitting' || answer.length === 0}>
      提交
    </button>
    {status === 'submitting' && <p>提交中...</p>}
  </form>
);
```

### 2️⃣ 确定状态触发因素
- 👆 **用户交互**：
  - 输入文本 → 表单从空变为非空
  - 点击提交 → 状态变为"提交中"
  - 网络请求成功 → 状态变为"成功"
  - 网络请求失败 → 状态变为"错误"

### 3️⃣ 使用useState表示状态
```jsx
// 定义必要的状态变量
const [answer, setAnswer] = useState('');      // 用户输入
const [error, setError] = useState(null);      // 错误信息
const [status, setStatus] = useState('typing'); // 当前状态：'typing', 'submitting', 'success'
```

### 4️⃣ 移除冗余状态
- ❓ **检查每个状态是否必要**：
  - ❌ 不要同时使用`isEmpty`和`isTyping`（互斥）
  - ❌ 不要同时使用`isError`和`error`（可通过`error !== null`判断）
  - ✅ 用一个`status`变量代替多个布尔状态

```jsx
// ❌ 冗余状态
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);

// ✅ 优化后
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', 'success'
```

### 5️⃣ 实现事件处理函数
```jsx
// 处理表单提交
async function handleSubmit(e) {
  e.preventDefault();
  setStatus('submitting');
  
  try {
    await submitForm(answer);
    setStatus('success');
  } catch (err) {
    setStatus('typing');
    setError(err);
  }
}

// 处理输入变化
function handleTextareaChange(e) {
  setAnswer(e.target.value);
}
```

## 🔍 完整示例：表单提交流程

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>答案正确！</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={answer}
        onChange={handleTextareaChange}
        disabled={status === 'submitting'}
      />
      <br />
      <button disabled={
        answer.length === 0 ||
        status === 'submitting'
      }>
        提交
      </button>
      {error !== null &&
        <p className="Error">
          {error.message}
        </p>
      }
    </form>
  );
}
```

## 🌟 使用Reducer优化复杂状态

### 🧩 Reducer的优势
- 📊 **集中管理**：将所有状态更新逻辑集中在一个地方
- 🚫 **避免不一致**：减少状态组合中的"不可能状态"

```jsx
// 使用reducer管理表单状态
function formReducer(state, action) {
  switch (action.type) {
    case 'START_SUBMITTING':
      return { ...state, status: 'submitting' };
    case 'SUBMISSION_SUCCESS':
      return { ...state, status: 'success' };
    case 'SUBMISSION_ERROR':
      return { 
        ...state, 
        status: 'typing', 
        error: action.error 
      };
    case 'UPDATE_ANSWER':
      return { 
        ...state, 
        answer: action.answer 
      };
    default:
      return state;
  }
}
```

## 📝 总结

- 🎭 **声明式vs命令式**：React使用声明式编程，描述UI应该是什么样子，而非如何修改
- 🧩 **状态驱动UI**：将UI视为不同状态的集合，使用state控制当前显示哪个状态
- 🔄 **单向数据流**：状态变化→重新渲染→显示新UI，形成可预测的数据流
- 🧠 **思考方式**：先识别所有UI状态，然后编写代码使UI能够在这些状态间转换
- 🛠️ **最小状态原则**：只保留必要的状态变量，删除可以从其他状态计算出的变量

> 参考：[React官方文档-用State响应输入](https://zh-hans.react.dev/learn/reacting-to-input-with-state) 