# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个网页交互企业管理系统，用于管理员工、部门、项目以及员工与项目的参与关系。

- **前端**: Vue 3 + Vite + Axios
- **后端**: Express + TypeScript
- **数据库**: OpenGauss (通过 node-opengauss 库连接)

## 常用开发命令

### 后端开发

```bash
cd backend
npm install              # 安装依赖
npm run dev             # 开发模式（使用 tsx watch 热重载）
npm run build           # 编译 TypeScript 到 dist/
npm run start           # 启动生产环境服务
```

### 前端开发

```bash
cd frontend
npm install              # 安装依赖
npm run dev             # 启动开发服务器
npm run build           # 构建生产版本
npm run preview         # 预览生产构建
```

## 项目架构

### 后端结构

```
backend/src/
├── server.ts           # Express 服务器入口，监听 8000 端口
├── db/
│   └── opengauss.ts   # OpenGauss 数据库连接和查询封装
├── routes/
│   ├── index.ts       # 路由聚合
│   ├── worker.routes.ts     # 员工 CRUD
│   ├── department.routes.ts # 部门 CRUD
│   ├── project.routes.ts    # 项目 CRUD
│   └── participate.routes.ts # 员工-项目参与关系 CRUD
└── types/
    ├── Result.ts      # 统一响应格式 (code, message, data)
    └── Entity.ts      # 实体类型定义
```

**API 端点前缀**: `/api`

- `/api/workers` - 员工管理
- `/api/departments` - 部门管理
- `/api/projects` - 项目管理
- `/api/participations` - 参与关系管理

### 前端结构

```
frontend/src/
├── App.vue            # 主应用组件（包含所有页面逻辑）
├── main.js            # 应用入口
└── api/
    └── request.js     # Axios 实例配置，baseURL: http://localhost:8000/api
```

### 数据库模型

**关系模式**:
- `worker(WID PK, name, age, gender, address, email, salary, DID FK)`
- `department(DID PK, name, location)`
- `project(PID PK, name, status, DID FK)`
- `participate(WID FK, PID FK, role, work_hour)`

**实体关系**:
- 部门-员工: 1:N（隶属关系）
- 部门-项目: 1:N（负责关系）
- 员工-项目: M:N（参与关系，通过 participate 表）

## 重要配置

### 数据库配置

数据库连接配置在 `backend/src/db/opengauss.ts` 的 `DB_CONFIG` 对象中：

```typescript
const DB_CONFIG = {
    host: '127.0.0.1',
    port: 5432,
    username: 'omm',
    database: 'postgres',
    password: '123456',
};
```

修改数据库连接信息时需要更新此配置。

### 响应格式

后端所有 API 使用统一的响应格式：

```typescript
// 成功响应
{
    code: 200,
    message: "操作成功",
    data: { ... }
}

// 失败响应
{
    code: 400/404/500,
    message: "错误信息",
    data: null
}
```

前端 Axios 拦截器会自动处理此响应格式。

## TypeScript 配置

后端使用严格的 TypeScript 配置 (`tsconfig.json`)：
- `strict: true` - 启用所有严格类型检查
- `noUncheckedIndexedAccess: true` - 禁止未检查的索引访问
- `exactOptionalPropertyTypes: true` - 精确的可选属性类型
- `module: "nodenext"` - 使用 Node.js ESM 模块系统

## 开发注意事项

1. 后端路由使用字符串拼接 SQL 查询，注意使用 `toSqlValue()` 函数进行 SQL 值转义，防止 SQL 注入
2. 所有数据库操作通过 `backend/src/db/opengauss.ts` 中的 `query()` 函数执行
3. 前端是单文件应用（App.vue），所有页面组件集中管理
4. 新增 API 端点需要在 `backend/src/routes/index.ts` 中注册路由
