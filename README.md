# 网页交互企业管理系统设计方案  

## E-R关系设计  
### 实体关系模型  
员工（worker）：(WID,name,age,gender,address,email,salary)  
部门（department）：(DID,name,location)  
项目（project）：(PID,name,status)  
订单（order）：(OID,project,amount,status)  
产品（product）：(PID,name,price)  
客户（customer）：(CID,name,address,email)  
### 联系实体关系  
1. 部门-员工（隶属，1:N）  
2. 员工-项目（参与，M:N，属性：角色、工时）  
3. 部门-项目（负责，1:N）  
4. 客户-订单（下单，1:N）  
5. 订单-产品（包含，M:N，属性：数量、小计金额）  
6. 员工-员工（管理，1:N递归关系，表示上下级）  
## 关系模式设计  

worker(WID Primary Key, name, age, gender, address, email, salary,DID Foreign Key,MID Foreign Key)  

department(DID Primary Key, name, location) 

project(PID Primary Key, name, status,DID Foreign Key)  

customer(CID Primary Key, name, address,email)  

order(OID Primary Key,project, amount, status,CID Foreign Key)  

product(PID Primary Key, name, price)  

partcipate(WID Foreign Key,PID Foreign Key,role,work_hour)  

Order_Product(OID Foreign Key,PID Foreign Key,quantity,subtotal)  

## 说明
前端采用vue框架，后端采用Express框架，用node-opengauss库来连接数据库，问了一下ai结构，没怎么搞懂，还没开始做，望斧正。




