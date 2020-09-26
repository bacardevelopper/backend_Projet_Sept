exports.createPost = ( req, res, next ) => {

}

exports.updatePost = ( req, res, next ) => {

}

exports.deletePost = ( req, res, next ) => {

}

exports.getPost = ( req, res, next ) => {
    console.log('requete reçu');
    res.status(200).json({message : 'requete get article bien reçu'});
}

exports.moderatePost = ( req, res, next) => {

}