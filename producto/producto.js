require('dotenv').config();

const express = require('express');
const router = express.Router();
// const jws=require('jws')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bprd_fam} = require('../querys/producto/p_buscar_familia');
let {bprd_subfam} = require('../querys/producto/p_buscar_subfamilia');
let {bprd_sugerencia} = require('../querys/producto/p_sugerencias');
let {bprd_partnumber} = require('../querys/producto/p_partnumber');
let {bprd_list} = require('../querys/producto/p_listado_sbfam');
let {bprd_id} = require('../querys/producto/p_precio');
let {bprd_dscto} = require('../querys/producto/p_descuentos');
let {bprd_hp_cliente} = require('../querys/producto/p_hp_producto');
let {bprd_hp} = require('../querys/producto/p_hp_habilitados');
/////////////////////////////////
//////ESPACIO PARA MIDDLEWARE DE OBJETOS VACIOS PARA PARAMETROS Y QUERY
const {objevacio,objepropiedades} = require('../funciones/objvacio');
// const {objeto_verificador_mejorado,objeto_verificador_mejorado_permitidos} = require('../funciones/param_verificador');
const {middleware_objevacio_param} = require('../middleware/params_vacios');
const {middleware_objevacio_qs} = require('../middleware/qs_vacios');
const objgeneralesllenos=[middleware_objevacio_param,middleware_objevacio_qs];
//////////////////////
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {objeto_verificador_mejorado_permitidos} = require('../middleware/params_validos');
const {objeto_verificador_mejorado_permitidos_qs,objeto_verificador_busqueda_productos,objeto_verificador_busqueda_partnumber} = require('../middleware/qs_validos');//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA QS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const objkeyvalidos=[objeto_verificador_mejorado_permitidos,objeto_verificador_mejorado_permitidos_qs];
////////////////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));

///piensa en una manera de pedir el producto por varias entradas y con diferentes condiciones
router.get('/',(req,res)=>{ res.status(200).send("ruta productos"); })

router.get('/categorias',bprd_fam)////producto rango de familia
// router.get('/categorias/:catID',bprd_fam)////POSIBLE REDUNDANCIA
router.get('/categorias/:catID/subcategoria',bprd_subfam)////producto rango de subfamilia en fam identificadda
// router.get('/categorias/:catID/subcategoria/:sbfamID',bprd_subfam)////POSIBLE REDUNDANCIA

router.get('/listado',bprd_list) ////COMENSAR CON LA BUSQUEDA DEL PRODUCTOS CON QUERY STRINGS (fam/sbfam/stoc)
// router.get('/listado/:grupo',) ////identificador del codi

router.get('/codi/:id',bprd_id) ////identificador del codi//EL CLIENTE PODRIA SACARSE DEL TOKEN
/////////////////////////
// router.get('/codi/:id/descuento/:marca',bprd_dscto) ////aca sacaremos el descuento por solicitud
router.get('/codi/:id/descuento',bprd_dscto) ////aca sacaremos el descuento por solicitud con qs

// FALTA LOS DE HP SI ES VALIDO EL CLIENTE LA CONSULTA
////diferenciar el tipo de producto(suministro,ploter) y luego ver si esta habilitado el cliente
// NUEVO METODO DE CAMINOS CON MIDDLEWARE
////VALIDAR LOS PARAMETROS INSERTADOS QUE SEAN CORRECTOS
router.get('/hp/:id',objgeneralesllenos,objkeyvalidos,bprd_hp) ////diferenciar el tipo de producto(suministro,ploter) y luego ver si esta habilitado el cliente
router.get('/hp/:id',objgeneralesllenos[0],objkeyvalidos[0],bprd_hp_cliente)
router.get('/hp/:id',(req,res,next)=>{ res.status(400).send("parametros invalido"); })

router.get('/sugerencia',objeto_verificador_busqueda_productos,bprd_sugerencia) ////podria ser una busqueda relacionada a la descripcion
router.get('/sugerencia',objeto_verificador_busqueda_partnumber,bprd_partnumber) ////podria ser una busqueda relacionada al partnumber
router.get('/sugerencia',(req,res,next)=>{ res.status(400).send("parametros invalido"); })


module.exports=router