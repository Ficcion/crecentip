/*
Ruta: /buscar
*/

const { Router } = require('express');
const { validaJWT } = require('../middlewares/valida-jwt');
const { getBuscado } = require('../controllers/buscar');

const router = Router();

router.get( '/:buscado', validaJWT, getBuscado );


module.exports = router;