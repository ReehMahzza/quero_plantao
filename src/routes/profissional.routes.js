// src/routes/profissional.routes.js

const express = require('express');
const router = express.Router();
const profissionalController = require('../controllers/profissional.controller');

// Define a rota POST para a raiz ('/') do recurso de profissionais.
// Quando uma requisição POST chegar em /api/v1/profissionais,
// ela será tratada pela função 'create' do 'profissionalController'.
router.post('/', profissionalController.create);

module.exports = router;
