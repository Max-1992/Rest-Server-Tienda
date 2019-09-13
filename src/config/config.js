// CONFIGURACIÓN GLOBAL DE PUERTO
process.env.PORT = process.env.PORT || 3000;


// DIFERENCIACIÓN DE ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// CONEXIÓN GLOBAL A MONGO DB
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/tienda';
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URL_DB = urlDB;