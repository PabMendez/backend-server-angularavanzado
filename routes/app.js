var express = require('express');

var app = express();


// -req(request) es la peticion al servidor
// -res(response) es la respuesta que entrega el servidor
// -next le dice a node que cuando se ejecute siga ocn la siguiente instruccion
app.get('/', (req, res, next) => { // tiene 3 parametros; 1) el request y 2) el parametro y 3) el callback(es una funcion)

    res.status(200).json({ //aca el 200 es el codigo de peticion http
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
} ); 

module.exports = app;