const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

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

module.exports = {
    login
}