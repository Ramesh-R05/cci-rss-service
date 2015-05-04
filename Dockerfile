FROM node:0.12

ADD package.json /tmp/package.json
WORKDIR /tmp

RUN npm config set proxy http://proxy.mgmt.local:3128 && \
    npm config set https-proxy http://proxy.mgmt.local:3128 && \
    npm install --production && \
    mkdir /app && \
    cp -r node_modules /app

ADD . /app
WORKDIR /app

EXPOSE 8001

CMD ["npm", "run", "start"]
