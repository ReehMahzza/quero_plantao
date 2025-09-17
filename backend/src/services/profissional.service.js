// src/services/profissional.service.js

// Importa a instância 'db' e 'admin' já inicializadas do nosso arquivo de configuração
const { db, admin } = require('../config/firebase.config');
/**
 * Cria um novo profissional no banco de dados.
 * @param {object} profissionalData - Os dados do profissional recebidos da requisição.
 * @returns {Promise<string>} O ID do novo profissional criado.
 */
const createProfissional = async (profissionalData) => {
  // 1. Formata o objeto para garantir a consistência dos dados no banco.
  // Esta lógica de negócio agora vive exclusivamente no serviço.
  const profissionalFormatado = {
    nomeCompleto: profissionalData.nomeCompleto,
    email: profissionalData.email,
    cpf: profissionalData.cpf,
    coren: {
      numero: profissionalData.coren.numero,
      estado: profissionalData.coren.estado
    },
    avaliacaoMedia: profissionalData.avaliacaoMedia || 0,
    especialidade: profissionalData.especialidade || 'Não informada',
    statusGeral: 'pending_api_check',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // 2. Acessa a coleção 'profissionais' e adiciona o novo documento.
  const docRef = await db.collection('profissionais').add(profissionalFormatado);

  // 3. Retorna o ID do documento criado.
  return docRef.id;
};

// Exporta as funções do serviço para serem usadas pelos controllers.
module.exports = {
  createProfissional,
};
