require('dotenv').config();

const express = require('express');
const router = express.Router();

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
// let {coti_crear,cotizacion_crear_llamar} = require('../querys/cotizacion/coti_crear');
let {llamar_crear,cotizacion_crear_llamar} = require('../querys/cotizacion/coti_crear');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {validar_cabesera} = require('../middleware/coti_validar_cabesa');
const {validar_body} = require('../middleware/coti_validar_body');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS VACIOS PARA PARAMETROS Y QUERY
const {middleware_objevacio_param} = require('../middleware/params_vacios');
const {middleware_objevacio_qs} = require('../middleware/qs_vacios');
// const objgeneralesllenos=[middleware_objevacio_param,middleware_objevacio_qs];
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {objeto_verificador_mejorado_permitidos} = require('../middleware/params_validos');
const {objeto_verificador_mejorado_permitidos_qs} = require('../middleware/qs_validos');//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA QS QUE TIENEN TIENE LOS INPUTS CORRECTOS
// const objkeyvalidos=[objeto_verificador_mejorado_permitidos,objeto_verificador_mejorado_permitidos_qs];
////////////////////////////////////////////////////

router.use(express.json());
router.use(express.urlencoded({extended:true}));

/////TENGO Q MANEJAR LOS 3 TIPOS DE CLIENTES QUE EMPIESAN POR 20,10,DNI
// router.get('/crear',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo,ruc_diferenciador,bcli_ruc)//PARA RUC
// router.post('/crear',coti_crear)
// MANEJAR MULTIPLES PETICIONES A LA MISMA RUTA NUEVO METODO

// router.post('/crear',validar_cabesera,validar_body,cotizacion_crear_llamar)////RUTA VERSION 1

router.post('/crear',llamar_crear)

// router.post('/crear',(req,res,next)=>{
//     console.log(req.body.coti);
//     console.log(req.body.coti.productos);
//     res.status(200).json(req.body)
// })

// router.post('/crear',(req,res,next)=>{res.status(400).send("fallo algo en los parametros del cuerpo")})


module.exports=router