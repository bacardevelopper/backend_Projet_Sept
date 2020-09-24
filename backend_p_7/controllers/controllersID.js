/* modules used */
const mysql = require("mysql");
/* modules used */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs",
});

/* FUNCTION CREATE USER (SIGNUP) */
/* à la reussite finale , l'utilisateur doit etre ajouter et server renvoit l'id */
exports.createUser = (req, res, next) => {
  if (req) {
    if (req.body.email !== "" && req.body.mdp !== "") {
      res.status(200).json({ message: "ok données bien reçu" });
      let email = req.body.email;
      let password = req.body.mdp;

      //sql requete
      const sql = `INSERT INTO members (adressemail, password) VALUES('${email}', '${password}')`;
      console.log(req.body);

      /* CONNECTION MYSQL DB */
      db.connect((err) => {
        if (err) {
          console.log("not connected in database");
        } else {
          console.log("connected in database");
          db.query(sql,(error, results) => {
              if (error) {
                console.log(error.message);
              } else {
                /* [ RowDataPacket { id: 8, adressemail: 'le email', password: '' } ] */
                console.log(results);
              }
            }
          );
        }
      });
    }
  } else {
    return res.status(400).json({ messahge: "erreur" });
  }
};
