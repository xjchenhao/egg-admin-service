FROM daocloud.io/library/centos:latest

ADD ./docker/node-v8.tar.gz /usr

RUN mkdir /var/client
COPY ./client/ /var/client/
RUN cd /var/client/ \
	&& npm install --save --registry=https://registry.npm.taobao.org \
	&& npm run build


RUN mkdir /var/eas
COPY ./service/ /var/eas/
COPY ./docker/config.default.js /var/eas/config/config.default.js

RUN mkdir /var/eas/app/assets \
	&& cp -r /var/client/dist/* /var/eas/app/assets

RUN cd /var/eas \
	&& npm install --save --registry=https://registry.npm.taobao.org

RUN rm -rf /var/client/	

WORKDIR /var/eas

ENV NODE_ENV=test

EXPOSE 3000

CMD npm run docker
