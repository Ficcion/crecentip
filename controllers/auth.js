const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generaJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        // Verificar correo
        const usuarioDB = await Usuario.findOne({ correo });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales incorrectas.'
            });
        }

        // Verificar contraseña
        const validaClave = bcrypt.compareSync( password, usuarioDB.password );
        if (!validaClave) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas.'    
            });
        }

        // Generar web token
        const token = await generaJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });    
    }
}

const renovarToken = async (req, res = response) => {
    const uid = req.uid;
    try {
        if (!uid) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas.'    
            });
        }

        const token = await generaJWT( uid );
    
        res.json({
            ok: true,
            token,
        });
    
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });    

    }
}


module.exports = {
    login,
    renovarToken
}