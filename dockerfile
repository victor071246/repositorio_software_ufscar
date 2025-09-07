# Arquivo: Dockerfile

# Passo 1: Imagem base
FROM node:18-alpine

# Passo 2: Diretório de trabalho
WORKDIR /usr/src/app

# Passo 3: Ativar o Corepack PRIMEIRO
RUN corepack enable

# Passo 4: Copiar SOMENTE os arquivos de definição de pacotes
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./

# Passo 5: Rodar o yarn install. O Corepack vai baixar a versão
# correta do Yarn (definida no .yarnrc.yml) e depois instalar
# as dependências do projeto.
RUN yarn install --immutable

# Passo 6: Copiar o restante do código da aplicação
COPY . .

# Passo 7: Expor a porta
EXPOSE 3001

# Passo 8: Comando para iniciar a aplicação
CMD ["node", "app/src/server.js"]
