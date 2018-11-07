FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:latest


# copy代码进docker，替换config文件
RUN mkdir /usr/local/eas
COPY ./ /usr/local/eas

# 安装service的npm依赖
RUN cd /usr/local/eas \
	&& npm install --registry=https://registry.npm.taobao.org \
	&& npm run build

# 进入工作目录
WORKDIR /usr/local/eas

# 配置环境
ENV NODE_ENV=test

# docker对外暴露的端口号
EXPOSE 7001

# 执行脚本
CMD npm run docker
