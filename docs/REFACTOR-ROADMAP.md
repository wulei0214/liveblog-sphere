# LiveBlog Sphere 重构实施路线图

> 文档版本：1.0.0  
> 对应项目：LiveBlog Sphere  
> 基准分支：main  
> 当前实施分支：refactor/v0.2.0-safe-sample-initialization  
> 目标：以不丢失现有内容为前提，将本地演示型博客逐步演进为支持多用户协作的云端内容社区。

## 1. 已确认的产品决策

| 决策项 | 已确认方案 | 实施约束 |
|---|---|---|
| 登录 | 手机号验证码 | Supabase Auth Phone OTP 为唯一登录身份源；删除固定验证码和密码式模拟登录 |
| 文章发布 | 作者直接发布 | 普通用户直接发布和管理自己的文章；Editor/Admin 可管理全站文章 |
| 历史数据迁移 | 用户自主导入，管理员核查 | 用户登录并验证手机号后自行导入；导入默认待核查，不自动覆盖云端记录 |
| 角色 | user / editor / admin | 文章作者身份由 posts.author_id 表达，不增加冗余 author 角色 |
| 云数据 | Supabase PostgreSQL | 正式业务数据从 localStorage 迁出；localStorage 仅可作为 UI 缓存，不作为权威数据源 |

### 1.1 身份规则

- `auth.users.id` 是全站唯一用户 ID。
- `public.profiles.id` 与 `auth.users.id` 一对一，使用相同 UUID。
- 新注册用户默认角色为 `user`，客户端不能自行提升角色。
- 用户资料与角色分离；用户可编辑昵称、头像、简介等白名单字段，不能编辑 role、审核状态或系统字段。
- 手机号以 E.164 格式保存。当前 UI 校验主要面向中国大陆 11 位手机号（+86）；若正式用户覆盖其他国家/地区，应在上线前增加国家区号选择和短信合规配置。
- 禁止迁移旧密码、会话、QQ 音乐模拟令牌或旧版客户端角色字段。

### 1.2 内容规则

- 普通用户可以创建、发布、编辑、删除自己的文章，不需要编辑审批。
- Editor 可以编辑、发布、撤下、删除全站文章，但不能修改系统管理员角色。
- Admin 拥有用户与系统级管理权限。
- 评论、点赞、关注等互动只能以当前 `auth.uid()` 作为操作者身份。
- 所有权限必须在数据库 RLS 层执行，前端仅负责交互和友好提示。

### 1.3 历史迁移规则

- 每个用户只能导入自己当前浏览器可访问的本地数据。
- 导入前生成可下载 JSON 备份，并展示记录数、重复数、无法识别记录和预计导入数。
- 以已经验证的 Supabase 用户 ID 作为新作者 ID；不得相信导入 JSON 中自带的 author.id 或 role。
- 导入批次必须具备幂等键，重复提交不得重复创建文章和评论。
- 导入记录先进入 `pending_review`，管理员核查后批准或拒绝；审核对象应是导入批次及异常记录，不代表未来新文章都需要审核。
- 历史文章不得被用于创建/合并用户身份；无法确认作者归属的记录进入人工处理队列。
- 导入成功前保留本地数据。云端校验通过并由用户确认后，才允许用户自行清理本地副本。

## 2. 当前代码基线与问题

### 2.1 已确认的实现现状

- 前端：React 18、TypeScript、Vite、React Router、Tailwind CSS、shadcn/ui。
- 已安装 Supabase JS SDK，存在 Supabase Auth 上下文和 profiles 读取逻辑。
- 文章、用户、分类、标签、评论、互动、通知和消息等旧版 repository 主要通过 `src/lib/database.ts` 使用 localStorage。
- 新旧认证并存：AuthContext 使用 Supabase Auth；旧版 authLogin/authSession 仍使用 localStorage/sessionStorage。
- 手机验证码当前为固定 `123456` 的开发模拟流程，`phoneAuth.ts` 使用默认密码尝试登录/注册，不能视为生产 OTP。
- 微博、新闻和 QQ 音乐服务包含静态或模拟数据，不纳入本轮核心数据迁移。

