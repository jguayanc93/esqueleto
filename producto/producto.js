require('dotenv').config();

const express = require('express');
const router = express.Router();
// const jws=require('jws')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bprd_codi} = require('../querys/producto/p_buscar_codi');
let {bprd_fam} = require('../querys/producto/p_buscar_familia');
let {bprd_subfam} = require('../querys/producto/p_buscar_subfamilia');

let {bprd_list} = require('../querys/producto/p_listado_sbfam');
/////////////////////////////////

router.use(express.json(),express.urlencoded({extended:true}));

///piensa en una manera de pedir el producto por varias entradas y con diferentes condiciones
router.get('/',(req,res)=>{
    res.status(200).send("solo ruta limpia");
})
// router.get('/:id',bprd_codi)////producto identificado

router.get('/categorias',bprd_fam)////producto rango de familia
router.get('/categorias/:catID',bprd_fam)////producto rango de familia con o sin identificador
router.get('/categorias/:catID/subcategoria',bprd_subfam)////producto rango de subfamilia en fam identificadda
router.get('/categorias/:catID/subcategoria/:sbfamID',bprd_subfam)////producto rango de subfamilia en fam identificadda

// router.get('/:descr',prdcodi)

// router.get('/:partnmb',prdcodi)

// router.get('/:stock',prdcodi)

// router.get('/:id/desc',prdcodi) ////COMENSAR CON LA BUSQUEDA DEL PRODUCTO EN SI
router.get('/listado',bprd_list) ////COMENSAR CON LA BUSQUEDA DEL PRODUCTO EN SI

// router.get('/id:/marca',prdcodi)


module.exports=router