// backend/src/middlewares/auth.middleware.js
const admin = require('firebase-admin');

async function ensureAuthenticated(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Adiciona o usuário decodificado à requisição
    return next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).send('Forbidden: Invalid token');
  }
}

module.exports = { ensureAuthenticated };