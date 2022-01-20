const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async(req = request, res = response) => {
    /*if(!req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivo en la peticion'
        });
    }*/
    try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'img');
        return res.json({
            nombre
        });
    } catch (msg) {
        return res.status(400).json({
            msg
        });
    }

};

const actualzarImg = async(req= request, res=response) => {
    const {id, collection} = req.params;
    let modelo;
    switch (collection) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el id ${id} en la coleccion ${collection}`
                    });
                }
                
            break;
        case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el id ${id} en la coleccion ${collection}`
                    });
                }
            break;
    
        default:
            return res.status(400).json({
                msg: 'No se ha implementado esa collection'
            });
    }

    //limpiar imagenes previas
    if(modelo.img){
        //borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, modelo.img);
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, collection);
    modelo.img = nombre;
    await modelo.save();

    res.json({
        modelo
    });
};

const actualzarImgCloudinary = async(req= request, res=response) => {
    const {id, collection} = req.params;
    let modelo;
    switch (collection) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el id ${id} en la coleccion ${collection}`
                    });
                }
                
            break;
        case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el id ${id} en la coleccion ${collection}`
                    });
                }
            break;
    
        default:
            return res.status(400).json({
                msg: 'No se ha implementado esa collection'
            });
    }

    //limpiar imagenes previas
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length-1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath  } = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json({
        modelo
    });
};

const mostrarImagen = async(req = request, res = response) => {
    const {id, collection} = req.params;
    let modelo;

    switch (collection) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el id ${id} en la coleccion ${collection}`
                    });
                }
                
            break;
        case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe el id ${id} en la coleccion ${collection}`
                    });
                }
            break;
    
        default:
            return res.status(400).json({
                msg: 'No se ha implementado esa collection'
            });
    }

    //limpiar imagenes previas
    if(modelo.img){
        //borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, modelo.img);
        if(fs.existsSync(pathImg)){
            return res.sendFile(pathImg);
        }
    }

    const pathImgNotFound = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImgNotFound);
}

module.exports = {
    cargarArchivo,
    actualzarImg,
    mostrarImagen,
    actualzarImgCloudinary
}