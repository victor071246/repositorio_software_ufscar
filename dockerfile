# Dockerfile

FROM node:18-alpine

WORKDIR /usr/src/app

# Ativar Corepack para gerenciar Yarn
RUN corepack enable

# Copiar apenas arquivos de definição de pacotes primeiro (para cache de dependências)
COPY package.json yarn.lock .yarnrc.yml ./

# Instalar dependências como root para evitar problemas de permissão
USER root
RUN yarn install --immutable
RUN chown -R node:node /usr/src/app
USER node

# Copiar o restante do código
COPY --chown=node:node . .

EXPOSE 3001

CMD ["node", "app/src/server.js"]
