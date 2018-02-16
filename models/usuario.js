var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

// funcion que recibe un objeto de js con la config del registro que se quiere hacer
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique:true , required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, required: true, enum: rolesValidos }

});

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} ya fue registrado anteriormente' } );

module.exports = mongoose.model('Usuario', usuarioSchema);