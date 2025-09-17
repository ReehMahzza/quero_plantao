// src/controllers/instituicao.controller.js

const instituicaoService = require('../services/instituicao.service');

const create = async (req, res) => {
  try {
    const instituicaoId = await instituicaoService.createInstituicao(req.body);
    res.status(201).send({ id: instituicaoId, message: 'Instituição criada com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar instituição: ", error);
    res.status(500).send({ message: 'Erro no servidor ao criar instituição.' });
  }
};

const getById = async (req, res) => {
  try {
    const instituicao = await instituicaoService.getInstituicaoById(req.params.id);
    if (!instituicao) {
      return res.status(404).send({ message: 'Instituição não encontrada.' });
    }
    res.status(200).send(instituicao);
  } catch (error) {
    console.error("Erro ao buscar instituição: ", error);
    res.status(500).send({ message: 'Erro no servidor ao buscar instituição.' });
  }
};

module.exports = {
  create,
  getById,
};
