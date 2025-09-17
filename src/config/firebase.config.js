// src/config/firebase.config.js

const admin = require('firebase-admin');

// Carrega a chave de acesso do arquivo na raiz do projeto
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Cria e exporta a instância do Firestore para ser usada em todo o projeto
const db = admin.firestore();

// Exporta a instância do admin e do db
module.exports = { admin, db };