// src/config/firebase.config.js

const admin = require('firebase-admin');

const hasServiceAccount =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (hasServiceAccount) {
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const privateKey = rawPrivateKey
      .replace(/\\n/g, '\n')        // converte sequências literais \n
      .replace(/^"|"$/g, '');       // remove aspas extras no início/fim, caso existam

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      })
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();

module.exports = {
  admin,
  db
};
