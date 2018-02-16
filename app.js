// REQUIRES, basicamente es una importacion de LIBRERIAS que usamos para que funcione algo especifico
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// INICIALIZAR VARIABLES, aca es donde se usaran las LIBRERIAS
var app = express();

// BODY PARSER ================================
//
// Estas son funciones middleware, que se van a ejecutar SIEMPRE, cuando el codigo o una peticion entre
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));// si hay un objeto el bodyparses lo tomara y hara un objeto json
// parse application/json
app.use(bodyParser.json());
//=============================================

// IMPORTAR RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// CONEXION A LA BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, resp ) => { // aca se define el path a la bd

    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')

}); 

// RUTAS;  middleware: es algo que se ejecuta antes de las rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});