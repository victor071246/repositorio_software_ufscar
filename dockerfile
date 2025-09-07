# Passo 1: Usar uma imagem oficial do Node.js como base.
# A tag 'alpine' se refere a uma versão mínima e leve do Linux, ideal para contêineres.
FROM node:18-alpine

# Passo 2: Definir o diretório de trabalho dentro do contêiner.
# Todos os comandos seguintes serão executados a partir desta pasta.
WORKDIR /usr/src/app

# Passo 3: Copiar os arquivos de manifesto de pacotes.
# Copiamos estes primeiro para aproveitar o cache do Docker. Se eles não mudarem,
# o Docker não precisará reinstalar as dependências toda vez que você reconstruir a imagem.
COPY package.json yarn.lock ./

# Passo 4: Instalar as dependências do projeto usando Yarn.
# O '--frozen-lockfile' garante que as versões exatas do yarn.lock sejam instaladas.
RUN yarn install --frozen-lockfile

# Passo 5: Copiar o restante do código da sua aplicação para o diretório de trabalho.
# O primeiro '.' representa a pasta atual no seu computador (a raiz do projeto).
# O segundo '.' representa o diretório de trabalho dentro do contêiner (/usr/src/app).
COPY . .

# Passo 6: Expor a porta que sua aplicação usa dentro do contêiner.
# Isso é mais uma documentação. A porta real é mapeada no docker-compose.yml.
EXPOSE 3001

# Passo 7: Definir o comando para iniciar a aplicação quando o contêiner rodar.
# Com base na sua estrutura, o arquivo de entrada parece ser 'app/src/server.js'.
CMD ["node", "app/src/server.js"]
