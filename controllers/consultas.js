const { response } = require('express');
const Consulta = require('../models/consulta');
const Usuario = require('../models/usuario');

/* DEL PACIENTE EN TURNO O TODAS SI ES ADMINISTRADOR */
const getConsultas = async (req, res = response) => {
    const usuarioID = req.uid;
    const pacienteID = req.params.pacienteID;
    const ordenado = { nombre: 1 };
 
    try {
        const usuarioDB = await Usuario.findById( usuarioID );
    
        if (!usuarioDB) {
            return res.status(400).json({
                    ok: false,
                    msg: 'No existe un usuario con ese id.',
                });
        }
        const role = usuarioDB.role;

        if (role === 'ADMIN_ROLE') {
            const [ consultas, total ] = await Promise.all([
                Consulta.find()
                    .sort( ordenado )
                    .populate('usuario', 'nombre')
                    .populate('paciente', 'nombre'),

                Consulta.countDocuments()
            ])

            res.json({
                ok: true,
                total,
                consultas,
            });
        }

        if (role === 'MEDICO_ROLE') {
            const [ consultas, total ] = await Promise.all([
                Consulta.find({ paciente: pacienteID })
                    .sort( ordenado )
                    .populate('usuario', 'nombre')
                    .populate('paciente', 'nombre'),

                Consulta.countDocuments({ paciente: pacienteID })
            ])

            res.json({
                ok: true,
                total,
                consultas,
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, obteniendo pacientes.'
        });
    }
}


const getConsulta = async (req, res = response) => {
    const id = req.params.id;

    try {
        const consultaDB = await Consulta.findById( id )
            .populate('usuario', 'nombre')
            .populate('paciente', 'nombre')
    
        res.json({
            ok: true,
            consulta: consultaDB,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, obteniendo consulta.'
        });
    }
}


const crearConsulta = async (req, res = response) => {
    const usuarioID = req.uid;
    const consulta = new Consulta({ usuario: usuarioID, ...req.body });

    try {
        const consultaDB = await consulta.save();
        
        res.json({
            ok: true,
            consulta: consultaDB,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, creando consulta.'
        });
    }
}


const actualizarConsulta = async (req, res = response) => {
    const consultaID = req.params.id;

    try {
        const consultaDB = await Consulta.findById( consultaID );

        if (!consultaDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe una consulta con ese id.',
            });
        }

        // Actualizar
        const campos = req.body;

        const consultaActualizada = await Consulta.findByIdAndUpdate( consultaID, campos, { new: true });

        res.json({
            ok: true,
            consultaActualizada,
        });
 
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, actualizando consulta.'
        });
    }
}


const borrarConsulta = async (req, res = response) => {
    const consultaID = req.params.id;

    try {
        const consultaDB = await Consulta.findById( consultaID );

        if (!consultaDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe una consulta con ese id.',
            });
        }

        await Consulta.findByIdAndDelete( consultaID );

        res.json({
            ok: true,
            msg: 'Consulta borrada.'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, borrando consulta.'
        });
    }
}


module.exports = {
    getConsultas,
    getConsulta,
    crearConsulta,
    actualizarConsulta,
    borrarConsulta,
}