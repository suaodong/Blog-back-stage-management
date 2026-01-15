# Main App（Vue3 + Vite + Element Plus + Pinia + qiankun）

一个基于 Vue 3 的后台管理主应用，包含：
- 登录页（用户名/密码）
- mock.js 接口（login/getUserInfo/logout），便于后期无缝替换真实 API
- Pinia 全局状态管理（token、用户信息缓存）
- 路由鉴权与角色权限校验（meta.roles）
- 动态侧边栏菜单（基于路由配置）
- TagsView 标签导航
- qiankun 微前端主应用能力（挂载 React 子应用示例）

## 环境要求
- Node.js：推荐 `^20.19.0` 或 `>= 22.12.0`（Vite 7 的要求；Node 21 可能会提示 warning）
- npm：10+

## 快速开始

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产包：

```bash
npm run build
```

## 登录说明
- 登录方式：用户名 + 密码
- mock 默认规则：
  - 任意用户名可用
  - 默认密码：`123456`
- 登录后会缓存：
  - token：`localStorage.token`
  - 用户信息：`localStorage.user_info`

相关实现：
- 登录页：[views/login](src/views/login/index.vue)
- 用户状态：[stores/user](src/stores/user.ts)
- 本地缓存：[utils/auth](src/utils/auth.ts)

## Mock 接口设计
当前开发环境（`import.meta.env.DEV`）自动启用 mock：
- [mock/index.ts](src/mock/index.ts)

接口：
- `POST /api/login`：返回 `{ code, data: { token }, message }`
- `GET /api/user/info?token=...`：返回 `{ code, data: { name, roles, avatar }, message }`
- `POST /api/logout`：返回 `{ code, data: null, message }`

后期替换正式 API 的方式：
- 保持接口返回结构 `{ code, data, message }`
- 或者在 [utils/request.ts](src/utils/request.ts) 内统一适配

## 路由与权限
路由定义：
- [router/index.ts](src/router/index.ts)

权限拦截：
- [router/permission.ts](src/router/permission.ts)

规则：
- 未登录（无 token）访问非白名单路由会跳转 `/login`
- 登录后首次访问会请求 `getUserInfo` 拉取用户信息并缓存
- 若路由 `meta.roles` 存在且当前用户 roles 不满足，会跳转 `/401`

## qiankun 微前端（React 子应用示例）
主应用注册位置：
- [main.ts](src/main.ts)

当前注册的子应用示例：
- name：`react-sub`
- entry：`//localhost:5174/`
- activeRule：`/sub-react`
- container：`#subapp-container`

主应用路由与容器页面：
- 路由：`/sub-react/setting`
- 容器： [views/sub-react](src/views/sub-react/index.vue)（包含 `id="subapp-container"` 的 DOM）

### 子应用需要满足的条件（重要）
1) 子应用需要支持 qiankun 的生命周期（bootstrap/mount/unmount）
2) 子应用 dev server 需允许跨域（示例：Vite React）

```ts
// vite.config.ts（子应用示例）
export default defineConfig({
  server: {
    port: 5174,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hmr: false,// react：18+时，子应用为vite构建时，在开发环境中禁用 HMR（热更新），否则渲染失败
  }
})
```

## 目录结构（简）
```text
src/
  api/               # 接口封装
  layout/            # Layout + Header/Sidebar/TagsView
  mock/              # mock.js 接口
  router/            # 路由与权限拦截
  stores/            # Pinia
  utils/             # request/auth/cache/permission
  views/             # 页面（login/401/dashboard/sub-react）
```
