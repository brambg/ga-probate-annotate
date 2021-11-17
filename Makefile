all: build

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