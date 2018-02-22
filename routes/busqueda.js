var express = require('express');

var app = express();

var Hospital = require('../models/hospital');// para poder buscar algun dato hay que importar el modelo
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ===========================================================
// BUSQUEDA POR COLECCION
// ===========================================================
app.get('/coleccion/:tabla/:busqueda', (req, res)=>{

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );

    var promesa;

    switch( tabla ){

        case 'usuarios':
            promesa = buscarUsuarios( busqueda, regex );
        break;

        case 'hospitales':
            promesa = buscarHospitales( busqueda, regex );
        break;

        case 'medicos':
            promesa = buscarMedicos( busqueda, regex );
        break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'solo se pueden buscar: medicos, hospitales y usuarios',
                error: { message :'no la cagues asi porfa' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            tabla: data
        });
    });
});

// ===========================================================
// BUSQUEDA GENERAL
// ===========================================================
// -req(request) es la peticion al servidor
// -res(response) es la respuesta que entrega el servidor
// -next le dice a node que cuando se ejecute siga ocn la siguiente instruccion
app.get('/todo/:busqueda', (req, res, next) => { // tiene 3 parametros; 1) el request y 2) el parametro y 3) el callback(es una funcion)

    var busqueda = req.params.busqueda; // codigo para obtener el parametro "busqueda"
    var regex = new RegExp( busqueda, 'i' );

    Promise.all([ 
                buscarHospitales( busqueda, regex ), 
                buscarMedicos( busqueda, regex ), 
                buscarUsuarios( busqueda, regex ) 
            ])
            .then( respuesta =>{
                res.status(200).json({ //aca el 200 es el codigo de peticion http
                    ok: true,
                    hospitales: respuesta[0],
                    medicos: respuesta[1],
                    usuarios: respuesta[2]
                });
            });

    // buscarHospitales( busqueda, regex )
    // .then( hospitales =>{//aca se llama el resolve que en realidad es "hospitales", porque en la funcion asi se define

        
    // });
} ); 

// ===========================================================
// Metodo para transformar la respuesta en una PROMESA
// ===========================================================
// BUSCAR TODOS LOS HOSPITALES
// ===========================================================
function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {

    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => { // (err y hospitales) son los callbacks

            if (err) {
            reject("Error al cargar hospitales", err);
            } else {
            resolve(hospitales);
            }
      });
  });
}

// ===========================================================
// BUSCAR TDOS LOS MEDICOS
// ===========================================================
function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {

    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .populate('hospital')
      .exec((err, medicos) => {
        // (err y medicos) son los callbacks

        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

// ===========================================================
// BUSCAR TODOS LOS USUARIOS
// ===========================================================
function buscarUsuarios( busqueda, regex ) {

    return new Promise( (resolve, reject) => {
        
        Usuario.find({}, 'nombre email role')
                .or([{ 'nombre': regex }, { 'email': regex }])
                .exec(( err, usuarios ) =>{
                    if (err) {
                        reject('Error al cargar los usuarios', err)
                    }else {
                        resolve(usuarios)
                    }
                });
    } );
}

module.exports = app;