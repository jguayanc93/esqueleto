require('dotenv').config();

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// const bd = require('./conexion/cadena')
// const corsconfig=require('./cors/conf')
const corhabilitaciones=require('./cors/conf')

const app = express();
const port = process.env.PORT || 3002;

const ruta = require('./rutas/rutas')

//app.set('trust proxy','127.0.0.1');/////PROXY PASAR DE CABESERA

///////CREAR LA LISTA BLANCA Y EL OBJETO DE CONFIGURACION
// const corhabilitaciones={
//     origin:"http://127.0.0.1",
//     methods:['GET','POST'],
//     credentials:true
// }

app.use(cors(corhabilitaciones))

// app.use([express.json(),cookieParser(process.env.SECRET_PASS)])
app.use(express.json())
// app.use(express.urlencoded({extended:true}))

function metodohttpPermitido(req,res,next){
    if(req.method!=='GET'){
        res.status(501).send("metodo denegado");
    }
    console.log(req.method);
    next();
}

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
const revisionPeticion=[metodohttpPermitido,peticionUrl];

// app.use(process.env.BASE_URI+'/access',)

// app.use(process.env.BASE_URI+'/vendedor',)

app.use(process.env.BASE_URI+'/producto',ruta.producto)

app.use(process.env.BASE_URI+'/cliente',ruta.cliente)

app.use(process.env.BASE_URI+'/tcambio',ruta.tipo_cambio)

app.use(process.env.BASE_URI+'/promo',ruta.promos)

app.use(process.env.BASE_URI+'/cotizacion',ruta.cotizacion)

// app.all('*',(req,res)=>{
//     res.status(400).send("404 recurso no encontrado");
// })
// app.use(process.env.BASE_URI+'/marca',)////dentro de producto

app.listen(port,()=>console.log("servicio levantado"))