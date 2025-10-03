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

/**
 * NOVO: Controller para buscar o perfil do profissional autenticado.
 */
const getMeuPerfil = async (req, res) => {
  try {
    // O UID do usuário vem do middleware 'ensureAuthenticated'
    const userId = req.user.uid;
    const perfil = await profissionalService.getPerfilByUserId(userId);

    if (!perfil) {
      return res.status(404).send({ message: 'Perfil não encontrado.' });
    }

    res.status(200).send(perfil);
  } catch (error) {
    console.error("Erro ao buscar perfil: ", error);
    res.status(500).send({ message: 'Erro no servidor ao buscar perfil.' });
  }
};

/**
 * NOVO: Controller para atualizar o perfil do profissional autenticado.
 */
const updateMeuPerfil = async (req, res) => {
  try {
    const userId = req.user.uid;
    const dadosPerfil = req.body;

    await profissionalService.updatePerfil(userId, dadosPerfil);

    res.status(200).send({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error("Erro ao atualizar perfil: ", error);
    res.status(500).send({ message: 'Erro no servidor ao atualizar perfil.' });
  }
};


// Exporta as funções do controller.
module.exports = {
  create,
  getMeuPerfil,
  updateMeuPerfil,
};