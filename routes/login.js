var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El email ingresado no está registrado - email',
                errors: err
            });
        }

        if ( !bcrypt.compareSync( body.password, usuarioBD.password ) ){ // compareSync nos permite tomar el string a verificar contra otro string que ya ha sido pasado por el hash
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!

        usuarioBD.password = ':)';
        // payload, seed, fecha de expiracion del token
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });// 14400 son 4hr


        res.status(200).json({
            ok: true,
            usuarioBD: usuarioBD,
            token: token,
            id: usuarioBD._id
        });
    } );
} );


module.exports = app;