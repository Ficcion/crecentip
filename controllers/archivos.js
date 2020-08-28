const { response } = require('express');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.C_C_N,
    api_key: process.env.C_A_K,
    api_secret: process.env.C_A_S
});

/* OBTIENE LISTADO DE TODOS LOS ARCHIVOS DE UN PACIENTE */
const getArchivos = (req, res = response) => {
    const pacienteID = req.params.pacienteID;

    cloudinary.search
    .expression(pacienteID)
    .execute()
    .then(result => {
        if (result !== undefined) {
            return res.status(200).json({
                ok: true,
                lista: result,
            });
        }
    });
}


/* SUBIR ARCHIVOS DE UN PACIENTE */
const subirArchivo = (req, res = response) => {
    const pacienteID = req.params.pacienteID;
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecionó ningún archivo.',
            errors: { message: 'Debe seleccionar un archivo.' }
        });
    }

    // Obtener nombre del archivo
    const archivo = req.files.archivo;
    const nombreSeparado = archivo.name.split('.');
    const extensionArchivo = nombreSeparado[ nombreSeparado.length - 1 ];
    const sinExtension = nombreSeparado[ nombreSeparado.length - 2 ];    

    // Extenciones aceptadas
    const extensiones = ['gif', 'jpg', 'jpe', 'jpeg', 'pdf', 'png', 'tga', 'tif', 'tiff', 'webp'];

    if (extensiones.indexOf(extensionArchivo) < 0) {
        return res.status(415).json({
            ok: false,
            mensaje: 'Archivo no soportado.',
            errors: { massage: 'Soportados: ' + extensiones.join(', ') },
        });
    }

    // Nombre de archivo personalizado (pacienteID + nombre de archivo sin extensión)
    const nombreSolo = `${ pacienteID }-${ sinExtension }`;
    
    // Comprobar si ya existe un archivo con ese nombre
    cloudinary.api.resource(nombreSolo, (error, result) => {
        if (result) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Nombre duplicado.',
                errors: { massage: 'Ya existe un archivo con ese nombre.' },
            });
        } else { // Subir el archivo
            cloudinary.uploader.upload(archivo.tempFilePath, { public_id: nombreSolo }, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al subir archivo.',
                        errors: err,
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Archivo subido correctamente.',
                    result,
                });
            });
        }
    });
}


/* ELIMINA UN ARCHIVO POR NOMBRE */
const borrarArchivo = (req, res = response) => {
    const nombreArchivo = req.params.nombre;

    cloudinary.uploader.destroy(nombreArchivo, (error, result) => {
        if (!error) {
            return res.status(200).json({
                ok: true,
                mensaje: 'Archivo borrado.',
                borra: req.usuario,
                result,
            });
        }
    });
}


module.exports = {
    getArchivos,
    subirArchivo,
    borrarArchivo,
}
