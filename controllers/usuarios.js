const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req = request, res = response) => {
    //http://localhost:8081/api/usuarios?q=hola&nombre=Erick&apikey=12161516541
    //const {q, nombre='No name', apikey, page=1, limit=10} = req.query;
    const {limite=5, desde=0} = req.query;
    const query = {estado: true};

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));
    // const total = await Usuario.countDocuments(query);

    /*Arreglo de promesas se ejecuta simultaneamente y se pone el await para esperar a que todas las promesas terminen*/
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    res.json({
        total,
        usuarios
    });
};

const usuariosPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });//required
    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guarda en DB
    await usuario.save();

    res.status(201).json({
        usuario
    });
};

const usuariosPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id ,password, google, correo, ...resto } = req.body;

    if (password) {
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(400).json({
        msg: 'Put API - Controlador',
        usuario
    });
};

const usuariosPatch = (req = request, res) => {
    res.json({
        msg: 'Patch API - Controlador'
    });
};

const usuariosDelete = async(req = request, res) => {
    const { id } = req.params;
    //Borrado en duro o fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);
    //Borrado en blando
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    //const usuarioAuth = req.usuario;
    res.json({
        usuario: usuario,
    });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}