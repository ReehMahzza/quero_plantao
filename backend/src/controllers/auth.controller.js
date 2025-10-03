const { admin } = require('../config/firebase.config');
const profissionalService = require('../services/profissional.service');

/**
 * REATORIZADO: Regista um novo profissional com o fluxo de "Cadastro Mínimo".
 * 1. Cria o utilizador no Firebase Authentication.
 * 2. Chama o serviço para criar o documento de perfil mínimo no Firestore.
 */
const signupProfissional = async (req, res) => {
  try {
    // 1. Extrai apenas os dados mínimos necessários do corpo da requisição.
    const { email, password, nomeCompleto, cpf } = req.body;

    // 2. Cria o utilizador no Firebase Authentication.
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nomeCompleto,
    });

    // 3. Prepara o payload para o serviço, combinando o UID com os dados da requisição.
    const servicePayload = {
      uid: userRecord.uid,
      nomeCompleto,
      email,
      cpf,
    };

    // 4. Chama o serviço para criar o documento de perfil no Firestore.
    await profissionalService.createProfissional(servicePayload);

    // 5. Envia a resposta de sucesso.
    res.status(201).send({ uid: userRecord.uid, message: 'Profissional registado com sucesso!' });

  } catch (error) {
    console.error("Erro no registo do profissional: ", error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).send({ message: 'Este e-mail já está em uso.' });
    }
    res.status(500).send({ message: 'Erro no servidor ao registar profissional.' });
  }
};

module.exports = {
  signupProfissional,
};