### 2.2 v0.2.0 识别到的数据覆盖根因

1. `src/repositories/postInitialization.ts` 在发现文章表非空时会删除所有文章并重新写入 5 篇样例文章。
2. `src/lib/data.ts` 在模块加载时执行另一段初始化；只要文章数量不是恰好 5 篇，就删除所有文章。
3. 两处副作用会在应用模块导入时触发，因此即使用户刚创建文章，下一次加载也可能丢失数据。
4. 文章初始化把“演示数据数量”误当成“数据完整性条件”，这不是可靠的数据库初始化策略。

## 3. 版本路线

| 版本 | 主题 | 关键交付 |
|---|---|---|
| v0.2.0 | 数据安全止血 | 初始化幂等、移除破坏性重置、备份损坏数据、测试和回归保护 |
| v0.3.0 | 单一身份体系 | Supabase Phone OTP、唯一会话、profiles、角色安全边界、移除旧认证 |
| v0.4.0 | 核心内容云端化 | profiles/posts/categories/tags/comments/likes、RLS 与 repository API 化 |
| v0.5.0 | 社交与通知云端化 | follows/notifications/messages、事务性操作与权限测试 |
| v0.6.0 | 用户自主历史迁移 | 本地导出、预览、导入批次、幂等导入、管理员审核 |
| v1.0.0 | 稳定发布 | 监控、备份恢复演练、性能与安全测试、生产配置和运行手册 |

---

## 4. v0.2.0：数据安全止血

### 4.1 目标

修复应用启动时破坏既有文章数据的问题。该版本不切换身份认证、不迁移业务数据库、不修改用户角色模型。

### 4.2 代码修改任务

| ID | 文件 | 修改任务 | 验收 |
|---|---|---|---|
| V020-01 | `src/repositories/postInitialization.ts` | 只在 posts 键不存在或值为有效空数组时创建样例文章 | 已有文章永远不被删除 |
| V020-02 | `src/repositories/postInitializationPolicy.js` | 提取纯初始化决策函数 | 不依赖浏览器环境，可单测 |
| V020-03 | `src/lib/data.ts` | 删除“文章数不等于 5 就清空”的 IIFE | 导入数据模块不触发破坏性写入 |
| V020-04 | `tests/postInitializationPolicy.test.js` | 覆盖空值、空数组、非空数组、错误 JSON、非数组 JSON | 所有策略测试通过 |
| V020-05 | `package.json` | 增加 `npm test` 入口并设置版本为 0.2.0 | `npm test` 可运行 |
| V020-06 | `docs/REFACTOR-ROADMAP.md` | 记录已确认决策、版本计划和验收标准 | 文档与代码实现一致 |

### 4.3 安全初始化策略

| localStorage posts 值 | 动作 |
|---|---|
| key 不存在 | 首次写入演示文章 |
| `[]` | 写入演示文章 |
| 非空 JSON 数组 | 保留原值，跳过样例写入 |
| 非法 JSON | 尝试另存原始备份；保留原键；跳过样例写入 |
| JSON 非数组 | 尝试另存原始备份；保留原键；跳过样例写入 |
| localStorage 读取失败 | 不执行写入，记录错误 |

**重要：** 当前数据库表 `Tables.POSTS` 的底层键就是 `posts`。不能把这段旧值再当作另一份独立 legacy 数据导入。未来云端迁移需要为每个用户增加单独的导出文件和导入流程。

### 4.4 回归检查

- 0 篇文章：启动后出现演示文章。
- 1、2、4、5、6 篇文章：启动前后数量、ID、标题、正文一致。
- 用户创建第 6 篇文章后刷新：第 6 篇仍存在。
- 用户编辑或删除文章后刷新：操作结果仍存在。
- localStorage 中 posts 是非法 JSON：应用不自动把其替换为演示数据。
- 多次模块加载/刷新：初始化结果幂等。
- `npm test`、`npm run build` 和 `npm run lint` 通过。

