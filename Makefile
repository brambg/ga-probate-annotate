all: build

.install: package.json tsconfig.json
	yarn install
	touch .install

.build: .install src/* public/*
	yarn build
	touch .build

build: .build