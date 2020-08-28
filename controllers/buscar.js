const { response } = require('express');
const Paciente = require('../models/paciente');

const getBuscado = async (req, res = response) => {
    const usuarioID = req.uid;
    const buscado = req.params.buscado;
    const resultado = RegExp( buscado, 'i');

    try {
        
        const pacientesDB = await Paciente.find({ usuario: usuarioID, nombre: resultado });
        res.json({
            ok: true,
            encontrados: pacientesDB,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, obteniendo pacientes.'
        });
    }
}


module.exports = {
    getBuscado
}