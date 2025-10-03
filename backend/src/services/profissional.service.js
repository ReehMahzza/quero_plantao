const { db, admin } = require('../config/firebase.config');

/**
 * REATORIZADO: Cria o documento de perfil mínimo para um novo profissional.
 * @param {object} data - Objeto contendo uid, nomeCompleto, email e cpf.
 */
const createProfissional = async (data) => {
  const profissionalDocRef = db.collection('profissionais').doc(data.uid);

  const perfilMinimo = {
    nomeCompleto: data.nomeCompleto,
    email: data.email,
    cpf: data.cpf,
    statusDoPerfil: 'pendente',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await profissionalDocRef.set(perfilMinimo);
};

/**
 * Atualiza o perfil de um profissional existente no banco de dados.
 * @param {string} userId - O UID do profissional a ser atualizado.
 * @param {object} data - Os novos dados do perfil.
 */
const updatePerfil = async (userId, data) => {

  const profissionalDocRef = db.collection('profissionais').doc(userId);

  const dadosParaAtualizar = {
    nomeCompleto: data.nomeCompleto,
    cpf: data.cpf,
    dataNascimento: data.dataNascimento,
    sexo: data.sexo,
    telefone: data.telefone,
    coren: data.coren,
    endereco: data.endereco,
    anosDeExperiencia: data.anosDeExperiencia,
    ...(data.especialidades && { especialidades: data.especialidades }),
    ...(data.resumoProfissional && { resumoProfissional: data.resumoProfissional }),
    ...(data.dadosBancarios && { dadosBancarios: data.dadosBancarios }),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Validação para verificar se o perfil está completo
  const isComplete =
    data.nomeCompleto?.trim() &&
    data.cpf?.trim() &&
    data.dataNascimento &&
    data.sexo &&
    data.telefone?.trim() &&
    data.coren && data.coren.tipo && data.coren.numero?.trim() && data.coren.estado &&
    data.endereco && data.endereco.cep?.trim() && data.endereco.rua?.trim() && data.endereco.numero?.trim() && data.endereco.bairro?.trim() && data.endereco.cidade?.trim() && data.endereco.estado &&
    String(data.anosDeExperiencia).trim() &&
    data.resumoProfissional?.trim();

  if (isComplete) {
    dadosParaAtualizar.statusDoPerfil = 'ativo';
  }

  await profissionalDocRef.set(dadosParaAtualizar, { merge: true });
};


/**
 * Busca o perfil de um profissional pelo seu User ID.
 * @param {string} userId - O UID do profissional.
 * @returns {Promise<object|null>} Os dados do perfil ou null se não for encontrado.
 */
const getPerfilByUserId = async (userId) => {
  const docRef = db.collection('profissionais').doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }
  return doc.data();
};


module.exports = {
  createProfissional,
  updatePerfil,
  getPerfilByUserId,
};

