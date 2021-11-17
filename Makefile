all: build

.PHONY: build docker-image start help

.make/.install: package.json tsconfig.json
	yarn install
	touch .install

.make/.build: .make/.install src/* public/*
	yarn build
	touch .make/.build

build: .make/.build

.make/.docker: docker/Dockerfile public/* src/* package.json
	docker build -t ga-analiticcl-evaluation:latest -f docker/Dockerfile .
	touch .docker

docker-image: .make/.docker

start:
	yarn start

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  build           to build the app for deployment"
	@echo "  start           to run the app in development mode"
	@echo "  docker-image    to build the docker image of the app, running in nginx"
