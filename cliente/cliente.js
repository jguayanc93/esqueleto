require('dotenv').config();

const express = require('express');
const router = express.Router();
const jws=require('jws')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bcli_ruc} = require('../querys/cliente/c_buscar_cliente');

let {} = require('../querys/producto');
//////////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));

///piensa en una manera de pedir el vendedor por varias entradas y con diferentes condiciones
router.get('/:id',bcli_ruc)

router.get('/hp',prdcodi)

// router.get('/:cuota',prdcodi)

// router.get('/:sugerido',prdcodi)

module.exports=router