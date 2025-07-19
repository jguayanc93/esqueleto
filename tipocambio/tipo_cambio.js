require('dotenv').config();

const express = require('express');
const router = express.Router();

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {fecha_cambio} = require('../querys/cambio/fecha_tcambio');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS

//////ESPACIO PARA MIDDLEWARE DE OBJETOS VACIOS PARA PARAMETROS Y QUERY
const {middleware_objevacio_param} = require('../middleware/params_vacios');
const {middleware_objevacio_qs} = require('../middleware/qs_vacios');
const objgeneralesllenos=[middleware_objevacio_param,middleware_objevacio_qs];
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {objeto_verificador_mejorado_permitidos} = require('../middleware/params_validos');
const {objeto_verificador_mejorado_permitidos_qs} = require('../middleware/qs_validos');//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA QS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const objkeyvalidos=[objeto_verificador_mejorado_permitidos,objeto_verificador_mejorado_permitidos_qs];
////////////////////////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));

// router.get('/',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo)
router.get('/',fecha_cambio)
// router.get('/',(req,res,next)=>{res.status(400).send("parametro invalido")})


module.exports=router