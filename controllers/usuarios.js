const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {
//http://localhost:8081/api/usuarios?q=hola&nombre=Erick&apikey=12161516541
    const {q, nombre='No name', apikey, page=1, limit=10} = req.query;

    res.json({
        msg: 'Get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });

};

const usuariosPost = (req, res = response) => {
    
    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'Post API - Controlador',
        nombre,
        edad
    });

};

const usuariosPut = (req, res = response) => {

    const {id} = req.params;

    res.status(400).json({
        msg: 'Put API - Controlador',
        id
    });

};

const usuariosPatch = (req, res) => {

    res.json({
        msg: 'Patch API - Controlador'
    });

};

const usuariosDelete = (req, res) => {

    res.json({
        msg: 'Delete API - Controlador'
    });

};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}