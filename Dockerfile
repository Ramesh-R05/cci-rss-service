FROM node:0.12

ADD package.json /tmp/package.json
WORKDIR /tmp

RUN npm config set proxy http://sydproxy.acp.net:8080 && \
    npm config set https-proxy http://sydproxy.acp.net:8080 && \
    npm install

RUN mkdir /app

RUN cp -r node_modules /app

ADD . /app
WORKDIR /app

RUN npm run test

EXPOSE 8001

CMD ["npm", "run", "start"]
