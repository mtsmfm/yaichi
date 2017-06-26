FROM alpine:3.6

ENV NGINX_MRUBY_VERSION 1.19.4
ENV NGINX_CONFIG_OPT_ENV --with-http_stub_status_module --with-http_ssl_module --prefix=/usr/local/nginx --with-http_realip_module --with-http_addition_module --with-http_sub_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_random_index_module --with-http_secure_link_module

ENV DOCKER_CHANNEL stable
ENV DOCKER_VERSION 17.03.1-ce

COPY build_config.rb /tmp/build_config.rb

RUN apk add --no-cache --virtual .build-deps wget ruby-rake git gcc make tar bison \
	&& apk add --no-cache --virtual .linked-deps openssl-dev pcre-dev libc-dev \
	\
	&& mkdir -p /usr/local/src \
	&& cd /usr/local/src \
	&& wget https://github.com/matsumotory/ngx_mruby/archive/v$NGINX_MRUBY_VERSION.tar.gz \
	&& tar -xvf v$NGINX_MRUBY_VERSION.tar.gz \
	&& rm v$NGINX_MRUBY_VERSION.tar.gz \
	&& mv ngx_mruby-$NGINX_MRUBY_VERSION ngx_mruby \
	\
	&& cd /usr/local/src/ngx_mruby \
	&& mv /tmp/build_config.rb . \
	&& sh build.sh \
	&& make install \
	&& rm -rf /usr/local/src \
	\
	&& cd \
	&& wget -O docker.tgz "https://download.docker.com/linux/static/${DOCKER_CHANNEL}/x86_64/docker-${DOCKER_VERSION}.tgz" \
	&& tar --extract --file docker.tgz --strip-components 1 --directory /usr/bin/ \
	&& rm docker.tgz \
	\
	&& apk del .build-deps \
	&& apk add --no-cache --virtual .runtime-deps ruby ruby-json

WORKDIR /usr/local/nginx

COPY hook /usr/local/nginx/hook
COPY conf /usr/local/nginx/conf

CMD  cat conf/nginx.conf.erb | ruby -r erb -r json -r /usr/local/nginx/conf/init.rb -e 'ERB.new($<.read, nil, ?-).run' > conf/nginx.conf && /usr/local/nginx/sbin/nginx
