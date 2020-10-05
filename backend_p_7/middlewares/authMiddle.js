/* modules used */
const jwt = require("jsonwebtoken");
/* modules used */

/* module export function verify token authentification */
module.exports = (req, res, next) => {
  /* contient le token */
  const toktok = req.body.token;
  const tokenAD = toktok.tokenReq;
  /* contient le token */

  /*
  console.log(tokenAD);
  console.log(req.body);
  console.log(req.body.file);
  */

  if (req.body) {
    jwt.verify(tokenAD, "TOKEN_IS_FREE_OPEN_SOURCE", (err, data) => {
      if (err) {
        res.status(401).json({ message: "non auhtentifié" });
      } else {
        // INFOS USER DECRYPTED
        req.body.emailUser = data.userId;
        next();
      }
    });
  } else {
    return res.status(400).json({ message: "erreur" });
  }

};
