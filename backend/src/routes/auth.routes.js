// backend/src/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rota para o registo de um novo profissional
router.post('/signup/profissional', authController.signupProfissional);

module.exports = router;
