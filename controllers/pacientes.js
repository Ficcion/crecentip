const { response } = require('express');
const Paciente = require('../models/paciente');
const Usuario = require('../models/usuario');

/* DEL MÉDICO EN TURNO O TODOS SI ES ADMINISTRADOR */
const getPacientes = async (req, res = response) => {
    const usuarioID = req.uid;
    const desde = Number(req.query.desde) || 0;
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
            const [ pacientes, total ] = await Promise.all([
                Paciente.find()
                    // .sort({nombre: 1})
                    .sort( ordenado )
                    .skip( desde )
                    .limit( 5 )
                    .populate('usuario', 'nombre'),

                Paciente.countDocuments()
            ])

            res.json({
                ok: true,
                total,
                pacientes,
            });
        }

        if (role === 'MEDICO_ROLE') {
            const [ pacientes, total ] = await Promise.all([
                Paciente.find({ usuario: usuarioID })
                    .sort( ordenado )
                    .skip( desde )
                    .limit( 5 )
                    .populate('usuario', 'nombre'),

                Paciente.countDocuments({ usuario: usuarioID })
            ])

            res.json({
                ok: true,
                total,
                pacientes,
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, obteniendo pacientes.'
        });
    }
}


const getPaciente = async (req, res = response) => {
    const pacienteID = req.params.id;

    try {
        const pacienteDB = await Paciente.findById( pacienteID )
            .populate('usuario', 'nombre')
    
        res.json({
            ok: true,
            paciente: pacienteDB,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, obteniendo paciente.'
        });
    }
}


const crearPacientes = async (req, res = response) => {
    const usuarioID = req.uid;
    const paciente = new Paciente({ usuario: usuarioID, ...req.body });

    try {
        // Guardar paciente
        const pacienteDB = await paciente.save();
        
        res.json({
            ok: true,
            paciente: pacienteDB,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, creando paciente.'
        });
    }
}


const actualizarPaciente = async (req, res = response) => {
    const pacienteID = req.params.id;

    try {
        const pacienteDB = await Paciente.findById( pacienteID );
    
        if (!pacienteDB) {
            return res.status(400).json({
                    ok: false,
                    msg: 'No existe un paciente con ese id.',
                });
        }

        // Actualizar
        const campos = req.body;

        const pacienteActualizado = await Paciente.findByIdAndUpdate( pacienteID, campos, { new: true });

        res.json({
            ok: true,
            paciente: pacienteActualizado,
        });
 
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, actualizando paciente.'
        });
    }
}


const borrarPaciente = async (req, res = response) => {
    const pacienteID = req.params.id;

    try {
        const pacienteDB = await Paciente.findById( pacienteID );

        if (!pacienteDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un paciente con ese id.',
            });
        }

        await Paciente.findByIdAndDelete( pacienteID );

        res.json({
            ok: true,
            msg: 'Paciente borrado.'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, borrando paciente.'
        });
    }
}


module.exports = {
    getPacientes,
    getPaciente,
    crearPacientes,
    actualizarPaciente,
    borrarPaciente,
}