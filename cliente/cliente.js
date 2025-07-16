require('dotenv').config();

const express = require('express');
const router = express.Router();
const jws=require('jws')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bcli_ruc} = require('../querys/cliente/c_buscar_cliente');

// let {} = require('../querys/cliente');
//////////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));

///piensa en una manera de pedir el vendedor por varias entradas y con diferentes condiciones
router.get('/:id',bcli_ruc)
//////////VER LA CONDICIONAL DEL PRODUCTO SUMADO A ESTA RUTA
// router.get('/hp/:tinta',prdcodi)

// router.get('/hp/:ploter',prdcodi)
////////REVISAR SI LA CATEGORIA DEBERIA IR JUNTO CON EL DESCUENTO O EN 2 RUTAS SEPARADAS
// router.get('/categoria',prdcodi)

// router.get('/dsct',prdcodi)

// router.get('/:sugerido',prdcodi)

module.exports=router