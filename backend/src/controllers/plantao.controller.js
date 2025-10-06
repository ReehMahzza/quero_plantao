// backend/src/controllers/plantao.controller.js

const plantaoService = require('../services/plantao.service');

// RENOMEADO
const getAll = async (req, res) => {
  try {
    const plantoes = await plantaoService.getAllPlantoes();
    res.status(200).send(plantoes);
  } catch (error) {
    console.error("Erro ao buscar todos os plantões: ", error);
    res.status(500).send({ message: 'Erro no servidor ao buscar plantões.' });
  }
};

const findSingle = async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const plantao = await plantaoService.findPlantaoById(plantaoId);
    if (!plantao) {
      return res.status(404).send({ message: 'Plantão não encontrado.' });
    }
    res.status(200).send(plantao);
  } catch (error) {
    console.error('Erro ao buscar plantão por ID:', error);
    res.status(500).send({ message: 'Erro no servidor.' });
  }
};

// --- MANTENDO AS FUNÇÕES EXISTENTES ---
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

/**
 * NOVO: Controller para listar os candidatos de um plantão.
 */
const listarCandidatos = async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const candidatos = await plantaoService.listarCandidatosPorPlantao(plantaoId);
    res.status(200).json(candidatos);
  } catch (error) {
    console.error('Erro no controller ao listar candidatos:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

/**
 * NOVO: Controller para aprovar um candidato.
 */
const aprovarCandidato = async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const { idProfissionalAprovado } = req.body;
    const idInstituicao = req.user.uid; // UID da instituição logada

    if (!idProfissionalAprovado) {
      return res.status(400).json({ message: 'O campo "idProfissionalAprovado" é obrigatório.' });
    }

    await plantaoService.aprovarCandidato({ plantaoId, idProfissionalAprovado, idInstituicao });

    res.status(200).json({ message: 'Candidato aprovado e plantão preenchido com sucesso!' });

  } catch (error) {
    console.error('Erro no controller ao aprovar candidato:', error);
    // Retorna a mensagem de erro específica do serviço (ex: plantão já preenchido)
    res.status(error.statusCode || 500).json({ message: error.message || 'Erro interno no servidor.' });
  }
};


module.exports = {
  getAll,
  create,
  candidatar,
  findSingle,
  listarCandidatos,
  aprovarCandidato,
};
