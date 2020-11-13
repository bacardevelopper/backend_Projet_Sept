const db = require("../models/bddConfig");
const bcrypt = require("bcrypt");
/* poster article */
exports.createPost = (req, res, next) => {
  req.body = req.fields;

  const data = JSON.parse(req.fields.data);
  const titre = data.titre;
  const texte = data.texte;
  const email = req.fields.emailUser;

  const urlFictif = req.files.urlfile;
  /* ------------------------------------------------------------- */
  if (data.titre !== "" && data.texte !== "") {
    const selectIdUser = `SELECT id, generateid FROM users WHERE email = '${email}'`;

    db.query(selectIdUser, (error, results) => {
      if (results) {
        /* recuperation user id */
        const userIdFound = results[0].id;
        const leGenerateId = results[0].generateid;
        const sqlInsertPost = `INSERT INTO post (userid, titre, texte, urlfile, usergenerate) VALUES('${userIdFound}', '${titre}','${texte}','${urlFictif}','${leGenerateId}')`;

        db.query(sqlInsertPost, (error, results) => {
          if (!error) {
            return res
              .status(201)
              .json({ message: "bien reçu jusqu'au backend ctrl" });
          } else {
            return res
              .status(400)
              .json({ message: "données non enregistrer dans la bdd" });
          }
        });
      } else {
      }
    });
  }
};

/* UPDATE --------------------------------------------------------------------------------------------------- */
exports.updtRecFront = (req, res, next) => {
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
/* modifier post */
exports.updatePost = (req, res, next) => {
  const email = req.fields.emailUser;
  const idDt = JSON.parse(req.fields.idarticle);
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
          res.status(200).json({ message: "reussite update" });
        } else {
          return res.status(401).json({ message: " probleme sql" });
        }
      });
    } else {
      return res.status(400).json({ message: "pas de modification" });
    }
  });
};

/* PROFILE (recuperer info profile ) */
exports.profileRecup = (req, res, next) => {
  const email = req.fields.emailUser;
  const inf = `SELECT generateid FROM users WHERE email = '${email}'`;
  db.query(inf, (error, results) => {
    if (!error) {
      return res.status(200).json(results[0].generateid);
    } else {
      return res.status(401).json(error);
    }
  });
};

