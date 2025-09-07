# Arquivo: Dockerfile (na raiz do projeto)

# Passo 1: Imagem base
FROM node:18-alpine

# Passo 2: Diretório de trabalho
WORKDIR /usr/src/app

# Passo 3: Copiar TUDO relacionado ao Yarn para aproveitar o cache.
# Isso inclui os binários do Yarn v4 que estão na pasta .yarn
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./
COPY .yarn ./.yarn

# Passo 4 (NOVO): Habilitar o Corepack para gerenciar as versões do Yarn
RUN corepack enable

# Passo 5: Instalar as dependências. Agora o Corepack usará o Yarn v4
RUN yarn install --frozen-lockfile

# Passo 6: Copiar o restante do código da aplicação
COPY . .

# Passo 7: Expor a porta
EXPOSE 3001

# Passo 8: Comando para iniciar a aplicação
CMD ["node", "app/src/server.js"]
