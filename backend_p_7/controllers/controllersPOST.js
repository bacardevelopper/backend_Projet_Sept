const db = require("../models/bddConfig");

/* CREATE --------------------------------------------------------------------------------------------------- */
exports.createPost = (req, res, next) => {
  const dataToBdd = req.body;
  // variable
  const email = dataToBdd.emailUser;
  const titre = dataToBdd.data.titre;
  const texte = dataToBdd.data.texte;
  const urlFictif =  `${req.protocol}://${req.get("host")}/uploadfiles/img.png`;
  // variable
  if(dataToBdd.data.titre !== "" && dataToBdd.data.texte !== ""){
    const selectIdUser = `SELECT id FROM users WHERE email = '${email}'`;
    
    db.query(selectIdUser, (error, results) => {
      if(results){
        console.log(results[0].id);
        /* recuperation user id */
        const userIdFound = results[0].id;
        const sqlInsertPost = `INSERT INTO post (userid, titre, texte, urlfile) VALUES('${userIdFound}', '${titre}','${texte}','${urlFictif}')`;

        db.query(sqlInsertPost, (error, results) => {
          if(!error){
            return res.status(201).json({mesage : 'bien reçu jusqu\'au backend ctrl'});
          }else{
            return res.status(400).json({message : 'données non enregistrer dans la bdd'});
          }
        });
      }else{
        console.log(error);
      }
    });
  }

};
/* CREATE --------------------------------------------------------------------------------------------------- */
exports.updatePost = (req, res, next) => {};

exports.deletePost = (req, res, next) => {};
/* GET ALL ARTICLES ------------------------------------------------------------------------------------ */
exports.getPost = (req, res, next) => {
  let selectGetPost = `SELECT * FROM post`;
  db.query(selectGetPost, (error, results) => {
    if (!error) {
      console.log(results);
      return res.status(200).json(results);
    } else {
      return res.status(400).json({message : 'erreur 400'});
    }
  });
};
