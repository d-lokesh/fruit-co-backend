const admin = require('firebase-admin');
require('dotenv').config();
const logger = require('../logger');  // Import the logger


admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // To handle newlines
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
  }),
});

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.info('No authorization header found');
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    // logger.info('Token verified:', decodedToken);
    next();
  } catch (error) {
    logger.info('Error verifying token:', error);
    return res.status(401).send({ message: 'Unauthorized' });
  }
};
