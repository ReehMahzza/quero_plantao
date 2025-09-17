// src/controllers/plantao.controller.js

const plantaoService = require('../services/plantao.service');

const create = async (req, res) => {
  try {
    const { instituicaoId, ...plantaoData } = req.body;
    if (!instituicaoId) {
      return res.status(400).send({ message: 'O ID da instituição (instituicaoId) é obrigatório.' });
    }
    const plantaoId = await plantaoService.createPlantao(instituicaoId, plantaoData);
    res.status(201).send({ id: plantaoId, message: 'Plantão criado com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar plantão: ", error.message);
    if (error.message === 'INSTITUICAO_NAO_ENCONTRADA') {
      return res.status(404).send({ message: 'Instituição não encontrada para publicar o plantão.' });
    }
    res.status(500).send({ message: 'Erro no servidor ao criar plantão.' });
  }
};

const getAllOpen = async (req, res) => {
  try {
    const plantoes = await plantaoService.getOpenPlantoes();
    res.status(200).send(plantoes);
  } catch (error) {
    console.error("Erro ao listar plantões: ", error);
    res.status(500).send({ message: 'Erro no servidor ao listar plantões.' });
  }
};

const candidatar = async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const { profissionalId } = req.body;
    if (!profissionalId) {
      return res.status(400).send({ message: 'O ID do profissional (profissionalId) é obrigatório.' });
    }
    await plantaoService.createCandidatura(plantaoId, profissionalId);
    res.status(201).send({ message: 'Candidatura realizada com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar candidatura: ", error.message);
    if (error.message === 'PLANTÃO_NAO_ENCONTRADO') { return res.status(404).send({ message: 'Plantão não encontrado.' }); }
    if (error.message === 'PLANTAO_NAO_ABERTO') { return res.status(403).send({ message: 'Não é possível se candidatar a este plantão.' }); }
    if (error.message === 'PROFISSIONAL_NAO_ENCONTRADO') { return res.status(404).send({ message: 'Profissional não encontrado.' }); }
    if (error.message === 'CANDIDATURA_DUPLICADA') { return res.status(409).send({ message: 'Este profissional já se candidatou a este plantão.' }); }
    res.status(500).send({ message: 'Erro no servidor ao processar a candidatura.' });
  }
};

const listCandidaturas = async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const candidaturas = await plantaoService.getCandidaturas(plantaoId);
    res.status(200).send(candidaturas);
  } catch (error) {
    console.error("Erro ao listar candidaturas: ", error.message);
    if (error.message === 'PLANTÃO_NAO_ENCONTRADO') {
      return res.status(404).send({ message: 'Plantão não encontrado.' });
    }
    res.status(500).send({ message: 'Erro no servidor ao listar candidaturas.' });
  }
};

const aprovar = async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const { profissionalId } = req.body;
    if (!profissionalId) {
      return res.status(400).send({ message: 'O ID do profissional (profissionalId) é obrigatório.' });
    }
    await plantaoService.aprovarCandidato(plantaoId, profissionalId);
    res.status(200).send({ message: 'Candidato aprovado com sucesso! O plantão foi preenchido.' });
  } catch (error) {
    console.error("Erro ao aprovar candidato: ", error.message);
    if (error.message === 'PLANTÃO_NAO_ENCONTRADO') { return res.status(404).send({ message: 'Plantão não encontrado.' }); }
    if (error.message === 'PLANTAO_NAO_MAIS_ABERTO') { return res.status(403).send({ message: 'Este plantão não está mais aberto para aprovações.' }); }
    if (error.message === 'CANDIDATURA_NAO_ENCONTRADA') { return res.status(404).send({ message: 'A candidatura para o profissional especificado não foi encontrada.' }); }
    if (error.message === 'CANDIDATO_JA_PROCESSADO') { return res.status(409).send({ message: 'Este candidato já foi aprovado ou rejeitado.' }); }
    res.status(500).send({ message: 'Erro no servidor ao aprovar candidato.' });
  }
};

module.exports = {
  create,
  getAllOpen,
  candidatar,
  listCandidaturas,
  aprovar,
};
