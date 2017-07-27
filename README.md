# Yaichi

Yaichi is a reverse proxy for developers using Docker on development environment.

## Demo

![demo](https://s3-ap-northeast-1.amazonaws.com/mtsmfm/yaichi.gif)

## Usage

1. Run Yaichi

        $ docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 80:80 mtsmfm/yaichi

2. Run containers you want to connect via Yaichi

        $ docker run -d --name yaichi-test-1 nginx:alpine
        $ docker run -d --name yaichi-test-2 nginx:alpine

3. Access yaichi-test via browser

  Yaichi allows you to access \<container-name\>.localhost so you can access `yaichi-test-1` container via http://yaichi-test-1.localhost

## Development

        $ git clone https://github.com/mtsmfm/yaichi
        $ cd yaichi
        $ docker-compose up
        $ open http://localhost:80
