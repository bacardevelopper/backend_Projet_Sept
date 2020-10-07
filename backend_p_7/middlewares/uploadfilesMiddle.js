/* modules used */
const fs = require("fs");
const path = require("path");
/* modules used */

module.exports = (req, res, next) => {
  console.log(req.files.file.name);
  const file = req.files.file;

  let oldpath = file.path;
  let newPath ='C:\\Users\\gazab\\OneDrive\\Bureau\\project_7_realese\\backend_p_7\\uploadfiles\\'+ file.name;

  fs.readFile(oldpath, (err, data) => {
    console.log(err);
    fs.writeFile(newPath, data, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "non upl" });
      } else {
        res.status(200).json({ msg: "success" });
      }
    });
  });
};
