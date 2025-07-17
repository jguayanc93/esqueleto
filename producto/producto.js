require('dotenv').config();

const express = require('express');
const router = express.Router();
// const jws=require('jws')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bprd_codi} = require('../querys/producto/p_buscar_codi');
let {bprd_fam} = require('../querys/producto/p_buscar_familia');
let {bprd_subfam} = require('../querys/producto/p_buscar_subfamilia');

let {bprd_list} = require('../querys/producto/p_listado_sbfam');
let {bprd_id} = require('../querys/producto/p_precio');
let {bprd_dscto} = require('../querys/producto/p_descuentos');
let {bprd_hp} = require('../querys/producto/p_hp_habilitados');
/////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));

///piensa en una manera de pedir el producto por varias entradas y con diferentes condiciones
router.get('/',(req,res)=>{ res.status(200).send("ruta productos"); })

router.get('/categorias',bprd_fam)////producto rango de familia
router.get('/categorias/:catID',bprd_fam)////producto rango de familia con o sin identificador
router.get('/categorias/:catID/subcategoria',bprd_subfam)////producto rango de subfamilia en fam identificadda
router.get('/categorias/:catID/subcategoria/:sbfamID',bprd_subfam)////producto rango de subfamilia en fam identificadda

router.get('/listado',bprd_list) ////COMENSAR CON LA BUSQUEDA DEL PRODUCTOS CON QUERY STRINGS (fam/sbfam/stoc)
// router.get('/listado/:grupo',) ////identificador del codi

router.get('/codi/:id',bprd_id) ////identificador del codi
// router.get('/codi/:id/descuento/:marca',bprd_dscto) ////aca sacaremos el descuento por solicitud
router.get('/codi/:id/descuento',bprd_dscto) ////aca sacaremos el descuento por solicitud con qs

router.get('/marca/:id',bprd_dscto) ////podria ser una busqueda relacionada a la marca?

// FALTA LOS DE HP SI ES VALIDO EL CLIENTE LA CONSULTA
router.get('/hp/:id',bprd_hp) ////diferenciar el tipo de producto(suministro,ploter) y luego ver si esta habilitado el cliente


module.exports=router