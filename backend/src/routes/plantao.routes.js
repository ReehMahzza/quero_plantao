// backend/src/routes/plantao.routes.js

const express = require('express');
const router = express.Router();
const plantaoController = require('../controllers/plantao.controller');

router.post('/', plantaoController.create);
router.get('/', plantaoController.getAll); // ATUALIZADO

// ADICIONE ESTAS DUAS LINHAS NOVAS ANTES DAS ROTAS MAIS ESPECÍFICAS
router.get('/:id', plantaoController.getById); // <-- ROTA PARA BUSCAR UM PLANTÃO

// As rotas com sub-recursos vêm depois
router.get('/:plantaoId/candidaturas', plantaoController.listCandidaturas);
router.post('/:plantaoId/candidatar-se', plantaoController.candidatar);
router.post('/:plantaoId/aprovar-candidato', plantaoController.aprovar);

module.exports = router;