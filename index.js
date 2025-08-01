require('dotenv').config();

const express = require('express')
const cors = require('cors')
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

// app.use(process.env.BASE_URI+'/access',)

app.use(process.env.BASE_URI+'/producto',ruta.producto)////CORREGIR

app.use(process.env.BASE_URI+'/cliente',ruta.cliente)///CASI CORRIGIDO

app.use(process.env.BASE_URI+'/tcambio',ruta.tipo_cambio)////CORREGIR

app.use(process.env.BASE_URI+'/promo',ruta.promos)///CORREGIR

app.use(process.env.BASE_URI+'/cotizacion',ruta.cotizacion)///CORREGIR

// app.all('*',(req,res)=>{
//     res.status(400).send("404 recurso no encontrado");
// })
// app.use(process.env.BASE_URI+'/marca',)////dentro de producto

app.listen(port,()=>console.log("servicio levantado"))