// index.js (Ponto de entrada do Backend)

// --- 1. Importação das Ferramentas ---
const express = require('express');
const cors = require('cors'); // <-- NOVO: Importamos o middleware CORS
const mainRouter = require('./src/routes'); // Importa o roteador principal
require('./src/config/firebase.config'); // Inicializa a conexão com o Firebase

// --- 2. Criação do Servidor ---
const app = express();
const port = process.env.PORT || 3000;

// --- 3. Configuração de Middlewares ---
app.use(express.json()); // Habilita o servidor para entender requisições com corpo em JSON

// <-- NOVO: Habilita o CORS para a aplicação frontend -->
// Esta linha deve vir ANTES da definição das suas rotas.
// Configuramos para aceitar requisições apenas do nosso frontend na web.
const corsOptions = {
  origin: ['https://quero-plantao-793ef.web.app', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- 4. Montagem das Rotas ---
// Rota raiz para health check ou boas-vindas
app.get('/', (req, res) => {
  res.send('API Quero Plantão no ar!');
});

// Todas as rotas definidas no roteador principal serão prefixadas com /api/v1
app.use('/api/v1', mainRouter);

// --- 5. Iniciando o Servidor ---
app.listen(port, () => {
  console.log(`Servidor "Quero Plantão" (Fase 2) rodando na porta ${port}!`);
});