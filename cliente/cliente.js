require('dotenv').config();

const express = require('express');
const router = express.Router();

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bcli_ruc} = require('../querys/cliente/c_buscar_cliente');
let {} = require('../querys/cliente/c_buscar_ruc');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {} = require('../middleware/ruc_diferenciador');
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

///piensa en una manera de pedir el vendedor por varias entradas y con diferentes condiciones
router.get('/:id',objgeneralesllenos[0],objkeyvalidos[0],bcli_ruc)
router.get('/:id',(req,res,next)=>{res.status(400).send("parametro invalido")})
/////TENGO Q MANEJAR LOS 3 TIPOS DE CLIENTES QUE EMPIESAN POR 20,10,DNI
router.get('/ruc/:id',objgeneralesllenos[0],objkeyvalidos[0],)
router.get('/ruc/:id',(req,res,next)=>{res.status(400).send("parametro invalido")})
//////////VER LA CONDICIONAL DEL PRODUCTO SUMADO A ESTA RUTA
// router.get('/hp/:tinta',prdcodi)

////////REVISAR SI LA CATEGORIA DEBERIA IR JUNTO CON EL DESCUENTO O EN 2 RUTAS SEPARADAS
// router.get('/categoria',prdcodi)

// router.get('/dsct',prdcodi)

// router.get('/:sugerido',prdcodi)

module.exports=router