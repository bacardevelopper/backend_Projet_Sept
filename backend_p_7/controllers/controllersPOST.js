const db = require("../models/bddConfig");
const bcrypt = require("bcrypt");
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
    const selectIdUser = `SELECT id, generateid FROM users WHERE email = '${email}'`;

    db.query(selectIdUser, (error, results) => {
      if (results) {
        console.log(results[0].id);
        /* recuperation user id */
        const userIdFound = results[0].id;
        const leGenerateId = results[0].generateid;
        const sqlInsertPost = `INSERT INTO post (userid, titre, texte, urlfile, usergenerate) VALUES('${userIdFound}', '${titre}','${texte}','${urlFictif}','${leGenerateId}')`;

        db.query(sqlInsertPost, (error, results) => {
          if (!error) {
            console.log("bien ajouté a la bdd");
            return res
              .status(201)
              .json({ mesage: "bien reçu jusqu'au backend ctrl" });
          } else {
            console.log(error);
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
/* UPDATE --------------------------------------------------------------------------------------------------- */
exports.updtRecFront = (req, res, next) => {
  const email = req.fields.emailUser;
  const idDt = JSON.parse(req.fields.idarticle);
  const idDtNumb = Number(idDt);
  const reqPrepare = `SELECT * FROM post WHERE idpost = '${idDtNumb}'`;
  db.query(reqPrepare, (error, results) => {
    if (!error) {
      res.status(200).json(results);
    } else {
      return res.status(400).json({ message: "error" });
    }
  });
};
/* -------------------------------------- */
exports.updatePost = (req, res, next) => {
  const email = req.fields.emailUser;
  const idDt = JSON.parse(req.fields.idarticle);
  const idDtNumb = Number(idDt);
  const data = JSON.parse(req.fields.data);
  const titre = data.titre;
  const texte = data.texte;
  const idFile = req.body.vef;
  /* ------------------------------------ */
  const slct = `SELECT id FROM users WHERE email = '${email}'`;

  db.query(slct, (error, results) => {
    if (!error) {
      const idP = results[0].id;
      const artModifyUn = `UPDATE post SET titre = '${titre}' , texte = '${texte}' WHERE idpost = '${idDt}' AND userid = '${idP}'`;
      const artModifyDeux = `UPDATE post SET titre = '${titre}' , texte = '${texte}', urlfile = '${req.files.urlfile}' WHERE idpost = '${idDt}' AND userid = '${idP}'`;
      const arrayReq = [artModifyUn, artModifyDeux];
      /* -- si fichier non present ne pas enr° url img -- */
      db.query(arrayReq[idFile], (error, results) => {
        if (!error) {
          console.log(results);
          console.log(idDt);
          res.status(200).json({ message: "reussite update" });
        } else {
          console.log(error);
          return res.status(401).json({ message: " probleme sql" });
        }
      });
    } else {
      return res.status(400).json({ msg: "pas de modification" });
    }
  });
};
/* UPDATE --------------------------------------------------------------------------------------------------- */
/* PROFILE --------------------------------------------------------------------------------------------------- */
exports.profileRecup = (req, res, next) => {
  return res.status(200).json(req.fields.emailUser);
};
/* UPDATE --------------------------------------------------------------------------------------------------- */
/* GET ALL ARTICLES ------------------------------------------------------------------------------------ */
exports.geAlltPost = (req, res, next) => {
  const selectAll = `SELECT * FROM post WHERE statut = 1 ORDER BY datepost DESC`;
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
      console.log(error);
      console.log(email);
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
      const deleteData = `DELETE FROM post WHERE idpost = ${idPostDelete}  AND userid = ${id}`;
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
/* ------------ commentaire ------------------------------- */
exports.comment = (req, res, next) => {
  console.log(req.fields);
  const cmt = JSON.parse(req.fields.commentaire);
  const idarticle = JSON.parse(req.fields.idArticle);
  const email = req.fields.emailUser;
  // trouver l'id correpondant à l'email
  const reqA = `SELECT id FROM users WHERE email = '${email}'`;
  if (cmt !== "") {
    db.query(reqA, (error, results) => {
      if (!error) {
        console.log(results);

        const idUser = results[0].id;
        const reqB = `INSERT INTO coment (iduser, commentaire, idpost) VALUES('${idUser}', '${cmt}','${idarticle}')`;
        db.query(reqB, (error, results) => {
          if (!error) {
            return res.status(200).json({ message: "commentaire reçu" });
          } else {
            return res.status(400).json({ message: "commentaire non ajouté" });
          }
        });
      }
    });
  } else {
    return res.json({ message: "champ vide" });
  }
};
/* VOIR LES COMMENTAIRES */
exports.allComment = (req, res, next) => {
  console.log(req.fields);
  const id = JSON.parse(req.fields.idcmt);
  const selectUserId = `SELECT * FROM coment WHERE idpost = '${id}'`;
  db.query(selectUserId, (error, results) => {
    if (!error) {
      return res.status(200).json(results);
    } else {
      return res.status(400).json({ message: "erreur" });
    }
  });
};
/* DELETE USER */
exports.deleteUser = (req, res, next) => {
  const email = req.fields.emailUser;
  const selectDeleteUser = `SELECT id FROM users WHERE email = '${email}'`;
  db.query(selectDeleteUser, (error, results) => {
    if (!error) {
      console.log(results[0].id);
      /* supprimer commentaires */
      const iduserUse = results[0].id;
      const deleteCommentaire = `DELETE FROM coment WHERE iduser = ${iduserUse}`;
      db.query(deleteCommentaire, (error, results) => {
        const deletePost = `DELETE FROM post WHERE userid = ${iduserUse}`;
        if (!error) {
          /* supprimer post */
          db.query(deletePost, (error, results) => {
            const deleteUser = `DELETE FROM users WHERE id = ${iduserUse}`;
            if (!error) {
              db.query(deleteUser, (error, results) => {
                return res.status(201).json({
                  message: "suppression de compte accepter plus d'accees",
                });
              });
            }
          });
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(error);
      return res.status(401).json({ message: "no user delete" });
    }
  });
};
// modifier
exports.modifierMdp = (req, res, next) => {
  let saltRounds = 10;
  console.log(req.fields.mdp);
  const mdpVf = req.fields.mdp;
  if (mdpVf.length > 5 && mdpVf !== "" && mdpVf !== "") {
    const mdpMdf = JSON.parse(req.fields.mdp);
    const email = req.fields.emailUser;

    /* BCRYPT */
    bcrypt
      .hash(mdpMdf, saltRounds)
      .then((hash) => {
        const updtMdp = `UPDATE users SET password = '${hash}' WHERE email = '${email}'`;
        db.query(updtMdp, (error, results) => {
          if (!error) {
            return res
              .status(200)
              .json({ message: "mot de passe bien modifier" });
          } else {
            console.log(error);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({ message: "non hash" });
      });
  } else {
    return res.status(400).json({ message: "champ vide ou 5 caracteres min" });
  }
};
/* --------------------------------- CONTROLEURS ADMIN ---------------------------- */
exports.adminAllPost = (req, res, next) => {
  const selectAll = `SELECT * FROM post WHERE statut = 0`;
  if (req.fields.emailUser !== "admin@groupmania.fr") {
    return res.status(401).json({ message: "vous n'etes pas un admin" });
  } else {
    db.query(selectAll, (error, results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        console.log(error);
        return res.status(400).json({ errror });
      }
    });
  }
};

// moderer
exports.moderer = (req, res, next) => {
  console.log(req.fields);
  const id = JSON.parse(req.fields.moderer);
  const idNumb = Number(id);
  console.log(typeof idNumb);
  const leStatut = 1;
  const updtModere = `UPDATE post SET statut = '${leStatut}' WHERE idpost = '${idNumb}'`;
  if (req.fields.emailUser !== "admin@groupmania.fr") {
    return res.status(401).json({ message: "bien reçu ctrl moderer" });
  } else {
    db.query(updtModere, (error, results) => {
      if (results) {
        return res.status(200).json({ msg: "bien modifier" });
      } else {
        console.log(error);
        return res.status(400).json({ error });
      }
    });
  }
};

// statistique
exports.statistiques = (req, res, next) => {
  const selectStats = `SELECT * FROM post`;
  const slcLastP = `SELECT userid FROM post`;
  const sltLastP = `SELECT email FROM users INNER JOIN post  ON users.id = post.userid ORDER BY datepost DESC LIMIT 3`;
  if (req.fields.emailUser !== "admin@groupmania.fr") {
    return res.status(400).json({ message: "erreur 400" });
  } else {
    db.query(selectStats, (error, results) => {
      const nbrPost = results.length;
      if (!error) {
        db.query("SELECT * FROM coment", (error, results) => {
          const nombreComent = results;
          // voir les trois derniers participants

          // nombre de commentaires
          if (!error) {
            db.query(slcLastP, (error, results) => {
              const data = results;
              if (!error) {
                /* 3 derniers users */
                db.query(sltLastP, (error, results) => {
                  const lastP = results;
                  if (!error) {
                    return res.status(200).json({
                      nbr: nbrPost,
                      users: results,
                      nbrComent: nombreComent.length,
                      userFind: data,
                      last: lastP,
                    });
                  } else {
                    console.log(error);
                  }
                });
              }
            });
            const nbrComent = results;
          }
        });
      } else {
        return res.status(400).json({ message: "erreur" });
      }
    });
  }
};
