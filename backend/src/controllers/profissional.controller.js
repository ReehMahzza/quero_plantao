// src/controllers/profissional.controller.js
const profissionalService = require('../services/profissional.service');

/**
 * Controller para a criação de um novo profissional.
 */
const create = async (req, res) => {
  try {
    const profissionalData = req.body;
    const novoProfissionalId = await profissionalService.createProfissional(profissionalData);
    res.status(201).send({ id: novoProfissionalId, message: 'Profissional criado com sucesso!' });
  } catch (error) {
    console.error("Erro no controller ao criar profissional: ", error);
    res.status(500).send({ message: 'Erro no servidor.' });
  }
};

/**
 * Controller para a atualização do perfil do profissional autenticado.
 */
const updateMeuPerfil = async (req, res) => {
  try {
    const { uid } = req.user;
    const data = req.body;
    // ... (lógica de validação existente)
    await profissionalService.updatePerfil(uid, data);
    res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar perfil do profissional:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao atualizar o perfil.' });
  }
};

/**
 * Controller para buscar os dados do próprio perfil.
 */
const getMeuPerfil = async (req, res) => {
    try {
        const { uid } = req.user;
        const perfil = await profissionalService.getPerfilByUserId(uid);
        if (!perfil) {
            return res.status(404).json({ message: 'Perfil não encontrado.' });
        }
        res.status(200).json(perfil);
    } catch (error) {
        console.error('Erro ao buscar o próprio perfil:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

/**
 * NOVO: Controller para buscar o perfil público de um profissional pelo seu ID.
 */
const getProfissionalById = async (req, res) => {
  try {
    const { profissionalId } = req.params;

    const perfil = await profissionalService.getPerfilByUserId(profissionalId);

    // Regra de Segurança: Se o perfil não for encontrado, retorna 404.
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil do profissional não encontrado.' });
    }

    // Filtro de Dados Sensíveis: Cria um novo objeto omitindo campos privados.
    const perfilPublico = {
      nomeCompleto: perfil.nomeCompleto,
      email: perfil.email,
      coren: perfil.coren,
      anosDeExperiencia: perfil.anosDeExperiencia,
      especialidades: perfil.especialidades,
      resumoProfissional: perfil.resumoProfissional,
      // Omitimos intencionalmente: cpf, dadosBancarios, dataNascimento, sexo, telefone, endereco.
    };

    res.status(200).json(perfilPublico);

  } catch (error) {
    console.error('Erro ao buscar perfil do profissional por ID:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = {
  create,
  updateMeuPerfil,
  getMeuPerfil,
  getProfissionalById, // Exporta a nova função
};
