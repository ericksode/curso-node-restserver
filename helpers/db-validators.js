const Role = require('../models/rol');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no existe en la DB`);
    }
};

const existeMail = async(correo) => {
    const existEmail = await Usuario.findOne({correo});
    if(existEmail){//No es undefined, null, false, 0. Nan, ''
        throw new Error(`El correo ${correo} ya esta registrado en la DB`);
    }
};

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){//No es undefined, null, false, 0. Nan, ''
        throw new Error(`El id: ${id} no existe en la DB`);
    }
};

module.exports = {
    esRoleValido,
    existeMail,
    existeUsuarioPorId
};