// backend/src/controllers/auth.controller.js

const { admin, db } = require('../config/firebase.config');

/**
 * Regista um novo profissional.
 * 1. Cria o utilizador no Firebase Authentication.
 * 2. Cria o documento do perfil no Firestore com o mesmo UID.
 */
const signupProfissional = async (req, res) => {
  try {
    const { email, password, nomeCompleto, cpf, coren } = req.body;

    // Passo 1: Criar o utilizador no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: nomeCompleto,
    });

    const { uid } = userRecord;

    // Passo 2: Criar o documento do perfil na coleção 'profissionais' do Firestore
    // Usamos o UID da autenticação como ID do documento para manter a ligação.
    const profissionalDocRef = db.collection('profissionais').doc(uid);
    
    await profissionalDocRef.set({
      nomeCompleto,
      email,
      cpf, // Lembre-se que em produção isto deve ser encriptado
      coren: {
        numero: coren.numero,
        estado: coren.estado,
      },
      statusGeral: 'pending_validation', // Um status inicial para novos registos
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).send({ uid, message: 'Profissional registado com sucesso!' });

  } catch (error) {
    console.error("Erro no registo do profissional: ", error);
    // Códigos de erro comuns do Firebase Auth: auth/email-already-exists
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).send({ message: 'Este e-mail já está em uso.' });
    }
    res.status(500).send({ message: 'Erro no servidor ao registar profissional.' });
  }
};

module.exports = {
  signupProfissional,
};
