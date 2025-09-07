# Arquivo: Dockerfile

# Passo 1: Imagem base
FROM node:18-alpine

# Passo 2: Diretório de trabalho
WORKDIR /usr/src/app

# Passo 3: Ativar o Corepack PRIMEIRO
RUN corepack enable

# Passo 4: Copiar SOMENTE os arquivos de definição de pacotes
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./

# --- INÍCIO DA CORREÇÃO DE PERMISSÃO ---
# Muda para o usuário root para ter permissão de instalar pacotes globais e de sistema
USER root

# Concede a propriedade da pasta da aplicação ao usuário node
RUN chown -R node:node /usr/src/app

# Volta para o usuário node, que é mais seguro para rodar a aplicação
USER node
# --- FIM DA CORREÇÃO DE PERMISSÃO ---

# Passo 5: Rodar o yarn install. Agora, como usuário 'node' mas com as permissões corretas,
# o Corepack vai conseguir baixar e instalar tudo sem problemas.
RUN yarn install --immutable

# Passo 6: Copiar o restante do código da aplicação
COPY --chown=node:node . .

# Passo 7: Expor a porta
EXPOSE 3001

# Passo 8: Comando para iniciar a aplicação
CMD ["node", "app/src/server.js"]
