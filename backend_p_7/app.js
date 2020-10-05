/* modules used */
const express = require('express');
const bPraser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const fileUpload = require('express-fileupload');
/* modules used */

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
app.use(fileUpload());



/* ROUTERS USED */
const routersUser = require('./routers/routerUser');
const routerArticles = require('./routers/routerPost');
/* routers used */

/* GLOBAL MIDDLE */
/* serve static files, and join path global */
app.use('/uploadfiles', express.static(path.join(__dirname, 'uploadfiles')));
app.use('/home', routersUser );
app.use('/home',  routerArticles);


/* EXPORT MODULE APP */
module.exports = app;
