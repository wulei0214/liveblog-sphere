
/**
 * Vite配置文件
 * 
 * 定义项目的构建配置，包括插件、服务器设置和路径别名等
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 开发服务器配置
  server: {
    host: "::", // 监听所有地址
    port: 8080, // 服务端口
  },
  // 插件配置
  plugins: [
    react(), // React SWC编译插件
    // 仅在开发模式下启用组件标记器
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  // 路径解析配置
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 设置@别名指向src目录
    },
  },
}));
