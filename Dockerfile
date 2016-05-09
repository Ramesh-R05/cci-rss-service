FROM bauer/node-lite-base

ARG node_ver=v0.12.8

ADD ./deployment/nginx/service.conf /etc/nginx/conf.d/field-indexer.conf

ADD ./src /app

WORKDIR /app

EXPOSE 80 9001

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]