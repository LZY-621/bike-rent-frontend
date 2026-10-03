# 🚲 共享单车租赁管理系统 - 前端

> 基于 Vue 3 + Element Plus 的共享单车租赁系统管理后台，为 Spring Boot 后端提供用户交互界面。

## 📖 项目简介

共享单车租赁系统的前端管理界面，支持用户注册登录、自行车信息管理、租赁订单管理、在线租车还车、数据统计可视化等核心业务功能。采用前后端分离架构，通过 RESTful API 与后端服务通信，JWT Token 实现无状态身份认证。

## 🔗 后端仓库

本项目配套后端服务：[bike-rent-backend](https://github.com/LZY-621/bike-rent-backend) (Spring Boot 3 + MyBatis-Plus + JWT)

## 💻 技术栈

| 分类 | 技术 | 版本 | 说明 |
|---|---|---|---|
| 核心框架 | Vue | 3.x | 渐进式 JavaScript 框架 |
| 构建工具 | Vite | 5.x | 极速开发服务器 + 热更新 |
| UI 组件库 | Element Plus | 2.x | Vue 3 桌面端组件库 |
| 状态管理 | Pinia | 2.x | 用户登录态持久化（localStorage） |
| 路由 | Vue Router | 4.x | 路由嵌套 + 登录守卫 |
| HTTP 请求 | Axios | 1.x | JWT 拦截器 + 统一错误处理 |
| 图表可视化 | ECharts | 5.x | 仪表盘饼图/柱状图 |

## ✨ 功能特性

### 📝 用户模块
- ✅ 用户注册 / 登录（后端 BCrypt 密码加密 + JWT 返回）
- ✅ 用户列表、分页、搜索
- ✅ 用户新增、编辑、删除
- ✅ 账户余额充值

### 🚲 自行车模块
- ✅ 自行车列表、分页、搜索
- ✅ 自行车新增、编辑、删除
- ✅ **在线租车**（空闲状态显示租车按钮，自动调用后端接口）

### 📋 订单模块
- ✅ 租赁订单列表、分页、多条件筛选
- ✅ **在线还车**（自动计费，每 30 分钟 1 元，最低 1 元）
- ✅ 我的租赁（当前登录用户的订单）

### 📊 数据统计
- ✅ 统计卡片：用户总数 / 单车总数 / 订单总数 / 累计营收
- ✅ ECharts 饼图：单车状态分布（空闲 vs 已借出）
- ✅ ECharts 柱状图：月度订单数 + 月度营收（双 Y 轴）

### 🔐 安全认证
- ✅ JWT Token 请求拦截器（自动带 Authorization 头）
- ✅ 路由全局守卫（未登录自动跳转登录页）
- ✅ 401 响应自动登出 + 清除 localStorage

## 📂 目录结构

```
bike-rent-frontend/
├── public/                      # 静态资源
├── src/
│   ├── api/                     # 后端接口封装
│   │   ├── request.js           # Axios 实例（JWT 拦截器 + 统一错误处理）
│   │   ├── auth.js              # 登录 / 注册
│   │   ├── user.js              # 用户 CRUD + 充值
│   │   ├── bike.js              # 自行车 CRUD
│   │   └── rentOrder.js         # 订单 + 租车 / 还车
│   ├── assets/                  # 样式 / 图片
│   ├── router/
│   │   └── index.js             # 路由配置 + 登录守卫
│   ├── stores/
│   │   └── user.js              # Pinia 用户状态（token 持久化）
│   ├── utils/
│   │   └── auth.js              # Token 存取工具
│   ├── views/
│   │   ├── Login.vue            # 登录 / 注册（双 Tab）
│   │   ├── Layout.vue           # 侧边栏 + 顶栏布局
│   │   ├── Dashboard.vue        # 首页统计 + ECharts 图表
│   │   ├── UserList.vue         # 用户管理
│   │   ├── BikeList.vue         # 自行车管理 + 租车按钮
│   │   ├── RentOrderList.vue    # 订单管理 + 还车按钮
│   │   └── MyRent.vue           # 我的租赁
│   ├── App.vue
│   └── main.js
├── vite.config.js               # Vite 配置（/api → localhost:8080 代理）
├── package.json
└── .gitignore
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9
- 后端服务已启动（默认 http://localhost:8080）

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 http://localhost:5173

Vite 已配置代理：`/api` 请求自动转发到 http://localhost:8080，无需额外配置跨域。

### 生产构建

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run preview
```

## 🔧 配置说明

### Vite 代理

`vite.config.js` 中已配置：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

如需修改后端地址，只改 `target` 即可。

### 默认账号

后端数据库初始化后，可用以下账号登录：

| 用户名 | 密码 | 说明 |
|---|---|---|
| zhangsan | 123456 | 老用户（密码已自动升级为 BCrypt） |
| lisi | 123456 | 老用户 |
| （注册页） | 自定义 | 新用户，注册时直接 BCrypt 加密 |

## 🔐 API 认证机制

1. 用户提交登录表单 → 后端验证用户名密码 → 生成 JWT token 返回
2. 前端将 token 存入 localStorage + Pinia store
3. 每次请求，Axios 请求拦截器自动在 Header 加入：
   ```
   Authorization: Bearer <token>
   ```
4. 后端 JwtAuthenticationFilter 校验 token 签名和有效性
5. 后端返回 401 时，Axios 响应拦截器自动清除 token 并跳转登录页

## 🖼️ 页面预览

- 登录页：Tab 切换登录 / 注册
- 布局页：侧边栏（5 菜单项）+ 顶栏（用户信息 + 退出）
- Dashboard：4 统计卡片 + 饼图 + 柱状图
- UserList：表格分页 + 搜索 + 弹窗表单 + 充值按钮
- BikeList：表格分页 + 搜索 + 弹窗表单 + **租车按钮（仅空闲状态）**
- RentOrderList：表格分页 + 多条件筛选 + **还车按钮（仅租赁中状态）**
- MyRent：当前用户的订单列表
