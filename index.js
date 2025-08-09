require('dotenv').config();

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const corhabilitaciones=require('./cors/conf')

const app = express();
const port = process.env.PORT || 3002;

const ruta = require('./rutas/rutas')

//app.set('trust proxy','127.0.0.1');/////PROXY PASAR DE CABESERA

///////CREAR LA LISTA BLANCA Y EL OBJETO DE CONFIGURACION
app.use(cors(corhabilitaciones))

// app.use([express.json(),cookieParser(process.env.SECRET_PASS)])
app.use(express.json())
// app.use(express.urlencoded({extended:true}))

function peticionUrl(req,res,next){
    /////URL ORIGINAL AL CUAL SE HACE EL LLAMADO EL PATH COMPLETO
    console.log("url completa",req.originalUrl)
    /////URL AL CUAL SE HACE EL LLAMADO PERO SIN LOS PARAMETROS COMO(PARAM O QUERY)
    console.log("url",req.baseUrl)
    /////URL DEL ULTIMO PUNTO DE MONTAJE
    console.log("url",req.path)
    next();
}

//////funciones de verificacion generales
const revisionPeticion=[peticionUrl];

app.get(process.env.BASE_URI+'/access',(req,res)=>{
    console.log(req.body)
    if(!req.body.user || !req.body.pass){
        return res.status(401).json({
            "msg":"invalid data"
        })
    }
    
    let carga={
        "usuario":req.body.user,
        "cliente":"C00904"
    }
    let token= jwt.sign(carga,process.env.PALABRA_CLAVE,{expiresIn:35})
    res.status(200).json({
        "usuario":"prueba",
        "token":token
    })
})

// app.use(process.env.BASE_URI+'/producto',ruta.producto)////CORREGIR
app.use('/v1/producto',ruta.producto)////CORREGIR

// app.use(process.env.BASE_URI+'/cliente',ruta.cliente)///TERMINADO
app.use('/v1/cliente',ruta.cliente)///TERMINADO

// app.use(process.env.BASE_URI+'/tcambio',ruta.tipo_cambio)////TERMINADO
app.use('/v1/tcambio',ruta.tipo_cambio)////TERMINADO

// app.use(process.env.BASE_URI+'/promocion',ruta.promos)///TERMINADO
app.use('/v1/promocion',ruta.promos)///TERMINADO

// app.use(process.env.BASE_URI+'/cotizacion',ruta.cotizacion)///CASI TERMINADO
app.use('/v1/cotizacion',ruta.cotizacion)///CASI TERMINADO

// app.use(process.env.BASE_URI+'/marca',)////dentro de producto

app.listen(port,()=>console.log("servicio levantado"))