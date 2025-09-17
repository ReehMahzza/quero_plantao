// src/config/firebase.config.js

const admin = require('firebase-admin');

// O caminho para o serviceAccountKey.json foi corrigido aqui.
// Partindo de /src/config, subimos dois níveis (../../) para chegar na raiz /backend,
// onde o arquivo serviceAccountKey.json está localizado.
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializa a conexão com o Firebase.
// Esta configuração só precisa ser feita uma vez.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Exporta as instâncias do admin e do db para serem usadas em outros lugares da aplicação.
const db = admin.firestore();

module.exports = {
  admin,
  db
};