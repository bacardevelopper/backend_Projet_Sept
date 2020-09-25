/* modules used */
const bcrypt = require("bcrypt");
const db = require("../models/bddConfig");
/* modules used */

/* FUNCTION CREATE USER (SIGNUP) */
/* à la reussite finale , l'utilisateur doit etre ajouter et server renvoit l'id */
exports.createUser = (req, res, next) => {
  const saltRounds = 10;

  if (req.body.email !== "" && req.body.mdp !== "") {
    // EMAIL FORMAT OK
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
      let email = req.body.email;
      let password = req.body.mdp;

      // SQL PREPARE REQUETE
      let sqlSelectEmail = `SELECT adressemail FROM members WHERE adressemail = '${email}'`;
      console.log(req.body);

      /* EXECUTION DES REQUETES */
      /* Verification : email exist in bdd */
      db.query(sqlSelectEmail, (error, results) => {
        // on verifie si l'email existe
        if (results && results.length === 0) {
          // console.log(results);
          // si on  trouve pas l'email ; on lance le hashage

          /* BCRYPT */
          bcrypt
            .hash(password, saltRounds)
            .then((hash) => {
              const sqlInsert = `INSERT INTO members (adressemail, password) VALUES('${email}', '${hash}')`;
              db.query(sqlInsert, (error, results) => {
                if (!error) {
                  console.log("email bien ajoutée");
                  return res.status(200).json({ message: "bien ajouté" });
                } else {
                  console.log(error.message);
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });
          /* FIN BCRYPT */
        } else {
          res.status(400).json({message : 'email déjà existant'});
          console.log(error.message);
        }
      });
    } else {
      return res.status(400).json({ message: "ce n'est pas un email valide" });
    }
  } else {
    return res.status(400).json({ message : "erreur champ vide" });
  }
};

/* CONNEXION */
exports.loginUser = (req, res, next) => {
  if (
    req.body.email !== "" &&
    req.body.mdp !== "" &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)
  ) {
    // SQL PREPARE REQUETE
    let sqlSelectLogin = `SELECT adressemail FROM members WHERE adressemail = '${req.body.email}'`;
    let sqlSelectMdp = `SELECT password FROM members WHERE adressemail = '${req.body.email}'`;

    /* Verification : email exist in bdd */
    db.query(sqlSelectLogin, (error, results) => {

      if (results.length === 0) {
        console.log("email not found");
        res.status(400).json({ message: "email not found" });
      } else {
        db.query(sqlSelectMdp, (error, results) => {
          if(results){
            console.log(results[0]);
            bcrypt.compare(req.body.mdp, results[0].password, (err, result) => {
              if(result){
                return res.status(200).json({message : 'mot de passe trouver et correspond'});
              }else{
                return res.status(400).json({message : 'mot de passe ne correspond pas'});
              }
            });

          } else {
            console.log(error.message);
          }
        });
      }
    });
    // NOT EMAIL
  } else {
    res.status(400).json({ message: "données vide ou ce n'est pas un email" });
  }
};
