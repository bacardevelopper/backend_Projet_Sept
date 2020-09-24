/* modules used */
const express = require('express');
const fonctionID = require('../controllers/controllersID');
/* modules used */

const myRouterUser = express.Router();

/* ----------- */
myRouterUser.post('/signup', fonctionID.createUser);
myRouterUser.post('/login', fonctionID.loginUser);

module.exports = myRouterUser;
