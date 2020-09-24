/* modules used */
const express = require('express');
const bPraser = require('body-parser');
const mongoose = require('path');
const helmet = require('helmet');
const mysql = require('mysql');
/* modules used */

/* routers used */
const routersUser = require('./routers/routerUser');
/* routers used */

/* configuration connexion DB */

/* configuration connexion DB */

/*  CREATE EXPRESS APP */
const app = express();

app.use(helmet());

/* HEADERS CORS */
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

/* PARSER : ANALYSE SYNTHAXE */
app.use(bPraser.json());
app.use(bPraser.urlencoded({
	extended : true
}));


/* GLOBAL MIDDLE */
app.use('/home', routersUser );
// app.use('/net', / routersPost /);


/* EXPORT MODULE APP */
module.exports = app;
