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
 * Lista todas as candidaturas de um plantão.
 * @param {string} plantaoId - O ID do plantão.
 * @returns {Promise<Array>} Um array com as candidaturas.
 */
const getCandidaturas = async (plantaoId) => {
  const plantaoRef = db.collection('plantoes').doc(plantaoId);
  const plantaoDoc = await plantaoRef.get();
  if (!plantaoDoc.exists) {
    throw new Error('PLANTÃO_NAO_ENCONTRADO');
  }

  const candidaturasSnapshot = await plantaoRef.collection('candidaturas').get();
  if (candidaturasSnapshot.empty) {
    return [];
  }

  const candidaturas = [];
  candidaturasSnapshot.forEach(doc => {
    candidaturas.push({ id: doc.id, ...doc.data() });
  });
  return candidaturas;
};

/**
 * Aprova um candidato e atualiza o status do plantão e das outras candidaturas.
 * @param {string} plantaoId - O ID do plantão.
 * @param {string} profissionalId - O ID do profissional a ser aprovado.
 * @returns {Promise<void>}
 */
const aprovarCandidato = async (plantaoId, profissionalId) => {
  const plantaoRef = db.collection('plantoes').doc(plantaoId);
  const candidaturaAprovadaRef = plantaoRef.collection('candidaturas').doc(profissionalId);

  return db.runTransaction(async (transaction) => {
    // --- ETAPA 1: LEITURA DE TODOS OS DADOS ---
    const plantaoDoc = await transaction.get(plantaoRef);
    const candidaturaDoc = await transaction.get(candidaturaAprovadaRef);
    const todasCandidaturasRef = plantaoRef.collection('candidaturas');
    const candidaturasPendentesSnapshot = await transaction.get(
      todasCandidaturasRef.where('status', '==', 'pending')
    );

    // --- ETAPA 2: VALIDAÇÕES ---
    if (!plantaoDoc.exists) { throw new Error('PLANTÃO_NAO_ENCONTRADO'); }
    if (plantaoDoc.data().status !== 'open') { throw new Error('PLANTAO_NAO_MAIS_ABERTO'); }

    if (!candidaturaDoc.exists) { throw new Error('CANDIDATURA_NAO_ENCONTRADA'); }
    if (candidaturaDoc.data().status !== 'pending') { throw new Error('CANDIDATO_JA_PROCESSADO'); }

    // --- ETAPA 3: OPERAÇÕES DE ESCRITA ---
    transaction.update(plantaoRef, {
      status: 'filled',
      profissionalId: profissionalId,
      profissionalInfo: candidaturaDoc.data().profissionalInfo,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    transaction.update(candidaturaAprovadaRef, { status: 'approved' });

    candidaturasPendentesSnapshot.forEach(doc => {
      if (doc.id !== profissionalId) {
        transaction.update(doc.ref, { status: 'rejected' });
      }
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
  getCandidaturas,
  aprovarCandidato,
  getPlantaoById,
};