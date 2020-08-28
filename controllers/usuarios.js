const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generaJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

// ADMINISTRADOR
const getUsuarios = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;

    try {
        const [ usuarios, total ] = await Promise.all([
            Usuario.find()
                .sort({nombre: 1})
                .skip( desde )
                .limit( 5 ),

            Usuario.countDocuments()
        ])  
    
        res.json({
            ok: true,
            total,
            usuarios,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, obteniendo usuarios.'
        });
    }
}


const crearUsuarios = async (req, res = response) => {
    const { uid, correo, password } = req.body;

    try {
        const existeCorreo = await Usuario.findOne({ correo });
        if (existeCorreo) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo registrado por otro usuario.'
            });
        }
        const usuario = new Usuario( req.body );

        // Encriptar contaseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // Guardar usuario
        await usuario.save();
        
        // Generar web token
        const token = await generaJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token,
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, creando usuario.'
        });
    }
}


// ADMINISTRADOR POR EL MOMENTO
const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id.',
            });
        }

        // Actualizar
        const { role, activo, ...campos } = req.body;
        const password = req.body.password;

        // Comprobar correo
        if ( usuarioDB.correo === req.body.correo ) {
            delete campos.correo;

        } else {
            const existeCorreo = await Usuario.findOne({ correo: req.body.correo });
            if (existeCorreo) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Correo usado por otro usuario.'
                });
            }
        }
        
        // Encriptar contaseña
        const salt = bcrypt.genSaltSync();
        campos.password = bcrypt.hashSync( password, salt );

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true });

        res.json({
            ok: true,
            usuarioActualizado,
        });
 
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, actualizando usuario.'
        });
    }
}


// ADMINISTRADOR
const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id.',
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario borrado.'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, borrando usuario.'
        });
    }
}


module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
}