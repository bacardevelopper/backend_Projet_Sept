/* modules used */
const fs = require("fs");
const path = require("path");
/* modules used */

module.exports = (req, res, next) => {
  console.log(req.files.file.name);
  const file = req.files.file;
  console.log(req.fields.cookie);
  let oldpath = file.path;
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

        next();
      }
    });
  });
};
