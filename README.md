# 网页交互企业管理系统设计方案

## E-R关系设计

### 实体关系模型

员工（worker）：(WID,name,age,gender,address,email,salary)  
部门（department）：(DID,name,location)  
项目（project）：(PID,name,status)

### 联系实体关系

1. 部门-员工（隶属，1:N）
2. 员工-项目（参与，M:N，属性：角色、工时）
3. 部门-项目（负责，1:N）

## 关系模式设计

worker(WID Primary Key, name, age, gender, address, email, salary, DID Foreign Key)

department(DID Primary Key, name, location)

project(PID Primary Key, name, status, DID Foreign Key)

partcipate(WID Foreign Key, PID Foreign Key, role, work_hour)

## 说明

前端采用vue框架，后端采用Express框架，用node-opengauss库来连接数据库。

## 快速开始

```BASH
# 克隆项目
git clone https://github.com/Safaiachan/CQU_SQLwork_spring2026.git
```

- 后端，记得更改数据库配置，在 `backend/src/db/opengauss.ts` 的 `DB_CONFIG` 里

```BASH
# 进入后端目录
cd backend
# 安装依赖
npm install
# 编译并启动后端服务
npm run build
npm run start
```

- 前端
```BASH
# 进入前端目录
cd frontend
# 安装依赖
npm install
# 启动前端开发服务器
npm run dev
```




