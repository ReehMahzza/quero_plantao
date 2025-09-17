// index.js

// --- 1. Importação das Ferramentas ---
const express = require('express');
const admin = require('firebase-admin');

// --- 2. Configuração da Conexão com o Firebase ---
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- 3. Criação do Servidor ---
const app = express();
app.use(express.json());
const port = 3000;

// --- 4. ROTA DE PROFISSIONAIS ---
app.post('/profissionais', async (req, res) => {
  try {
    const novoProfissionalData = req.body;
    const profissionalFormatado = {
      nomeCompleto: novoProfissionalData.nomeCompleto,
      email: novoProfissionalData.email,
      cpf: novoProfissionalData.cpf,
      coren: {
        numero: novoProfissionalData.coren.numero,
        estado: novoProfissionalData.coren.estado
      },
      avaliacaoMedia: novoProfissionalData.avaliacaoMedia || 0,
      especialidade: novoProfissionalData.especialidade || 'Não informada',
      statusGeral: 'pending_api_check',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('profissionais').add(profissionalFormatado);
    res.status(201).send({ id: docRef.id, message: 'Profissional criado com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar profissional: ", error);
    res.status(500).send({ message: 'Erro no servidor.' });
  }
});

// --- 5. ROTAS DE INSTITUIÇÕES ---
// ... (código das instituições permanece o mesmo)
app.post('/instituicoes', async (req, res) => {
  try {
    const novaInstituicaoData = req.body;
    const instituicaoFormatada = {
      razaoSocial: novaInstituicaoData.razaoSocial,
      nomeFantasia: novaInstituicaoData.nomeFantasia,
      cnpj: novaInstituicaoData.cnpj,
      emailPrincipal: novaInstituicaoData.emailPrincipal,
      telefoneContato: novaInstituicaoData.telefoneContato,
      endereco: {
        cep: novaInstituicaoData.endereco.cep,
        logradouro: novaInstituicaoData.endereco.logradouro,
        numero: novaInstituicaoData.endereco.numero,
        bairro: novaInstituicaoData.endereco.bairro,
        cidade: novaInstituicaoData.endereco.cidade,
        estado: novaInstituicaoData.endereco.estado
      },
      status: 'pending_approval',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('instituicoes').add(instituicaoFormatada);
    res.status(201).send({ id: docRef.id, message: 'Instituição criada com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar instituição: ", error);
    res.status(500).send({ message: 'Erro no servidor ao criar instituição.' });
  }
});

app.get('/instituicoes/:id', async (req, res) => {
  try {
    const instituicaoId = req.params.id;
    const docRef = db.collection('instituicoes').doc(instituicaoId);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).send({ message: 'Instituição não encontrada.' });
    } else {
      res.status(200).send(doc.data());
    }
  } catch (error) {
    console.error("Erro ao buscar instituição: ", error);
    res.status(500).send({ message: 'Erro no servidor ao buscar instituição.' });
  }
});


// --- 6. ROTAS DE PLANTÕES ---
// ... (rotas de criar e listar plantões permanecem as mesmas)
app.post('/plantoes', async (req, res) => {
  try {
    const { instituicaoId, ...plantaoData } = req.body;
    if (!instituicaoId) {
      return res.status(400).send({ message: 'O ID da instituição (instituicaoId) é obrigatório.' });
    }
    const instituicaoRef = db.collection('instituicoes').doc(instituicaoId);
    const instituicaoDoc = await instituicaoRef.get();
    if (!instituicaoDoc.exists) {
      return res.status(404).send({ message: 'Instituição não encontrada para publicar o plantão.' });
    }
    const instituicaoData = instituicaoDoc.data();
    const plantaoFormatado = {
      titulo: plantaoData.titulo,
      descricao: plantaoData.descricao,
      dataInicio: admin.firestore.Timestamp.fromDate(new Date(plantaoData.dataInicio)),
      dataFim: admin.firestore.Timestamp.fromDate(new Date(plantaoData.dataFim)),
      valorOferecido: plantaoData.valorOferecido,
      endereco: plantaoData.endereco,
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
    res.status(201).send({ id: docRef.id, message: 'Plantão criado com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar plantão: ", error);
    res.status(500).send({ message: 'Erro no servidor ao criar plantão.' });
  }
});

app.get('/plantoes', async (req, res) => {
  try {
    const plantoesRef = db.collection('plantoes');
    const snapshot = await plantoesRef.where('status', '==', 'open').get();
    if (snapshot.empty) {
      return res.status(200).send([]);
    }
    const plantoesDisponiveis = [];
    snapshot.forEach(doc => {
      plantoesDisponiveis.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.status(200).send(plantoesDisponiveis);
  } catch (error) {
    console.error("Erro ao listar plantões: ", error);
    res.status(500).send({ message: 'Erro no servidor ao listar plantões.' });
  }
});

app.post('/plantoes/:plantaoId/candidatar-se', async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const { profissionalId } = req.body;

    if (!profissionalId) {
      return res.status(400).send({ message: 'O ID do profissional (profissionalId) é obrigatório.' });
    }

    const plantaoRef = db.collection('plantoes').doc(plantaoId);
    const profissionalRef = db.collection('profissionais').doc(profissionalId);
    const candidaturaRef = plantaoRef.collection('candidaturas').doc(profissionalId);

    await db.runTransaction(async (transaction) => {
      const plantaoDoc = await transaction.get(plantaoRef);
      if (!plantaoDoc.exists) { throw new Error('PLANTÃO_NAO_ENCONTRADO'); }
      const plantaoData = plantaoDoc.data();
      if (plantaoData.status !== 'open') { throw new Error('PLANTAO_NAO_ABERTO'); }

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
      transaction.update(plantaoRef, {
        numeroDeCandidatos: admin.firestore.FieldValue.increment(1)
      });
    });

    res.status(201).send({ message: 'Candidatura realizada com sucesso!' });

  } catch (error) {
    console.error("Erro ao criar candidatura: ", error.message);
    if (error.message === 'PLANTÃO_NAO_ENCONTRADO') { return res.status(404).send({ message: 'Plantão não encontrado.' }); }
    if (error.message === 'PLANTAO_NAO_ABERTO') { return res.status(403).send({ message: 'Não é possível se candidatar a este plantão.' }); }
    if (error.message === 'PROFISSIONAL_NAO_ENCONTRADO') { return res.status(404).send({ message: 'Profissional não encontrado.' }); }
    if (error.message === 'CANDIDATURA_DUPLICADA') { return res.status(409).send({ message: 'Este profissional já se candidatou a este plantão.' }); }
    res.status(500).send({ message: 'Erro no servidor ao processar a candidatura.' });
  }
});

// --- NOVAS ROTAS DE GESTÃO DE CANDIDATURAS ---

/**
 * Rota para listar todas as candidaturas de um plantão específico.
 */
app.get('/plantoes/:plantaoId/candidaturas', async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const plantaoRef = db.collection('plantoes').doc(plantaoId);

    // Validação: Verifica se o plantão existe antes de buscar as candidaturas.
    const plantaoDoc = await plantaoRef.get();
    if (!plantaoDoc.exists) {
      return res.status(404).send({ message: 'Plantão não encontrado.' });
    }

    const candidaturasSnapshot = await plantaoRef.collection('candidaturas').get();

    if (candidaturasSnapshot.empty) {
      return res.status(200).send([]);
    }

    const candidaturas = [];
    candidaturasSnapshot.forEach(doc => {
      candidaturas.push({
        id: doc.id, // O ID do documento é o próprio profissionalId
        ...doc.data()
      });
    });

    res.status(200).send(candidaturas);

  } catch (error) {
    console.error("Erro ao listar candidaturas: ", error);
    res.status(500).send({ message: 'Erro no servidor ao listar candidaturas.' });
  }
});

// Cole esta versão corrigida no lugar da sua rota "aprovar-candidato" existente

app.post('/plantoes/:plantaoId/aprovar-candidato', async (req, res) => {
  try {
    const { plantaoId } = req.params;
    const { profissionalId } = req.body;

    if (!profissionalId) {
      return res.status(400).send({ message: 'O ID do profissional (profissionalId) é obrigatório.' });
    }

    const plantaoRef = db.collection('plantoes').doc(plantaoId);
    const candidaturaAprovadaRef = plantaoRef.collection('candidaturas').doc(profissionalId);

    await db.runTransaction(async (transaction) => {
      // --- ETAPA 1: LEITURA DE TODOS OS DADOS ---
      // Primeiro, lemos todos os documentos que vamos precisar manipular.

      const plantaoDoc = await transaction.get(plantaoRef);
      const candidaturaDoc = await transaction.get(candidaturaAprovadaRef);

      // Leitura de TODAS as outras candidaturas pendentes ANTES de qualquer escrita.
      const todasCandidaturasRef = plantaoRef.collection('candidaturas');
      const candidaturasPendentesSnapshot = await transaction.get(
        todasCandidaturasRef.where('status', '==', 'pending')
      );

      // --- ETAPA 2: VALIDAÇÕES ---
      // Agora que temos os dados, validamos as regras de negócio.

      if (!plantaoDoc.exists) { throw new Error('PLANTÃO_NAO_ENCONTRADO'); }
      const plantaoData = plantaoDoc.data();
      if (plantaoData.status !== 'open') { throw new Error('PLANTAO_NAO_MAIS_ABERTO'); }

      if (!candidaturaDoc.exists) { throw new Error('CANDIDATURA_NAO_ENCONTRADA'); }
      const candidaturaData = candidaturaDoc.data();
      if (candidaturaData.status !== 'pending') { throw new Error('CANDIDATO_JA_PROCESSADO'); }

      // --- ETAPA 3: OPERAÇÕES DE ESCRITA ---
      // Com tudo lido e validado, agora podemos escrever as alterações com segurança.

      // Atualiza o documento principal do plantão
      transaction.update(plantaoRef, {
        status: 'filled',
        profissionalId: profissionalId,
        profissionalInfo: candidaturaData.profissionalInfo,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Atualiza a candidatura aprovada
      transaction.update(candidaturaAprovadaRef, { status: 'approved' });

      // Rejeita as outras candidaturas pendentes
      candidaturasPendentesSnapshot.forEach(doc => {
        if (doc.id !== profissionalId) {
          transaction.update(doc.ref, { status: 'rejected' });
        }
      });
    });

    res.status(200).send({ message: 'Candidato aprovado com sucesso! O plantão foi preenchido.' });

  } catch (error) {
    console.error("Erro ao aprovar candidato: ", error.message);
    // O tratamento de erros permanece o mesmo
    if (error.message === 'PLANTÃO_NAO_ENCONTRADO') { return res.status(404).send({ message: 'Plantão não encontrado.' }); }
    if (error.message === 'PLANTAO_NAO_MAIS_ABERTO') { return res.status(403).send({ message: 'Este plantão não está mais aberto para aprovações.' }); }
    if (error.message === 'CANDIDATURA_NAO_ENCONTRADA') { return res.status(404).send({ message: 'A candidatura para o profissional especificado não foi encontrada.' }); }
    if (error.message === 'CANDIDATO_JA_PROCESSADO') { return res.status(409).send({ message: 'Este candidato já foi aprovado ou rejeitado.' }); }
    res.status(500).send({ message: 'Erro no servidor ao aprovar candidato.' });
  }
});

// --- 7. Iniciando o Servidor ---
app.listen(port, () => {
  console.log(`Servidor "Quero Plantão" rodando na porta ${port}!`);
});

