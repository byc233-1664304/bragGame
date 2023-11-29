const auth = require("../config/firebase-config.js");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token.split(" ")[1]);
      if (decodedToken) {
        req.user = decodedToken;
        return next();
      }
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = verifyToken;