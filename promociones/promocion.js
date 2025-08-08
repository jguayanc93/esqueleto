require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
let {prom_search} = require('../querys/promociones/prom_buscador');
// let {} = require('../querys')
//////ESPACIO PARA MIDDLEWARE DE OBJETOS VACIOS PARA PARAMETROS Y QUERY
const {middleware_objevacio_param} = require('../middleware/params_vacios');
const {middleware_objevacio_qs} = require('../middleware/qs_vacios');
//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA PARAMETROS QUE TIENEN TIENE LOS INPUTS CORRECTOS
const {objeto_verificador_mejorado_permitidos} = require('../middleware/params_validos');
const {objeto_verificador_mejorado_permitidos_qs} = require('../middleware/qs_validos');//////ESPACIO PARA MIDDLEWARE DE OBJETOS PARA QS QUE TIENEN TIENE LOS INPUTS CORRECTOS
////////////////////////////////////////////////////
const objgeneralesllenos=[middleware_objevacio_param,middleware_objevacio_qs];
const objkeyvalidos=[objeto_verificador_mejorado_permitidos,objeto_verificador_mejorado_permitidos_qs];

router.use(express.json(),express.urlencoded({extended:true}));

router.get('/',(req,res,next)=>{res.status(200).send("ruta promocion")})

// router.get('/producto',(req,res,next)=>{
//     res.status(200).json({"msg":"verificar que promo es llamado segun producto"})
// })

router.get('/token',(req,res)=>{
    let authorization= req.headers.authorization;
    if(!authorization || !authorization.startsWith('Bearer ')){
        return res.status(401).json({"msg":"Unauthorized: Missing or invalid token"})
    }

    const token=authorization.split(' ')[1];
    try{
        const decoded = jwt.verify(token,process.env.PALABRA_CLAVE)
        res.status(200).send("token valido");
    }
    catch(err){
        return res.status(401).json({"msg":"Unauthorized: invalid token"})
    }
})

router.get('/:codi',prom_search)


module.exports=router