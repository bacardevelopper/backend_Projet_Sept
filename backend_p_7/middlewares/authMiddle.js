/* modules used */
const jwt = require('jsonwebtoken');
/* modules used */

/* module export function verify token authentification */
module.exports =  (req, res, next) => {
	if(req.body.tokenReq){
		jwt.verify(req.body.tokenReq, 'TOKEN_IS_FREE_OPEN_SOURCE', (err, data) => {
			if(err){
				res.status(401).json({message : 'non auhtentifié'});
			}else{
				next();
			}
		});
	}else{
		return res.status(400).json({message : 'erreur'});
	}

}