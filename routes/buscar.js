const { Router } = require('express');
const { check } = require('express-validator');
const { busqueda } = require('../controllers/buscar');
const { validarCampos } = require('../middlewares');

const router = Router();

router.get('/:coleccion/:termino',[
    
], busqueda);

module.exports = router;