### 4.5 v0.2.0 暂不包含

- 不删除旧版 localStorage 用户/认证模块。
- 不将文章写入 Supabase。
- 不修改 profiles 或 RLS。
- 不自动迁移历史数据。
- 不启用短信供应商或生产手机号 OTP。
- 不把样例数据当作正式用户内容。

---

## 5. v0.3.0：统一手机号身份体系

### 5.1 目标架构

```text
React UI
  └── AuthProvider
        └── Supabase Auth (Phone OTP)
              └── auth.users (唯一身份)
                    └── public.profiles (应用资料与角色)
```

### 5.2 任务清单

1. 登录流程改为 `signInWithOtp({ phone })` 发送验证码、`verifyOtp({ phone, token, type: 'sms' })` 验证登录。
2. 首次成功验证手机号即创建 Supabase Auth 用户；不要通过默认密码进行模拟注册。
3. 删除固定验证码 `123456`、默认密码 `defaultpassword` 和客户端模拟 token。
4. AuthContext 统一监听 `onAuthStateChange` 并处理初始 session；避免重复查询和并发状态覆盖。
5. profiles 使用 auth.users.id；创建用户资料采用数据库触发器或受信任服务端流程。
6. 前端用户角色只从受保护的 profiles/RLS 数据读取；客户端 user metadata 不作为授权源。
7. 统一退出登录、会话恢复、资料刷新、手机号变更和失败状态。
8. 移除旧版手机号+密码登录、旧 sessionStorage currentUser 与重复的用户认证接口。
9. 更新用户资料时仅允许修改公开资料白名单字段；role、phone_verified、审核字段禁止客户端任意更新。
10. 配置短信服务商、验证码有效期、发送频率限制与 CAPTCHA 后才允许生产启用。

### 5.3 验收

- 新号码可通过真实短信验证码注册并进入系统。
- 已注册号码可通过短信验证码登录。
- 错误、过期、重复使用的验证码不能登录。
- 退出后刷新不恢复旧会话。
- 同一 Auth 用户始终映射到同一个 profile。
- 普通用户不能自行把角色更新为 editor/admin。
- 短信发送有限流和反机器人保护。

---

## 6. v0.4.0：核心云端数据模型

### 6.1 建议表结构

| 表 | 关键字段 | 说明 |
|---|---|---|
| profiles | id, username, avatar_url, bio, role, created_at, updated_at | id 引用 auth.users.id |
| categories | id, name, slug, description, parent_id | 分类 |
| tags | id, name, slug | 标签 |
| posts | id, author_id, title, slug, content, excerpt, cover_image, status, published_at, created_at, updated_at | 核心文章 |
| post_tags | post_id, tag_id | 文章标签多对多 |
| comments | id, post_id, author_id, parent_id, content, created_at, updated_at | 评论/回复 |
| post_likes | post_id, user_id, created_at | 点赞关联表 |

### 6.2 关键约束

- 所有主键使用 UUID；作者外键引用 profiles.id。
- posts.status 建议使用 draft/published/scheduled/archived。
- 文章正文使用 Markdown 文本；摘要与封面独立保存。
- 评论采用 parent_id 表达回复关系，避免把评论数组嵌在文章 JSON 中。
- 点赞使用联合唯一约束 `unique(post_id, user_id)`，防止重复点赞。
- post_tags 使用联合主键或唯一约束防止重复绑定。
- 为 author_id、status、published_at、post_id、created_at 等常用过滤字段建立索引。
- 文章删除策略采用明确的外键级联或软删除决策，不能在迁移中无意删除评论和互动。

### 6.3 文章状态与权限

| 操作 | 普通用户 | Editor | Admin |
|---|---|---|---|
| 查看已发布文章 | 允许 | 允许 | 允许 |
| 查看自己的草稿 | 允许 | 允许 | 允许 |
| 新建并直接发布自己的文章 | 允许 | 允许 | 允许 |
| 修改自己的文章 | 允许 | 允许 | 允许 |
| 修改他人文章 | 拒绝 | 允许 | 允许 |
| 删除自己的文章 | 允许 | 允许 | 允许 |
| 删除他人文章 | 拒绝 | 允许 | 允许 |
| 管理用户角色 | 拒绝 | 拒绝 | 允许 |

