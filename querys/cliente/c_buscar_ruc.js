require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
////temporal para los nombres
const {cliente_ruc} = require('../../id_nombres/lista')
const asignador_identificadores = require('../../funciones/asignador_indice_nombre')
// let observador = (req,res,next) => objevacio(req.signedCookies) ? res.status(401).send("logeate") : next();

async function bcli_ruc(req,res,next) {
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        const segunda_llamada=await obtenerpromesa_consulta1(primera_llamada,req,res,next);
    }
    catch(err){
        console.log(err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtenerpromesa_consulta1(conexion,req,res,next){
    return new Promise((resolve,reject)=>query_cliente_ruc(resolve,reject,conexion,req,res,next))
}

let query_cliente_ruc = (resolve,reject,conexion,req,res,next)=>{
    let ruc=req.params.id;
    let sp_sql="select codcli,ruccli,nomcli from mst01cli where estado=1 AND ruccli=@ruc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            // res.status(500).send("error interno");
            reject("error request");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                res.status(400).send("no registrado");
            }
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                ////podria transformarlo en una funcion para reutilisarlo para cada consulta
                let respuesta3=asignador_identificadores(respuesta[0],cliente_ruc,1);
                Object.assign(respuesta2,respuesta);
                console.log(respuesta);
                console.log(respuesta2)
                console.log(respuesta3);
                res.status(200).json(respuesta3);
            }
        }
    })
    consulta.addParameter('ruc',TYPES.VarChar,ruc);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_ruc}