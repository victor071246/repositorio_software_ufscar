# Arquivo: Dockerfile

# Passo 1: Imagem base
FROM node:18-alpine

# Passo 2: Diretório de trabalho
WORKDIR /usr/src/app

# Passo 3: Ativar o Corepack
RUN corepack enable

# Passo 4: Copiar arquivos de definição de pacotes
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./

# --- Permissões ---
USER root
RUN chown -R node:node /usr/src/app
USER node

# Passo 5: Instalar Yarn globalmente e instalar dependências
RUN corepack prepare yarn@stable --activate
RUN yarn install

# Passo 6: Copiar o restante do código
COPY --chown=node:node . .

# Passo 7: Expor porta
EXPOSE 3001

# Passo 8: Rodar aplicação
CMD ["node", "app/src/server.js"]
