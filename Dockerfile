FROM daocloud.io/library/centos:latest

ADD ./docker/node-v8.tar.gz /usr
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
	&& mkdir /var/eas

COPY ./client/dist/ /var/eas/app/assets
COPY ./service/ /var/eas/
COPY ./docker/config.default.js /var/eas/config/config.default.js

RUN cd /var/eas \
	&& cnpm install --save

WORKDIR /var/eas

ENV NODE_ENV=test

EXPOSE 3000

CMD npm run docker
