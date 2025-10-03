// src/routes/profissional.routes.js
const express = require('express');
const router = express.Router();
const profissionalController = require('../controllers/profissional.controller');
const { ensureAuthenticated } = require('../middlewares/auth.middleware'); // Middleware de autenticação

// Rota para CRIAR um novo profissional (existente)
router.post('/', profissionalController.create);

// Rota para LER o perfil do profissional autenticado
router.get(
  '/meu-perfil',
  ensureAuthenticated, // Apenas utilizadores autenticados podem aceder
  profissionalController.getMeuPerfil
);

// Rota para ATUALIZAR o perfil do profissional autenticado
router.put(
  '/meu-perfil',
  ensureAuthenticated, // Apenas utilizadores autenticados podem aceder
  profissionalController.updateMeuPerfil
);

module.exports = router;