FROM node:16-alpine
 
LABEL mantainer="leandrooromualdo"
 
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
 
WORKDIR /home/node/app
 
WORKDIR /home/node/app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
COPY --chown=node:node . .
 
USER node
 
#Porta de execucao da aplicacao
ARG APPLICATION_PORT=3010
ENV APP_PORT=${APPLICATION_PORT}
 
#Configuracoes de conexao ao banco de dados
ENV ENV_DEPLOY 'production'
ENV DB_HOST 'localhost'
ENV DB_PORT 5432
ENV DB_NAME 'db_carteiras'
ENV DB_USER 'postgres'
ENV DB_PASSWORD 'Senha123'
 
#Configuracoes de conexao a MQ
ENV HOST_MQ 'amqp://localhost'
ENV QUEUE_NAME 'draws'
ENV EXCHANGE_NOTIFICATIONS_NAME 'notifications'

#Configuracoes repositorio Api
ENV WALLET_API_URL = 'http://localhost:3001/api/v1'

EXPOSE ${APP_PORT}
 
CMD [ "node", "server.js" ]