const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidators = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    }
});

// Personalizar validación de Unique
usuarioSchema.plugin(uniqueValidators, { message: 'Ya existe en nuestra base de datos un usuario con este {PATH}' })

// Eliminar la contraseña de la respuesta
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('Usuario', usuarioSchema);