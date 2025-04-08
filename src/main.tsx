
/**
 * 应用程序入口文件
 * 
 * 负责初始化React应用，将根组件渲染到DOM中
 * 使用createRoot API来支持React 18的并发模式特性
 */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 创建React根组件并渲染应用
createRoot(document.getElementById("root")!).render(<App />);
