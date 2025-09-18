// index.js (Ponto de entrada do Backend)

// --- 1. Importação das Ferramentas ---
const express = require('express');
const cors = require('cors'); // <-- NOVO: Importamos o middleware CORS
const mainRouter = require('./src/routes'); // Importa o roteador principal
require('./src/config/firebase.config'); // Inicializa a conexão com o Firebase

// --- 2. Criação do Servidor ---
const app = express();
const port = 3000;

// --- 3. Configuração de Middlewares ---
app.use(express.json()); // Habilita o servidor para entender requisições com corpo em JSON

// <-- NOVO: Habilita o CORS para todas as origens -->
// Esta linha deve vir ANTES da definição das suas rotas.
// Por padrão, isso permite requisições de qualquer origem, o que é perfeito para o desenvolvimento local.
app.use(cors());

// --- 4. Montagem das Rotas ---
// Todas as rotas definidas no roteador principal serão prefixadas com /api/v1
app.use('/api/v1', mainRouter);

// --- 5. Iniciando o Servidor ---
app.listen(port, () => {
  console.log(`Servidor "Quero Plantão" (Fase 2) rodando na porta ${port}!`);
});