---

## 7. 数据库 RLS 与安全策略

### 7.1 原则

- public schema 中所有暴露给客户端的表都启用 RLS。
- grants 决定角色是否可以执行操作，RLS policies 决定允许作用于哪些行；两者都必须配置。
- RLS 分别为 SELECT/INSERT/UPDATE/DELETE 编写策略，避免用宽泛的 `FOR ALL` 隐藏权限边界。
- 文章权限以 `author_id = auth.uid()` 为基础，编辑/管理员权限使用受信任的角色来源。
- profiles.role 不能通过用户可编辑的 user_metadata 进行授权。
- SECURITY DEFINER 函数固定 `search_path`，内部对象使用 schema-qualified 名称，且尽可能放在 private schema。
- service_role key 只能保存在受信任服务端，绝不能进入浏览器环境变量或打包产物。
- Storage 对象也需要独立策略；路径应绑定用户 ID，不能只靠前端隐藏上传入口。

### 7.2 policies 设计概要

**profiles**
- SELECT：公开资料可按产品规则开放；敏感字段使用独立表或列权限。
- UPDATE：只能修改自己的公开资料字段。
- INSERT：由受信任触发器创建；客户端不能选择 role。
- DELETE：仅管理员或受控删除流程。

**posts**
- SELECT：published 对公众可读；作者可查看自己的 draft/scheduled；Editor/Admin 可查看全部。
- INSERT：authenticated 且 author_id = auth.uid()。
- UPDATE：作者本人或 Editor/Admin。
- DELETE：作者本人或 Editor/Admin。
- UPDATE 的 USING 与 WITH CHECK 都要检查，防止把 author_id 改成其他用户。

**comments**
- SELECT：只对可见文章读取评论。
- INSERT：comment.author_id = auth.uid()，且关联文章对当前用户可见。
- UPDATE/DELETE：评论作者本人；Editor/Admin 可按管理策略操作。
- 防止用户把评论 parent_id 指向其他文章或无权访问的评论。

**post_likes**
- INSERT/DELETE：只能以 auth.uid() 操作自己的 user_id。
- UNIQUE(post_id,user_id) 防止重复点赞。
- 浏览器不能直接更新汇总计数；计数由查询、视图或受控数据库函数计算。

**follows**
- INSERT：follower_id = auth.uid()，且不能关注自己。
- DELETE：只能取消自己的关注关系。
- 双向关系应使用单条 follows 事实记录，不再同时维护两个容易失配的数组字段。

### 7.3 数据库自动化测试

- 使用 Supabase CLI 和 pgTAP 编写 `supabase/tests/*.sql`。
- 至少准备 anon、user A、user B、editor、admin 五种测试身份。
- 每张业务表分别测试允许和拒绝的 SELECT/INSERT/UPDATE/DELETE。
- 特别验证 IDOR：用户 A 伪造用户 B 的 UUID、post_id、author_id 时必须被数据库拒绝。
- 所有 migration 在 staging 数据库验证后再部署 production。

---

## 8. v0.5.0：社交关系、消息与通知

### 建议表

| 表 | 关键字段 | 权限重点 |
|---|---|---|
| follows | follower_id, following_id, created_at | 仅发起关注者能创建/删除 |
| notifications | id, recipient_id, actor_id, type, entity_id, read_at, created_at | 收件人可读/标记已读；系统生成 |
| conversations | id, created_at | 参与者可访问 |
| conversation_members | conversation_id, user_id | 成员关系受保护 |
| messages | id, conversation_id, sender_id, content, created_at, read_at | 仅会话成员，sender_id 必须为 auth.uid() |

