var express = require('express');
var fs = require('fs');

var app = express();


// -req(request) es la peticion al servidor
// -res(response) es la respuesta que entrega el servidor
// -next le dice a node que cuando se ejecute siga ocn la siguiente instruccion

// ===========================================================
// GET IMAGEN MEDICO
// ===========================================================
app.get('/:tipo/:img', (req, res, next) => { // tiene 3 parametros; 1) el request y 2) el parametro y 3) el callback(es una funcion)

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${ tipo }/${ img }`; // variable para verificar si la imagen existe y asi poder colocar una por defecto si no

    fs.exists( path, existe => { // recibe un path y un callback booleano (existe)

        if( !existe ) {
            path = './assets/no-img.jpg';
        }

        res.sendfile( path );
    });

} ); 

module.exports = app;