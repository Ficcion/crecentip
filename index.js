require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConeccion } = require('./database/config');

// Crear servidor de express
const app = express();

// CORS
app.use( cors() );
// app.use(cors(opciones));

// var opciones = {
//     origin: (origin, callback) => {
//         if (process.env.PERMITIDO.indexOf(origin) !== -1) {
//             callback(null, true);

//         } else {

//             callback(new Error('No permitido por el CORS.'))
//         }
//     }
// };

// Lectura Parse del body
app.use( express.json() );

// Base de datos
dbConeccion();

// Directorio público
app.use( express.static('public') );

// RUTAS
app.use( '/usuarios', require('./routes/usuarios') );
app.use( '/pacientes', require('./routes/pacientes') );
app.use( '/consultas', require('./routes/consultas') );
app.use( '/archivos', require('./routes/archivos') );
app.use( '/buscar', require('./routes/buscar') );
app.use( '/login', require('./routes/auth') );


app.listen( process.env.PORT, () => {
    console.log( 'Servidor corriendo en puerto ' + process.env.PORT );
});