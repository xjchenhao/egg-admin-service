FROM debian:latest

ADD ./docker/node-v8.tar.gz /usr
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
	&& mkdir /var/eas

COPY ./client/dist/ /var/eas/app/assets
COPY ./server/ /var/eas/
COPY ./docker/config.default.js /var/eas/config/config.default.js

RUN cd /var/eas \
	&& cnpm install --save

WORKDIR /var/eas

ENV NODE_ENV=test

EXPOSE 7001

CMD node index.js
