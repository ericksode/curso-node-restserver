const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', [
    check('desde', 'Valor desde no es un numero').toInt().isInt(),
    check('limite', 'Valor limite no es un numero').toInt().isInt(),
    validarCampos,
], obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID valido de MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido en MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido en MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

module.exports = router;