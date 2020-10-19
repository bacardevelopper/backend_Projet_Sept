/* modules used */
const express = require("express");
const fonctionPost = require("../controllers/controllersPOST");
const authVerify = require("../middlewares/authMiddle");
const upload = require("../middlewares/uploadfilesMiddle");
/* modules used */
const myRouterPost = express.Router();
/* ----------- */

myRouterPost.post("/create", authVerify, upload, fonctionPost.createPost);
myRouterPost.put("/update", authVerify, upload, fonctionPost.updatePost );
myRouterPost.post("/delete", authVerify, fonctionPost.delete);
myRouterPost.post("/own/post", authVerify, fonctionPost.ownPost);
myRouterPost.post("/read/all/", authVerify, fonctionPost.geAlltPost);
myRouterPost.post("/profile", authVerify, fonctionPost.profileRecup )

module.exports = myRouterPost;
