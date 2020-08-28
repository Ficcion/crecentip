/*
Ruta: /login
*/

const { Router } = require('express');
const { login, renovarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validaCampos } = require('../middlewares/valida-campos');
const { validaJWT } = require('../middlewares/valida-jwt');

const router = Router();

router.post( '/',
    [
        check('correo', 'El correo es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validaCampos
    ],
    login
)

router.get( '/renovar', validaJWT, renovarToken )


module.exports = router;