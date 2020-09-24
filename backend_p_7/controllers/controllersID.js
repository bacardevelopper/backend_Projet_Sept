/* modules used */
const bcrypt = require("bcrypt");
const db = require("../models/bddConfig");
/* modules used */

/* FUNCTION CREATE USER (SIGNUP) */
/* à la reussite finale , l'utilisateur doit etre ajouter et server renvoit l'id */
exports.createUser = (req, res, next) => {
  if (req.body.email !== "" && req.body.mdp !== "") {
    // EMAIL FORMAT OK
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
      let email = req.body.email;
      let password = req.body.mdp;
      // SQL PREPARE REQUETE
      const sqlInsert = `INSERT INTO members (adressemail, password) VALUES('${email}', '${password}')`;
      let sqlSelectEmail = `SELECT adressemail FROM members WHERE adressemail = '${email}'`;
      console.log(req.body);

      /* EXECUTION DES REQUETES */
      /* Verification : email exist in bdd */
      db.query(sqlSelectEmail, (error, results) => {
        // on verifie si l'email existe
        if (results) {
          console.log(results);
          if (results.length === 0) {
            // si on  trouve pas l'email
            db.query(sqlInsert, (error, results) => {
              console.log("email bien ajoutée");
            });
          }
        } else {
          console.log(error.message);
        }
      });
    } else {
      return res.json({ message: "ce n'est pas un email valide" });
    }
  } else {
    return res.json({ messahge: "erreur" });
  }
};
