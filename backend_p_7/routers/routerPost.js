/* modules used */
const express = require("express");
const fonctionPost = require("../controllers/controllersPOST");
const authVerify = require("../middlewares/authMiddle");
const upload = require("../middlewares/uploadfilesMiddle");
/* modules used */

const myRouterPost = express.Router();

/* ----- MY ROUTER ----- */
myRouterPost.post("/create", authVerify, upload, fonctionPost.createPost);
myRouterPost.put("/update", authVerify, upload, fonctionPost.updatePost);
myRouterPost.post("/delete", authVerify, fonctionPost.delete);
myRouterPost.post("/own/post", authVerify, fonctionPost.ownPost);
myRouterPost.post("/read/all/", authVerify, fonctionPost.geAlltPost);
myRouterPost.post("/profile", authVerify, fonctionPost.profileRecup);
myRouterPost.post("/updt", authVerify, fonctionPost.updtRecFront);
myRouterPost.post("/admin/all", authVerify, fonctionPost.adminAllPost);
myRouterPost.post("/moderer", authVerify, fonctionPost.moderer);
myRouterPost.put("/modifier/mdp", authVerify, fonctionPost.modifierMdp);
myRouterPost.post("/comment", authVerify, fonctionPost.comment);
myRouterPost.post("/all/comment", authVerify, fonctionPost.allComment);

module.exports = myRouterPost;
