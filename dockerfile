# Arquivo: Dockerfile

# Passo 1: Imagem base
FROM node:18-alpine

# Passo 2: Diretório de trabalho
WORKDIR /usr/src/app

# Passo 3: Ativar o Corepack
RUN corepack enable

# Passo 4: Copiar somente os arquivos de definição de pacotes
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./

# --- INÍCIO DA CORREÇÃO DE PERMISSÃO ---
# Muda para o usuário root para ter permissão de instalar pacotes
USER root

# Concede a propriedade da pasta da aplicação ao usuário node
RUN chown -R node:node /usr/src/app

# Instala dependências como root para evitar problemas de permissão
RUN yarn install --immutable

# Volta para o usuário node, que é mais seguro para rodar a aplicação
USER node
# --- FIM DA CORREÇÃO DE PERMISSÃO ---

# Passo 5: Copiar o restante do código da aplicação
COPY --chown=node:node . .

# Passo 6: Expor a porta que a aplicação vai usar
EXPOSE 3001

# Passo 7: Comando para iniciar a aplicação
CMD ["node", "app/src/server.js"]
