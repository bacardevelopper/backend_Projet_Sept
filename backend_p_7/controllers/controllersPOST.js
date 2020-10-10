const db = require("../models/bddConfig");

/* CREATE --------------------------------------------------------------------------------------------------- */
exports.createPost = (req, res, next) => {
    req.body = req.fields;
    console.log('/* ---------- DATA FIELDS ----------- */');
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
    if(data.titre !== "" && data.texte !== ""){
        const selectIdUser = `SELECT id FROM users WHERE email = '${email}'`;
        
        db.query(selectIdUser, (error, results) => {
          if(results){
            console.log(results[0].id);
            /* recuperation user id */
            const userIdFound = results[0].id;
            const sqlInsertPost = `INSERT INTO post (userid, titre, texte, urlfile) VALUES('${userIdFound}', '${titre}','${texte}','${urlFictif}')`;
    
            db.query(sqlInsertPost, (error, results) => {
              if(!error){
                console.log('bien ajouté a la bdd');
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

};
