require('dotenv').config();

const express = require('express');
const router = express.Router();
// const jws=require('jws')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {bprd_ruc} = require('../querys/producto/p_buscar_codi');

router.use(express.json(),express.urlencoded({extended:true}));

///piensa en una manera de pedir el producto por varias entradas y con diferentes condiciones
router.get('/',(req,res)=>{
    res.status(200).send("solo ruta limpia");
})
router.get('/:id',bprd_ruc)

// router.get('/partnum',bprd_ruc)

// router.get('/:descr',prdcodi)

// router.get('/:partnmb',prdcodi)

// router.get('/:stock',prdcodi)

// router.get('/:id/desc',prdcodi)

// router.get('/id:/marca',prdcodi)


module.exports=router