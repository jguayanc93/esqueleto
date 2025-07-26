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
        const segunda_llamada=await obtenerpromesa_consulta1(primera_llamada,req,next);
        //////separacion de logica para la formacion de la respuesta
        const tercera_llamada=asignador_identificadores(segunda_llamada[0],cliente_ruc,1);
        res.status(200).json(tercera_llamada);
    }
    catch(err){
        // el error debe ser manejado de otra manera
        console.log("deberia ser disparado en el reject");
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
    return new Promise((resolve,reject)=>query_cliente_ruc(resolve,reject,conexion,req,next))
}

let query_cliente_ruc = (resolve,reject,conexion,req,next)=>{
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
                // res.status(400).send("no registrado");
                reject("no registrado");
            }
            else{
                let respuesta=[];
                // let respuesta2={};////YA NO SERVIRIA PORQUE TIENE OTRA ESTRUCTURA
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
                ////esta funcion debe separarse porque no tiene nada que ver dentro de del request
                // let respuesta3=asignador_identificadores(respuesta[0],cliente_ruc,1);
                // Object.assign(respuesta2,respuesta);////YA NO SERVIRIA PORQUE TIENE OTRA ESTRUCTURA
                // console.log(respuesta);///solo es para tratar la data
                // console.log(respuesta2)///ya no sirve
                // console.log(respuesta3);
                // res.status(200).json(respuesta3);
                resolve(respuesta);
            }
        }
    })
    consulta.addParameter('ruc',TYPES.VarChar,ruc);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_ruc}