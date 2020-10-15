/* modules used */
const jwt = require("jsonwebtoken");
/* modules used */

/* module export function verify token authentification */
module.exports = (req, res, next) => {
  console.log(req.fields.cookie);
  const cookie = JSON.parse(req.fields.cookie);
  console.log(cookie);
  
  if (cookie) {
    jwt.verify(cookie, "TOKEN_IS_FREE_OPEN_SOURCE", (err, data) => {
      if (err) {
        res.status(401).json({ message: "non auhtentifié" });
      } else {
        // INFOS USER DECRYPTED
        req.fields.emailUser = data.userId;

        console.log(req.body);
        next();
      }
    });
  } else {
    return res.status(400).json({ message: "erreur et non authetifié" });
  }
  
};
