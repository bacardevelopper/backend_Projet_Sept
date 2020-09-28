/* modules used */
const express = require('express');
const fonctionPost = require('../controllers/controllersPOST');
const authVerify = require('../middlewares/authMiddle');
/* modules used */

const myRouterPost = express.Router();

/* ----------- */
myRouterPost.post('/create', /* function phantom */);
myRouterPost.put('/update', /* function phantom */);
myRouterPost.delete('/delete', /* function phantom */);
myRouterPost.get('/read/:id', /* function phantom */);
myRouterPost.post('/read/all', authVerify, fonctionPost.getPost);

module.exports = myRouterPost;