- 消息读取必须校验当前用户属于该会话。
- 通知由受控 RPC、数据库触发器或服务端逻辑产生。
- 私信与通知不应向 anon 开放。
- 未读数量优先通过索引化查询计算，不维护多个不一致的冗余计数。

---

## 9. v0.6.0：用户自主历史数据迁移

### 9.1 导入流程

```text
用户已完成手机号 OTP 登录
  -> 检测本地旧数据
  -> 用户下载原始 JSON 备份
  -> 本地解析、校验、去重与预览
  -> 用户确认导入
  -> 创建 migration_imports 批次
  -> 服务端校验并导入到隔离/待核查状态
  -> Admin 审核
  -> 批准后正式发布/关联
  -> 用户确认云端数据完整后自行清理本地副本
```

### 9.2 导入相关表

- migration_imports：批次 ID、owner_id、source、status、submitted_at、reviewed_by、reviewed_at。
- migration_import_items：批次 ID、source_record_id、entity_type、status、target_id、error_code。
- 对源记录 ID + owner_id 建立幂等唯一键。
- 审核记录保留审计轨迹；不能只在前端改变批次状态。

### 9.3 迁移校验

- 文章必须有标题、正文、有效创建时间和明确归属。
- 评论必须关联本批次可导入的文章。
- 点赞、关注等关系仅迁移可以被当前用户证明拥有的关系。
- 跳过密码、session、旧 role、验证码、token 与浏览器缓存。
- 导入失败要提供逐条错误报告；不能以整批覆盖方式重试。
- 批准/拒绝必须写明管理员、时间和原因。

---

## 10. v1.0.0 发布门槛

### 功能

- 手机号 OTP 全流程可用。
- 单一身份体系，不存在旧版登录状态分叉。
- 文章、评论、点赞、分类、标签数据全部走云端。
- 作者直接发布自己的文章；编辑和管理员能管理全站文章。
- 关注、通知和私信权限隔离。
- 用户可以导出并自主导入历史数据，管理员能够审核批次。

### 安全

- 客户端 bundle 不包含 service_role key。
- 所有 public schema 暴露表都已启用 RLS。
- grants 与 RLS policies 经过测试。
- 用户 A 无法读取、修改或删除用户 B 的私有内容。
- 普通用户无法提升角色。
- 生产短信开启频率限制与 CAPTCHA。
- Storage 对象、导入批次和私信同样经过权限审查。

### 运营

- 已验证 staging → production migration 流程。
- 生产备份与恢复演练完成。
- 有基础错误日志、性能监控和异常导入告警。
- 有用户数据导出、账号删除和数据保留政策。

---

## 11. 当前 v0.2.0 分支的验收状态

- [x] 移除文章非空时强制删除并重建样例数据的逻辑。
- [x] 移除文章数量不等于 5 时清空的第二段逻辑。
- [x] 提取纯初始化策略函数。
- [x] 增加初始化策略回归测试。
- [x] 增加 npm test 命令。
- [ ] 在 CI/本地执行完整测试、build 和 lint。
- [ ] 代码审查通过并合并主分支。

## 12. 官方技术参考

- Supabase Phone Login：<https://supabase.com/docs/guides/auth/phone-login>
- Supabase Row Level Security：<https://supabase.com/docs/guides/database/postgres/row-level-security>
- Supabase RBAC / Custom Claims：<https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac>
- WordPress Roles and Capabilities：<https://wordpress.org/documentation/article/roles-and-capabilities/>
- Ghost Staff Roles：<https://ghost.org/help/managing-your-team/>
- Medium Publication Permissions：<https://help.medium.com/hc/en-us/articles/34508714374679-Info-Homepage-Customizing-your-publication-settings-and-layout>

> 权限设计借鉴 WordPress 的职责/能力拆分与 Ghost 的 Author/Editor/Administrator 边界；LiveBlog Sphere 采用更精简的 user/editor/admin 三角色，作者权限通过文章归属实现。Medium 的 Publication Writer/Editor 机制仅作为未来投稿型专栏的参考，不纳入当前“作者直接发布”规则。
