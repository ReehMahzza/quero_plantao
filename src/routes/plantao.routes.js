// src/routes/plantao.routes.js

const express = require('express');
const router = express.Router();
const plantaoController = require('../controllers/plantao.controller');

// Rotas principais de plantões
router.post('/', plantaoController.create);
router.get('/', plantaoController.getAllOpen);

// Rotas de candidaturas de um plantão específico
router.get('/:plantaoId/candidaturas', plantaoController.listCandidaturas);
router.post('/:plantaoId/candidatar-se', plantaoController.candidatar);

// Rota de gestão de um plantão específico
router.post('/:plantaoId/aprovar-candidato', plantaoController.aprovar);

module.exports = router;
