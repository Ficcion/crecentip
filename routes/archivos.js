/*
Ruta: /archivos
*/

const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { validaJWT } = require('../middlewares/valida-jwt');
const { getArchivos, subirArchivo, borrarArchivo } = require('../controllers/archivos');

const router = Router();

router.get( '/:pacienteID', validaJWT, getArchivos );

// default options (midleware)
router.use( fileUpload({ useTempFiles: true }));
router.put( '/:pacienteID', validaJWT, subirArchivo );

router.delete( '/:nombre', validaJWT, borrarArchivo );


module.exports = router;