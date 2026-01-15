# Main App（Vue3 + Vite + Element Plus + Pinia + qiankun）

一个基于 Vue 3 的后台管理主应用，包含：
- 登录页（用户名/密码）
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