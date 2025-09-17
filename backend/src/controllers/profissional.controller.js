// src/controllers/profissional.controller.js

// Importa o serviço que contém a lógica de negócio.
const profissionalService = require('../services/profissional.service');

/**
 * Controller para a criação de um novo profissional.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
const create = async (req, res) => {
  try {
    // 1. Extrai os dados do corpo da requisição.
    const profissionalData = req.body;

    // 2. Chama o serviço para executar a lógica de negócio.
    const novoProfissionalId = await profissionalService.createProfissional(profissionalData);

    // 3. Envia a resposta de sucesso com o ID do novo recurso.
    res.status(201).send({ id: novoProfissionalId, message: 'Profissional criado com sucesso!' });

  } catch (error) {
    // 4. Em caso de erro, loga e envia uma resposta de erro genérica.
    console.error("Erro no controller ao criar profissional: ", error);
    res.status(500).send({ message: 'Erro no servidor.' });
  }
};

// Exporta as funções do controller.
module.exports = {
  create,
};
