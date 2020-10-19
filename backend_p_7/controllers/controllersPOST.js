const db = require("../models/bddConfig");

/* CREATE --------------------------------------------------------------------------------------------------- */
exports.createPost = (req, res, next) => {
  req.body = req.fields;
  console.log("/* ---------- DATA FIELDS ----------- */");
  console.log(req.fields);
  console.table(req.body);
  console.log(req.fields.data);
  const data = JSON.parse(req.fields.data);
  const titre = data.titre;
  const texte = data.texte;
  const email = req.fields.emailUser;
  console.log(data);
  console.log(data.titre);
  console.log(req.fields.emailUser);
  const urlFictif = req.files.urlfile;
  /* ------------------------------------------------------------- */
  if (data.titre !== "" && data.texte !== "") {
    const selectIdUser = `SELECT id FROM users WHERE email = '${email}'`;

    db.query(selectIdUser, (error, results) => {
      if (results) {
        console.log(results[0].id);
        /* recuperation user id */
        const userIdFound = results[0].id;
        const sqlInsertPost = `INSERT INTO post (userid, titre, texte, urlfile) VALUES('${userIdFound}', '${titre}','${texte}','${urlFictif}')`;

        db.query(sqlInsertPost, (error, results) => {
          if (!error) {
            console.log("bien ajouté a la bdd");
            return res
              .status(201)
              .json({ mesage: "bien reçu jusqu'au backend ctrl" });
          } else {
            return res
              .status(400)
              .json({ message: "données non enregistrer dans la bdd" });
          }
        });
      } else {
        console.log(error);
      }
    });
  }
};
/* CREATE --------------------------------------------------------------------------------------------------- */
exports.updatePost = (req, res, next) => {
  console.log(req.fields.data);
  console.log(req.files.urlfile);
  console.log(req.fields.emailUser);
  res.status(201).json({ message: "reçu au ctrl modify" });

  /* fonction metiers qui va ajouter les mdofication */
};
// profile
exports.profileRecup = (req, res, next) => {
  return res.status(200).json(req.fields.emailUser);
};
exports.deletePost = (req, res, next) => {};
/* GET ALL ARTICLES ------------------------------------------------------------------------------------ */
exports.geAlltPost = (req, res, next) => {
  const selectAll = `SELECT * FROM post`;
  db.query(selectAll, (error, results) => {
    if (results) {
      res.status(200).json(results);
    } else {
      console.log(error);
      return res.status(400).json({ errror });
    }
  });
};
/* OWN POSTS  ------------------------------------------------------------------------------------ */
exports.ownPost = (req, res, next) => {
  const email = req.fields.emailUser;
  const selectOwnPost = `SELECT * FROM post INNER JOIN users  ON post.userid = users.id WHERE email = '${email}'`;

  db.query(selectOwnPost, (error, results) => {
    if (!error) {
      res.status(200).json(results);
    } else {
      return res.status(401).json({ msg: "erreur" });
    }
  });
};
/* delete post ------------------------------------------------------------------------------------ */
exports.delete = (req, res, next) => {
  const email = req.fields.emailUser;
  const idPostDelete = Number(req.fields.delete);
  const selectUserId = `SELECT id FROM users WHERE email = '${email}'`;
  db.query(selectUserId, (error, results) => {
    if (!error) {
      const id = results[0].id;
      const deleteData = `DELETE FROM post WHERE idpost = ${idPostDelete}  AND userid = ${id} `;
      console.log(results[0].id);
      db.query(deleteData, (error, results) => {
        if (!error) {
          res.status(200).json({ msg: "supprimé" });
        } else {
          console.log(error);
          return res.status(400).json({ msg: "non supprimé" });
        }
      });
    } else {
      return res.status(401).json({ msg: "non trouvé" });
    }
  });
};
