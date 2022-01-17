const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const {Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({//puedes cambiar el find por count para retornar el numero de rows/documents
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async(termino = '', res = response) =>{
    const esMongoId = ObjectId.isValid(termino);
    if( esMongoId ){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({//nombre: regex, estado: true
        $or: [{nombre: regex}],
        $and: [{estado: true}]
    });

    return res.json({
        results: categorias
    });
};

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    
    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: producto ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{nombre: regex}],
        $and: [{estado: true}]
    }).populate('categoria','nombre');

    return res.json({
        results: productos
    });
};

const busqueda = (req = request, res = response) => {
    const { termino } = req.params;
    const coleccion = req.params.coleccion.toLowerCase();

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;
    
        default:
            res.status(500).json({
                msg: 'No se ha implementado esta busqueda'
            });
    }

};

module.exports = {
    busqueda
};