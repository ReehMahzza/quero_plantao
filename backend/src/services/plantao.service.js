// src/services/plantao.service.js

// Importa a instância 'db' e 'admin' já inicializadas
const { db, admin } = require('../config/firebase.config');
/**
 * Cria um novo plantão, denormalizando dados da instituição.
 * @param {string} instituicaoId - ID da instituição publicadora.
 * @param {object} plantaoData - Dados do plantão.
 * @returns {Promise<string>} O ID do novo plantão.
 */
const createPlantao = async (instituicaoId, plantaoData) => {
  const instituicaoRef = db.collection('instituicoes').doc(instituicaoId);
  const instituicaoDoc = await instituicaoRef.get();
  if (!instituicaoDoc.exists) {
    throw new Error('INSTITUICAO_NAO_ENCONTRADA');
  }

  const instituicaoData = instituicaoDoc.data();
  const plantaoFormatado = {
    ...plantaoData,
    dataInicio: admin.firestore.Timestamp.fromDate(new Date(plantaoData.dataInicio)),
    dataFim: admin.firestore.Timestamp.fromDate(new Date(plantaoData.dataFim)),
    instituicaoId: instituicaoId,
    instituicaoInfo: {
      nomeFantasia: instituicaoData.nomeFantasia,
      avaliacaoMedia: instituicaoData.avaliacaoMedia || 0
    },
    status: "open",
    numeroDeCandidatos: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection('plantoes').add(plantaoFormatado);
  return docRef.id;
};

// RENOMEADO E CORRIGIDO: Busca TODOS os plantões.
const getAllPlantoes = async () => {
  const snapshot = await db.collection('plantoes').orderBy('dataInicio', 'desc').get(); // Ordena por data
  if (snapshot.empty) {
    return [];
  }
  const plantoes = [];
  snapshot.forEach(doc => {
    plantoes.push({ id: doc.id, ...doc.data() });
  });
  return plantoes;
};

/**
 * Cria uma candidatura para um plantão.
 * @param {string} plantaoId - O ID do plantão.
 * @param {string} profissionalId - O ID do profissional.
 * @returns {Promise<void>}
 */
const createCandidatura = async (plantaoId, profissionalId) => {
  const plantaoRef = db.collection('plantoes').doc(plantaoId);
  const profissionalRef = db.collection('profissionais').doc(profissionalId);
  const candidaturaRef = plantaoRef.collection('candidaturas').doc(profissionalId);

  return db.runTransaction(async (transaction) => {
    const plantaoDoc = await transaction.get(plantaoRef);
    if (!plantaoDoc.exists) { throw new Error('PLANTÃO_NAO_ENCONTRADO'); }
    if (plantaoDoc.data().status !== 'open') { throw new Error('PLANTAO_NAO_ABERTO'); }

    const profissionalDoc = await transaction.get(profissionalRef);
    if (!profissionalDoc.exists) { throw new Error('PROFISSIONAL_NAO_ENCONTRADO'); }

    const candidaturaExistenteDoc = await transaction.get(candidaturaRef);
    if (candidaturaExistenteDoc.exists) { throw new Error('CANDIDATURA_DUPLICADA'); }

    const profissionalData = profissionalDoc.data();
    const novaCandidaturaData = {
      profissionalInfo: {
        nomeCompleto: profissionalData.nomeCompleto,
        avaliacaoMedia: profissionalData.avaliacaoMedia || 0,
        especialidade: profissionalData.especialidade || 'Não informada'
      },
      status: 'pending',
      dataCandidatura: admin.firestore.FieldValue.serverTimestamp()
    };
    
    transaction.set(candidaturaRef, novaCandidaturaData);
    transaction.update(plantaoRef, { numeroDeCandidatos: admin.firestore.FieldValue.increment(1) });
  });
};

/**
 * NOVO: Busca um plantão e retorna os dados completos dos seus candidatos.
 * @param {string} plantaoId - O ID do plantão.
 * @returns {Promise<Array>} Uma lista de objetos com os dados dos profissionais candidatos.
 */
const listarCandidatosPorPlantao = async (plantaoId) => {
  const plantaoRef = db.collection('plantoes').doc(plantaoId);
  const plantaoDoc = await plantaoRef.get();

  if (!plantaoDoc.exists || !plantaoDoc.data().candidaturas?.length) {
    return []; // Retorna vazio se o plantão não existe ou não tem candidatos
  }

  const candidaturas = plantaoDoc.data().candidaturas;
  const idsProfissionais = candidaturas.map(c => c.idProfissional);

  // Busca todos os documentos dos profissionais de uma vez
  const profissionaisRefs = idsProfissionais.map(id => db.collection('profissionais').doc(id));
  const profissionaisDocs = await db.getAll(...profissionaisRefs);

  const profissionaisMap = new Map();
  profissionaisDocs.forEach(doc => {
    if (doc.exists) {
      profissionaisMap.set(doc.id, doc.data());
    }
  });

  // Combina os dados do perfil com o status da candidatura
  const candidatosComDados = candidaturas.map(cand => ({
    ...profissionaisMap.get(cand.idProfissional), // Dados do perfil
    idProfissional: cand.idProfissional,
    statusCandidatura: cand.status,
  }));

  return candidatosComDados;
};

/**
 * NOVO: Aprova um candidato, alocando-o ao plantão e atualizando os status.
 * Executa como uma transação para garantir a atomicidade.
 * @param {object} params - Parâmetros da operação.
 * @param {string} params.plantaoId - ID do plantão.
 * @param {string} params.idProfissionalAprovado - ID do profissional a ser aprovado.
 * @param {string} params.idInstituicao - ID da instituição (para autorização).
 */
const aprovarCandidato = async ({ plantaoId, idProfissionalAprovado, idInstituicao }) => {
  const plantaoRef = db.collection('plantoes').doc(plantaoId);

  await db.runTransaction(async (transaction) => {
    const plantaoDoc = await transaction.get(plantaoRef);

    if (!plantaoDoc.exists) {
      const error = new Error('Plantão não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const plantaoData = plantaoDoc.data();

    // 1. Autorização: Verifica se a instituição que fez a requisição é a dona do plantão
    if (plantaoData.idInstituicao !== idInstituicao) {
       const error = new Error('Ação não autorizada.');
       error.statusCode = 403;
       throw error;
    }

    // 2. Validação: Verifica se o plantão ainda está aberto
    if (plantaoData.status !== 'Aberta') {
      const error = new Error('Este plantão já foi preenchido ou cancelado.');
      error.statusCode = 409; // Conflict
      throw error;
    }

    // 3. Atualiza o plantão e as candidaturas
    const novasCandidaturas = plantaoData.candidaturas.map(cand => {
        if (cand.idProfissional === idProfissionalAprovado) {
            return { ...cand, status: 'aprovado' };
        }
        return { ...cand, status: 'rejeitado' };
    });

    transaction.update(plantaoRef, {
      status: 'Preenchida',
      idProfissionalAlocado: idProfissionalAprovado,
      candidaturas: novasCandidaturas,
    });
  });
};

const getPlantaoById = async (plantaoId) => {
  const docRef = db.collection('plantoes').doc(plantaoId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

module.exports = {
  createPlantao,
  getAllPlantoes,
  createCandidatura,
  getPlantaoById,
  listarCandidatosPorPlantao,
  aprovarCandidato,
};