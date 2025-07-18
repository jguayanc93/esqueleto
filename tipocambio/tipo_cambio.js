require('dotenv').config();

const express = require('express');
const router = express.Router();

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bcli_ruc} = require('../querys/cliente/c_buscar_ruc');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {ruc_largo} = require('../middleware/ruc_diferenciador');
const {ruc_diferenciador,dni_diferenciador} = require('../middleware/ruc_clasificador');
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

/////TENGO Q MANEJAR LOS 3 TIPOS DE CLIENTES QUE EMPIESAN POR 20,10,DNI
router.get('/:id',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo,ruc_diferenciador,bcli_ruc)
router.get('/:id',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo,dni_diferenciador,)
router.get('/:id',(req,res,next)=>{res.status(400).send("parametro invalido")})


module.exports=router