// index.js (Raiz do Projeto)

const express = require('express');
require('./src/config/firebase.config');
const mainRouter = require('./src/routes/index');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/v1', mainRouter);

app.listen(port, () => {
  console.log(`Servidor "Quero Plantão" rodando em http://localhost:${port}`);
  console.log(`As rotas da API estão disponíveis em http://localhost:${port}/api/v1`);
});