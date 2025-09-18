// src/config/firebase.config.js

const admin = require('firebase-admin');

// Inicializa a conexão com o Firebase.
// Esta configuração só precisa ser feita uma vez.
// O SDK irá automaticamente usar as Application Default Credentials (ADC)
// que você configurou com 'gcloud auth application-default login'.
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exporta as instâncias do admin e do db para serem usadas em outros lugares da aplicação.
const db = admin.firestore();

module.exports = {
  admin,
  db
};