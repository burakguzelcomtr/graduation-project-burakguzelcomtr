FROM node:alpine

RUN npm install -g nodemon

WORKDIR /app

ADD package.json package-lock.json ./
ADD bin ./bin
ADD src ./src
RUN npm install



CMD [ "nodemon" ]