/*
Ruta: /usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validaCampos } = require('../middlewares/valida-campos');
const { validaJWT } = require('../middlewares/valida-jwt');

const {
    getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario
} = require('../controllers/usuarios');

const router = Router();

router.get( '/', validaJWT, getUsuarios );

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),        
        check('correo', 'El correo es obligatorio').isEmail(),        
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validaCampos,
    ],
    crearUsuarios
);

router.put( '/:id',
    [
        validaJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),        
        check('correo', 'El correo es obligatorio').isEmail(),        
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validaCampos,
    ],
    actualizarUsuario
);

router.delete( '/:id', validaJWT, borrarUsuario );


module.exports = router;