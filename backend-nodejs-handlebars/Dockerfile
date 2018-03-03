FROM node:latest

ENV PROJECT_ROOT /opt/app

RUN apt-get update \
  && apt-get install -y man postgresql-client-9.4 \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pm2

RUN mkdir -p /tmp/app

COPY package.json /tmp/app/package.json

RUN cd /tmp/app/ && npm install --silent

WORKDIR $PROJECT_ROOT

CMD ["/opt/app/bin/start.sh"]