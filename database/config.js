const mongoose = require('mongoose');

const dbConeccion = async () => {
    
    try{
        await mongoose.connect( process.env.DB, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

    } catch ( error ) {
        throw new Error('Error al iniciar BD, ver logs.');
    }
}


module.exports = {
    dbConeccion
}