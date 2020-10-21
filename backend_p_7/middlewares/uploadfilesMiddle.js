/* modules used */
const fs = require("fs");
const randomstring = require("randomstring");
/* modules used */

module.exports = (req, res, next) => {
  /* si un fichier est envoyé on enregistre sinon nada */
  if (req.files.file) {
    console.log(req.files.file.name);
    const file = req.files.file;
    console.log(req.fields.cookie);
    let oldpath = file.path;
    file.name = randomstring.generate(7) + "." + file.name.split(".")[1];
    let newPath = process.cwd() + "/uploadFiles/" + "" + "fil" + file.name;

    fs.readFile(oldpath, (err, data) => {
      console.log(err);
      fs.writeFile(newPath, data, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(newPath);
          req.files.urlfile = `${req.protocol}://${req.get(
            "host"
          )}/uploadfiles/fil${file.name}`;
          req.body.vef = 1;

          next();
        }
      });
    });
  } else {
    req.body.vef = 0;
    next();
  }
};
