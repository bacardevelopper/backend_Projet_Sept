/* modules used */
const bcrypt = require("bcrypt");
const db = require("../models/bddConfig");
const jwt = require("jsonwebtoken");
/* modules used */

/* SIGNUP --------------------------------------------------------------------------------------------------- */
/* à la reussite finale , l'utilisateur doit etre ajouter et server renvoit l'id */
exports.createUser = (req, res, next) => {
  let saltRounds = 10;
  req.body.user = req.fields.user;
  console.log(req.fields.user);
  console.log('------------------');
  console.log(req.body.user);
  let user = JSON.parse(req.body.user);

  if (user.email !== "" && user.mdp !== "") {
    // EMAIL FORMAT OK
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
      let email = user.email;
      let password = user.mdp;

      // SQL PREPARE REQUETE
      let sqlSelectEmail = `SELECT email FROM users WHERE email = '${email}'`;
      console.log(req.body);

      /* EXECUTION DES REQUETES */
      /* Verification : email exist in bdd */
      db.query(sqlSelectEmail, (error, results) => {
        // on verifie si l'email existe
        
        if (results && results.length === 0) {
          
          // console.log(results);
          // si on  trouve pas l'email ; on lance le hashage
          console.log(results);
          /* BCRYPT */
          bcrypt
            .hash(password, saltRounds)
            .then((hash) => {
              const sqlInsert = `INSERT INTO users (email, password) VALUES('${email}', '${hash}')`;
              console.log(sqlInsert);
              db.query(sqlInsert, (error, results) => {
                if (!error) {
                  console.log("email bien ajoutée");
                  return res.status(200).json({ message: "bien ajouté" });
                } else {
                  console.log(error);
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });
          /* FIN BCRYPT */
        } else {
          return res.status(400).json({ message: "email déjà existant" });
          console.log('error : '+error);
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
  console.log(req.fields.user);
  console.log('------------------');
  console.log(req.body.user);
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
        console.log("email not found");
        return res.status(400).json({ message: "email not found" });
      } else {
        db.query(sqlSelectMdp, (error, results) => {
          if (results) {
            console.log(results[0]);
            bcrypt.compare(user.mdp, results[0].password, (err, result) => {
              if (result) {
                // CREATION TOKEN
                const token = jwt.sign(
                  { userId: user.email },
                  'TOKEN_IS_FREE_OPEN_SOURCE',
                  { expiresIn: "1h" }
                );
                // renvoit status et token en json au client 
                return res.status(200).json({userToken : token});
              } else {
                return res
                  .status(400)
                  .json({ message: "mot de passe ne correspond pas" });
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
