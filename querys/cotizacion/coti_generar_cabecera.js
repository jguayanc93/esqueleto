
const {Connection,Request,TYPES} = require('../../conexion/cadena')
const {coti_objheader_structure,coti_objheader_addparametros} = require('../../funciones/coti_header_addparam_obj');

function query_llamada(resolve,reject,req,res,conexion,correlativo,fecha){
    
    let valores_parseados=coti_objheader_structure(req.body["cabecera"],correlativo,fecha);
    // let valores_parseados2=coti_objbody_structure(req.body["detallado"]);
    let sp_sql="GrabaMstCotFac";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            console.log(err);
            // res.status(500).send("error interno");///envia doble cabecera
            reject("sin exito de consulta en cabesera");
        }
        else{
            conexion.close();
            // res.status(200).send("creado con exito");
            resolve("exito la creacion de la cabesera");
        }
    })
    
    for(const input in valores_parseados){
        consulta.addParameter(input,valores_parseados[input][0],valores_parseados[input][1]);
    }
    conexion.callProcedure(consulta);
}

function query_llamada2(resolve,reject,req,conexion){
    // console.log("revisar estos parametros de la cabecera",req.cabecera);
    let valores_parseados=coti_objheader_addparametros(req.cabecera);
    let sp_sql="GrabaMstCotFac";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            console.log(err);
            // res.status(500).send("error interno");///envia doble cabecera
            reject("sin exito de consulta en cabesera");
        }
        else{
            conexion.close();
            resolve(req.cabecera);
        }
    })
    
    for(const input in valores_parseados){
        consulta.addParameter(input,valores_parseados[input][0],valores_parseados[input][1]);
    }
    conexion.callProcedure(consulta);
}

module.exports={query_llamada,query_llamada2}