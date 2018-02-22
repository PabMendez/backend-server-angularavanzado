var express = require('express');
var app = express();

var mdAutentication = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');
// var SEED = require('../config/config').SEED;

// ===========================================================
// Obtener todos los hospitales
// ===========================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; // parametro opcional que dice desde cual parametro debe cargar(podria venir undefined)
    // se supone que viene desde la query, pero si no es mejor dejarlo definido de antemano
    desde = Number(desde);

    Hospital.find({})// aca el find trae todo lo de la ruta
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') // aca se puede especificar que tabla y que campos queremos de la otra tabla o coleccion
        .exec(
            (err, hospitales)=>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospital',
                    errors: err
                });
            }

            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            } );

            
        });
} ); 



// ===========================================================
// Actualizar un hospital
// ===========================================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, (err, hospital) => {// aca el parametro 'hospital' es el RESPONSE DE LA PETICION, por lo tanto contiene todos los campos de usuario
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        
        if( !hospital ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( ( err, hospitalGuardado ) =>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({ 
                ok: true,
                hospital: hospitalGuardado
            });
        } );
    } );
});

// ===========================================================
// Crear un nuevo hospital
// ===========================================================
app.post('/', mdAutentication.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    hospital.save( ( err, hospitalGuardado ) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({ // 201 = recurso creado
            ok: true,
            hospital: hospitalGuardado,
            hospitalToken: req.hospital
        });
    } );
    
} );


// ===========================================================
// Borrar un hospital por su ID
// ===========================================================
app.delete('/:id', mdAutentication.verificaToken, ( req, res ) => {

    // primer obtener la id
    var id = req.params.id;

    // se hace referencia al esquema de hospital y gracias a los metodos de mongoose se busca por id y se remueve
    // todos los metodos de mongoose tienen un callback
    Hospital.findByIdAndRemove(id, ( err, hospitalBorrado ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con esa ID no existe',
                errors: { message: 'El hospital con esa ID no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
} );

module.exports = app;