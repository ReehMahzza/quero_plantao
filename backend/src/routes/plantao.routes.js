const express = require('express');
const router = express.Router();
const plantaoController = require('../controllers/plantao.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

// Rota para criar um novo plantão (já existente)
router.post('/', ensureAuthenticated, plantaoController.create);

// Rota para listar todos os plantões (já existente)
router.get('/', ensureAuthenticated, plantaoController.getAll);

// NOVA Rota para buscar um plantão específico pelo ID
router.get('/:plantaoId', ensureAuthenticated, plantaoController.findSingle);

// NOVA Rota para listar todos os candidatos de um plantão específico
router.get('/:plantaoId/candidaturas', ensureAuthenticated, plantaoController.listarCandidatos);

// NOVA Rota para aprovar um candidato para um plantão
router.post('/:plantaoId/aprovar-candidato', ensureAuthenticated, plantaoController.aprovarCandidato);

module.exports = router;
