const jwt = require('jsonwebtoken');

const generaJWT = ( uid, role ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = { uid, role };

        jwt.sign( payload, process.env.SEMILLA, { expiresIn: '9h' },
        ( err, token ) => {
            if (err) {
                reject('No se generó JSWT.');

            } else {
                resolve( token );
            }
        });
    });
}


module.exports = {
    generaJWT,
}