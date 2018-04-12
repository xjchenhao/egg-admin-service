# egg-admin-server

基于eggjs的nodeserver，用来做前后端分离的后台管理系统的后端服务。简称`Eas`。
Eas后台使用egg当作后台框架，`antd pro`当作前端界面。

## 需要掌握

- 为企业级框架和应用而生的node框架：[egg](https://eggjs.org/)
- 开箱即用的中台前端/设计解决方案：[ANT DESIGN PRO](https://pro.ant.design/index-cn)

### 本地开发

### 启动客户端
1. 进入工程目录下`client`文件夹
2. 执行`npm i`安装项目依赖
3. 执行`npm run dev`启动，理论上浏览器会自动打开*http://localhost:7001/*

### 启动服务端

#### 初始化数据库内容
##### 前提
该工程使用的数据库是mysql，请先预备好mysql，并建好一个空的库，工程默认配置的表名是：`eas_basis`。

##### 执行脚本
1. 进入工程目录下`/server/app/init.d`文件夹
2. 修改`import.sh`文件中的变量
3. 终端执行`sudo ./import.sh`（如果是window，请复制里面*mysql语句*，替换变量后直接在终端运行）
4. 查看原先建好的数据库是否被插入了值

#### 启动node服务
1. 进入工程目录下`server`文件夹
2. 执行`npm i`安装项目依赖
3. 执行`npm run dev`启动node服务

ps: 如果发现数据库连接不上，请检查`/server/config/config.local.js`文件中，数据库配置是否正确（尤其是账号密码）。

### 后续开发
这个工程的基本形态就是当前的样子，不会增加新的功能模块。新的模块将会起一个新的工程，作为微服务与此工程进行交互。后续大多是优化、完善为主。比如：增加单元测试、Docker化、mongodb版本的实现等。