// backend/src/routes/index.js

const express = require('express');
const router = express.Router();

const profissionalRoutes = require('./profissional.routes');
const instituicaoRoutes = require('./instituicao.routes');
const plantaoRoutes = require('./plantao.routes');
const authRoutes = require('./auth.routes'); // <-- NOVO: Importa as rotas de auth

router.use('/profissionais', profissionalRoutes);
router.use('/instituicoes', instituicaoRoutes);
router.use('/plantoes', plantaoRoutes);
router.use('/auth', authRoutes); // <-- NOVO: Monta as rotas de auth

module.exports = router;
