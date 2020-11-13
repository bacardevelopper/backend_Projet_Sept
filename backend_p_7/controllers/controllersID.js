/* modules used */
const bcrypt = require("bcrypt");
const db = require("../models/bddConfig");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
/* modules used */

/* inscription d'utilisateur */
exports.createUser = (req, res, next) => {
  let saltRounds = 10;
  req.body.user = req.fields.user;

  let user = JSON.parse(req.body.user);
  let generateId = "user" + randomstring.generate(7);
  if (user.email !== "" && user.mdp !== "") {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
      let email = user.email;
      let password = user.mdp;

      // SQL PREPARE REQUETE
      let sqlSelectEmail = `SELECT email FROM users WHERE email = '${email}'`;

      db.query(sqlSelectEmail, (error, results) => {
        if (results && results.length === 0) {
          /* BCRYPT */
          bcrypt
            .hash(password, saltRounds)
            .then((hash) => {
              const sqlInsert = `INSERT INTO users (email, password, generateid) VALUES('${email}', '${hash}','${generateId}')`;

              db.query(sqlInsert, (error, results) => {
                if (!error) {
                  return res.status(200).json({ message: "bien ajouté" });
                } else {
                }
              });
            })
            .catch((error) => {});
        } else {
          return res.status(400).json({ message: "email déjà existant" });
        }
      });
    } else {
      return res.status(400).json({ message: "ce n'est pas un email valide" });
    }
  } else {
    return res.status(400).json({ message: "erreur champ vide" });
  }
};

/* CONNEXION --------------------------------------------------------------------------------------------------- */
exports.loginUser = (req, res, next) => {
  req.body.user = req.fields.user;

  let user = JSON.parse(req.body.user);

  if (
    user.email !== "" &&
    user.mdp !== "" &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)
  ) {
    // SQL PREPARE REQUETE
    let sqlSelectLogin = `SELECT email FROM users WHERE email = '${user.email}'`;
    let sqlSelectMdp = `SELECT password FROM users WHERE email = '${user.email}'`;

    /* Verification : email exist in bdd */
    db.query(sqlSelectLogin, (error, results) => {
      if (results.length === 0) {
        return res.status(400).json({ message: "email not found" });
      } else {
        db.query(sqlSelectMdp, (error, results) => {
          if (results) {
            bcrypt.compare(user.mdp, results[0].password, (err, result) => {
              if (result) {
                const token = jwt.sign(
                  { userId: user.email },
                  "TOKEN_IS_FREE_OPEN_SOURCE",
                  { expiresIn: "1h" }
                );
                let sqlUpdateDateLogin = `UPDATE users SET datemaj = NOW() WHERE id = '${results[0].id}'`;

                db.query(sqlUpdateDateLogin, (error, results) => {
                  if (!error) {
                    return res.status(200).json({ userToken: token });
                  }
                });
              } else {
                return res
                  .status(400)
                  .json({ message: "mot de passe ne correspond pas" });
              }
            });
          } else {
          }
        });
      }
    });
    // NOT EMAIL
  } else {
    res.status(400).json({ message: "données vide ou ce n'est pas un email" });
  }
};
