# usage:
#   docker build -t ga-analiticcl-evaluation -f docker/Dockerfile .
#   docker run -p8888:80 ga-analiticcl-evaluation

# build
FROM node:12 AS build

WORKDIR /work
COPY public public
COPY src src
COPY package.json .
COPY tsconfig.json .
RUN yarn install && \
    yarn build


# run
FROM nginx:latest

COPY --from=build /work/build /usr/share/nginx/html
