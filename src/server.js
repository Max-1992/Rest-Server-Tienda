const express = require('express');
const app = express();

// CONFIGURACIONES GLOBALES
require('./config/config');

// //RUTAS
app.use(require('./routes/index'));



app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en le puerto ${process.env.PORT}`);
});