const { request, response } = require("express");
const { Producto, Categoria } = require("../models");

const obtenerProductos = async(req = request, res = response) => {
    const { desde = 0, limite=5  } = req.query;
    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true})
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);


    res.json({
        total,
        productos
    });
};

const obtenerProducto = async(req = request, res = response) => {
    const {id} = req.params;
    const producto = await Producto .findById(id, {},{estado: true})
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');

    res.json({
        producto
    });
};

const crearProducto = async(req = request, res = response) => {
    const { precio, descripcion, ...resto } = req.body;
    resto.categoria = resto.categoria.toUpperCase();
    resto.nombre = resto.nombre.toUpperCase();

    const existeProducto = await Producto.findOne({nombre: resto.nombre});
    if(existeProducto){
        return res.status(400).json({
            msg: `El producto ${resto.nombre}, ya existe en la DB`
        });
    }

    const categoriaProducto = await Categoria.findOne({nombre: resto.categoria, estado:true});
    if(!categoriaProducto){
        return res.status(400).json({
            msg: `La categoria ${resto.categoria}, no existe en la DB`
        });
    }

    const data = {
        nombre: resto.nombre,
        precio,
        categoria: categoriaProducto._id,
        usuario: req.usuario._id,
        descripcion
    }

    const producto = new Producto(data);//required
    await producto.save();
    res.status(201).json({
        producto
    });
};

const actualizarProducto = async(req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.categoria = data.categoria.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaProducto = await Categoria.findOne({nombre: data.categoria, estado:true});
    if(!categoriaProducto){
        return res.status(400).json({
            msg: `La categoria ${data.categoria}, no existe en la DB`
        });
    }
    data.categoria = categoriaProducto._id
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.status(202).json({
        producto
    });
};

const borrarProducto = async(req= request, res=response) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.status(202).json({
        producto
    });
};

module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}