// src/routes/instituicao.routes.js

const express = require('express');
const router = express.Router();
const instituicaoController = require('../controllers/instituicao.controller');

router.post('/', instituicaoController.create);
router.get('/:id', instituicaoController.getById);

module.exports = router;
