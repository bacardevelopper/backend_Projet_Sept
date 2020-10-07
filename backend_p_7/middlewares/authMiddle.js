/* modules used */
const jwt = require("jsonwebtoken");
/* modules used */

/* module export function verify token authentification */
module.exports = (req, res, next) => {
  console.log(req.fields);
  console.log(req.files);
  next();
  /*
  if (req.body.token) {
    jwt.verify(req.body.token, "TOKEN_IS_FREE_OPEN_SOURCE", (err, data) => {
      if (err) {
        res.status(401).json({ message: "non auhtentifié" });
      } else {
        // INFOS USER DECRYPTED
        req.body.emailUser = data.userId;
        console.log(req.body);
        res.status(200).json({msg : 'create'});
      }
    });
  } else {
    return res.status(400).json({ message: "erreur" });
  }
  */
};
