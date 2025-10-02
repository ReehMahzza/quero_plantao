# Etapa 1: Use uma imagem oficial do Node.js como base
FROM node:20-slim

# Etapa 2: Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Etapa 3: Copie os arquivos de dependências
COPY package*.json ./

# Etapa 4: Instale as dependências de produção
RUN npm ci --only=production

# Etapa 5: Copie todo o resto do código da aplicação
COPY . .

# Etapa 6: Diga à Google qual porta a nossa aplicação usa
ENV PORT 8080

# Etapa 7: O comando para iniciar a aplicação
CMD [ "node", "index.js" ]