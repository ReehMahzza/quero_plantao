// index.js (Ponto de entrada do Backend)

// --- 1. Importação das Ferramentas ---
const express = require('express');
const cors = require('cors');
const mainRouter = require('./src/routes');
require('./src/config/firebase.config');

// --- 2. Criação do Servidor ---
const app = express();
const port = process.env.PORT || 3000;

// --- 3. Configuração de Middlewares ---
app.use(express.json());

// --- CORREÇÃO APLICADA AQUI ---
// Adicionamos a nova porta do frontend (5174) à lista de origens permitidas.
const corsOptions = {
  origin: [
    'https://quero-plantao-793ef.web.app', // URL de produção
    'http://localhost:5173',               // URL de desenvolvimento padrão
    'http://localhost:5174'                // URL de desenvolvimento alternativa (a sua atual)
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- 4. Montagem das Rotas ---
// Rota raiz com branding atualizado
app.get('/', (req, res) => {
  res.send('API Conecta Care no ar!');
});

app.use('/api/v1', mainRouter);

// --- 5. Iniciando o Servidor ---
app.listen(port, () => {
  // Mensagem de log com branding atualizado
  console.log(`Servidor "Conecta Care" rodando na porta ${port}!`);
});
