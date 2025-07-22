require('dotenv').config();

const express = require('express');
const router = express.Router();

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bcli_codi} = require('../querys/cliente/c_buscar_cliente');
let {bcli_ruc} = require('../querys/cliente/c_buscar_ruc');
let {bcli_dni} = require('../querys/cliente/c_buscar_dni');
let {bcli_personal} = require('../querys/cliente/c_atencion');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {ruc_largo} = require('../middleware/ruc_diferenciador');
const {ruc_diferenciador,dni_diferenciador} = require('../middleware/ruc_clasificador');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS VACIOS PARA PARAMETROS Y QUERY
const {middleware_objevacio_param} = require('../middleware/params_vacios');
const {middleware_objevacio_qs} = require('../middleware/qs_vacios');
const objgeneralesllenos=[middleware_objevacio_param,middleware_objevacio_qs];
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {objeto_verificador_mejorado_permitidos} = require('../middleware/params_validos');
const {objeto_verificador_mejorado_permitidos_qs,objeto_verificador_cliente_personal} = require('../middleware/qs_validos');//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA QS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const objkeyvalidos=[objeto_verificador_mejorado_permitidos,objeto_verificador_mejorado_permitidos_qs];
////////////////////////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));
/////////falata validar que efectivamente tiene el parametro solicitado
router.get('/atender',objgeneralesllenos[1],objeto_verificador_cliente_personal,bcli_personal)
router.get('/atender',(req,res)=>{res.status(400).send("parametro incorrecto")})
///piensa en una manera de pedir el vendedor por varias entradas y con diferentes condiciones
router.get('/:id',objgeneralesllenos[0],objkeyvalidos[0],bcli_codi)
router.get('/:id',(req,res,next)=>{res.status(400).send("parametro invalido")})
/////TENGO Q MANEJAR LOS 3 TIPOS DE CLIENTES QUE EMPIESAN POR 20,10,DNI
router.get('/ruc/:id',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo,ruc_diferenciador,bcli_ruc)//PARA RUC
router.get('/ruc/:id',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo,dni_diferenciador,bcli_dni)//PARA DNI
router.get('/ruc/:id',objgeneralesllenos[0],objkeyvalidos[0],ruc_largo,(req,res)=>{res.status(200).send("fallo algo?")})//PARA DELEGAR
router.get('/ruc/:id',(req,res,next)=>{res.status(400).send("parametro invalido")})
//////////VER LA CONDICIONAL DEL PRODUCTO SUMADO A ESTA RUTA
// router.get('/hp/:tinta',prdcodi)

// router.get('/atender',(req,res)=>{res.status(400).send("error en su personal")})

// router.get('/dsct',prdcodi)

// router.get('/:sugerido',prdcodi)

module.exports=router