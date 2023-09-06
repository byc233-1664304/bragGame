const auth = require("../config/firebase-config.js");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if(token) {
    try {
        const decodeValue = await auth.verifyIdToken(token.split(" ")[1]);
        if (decodeValue) {
          req.user = decodeValue;
          return next();
        }
      } catch (e) {
        return res.json({ message: "Internal Error" });
      }
  }
};

module.exports = verifyToken;