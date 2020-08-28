const { Schema, model } = require('mongoose');

const PacienteSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    nacimiento: {
        type: String,
        required: true,
    },
    sexo: {
        type: String,
        required: true
    },
    ocupacion: { type: String },
    origen: { type: String },
    antHeredoFam: { type: String },
    antPerNoPat: { type: String },
    antPerinat: { type: String },
    antPerPat: { type: String },
    tallaMaterna: { type: String },
    tallaPaterna: { type: String },
    tbf: { type: String },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});
  
PacienteSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Paciente', PacienteSchema); 