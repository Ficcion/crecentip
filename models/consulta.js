const { Schema, model } = require('mongoose');

const ConsultaSchema = Schema({
    fecha: {
        type: String,
        required: true
    },
    padecimiento: { type: String },
    frecCardiaca: { type: String },
    frecResapiratoria: { type: String },
    tensionArterial: { type: String },
    temperatura: { type: String },
    cintura: { type: String },  
    peso: {
        type: String,
        required: true,
    },
    talla: {
        type: String,
        required: true
    },
    brazada: { type: String },
    sgtoInferior: { type: String },
    sgtoSuperior: { type: String },
    perimCefalico: { type: String },
    edadOsea: { type: String },
    expFisica: { type: String },
    tratamiento: { type: String },
    diagnostico: { type: String },
    observaciones: { type: String },
    rct: { type: String },
    rbt: { type: String },
    sIsS: { type: String },
    imc: { type: String },
    vc: { type: String },
    mesesT: { type: String },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: true
    },
});
  
ConsultaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});


module.exports = model('Consulta', ConsultaSchema); 