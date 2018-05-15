FROM daocloud.io/library/centos:latest

ADD ./docker/node-v8.tar.gz /usr
RUN mkdir /var/eas

COPY ./client/dist/ /var/eas/app/assets
COPY ./service/ /var/eas/
COPY ./docker/config.default.js /var/eas/config/config.default.js

RUN cd /var/eas \
	&& cnpm install --save --registry=https://registry.npm.taobao.org

WORKDIR /var/eas

ENV NODE_ENV=test

EXPOSE 3000

CMD npm run docker
