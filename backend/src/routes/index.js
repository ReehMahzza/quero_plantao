// src/routes/index.js

const express = require('express');
const router = express.Router();

// Importa as rotas específicas de cada recurso.
const profissionalRoutes = require('./profissional.routes');
const instituicaoRoutes = require('./instituicao.routes');
const plantaoRoutes = require('./plantao.routes');

// Monta as rotas de cada recurso sob seus respectivos prefixos.
router.use('/profissionais', profissionalRoutes);
router.use('/instituicoes', instituicaoRoutes);
router.use('/plantoes', plantaoRoutes);

module.exports = router;