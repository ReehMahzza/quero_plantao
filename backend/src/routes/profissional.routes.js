// src/routes/profissional.routes.js
const express = require('express');
const router = express.Router();
const profissionalController = require('../controllers/profissional.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware');

// Rota para CRIAR um novo profissional (existente)
router.post('/', profissionalController.create);

// Rota para buscar os dados do PRÓPRIO perfil (mais específica, vem primeiro)
router.get('/meu-perfil', ensureAuthenticated, profissionalController.getMeuPerfil);

// Rota para ATUALIZAR o PRÓPRIO perfil
router.put('/meu-perfil', ensureAuthenticated, profissionalController.updateMeuPerfil);

// NOVA Rota para buscar o perfil de QUALQUER profissional pelo ID (mais genérica, vem por último)
router.get('/:profissionalId', ensureAuthenticated, profissionalController.getProfissionalById);

module.exports = router;
