FROM daocloud.io/library/centos:latest

# 给环境注入预先准备好的node执行环境
ADD ./docker/node-v8.tar.gz /usr

# copy客户端代码进docker，build静态页面
RUN mkdir /var/client
COPY ./client/ /var/client/
RUN cd /var/client/ \
	&& npm install --save --registry=https://registry.npm.taobao.org \
	&& npm run build

# copy服务端代码进docker，替换config文件
RUN mkdir /var/eas
COPY ./service/ /var/eas/
COPY ./docker/config.default.js /var/eas/config/config.default.js

# 把build后的静态页面放入服务端的assets中，交由service运行
RUN mkdir /var/eas/app/assets \
	&& cp -r /var/client/dist/* /var/eas/app/assets

# 删除client的业务代码（已经build出结果了，这部分代码已经用不到了，留着占docker空间）
RUN rm -rf /var/client/	

# 安装service的npm依赖
RUN cd /var/eas \
	&& npm install --save --registry=https://registry.npm.taobao.org

# 进入工作目录
WORKDIR /var/eas

# 配置环境
ENV NODE_ENV=test

# docker对外暴露的端口号
EXPOSE 3000

# 执行脚本
CMD npm run docker
