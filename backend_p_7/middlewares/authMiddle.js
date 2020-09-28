/* modules used */
const jwt = require('jsonwebtoken');

/* module export function verify token authentification */
module.exports = async (req, res, next) => {
	const token = await req.body.tokenReq;
	if(token){
		jwt.verify(req.body.tokenReq, 'TOKEN_IS_FREE_OPEN_SOURCE', (err, data) => {
			if(err){
				res.status(401).json({message : 'non auhtentifié'});
			}else{
				next();
			}
		});
	}else{
		res.status(400).json({message : 'erreur'});
	}

}