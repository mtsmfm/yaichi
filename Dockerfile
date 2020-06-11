FROM alpine:3.6 AS build-env

ENV NGINX_MRUBY_VERSION v2.2.1
ENV NGINX_CONFIG_OPT_ENV '--with-ld-opt="-static" --prefix=/usr/local/nginx --with-http_stub_status_module --with-stream --without-stream_access_module'
ENV DOCKER_CHANNEL stable
ENV DOCKER_VERSION 19.03.11

RUN apk add --no-cache wget ruby-rake git gcc make tar bison openssl-dev pcre-dev libc-dev
RUN mkdir -p /usr/local/src

WORKDIR /usr/local/src

RUN git clone https://github.com/matsumotory/ngx_mruby.git

WORKDIR /usr/local/src/ngx_mruby

RUN git checkout ${NGINX_MRUBY_VERSION}

RUN wget -O /tmp/docker.tgz "https://download.docker.com/linux/static/${DOCKER_CHANNEL}/x86_64/docker-${DOCKER_VERSION}.tgz"
RUN tar --extract --file /tmp/docker.tgz --strip-components 1 --directory /usr/bin

COPY build_config.rb .
COPY mrbgems mrbgems
RUN sh build.sh
RUN make install

FROM node:14.4.0-alpine AS workspace

RUN apk add --no-cache zsh git less curl perl gnupg

COPY --from=build-env /usr/local/nginx/sbin/nginx /usr/bin/nginx
COPY --from=build-env /usr/bin/docker /usr/bin/docker

RUN mkdir -p /usr/local/nginx/logs /app

FROM workspace AS builder

RUN yarn install
RUN yarn build

FROM busybox

RUN mkdir -p /usr/local/nginx/logs /app

WORKDIR /app

COPY --from=builder /usr/local/nginx/sbin/nginx /usr/bin/nginx
COPY --from=builder /usr/bin/docker /usr/bin/docker

COPY --from=builder conf /app/conf
COPY --from=builder front/dist /app/front/dist

CMD ["/usr/bin/nginx", "-c", "/app/conf/nginx.conf"]
