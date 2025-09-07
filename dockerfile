# Arquivo: Dockerfile

# Passo 1: Imagem base
FROM node:18-alpine

# Passo 2: Diretório de trabalho
WORKDIR /usr/src/app

# --- Permissões ---
USER root
RUN chown -R node:node /usr/src/app
USER node

# Passo 3: Copiar arquivos de definição de pacotes (package.json e yarn.lock)
COPY package.json yarn.lock ./

# Passo 4: Instalar dependências usando Yarn Classic (node_modules)
RUN yarn install --immutable

# Passo 5: Copiar o restante do código
COPY --chown=node:node . .

# Passo 6: Expor porta da aplicação
EXPOSE 3001

# Passo 7: Rodar aplicação
CMD ["node", "app/src/server.js"]
