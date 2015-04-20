FROM node:0.12

ADD . /app
WORKDIR /app

RUN npm config set proxy http://proxy.mgmt.local:3128 && \
    npm config set https-proxy http://proxy.mgmt.local:3128 && \
    npm install

EXPOSE 8001

CMD ["npm", "run", "start"]
