# egg-admin-service

基于eggjs的node service，用来做前后端分离的后台管理系统的后端服务。简称`Eas`。
Eas后台使用egg当作后台框架，`antd`当作前端界面。

- demo地址：[http://eas.xjchenhao.cn/](http://eas.xjchenhao.cn/)
- api地址：[http://yapi.demo.qunar.com/project/8948/interface/api](http://yapi.demo.qunar.com/project/8948/interface/api)

## 已实现
1. 权限管理，精确到api级别的权限管理
2. 用户个人资料修改

## 需要掌握

- 为企业级框架和应用而生的node框架：[egg](https://eggjs.org/)
- 极快的类Next.js的React应用框架：[umi](https://umijs.org/)
- 开箱即用的中台前端/设计解决方案：[ANT DESIGN PRO](https://pro.ant.design/index-cn)

## 本地开发

### 初始化数据库内容
#### 前提
该工程使用的数据库是mongodb，请先运行mongodb。

#### 执行脚本
1. 进入工程目录下`/init.d/mongo`文件夹
3. 终端执行`mongo --quiet localhost:27017/eas init.js`
4. 查看mongodb是否生成了数据

### 启动node服务
1. 进入工程目录
2. 执行`npm i`安装项目依赖
3. 执行`npm run dev`启动node服务（如果是vscode直接按F5运行即可）

### 账号
- admin/123456
- test/123456
