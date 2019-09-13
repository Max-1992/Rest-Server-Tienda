const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());


// CONFIGURACIONES GLOBALES
require('./config/config');

// RUTAS
app.use(require('./routes/index'));


// CONEXIÓN A MONGO DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos Online');

});


app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en le puerto ${process.env.PORT}`);
});