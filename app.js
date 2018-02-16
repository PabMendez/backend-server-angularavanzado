// REQUIRES, basicamente es una importacion de LIBRERIAS que usamos para que funcione algo especifico
var express = require('express');
var mongoose = require('mongoose');


// INICIALIZAR VARIABLES, aca es donde se usaran las LIBRERIAS
var app = express();


// CONEXION A LA BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, resp ) => { // aca se define el path a la bd

    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')

}); 


// RUTAS;
app.get('/', (req, res, next) => { // tiene 3 parametros; 1) el request y 2) el parametro y 3) el callback(es una funcion)

    res.status(200).json({ //aca el 200 es el codigo de peticion http
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
} ); 

// -req(request) es la peticion al servidor
// -rest(response) es la respuesta que entrega el servidor
// -next le dice a node que cuando se ejecute siga ocn la siguiente instruccion



// ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});