var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ===========================================================
// Verificar Token
// ===========================================================
exports.verificaToken = function( req, res, next ) {

    var token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) =>{

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next(); // sin el next se quedaria pegado hasta acá aunque el token fuera correcto

        // res.status(200).json({
        //     ok: false,
        //     decoded: decoded
        // });
    } );

}