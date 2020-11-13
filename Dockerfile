FROM node:12.19.0-alpine

# Set env' variables
ARG API_URL

RUN set -ex \
    && mkdir /opt/app

WORKDIR /opt/app

# Install packages
ADD . /opt/app/

RUN npm install

RUN npm run build

# Service port
EXPOSE 3000

CMD ["npm", "run", "start"]
