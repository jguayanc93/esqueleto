require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

const {cliente_ruc} = require('../../id_nombres/lista')
const asignador_identificadores = require('../../funciones/asignador_indice_nombre')
// let observador = (req,res,next) => objevacio(req.signedCookies) ? res.status(401).send("logeate") : next();

async function bcli_dni(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const segunda_llamada= await obtenerpromesa_consulta1(primera_llamada,req,next);
        const tercera_llamada= asignador_identificadores(segunda_llamada[0],cliente_ruc,1);
        res.status(200).json(tercera_llamada);
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            "status":"ERROR",
            "codigo":2,
            "msg":err
        })
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtenerpromesa_consulta1(conexion,req,next){
    return new Promise((resolve,reject)=>query_cliente_dni(resolve,reject,conexion,req,next))
}


let query_cliente_dni = (resolve,reject,conexion,req,next)=>{
    let id=req.params.id;
    let dni="DNI"+id;
    // let sp_sql="select codcli,ruccli,nomcli,codcdv,tipocl from mst01cli where estado=1 AND codcli=@codcli";
    let sp_sql="select codcli,ruccli,nomcli from mst01cli where estado=1 AND ruccli=@dni";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            // res.status(500).send("error interno");
            reject("error request");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                // res.status(400).send("no registrado");
                reject("no registrado");
            }
            else{
                let respuesta=[];
                // let respuesta2={};
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
                // Object.assign(respuesta2,respuesta);
                // res.status(200).json(respuesta2);
                resolve(respuesta);
            }
        }
    })
    consulta.addParameter('dni',TYPES.VarChar,dni);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_dni}