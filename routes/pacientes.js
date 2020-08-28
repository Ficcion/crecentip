/*
Ruta: /pacientes
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validaCampos } = require('../middlewares/valida-campos');
const { validaJWT } = require('../middlewares/valida-jwt');

const {
    getPacientes, getPaciente, crearPacientes, actualizarPaciente, borrarPaciente
} = require('../controllers/pacientes');

const router = Router();

router.get( '/', validaJWT, getPacientes );

router.get( '/:id', validaJWT, getPaciente );

router.post( '/',
    [
        validaJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),        
        check('nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),        
        check('sexo', 'El género es obligatorio').not().isEmpty(),        
        validaCampos,
    ],
    crearPacientes
);

router.put( '/:id',
    [
        validaJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),        
        check('nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),        
        check('sexo', 'El género es obligatorio').not().isEmpty(),        
        validaCampos,
    ],
    actualizarPaciente
);

router.delete( '/:id', validaJWT, borrarPaciente );


module.exports = router;