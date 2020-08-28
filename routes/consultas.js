/*
Ruta: /consultas
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validaCampos } = require('../middlewares/valida-campos');
const { validaJWT } = require('../middlewares/valida-jwt');

const {
    getConsultas, getConsulta, crearConsulta, actualizarConsulta, borrarConsulta
} = require('../controllers/consultas');

const router = Router();

router.get( '/:pacienteID', validaJWT, getConsultas );

router.get( '/:pacienteID/:id', validaJWT, getConsulta );

router.post( '/',
    [
        validaJWT,
        check('fecha', 'La fecha es obligatoria').not().isEmpty(),        
        check('peso', 'El peso es obligatorio').not().isEmpty(),        
        check('talla', 'La talla es obligatoria').not().isEmpty(),        
        check('paciente', 'El id del paciente debe ser válido').isMongoId(),        
        validaCampos,
    ],
    crearConsulta
);

router.put( '/:id',
    [
        validaJWT,
        check('fecha', 'La fecha es obligatoria').not().isEmpty(),        
        check('peso', 'El peso es obligatorio').not().isEmpty(),        
        check('talla', 'La talla es obligatoria').not().isEmpty(),        
        validaCampos,
    ],
    actualizarConsulta
);

router.delete( '/:id', validaJWT, borrarConsulta );


module.exports = router;