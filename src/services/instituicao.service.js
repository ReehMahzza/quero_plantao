// Importa a instância 'db' e 'admin' já inicializadas
const { db, admin } = require('../config/firebase.config');

const createInstituicao = async (instituicaoData) => {
  const instituicaoFormatada = {
    ...instituicaoData,
    status: 'pending_approval',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const docRef = await db.collection('instituicoes').add(instituicaoFormatada);
  return docRef.id;
};

const getInstituicaoById = async (id) => {
  const docRef = db.collection('instituicoes').doc(id);
  const doc = await docRef.get();
  return doc.exists ? doc.data() : null;
};

module.exports = { createInstituicao, getInstituicaoById };