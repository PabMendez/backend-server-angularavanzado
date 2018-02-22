var express = require('express');
var app = express();

var mdAutentication = require('../middlewares/autenticacion');

var Medico = require('../models/medico');
// var SEED = require('../config/config').SEED;

// ===========================================================
// Obtener todos los medicos
// ===========================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; // parametro opcional que dice desde cual parametro debe cargar(podria venir undefined)
    // se supone que viene desde la query, pero si no es mejor dejarlo definido de antemano
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos)=>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medico',
                    errors: err
                });
            }
            Medico.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        });
} ); 



// ===========================================================
// Actualizar un medico
// ===========================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById( id, (err, medico) => {// aca el parametro 'medico' es el RESPONSE DE LA PETICION, por lo tanto contiene todos los campos de usuario
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        
        if( !medico ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;// el hospital tambien tiene que venir en el body, porque puede ser que la persona lo seleccione de alguna opcion
                                        // esto lo estamos recibiendo de la peticion post o put que se hará desde Angular
                                        // en MI FRONT END yo tengo que mandar la variable hospital, pero va a ser solamente la ID que yo seleccione

        medico.save( ( err, medicoGuardado ) =>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({ 
                ok: true,
                medico: medicoGuardado
            });
        } );
    } );
});

// ===========================================================
// Crear un nuevo medico
// ===========================================================
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( ( err, medicoGuardado ) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({ // 201 = recurso creado
            ok: true,
            medico: medicoGuardado,
            medicoToken: req.medico
        });
    } );
    
} );


// ===========================================================
// Borrar un medico por su ID
// ===========================================================
app.delete('/:id', mdAutentication.verificaToken, ( req, res ) => {

    // primer obtener la id
    var id = req.params.id;

    // se hace referencia al esquema de medico y gracias a los metodos de mongoose se busca por id y se remueve
    // todos los metodos de mongoose tienen un callback
    Medico.findByIdAndRemove(id, ( err, medicoBorrado ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con esa ID no existe',
                errors: { message: 'El medico con esa ID no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
} );

module.exports = app;