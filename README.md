# LiveBlog Sphere

LiveBlog Sphere 是一个以文章发布、内容浏览和多用户内容管理为核心的博客/内容社区项目，目前处于本地体验与产品重构阶段。

> **重要：当前 v0.3.1 仍是本地演示版本。** 固定验证码、管理员演示账号和浏览器本地数据仅用于 localhost 体验，不是正式身份认证或云端权限系统。不要部署到公网或存放真实客户资料。

## 当前版本与计划
- 已合并主分支版本：v0.3.0（本地演示登录、管理员工作区与文章数据安全修复）
- 当前开发版本：v0.3.1（首页交互修复与后台文章表格管理）
- 当前开发分支：`fix/v0.3.1-home-filters-admin-table`
- 正式云端后端：尚未完成接入

## 技术架构
- 前端：React 18、TypeScript、Vite、React Router
- UI：Tailwind CSS、shadcn/ui（Radix UI）
- 图标与动效：lucide-react、Framer Motion
- 数据访问：Repository 层
- 当前演示数据：浏览器 localStorage/sessionStorage
- 目标后端：Supabase Auth、PostgreSQL、Storage、RLS（尚未启用为正式数据源）

## 文档
- [技术架构](docs/ARCHITECTURE.md)
- [重构路线图](docs/REFACTOR-ROADMAP.md)
- [v0.3.1 体验修复需求](docs/REQUIREMENTS-v0.3.1-UX-ADMIN.md)
- [版本变更记录](docs/CHANGELOG.md)
- [本地演示登录说明](docs/LOCAL-DEMO-GUIDE.md)

## 环境要求与本地运行
建议 Node.js 22 LTS、npm 10+。

```bash
npm ci
npm run dev
```

Windows PowerShell 若 npm.ps1 被执行策略拦截，可运行：

```powershell
npm.cmd ci
npm.cmd run dev
```

按终端输出打开本地地址，通常为 http://localhost:5173。

## 本地演示账号
仅在 Vite 开发模式有效：
- 普通用户：13800138000，验证码 123456
- 管理员：admin，密码 AdminDemo@123

数据保存在当前浏览器；清理站点数据会清除演示数据。

## 常用命令
```bash
npm ci
npm test
npm run build
npm run lint
npm run dev
```

## 目录结构
- `src/pages/`：页面
- `src/components/`：通用组件
- `src/components/home/`：首页组件
- `src/contexts/`：认证和主题上下文
- `src/repositories/`：数据访问层
- `src/lib/`：基础工具和数据逻辑
- `src/integrations/`：外部服务集成
- `tests/`：自动化测试
- `docs/`：需求、架构、路线图和变更记录

## 数据与安全边界
- 本地演示数据不在云端，不同设备不共享。
- Supabase 目标项目 ref：`wkywjpjfhpyxffsmmgka`；正式接入前必须核查 schema、Auth、RLS 和 Storage。
- MongoDB Atlas 暂不作为文章/用户的重复数据源。
- Supabase service_role key 不得提交到 Git 或放入浏览器端。
- 当前文章删除操作为本地永久删除；因数据模型尚无软删除字段，暂不提供回收站/恢复功能。

## 提交与 PR 规范
采用 Conventional Commits：
- `feat(scope): ...` 新功能
- `fix(scope): ...` Bug 修复
- `refactor(scope): ...` 重构
- `docs(scope): ...` 文档
- `test(scope): ...` 测试
- `chore(scope): ...` 工程维护

每个 PR 必须说明：开发内容、修复的 Bug 与复现方式、修改文件、数据结构影响、实际测试结果、未完成事项/风险、本地验证步骤。每次代码变更同步更新 `docs/CHANGELOG.md`。不得只推送代码而不说明变更。

## 版本流程
1. 在独立分支开发。
2. 执行测试、构建和 lint，并如实记录结果。
3. 创建中文 Draft PR，列明开发、修复、测试和风险。
4. 本地体验与评审通过后再标记 Ready for review。
5. 未经项目负责人确认，不合并到 main。
