# LiveBlog Sphere 技术架构说明

> 当前状态：本地演示版（v0.3.0）；目标云端架构尚未完成接入。

## 1. 技术栈

| 层 | 技术 | 用途 |
|---|---|---|
| UI | React 18 + TypeScript | 页面与组件 |
| 构建 | Vite | 开发服务器、打包 |
| 路由 | React Router | 页面路由 |
| 样式 | Tailwind CSS + shadcn/ui | 样式与基础交互组件 |
| 图标 | lucide-react | 图标 |
| 动效 | Framer Motion | 页面动效 |
| 本地数据 | Repository / localStorage | 当前演示文章和用户数据 |
| 目标认证 | Supabase Auth Phone OTP | 正式手机号认证（未完成） |
| 目标数据库 | Supabase PostgreSQL + RLS | 正式业务数据（未完成） |
| 目标文件存储 | Supabase Storage | 正式媒体存储（未完成） |

## 2. 当前运行架构

浏览器 -> React 页面/组件 -> Repository -> localStorage/sessionStorage。

本地演示登录凭据只用于 Vite DEV 环境。固定验证码和管理员演示密码不是安全认证，不得部署到公网，不得存储真实客户数据。

## 3. 主要目录

- `src/pages/`：路由页面。
- `src/components/`：可复用 UI 组件。
- `src/components/home/`：首页 Banner、Sidebar、PostList。
- `src/contexts/`：认证与主题上下文。
- `src/repositories/`：文章、用户等数据访问封装。
- `src/lib/`：基础数据与工具。
- `src/integrations/supabase/`：Supabase 客户端集成代码（当前不是本地演示模式的权威数据源）。
- `tests/`：自动化测试。
- `docs/`：需求、架构、路线图和变更记录。

## 4. 目标云端架构

浏览器 -> React UI -> Repository/Data Adapter -> Supabase JS SDK -> Supabase Auth / PostgreSQL / Storage。

- 身份主键使用 `auth.users.id`。
- `public.profiles.id` 与 Auth user UUID 一致。
- 文章、评论、互动等业务实体只以 Supabase PostgreSQL 为唯一权威数据源。
- RLS 负责数据行级授权；前端角色仅用于显示，不能作为安全边界。
- Supabase 项目 ref：`wkywjpjfhpyxffsmmgka`。
- MongoDB Atlas 暂不作为重复业务数据源。

## 5. 目标权限模型

- user：创建、发布、编辑、删除自己的文章。
- editor：按最终策略管理全站文章。
- admin：全站内容和用户管理。
- 新用户默认 user；客户端不可自行提升角色。
- 所有权限需在数据库 RLS/受信任服务端校验。

## 6. 环境变量与密钥

- 浏览器只允许使用 Supabase project URL 和 publishable/anon key。
- service_role key 只能留在受信任服务端/密钥管理器，绝不能写入 Vite 客户端或 Git。
- 真实项目配置必须通过本地 `.env.local`，并确保 gitignore 排除。
- 提交 `.env.example` 只包含变量名和占位说明，不包含真实密钥。

## 7. 开发质量门禁

每个 PR 至少执行：
```bash
npm ci
npm test
npm run build
npm run lint
```
如 lint 有历史错误，必须记录基线，确保本次没有新增错误，并逐步清理。
