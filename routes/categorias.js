const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//middleware para id de categoria check('id').custom.( existeCategoria ) //se crea en db-validator y basado en existePorId
router.get( '/', [
    check('desde', 'Valor desde no es un numero').toInt().isInt(),
    check('limite', 'Valor limite no es un numero').toInt().isInt(),
    validarCampos,
], obtenerCategorias);

router.get('/:id',[
    check('id', 'No es un ID valido de MongoDB').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

router.post( '/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

router.put( '/:id',[
    validarJWT,
    check('nombre', 'Nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido en MongoDB').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido en MongoDB').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos, 
], borrarCategoria);

module.exports = router;