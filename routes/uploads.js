const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualzarImg, mostrarImagen, actualzarImgCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', [validarArchivoSubir], cargarArchivo);

router.put('/:collection/:id', [
    validarArchivoSubir,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('collection').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualzarImgCloudinary);
//], actualzarImg);


router.get('/:collection/:id', [
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('collection').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen );

module.exports = router;