/* recuperer tous les articles de statut = 1 */
exports.geAlltPost = (req, res, next) => {
  const selectAll = `SELECT * FROM post WHERE statut = 1 ORDER BY datepost DESC`;
  db.query(selectAll, (error, results) => {
    if (results) {
      //console.log(results);

      res.status(200).json(results);
    } else {
      return res.status(400).json({ error });
    }
  });
};
/* recuper tous mes articles */
exports.ownPost = (req, res, next) => {
  const email = req.fields.emailUser;
  const selectOwnPost = `SELECT * FROM post INNER JOIN users  ON post.userid = users.id WHERE email = '${email}'`;

  db.query(selectOwnPost, (error, results) => {
    if (!error) {
      return res.status(200).json(results);
    } else {
      res.status(401).json({ message: "erreur" });
    }
  });
};
/* supprimer post ------------------------------------------------------------------------------------ */
exports.delete = (req, res, next) => {
  const email = req.fields.emailUser;
  const idPostDelete = Number(req.fields.delete);
  const selectUserId = `SELECT id FROM users WHERE email = '${email}'`;
  db.query(selectUserId, (error, results) => {
    if (!error) {
      const id = results[0].id;
      const deleteData = `DELETE FROM post WHERE idpost = ${idPostDelete}  AND userid = ${id}`;
      db.query(deleteData, (error, results) => {
        if (!error) {
          /* delete commentaire */
          const deleteComment = `DELETE FROM coment WHERE idpost = ${idPostDelete}`;
          db.query(deleteComment, (error, results) => {
            if (!error) {
              return res.status(200).json({ message: "supprimé" });
            } else {
              return res.status(400).json({ message: "pas supprimé" });
            }
          });
        } else {
          return res.status(400).json({ message: "non supprimé general" });
        }
      });
    } else {
      return res.status(401).json({ message: "non trouvé" });
    }
  });
};
/* ajouter commentaire */
exports.comment = (req, res, next) => {
  const cmt = JSON.parse(req.fields.commentaire);
  const idarticle = JSON.parse(req.fields.idArticle);
  const email = req.fields.emailUser;
  // trouver l'id correpondant à l'email
  const reqA = `SELECT id FROM users WHERE email = '${email}'`;
  if (cmt !== "") {
    db.query(reqA, (error, results) => {
      if (!error) {
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
/* voir les commentaires*/
exports.getComment = (req, res, next) => {
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
/* supprimer utilisateur */
exports.deleteUser = (req, res, next) => {
  const email = req.fields.emailUser;
  const selectDeleteUser = `SELECT id FROM users WHERE email = '${email}'`;
  db.query(selectDeleteUser, (error, results) => {
    if (!error) {
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
          return res
            .status(400)
            .json({ message: "pas de suppression commentaire", error });
        }
      });
    } else {
      return res.status(401).json({ message: "no user delete" });
    }
  });
};
// modifier mot de passe
exports.modifierMdp = (req, res, next) => {
  let saltRounds = 10;

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
          }
        });
      })
      .catch((error) => {
        return res.status(400).json({ message: "non hash" });
      });
  } else {
    return res.status(400).json({ message: "champ vide ou 5 caracteres min" });
  }
};
/* modifier pseudo profile */
exports.updtProfile = (req, res, next) => {
  const pseudo = JSON.parse(req.fields.pseudo);
  const email = req.fields.emailUser;

  const updPseudo = `UPDATE users SET generateid = '${pseudo}' WHERE email = '${email}'`;
  db.query(updPseudo, (error, results) => {
    if (!error) {
      return res.status(201).json({ msg: "pseudo bien modifier" });
    } else {
      return res.status(400).json({ msg: "echec de la requete" });
    }
  });
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
        return res.status(400).json({ error });
      }
    });
  }
};

// moderer articles
exports.moderer = (req, res, next) => {
  const id = JSON.parse(req.fields.moderer);
  const idNumb = Number(id);
  //console.log(typeof idNumb);
  const leStatut = 1;
  const updtModere = `UPDATE post SET statut = '${leStatut}' WHERE idpost = '${idNumb}'`;
  if (req.fields.emailUser !== "admin@groupmania.fr") {
    return res.status(401).json({ message: "bien reçu ctrl moderer" });
  } else {
    db.query(updtModere, (error, results) => {
      if (results) {
        return res.status(200).json({ msg: "bien modifier" });
      } else {
        return res.status(400).json({ error });
      }
    });
  }
};

// statistique recuperation données
exports.statistiques = (req, res, next) => {
  const selectStats = `SELECT * FROM post`;
  const slcLastP = `SELECT userid FROM post`;
  const sltLastP = `SELECT * FROM users INNER JOIN post  ON users.id = post.userid ORDER BY datepost DESC`;
  if (req.fields.emailUser !== "admin@groupmania.fr") {
    return res.status(400).json({ message: "erreur 400" });
  } else {
    db.query(selectStats, (error, results) => {
      const nbrPost = results.length;
      if (!error) {
        db.query("SELECT * FROM coment", (error, results) => {
          const nombreComent = results;


          // nombre de commentaires
          if (!error) {
            db.query(slcLastP, (error, results) => {
              const data = results;
              if (!error) {
                /* 3 derniers users */
                db.query(sltLastP, (error, results) => {
                  const lastP = results;
                  if (!error) {
                    //console.log(results);
                    return res.status(200).json({
                      nbr: nbrPost,
                      users: results,
                      nbrComent: nombreComent.length,
                      userFind: data,
                      last: lastP,
                    });
                  } else {
                  }
                });
              }
            });
          }
        });
      } else {
        return res.status(400).json({ message: "erreur" });
      }
    });
  }
};
