const Role = require('../models/rol');
const {Usuario, Categoria, Producto} = require('../models');

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
    if(!existeUsuario){//Es undefined, null, false, 0. Nan, ''
        throw new Error(`El id: ${id} de Usuario no existe en la DB`);
    }
};

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){//Es undefined, null, false, 0. Nan, ''
        throw new Error(`El id: ${id} de Categoria no existe en la DB`);
    }
};

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){//Es undefined, null, false, 0. Nan, ''
        throw new Error(`El id: ${id} del Producto no existe en la DB`);
    }
};

module.exports = {
    esRoleValido,
    existeMail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
};