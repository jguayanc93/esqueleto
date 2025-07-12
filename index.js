require('dotenv').config();

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const bd = require('./conexion/cadena')

const app = express();
const port = process.env.PORT || 3002;

const ruta = require('./rutas/rutas')

//app.set('trust proxy','127.0.0.1');/////PROXY PASAR DE CABESERA

///////CREAR LA LISTA BLANCA Y EL OBJETO DE CONFIGURACION
const corhabilitaciones={
    origin:"http://127.0.0.1",
    methods:['GET','POST'],
    credentials:true
}
// app.use(cors())

app.use(cors(corhabilitaciones))

// app.use([express.json(),cookieParser(process.env.SECRET_PASS)])
app.use(express.json())

// app.use(express.static('checkpoint'));

// app.use(process.env.BASE_URI,(req,res)=>{ res.status(200).json({"msg":"start checkpoint"}) })

// app.use(process.env.BASE_URI+'/access',)

// app.use(process.env.BASE_URI+'/vendedor',)

app.use(process.env.BASE_URI+'/producto',ruta.producto)

app.use(process.env.BASE_URI+'/cliente',ruta.cliente)

// app.use(process.env.BASE_URI+'/marca',)////dentro de producto

// app.use(process.env.BASE_URI+'/dsct',)////dentro de producto

// app.use(process.env.BASE_URI+'/tcm',)////dentro de producto

// app.use(process.env.BASE_URI+'/stoc',)////dentro de producto

// app.use(process.env.BASE_URI+'/hp',)////dentro de producto

app.listen(port,()=>console.log("servicio levantado"))