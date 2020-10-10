/* modules used */
const express = require('express');
const fonctionPost = require('../controllers/controllersPOST');
const authVerify = require('../middlewares/authMiddle');
const upload = require('../middlewares/uploadfilesMiddle');
/* modules used */
const myRouterPost = express.Router();
/* ----------- */

myRouterPost.post('/create', authVerify,  upload,  fonctionPost.createPost);
myRouterPost.put('/update', authVerify/* function phantom */);
myRouterPost.delete('/delete', authVerify/* function phantom */);
myRouterPost.get('/read/:id', authVerify/* function phantom */);
myRouterPost.post('/read/all/', authVerify/*, fonctionPost.getPost*/);

module.exports = myRouterPost;
