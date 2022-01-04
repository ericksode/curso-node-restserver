const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, existeMail, existeUsuarioPorId } = require('../helpers/db-validators');
/*const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');*/
const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares/index');

const router = Router();

router.get('/',[
    check('desde', 'Valor desde no es un entero').toInt().isInt(),
    check('limite', 'Valor limite no es un entero').toInt().isInt(),
    validarCampos
], usuariosGet);

router.post('/', [
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 caracteres').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( existeMail ),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    //check('rol').custom( (rol) => esRoleValido(rol) ),
    check('rol').custom( esRoleValido ),
    validarCampos,
],usuariosPost);

router.put('/:id',[
    check('id', 'No es un ID valido en MongoDB').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos,
],usuariosPut);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROL','VENTAS_ROL','OTRO_ROL'),
    check('id', 'No es un ID valido en MongoDB').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;