FROM ubuntu:16.04

# TODO: remove unnecessary packages
RUN apt-get update -qq && \
	apt-get -y install build-essential sudo openssh-server \
	git curl rake ruby ruby-dev bison \
	libcurl4-openssl-dev libhiredis-dev libmarkdown2-dev libssl-dev \
	libcap-dev libcgroup-dev make libpcre3 libpcre3-dev libmysqlclient-dev

ENV NGINX_MRUBY_VERSION 1.19.4
ENV NGINX_CONFIG_OPT_ENV --with-http_stub_status_module --with-http_ssl_module --prefix=/usr/local/nginx --with-http_realip_module --with-http_addition_module --with-http_sub_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_random_index_module --with-http_secure_link_module

RUN cd /usr/local/src && \
	wget https://github.com/matsumotory/ngx_mruby/archive/v$NGINX_MRUBY_VERSION.tar.gz && \
	tar -xvf v$NGINX_MRUBY_VERSION.tar.gz && \
	rm v$NGINX_MRUBY_VERSION.tar.gz && \
	mv ngx_mruby-$NGINX_MRUBY_VERSION ngx_mruby

# https://github.com/docker-library/docker/blob/5a196cae40e2a0ab5050cf6d79b697e032352b24/17.03/Dockerfile
ENV DOCKER_CHANNEL stable
ENV DOCKER_VERSION 17.03.1-ce

RUN curl -fL -o docker.tgz "https://download.docker.com/linux/static/${DOCKER_CHANNEL}/x86_64/docker-${DOCKER_VERSION}.tgz"; \
	tar --extract \
		--file docker.tgz \
		--strip-components 1 \
		--directory /usr/local/bin/ \
	; \
	rm docker.tgz;

COPY build_config.rb /usr/local/src/ngx_mruby
RUN cd /usr/local/src/ngx_mruby && sh build.sh && make install

WORKDIR /usr/local/nginx

COPY hook /usr/local/nginx/hook
COPY conf /usr/local/nginx/conf

CMD cat conf/nginx.conf.erb | ruby -r erb -r json -r /usr/local/nginx/conf/init.rb -e 'ERB.new($<.read, nil, ?-).run' > conf/nginx.conf && /usr/local/nginx/sbin/nginx
