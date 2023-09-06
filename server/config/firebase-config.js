const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const app = initializeApp({
  credential: cert({
    type: process.env.CERT_TYPE,
    project_id: process.env.CERT_PROJECT_ID,
    private_key_id: process.env.CERT_PRIVATE_KEY_ID,
    private_key: process.env.CERT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CERT_CLIENT_EMAIL,
    client_id: process.env.CERT_CLIENT_ID,
    auth_uri: process.env.CERT_AUTH_URI,
    token_uri: process.env.CERT_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.CERT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CERT_CLIENT_X509_CERT_URL,
    universe_domain: process.env.CERT_UNIVERSE_DOMAIN
  }),
});

const auth = getAuth(app);
module.exports = auth;