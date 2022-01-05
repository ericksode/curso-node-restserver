const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { response, request } = require('express');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res=response) => {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});
        //Existe mail
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - mail'
            });
        }
        //Usuario activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - inactivo'
            });
        }
        //Password correcto
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //Crear JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el admin'
        });
    }

}

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;
    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo});
        //Si el usuario no existe lo crea con la data de google
        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':O',
                img,
                google: true
            }
            usuario = new Usuario(data);
            await usuario.save();
        }
        //Si el usuario existe pero su estado es inactivo
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el admin, usuario inactivo'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });   
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se  puedo verificar - Google SignIn'
        });
    }
};

module.exports = {
    login,
    googleSignIn
}