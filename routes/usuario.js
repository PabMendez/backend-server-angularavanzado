var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autenticacion');

var Usuario = require('../models/usuario');
// var SEED = require('../config/config').SEED;

// ===========================================================
// Obtener todos los usuarios
// ===========================================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios)=>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
} ); 



// ===========================================================
// Actualizar un usuario
// ===========================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById( id, (err, usuario) => {// aca el parametro 'usuario' es el RESPONSE DE LA PETICION, por lo tanto contiene todos los campos de usuario
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( ( err, usuarioGuardado ) =>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({ 
                ok: true,
                usuario: usuarioGuardado
            });
        } );
    } );
});

// ===========================================================
// Crear un nuevo usuario
// ===========================================================
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado ) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({ // 201 = recurso creado
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    } );
    
} );


// ===========================================================
// Borrar un usuario por su ID
// ===========================================================
app.delete('/:id', mdAutentication.verificaToken, ( req, res ) => {

    // primer obtener la id
    var id = req.params.id;

    // se hace referencia al esquema de Usuario y gracias a los metodos de mongoose se busca por id y se remueve
    // todos los metodos de mongoose tienen un callback
    Usuario.findByIdAndRemove(id, ( err, usuarioBorrado ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con esa ID no existe',
                errors: { message: 'El usuario con esa ID no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
} );

module.exports = app;