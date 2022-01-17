const { request, response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req = request, res = response, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(404).json(errores.errors[0]);
    }

    next();
};

module.exports = {
    validarCampos
};