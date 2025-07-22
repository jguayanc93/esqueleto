require('dotenv').config();
// const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
// const {coti_objheader_structure} = require('../../funciones/coti_header_addparam_obj')
const {coti_objbody_structure} = require('../../funciones/coti_detallado_addparam_obj')
const {query_numero_documento} = require('../../querys/cotizacion/coti_correlativo')
const {query_llamada} = require('../../querys/cotizacion/coti_generar_cabecera')
const {recorrer_detallado} = require('../../querys/cotizacion/coti_generar_detallado')

////////////////VALIDAR LOS VALORES ENTREGADOS
/* podria usar estos valores ya estan definidos y son todos los necesarios */
const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ","mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura","cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];
const cuerpo_keys=["fecha","cdocu","ndocu","codcli","tcam","mone","moneitm","aigv","item","codi","codf","marc","umed","descr","cant","preu","tota","dsct","totn","AnulaDetalle","codalm","cost","msto"];
// tengo que ver la manera de pasar los parametros para el query en un objeto dinamico
async function cotizacion_crear_llamar(req,res,next){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        const segunda_llamada=await obtenerpromesa_consulta1(primera_llamada);
        const tercera_llamada=await obtenerpromesa_conexion();
        const cuarta_llamada=await obtenerpromesa_consulta2(tercera_llamada,segunda_llamada);
        // const quinta_llamada=await obtenerpromesa_conexion();
        // const sexta_llamada=await obtenerpromesa_consulta3(req,res,quinta_llamada,segunda_llamada);
        // const setima_llamada=await obtenerpromesa_conexion();
        // const octava_llamada=await obtenerpromesa_consulta4(req,res,setima_llamada,segunda_llamada);
        const novena_llamada=await obtenerpromesa_conexion();
        const decima_llamada=await obtenerpromesa_consulta5(req,res,novena_llamada,segunda_llamada);
        console.log(decima_llamada);
    }
    catch(err){
        console.log(err);
        res.status(400).send("parametros invalido");
    }
}

function obtenerpromesa_conexion(){
    return new Promise((resolve,reject)=>conn(resolve,reject))
}

function obtenerpromesa_consulta1(conexion){
    return new Promise((resolve,reject)=>query_numero_documento(resolve,reject,conexion))
}

function obtenerpromesa_consulta2(conexion,correlativo){
    return new Promise((resolve,reject)=>query_update_correlativo(resolve,reject,conexion,correlativo))
}

function obtenerpromesa_consulta3(req,res,conexion,ndocu){
    return new Promise((resolve,reject)=>query_llamada(resolve,reject,req,res,conexion,ndocu))
}

function obtenerpromesa_consulta4(req,res,conexion,ndocu){
    return new Promise((resolve,reject)=>recorrer_detallado(resolve,reject,req,res,conexion,ndocu))
}

function obtenerpromesa_consulta5(req,res,conexion,correlativo){
    return new Promise((resolve,reject)=>query_costos(resolve,reject,req,res,conexion,correlativo))
}
// para la consulta de contactos
// select * from Dtl01Con where Codn='C08953'
function query_update_correlativo(resolve,reject,conexion,correlativo){
    let sp_sql="update tbl01cor set nroini=@correlativo where cdocu='31'";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("update correlativo error");
        }
        else{
            conexion.close();
            resolve("correlativo actualisado con exito");
        }
    })
    consulta.addParameter('correlativo',TYPES.VarChar,correlativo);
    conexion.execSql(consulta);
}

function query_costos(resolve,reject,req,res,conexion,correlativo){
    // let formato_codis="('0506-015125','0506-015126')";
    // agrupacion de solo codis    
    let valores_parseados2=coti_objbody_structure(req.body["detallado"],correlativo);
    let codis=[];
    for(const indice in valores_parseados2){
        if(Object.keys(valores_parseados2[indice]).includes("codi")){
            codis.push(valores_parseados2[indice]["codi"][1]);
        }
    }
    ////conseguir este formato ('0506-015125','0506-015126')
    // console.log(valores_parseados2)
    // console.log("y estos son los resultados",codis)
    let contador=1;
    let formato_codis="(";
    for(const ide of codis){        
        formato_codis+="'"+ide+"'";
        if(codis.length>contador){
            formato_codis+=",";
        }
        contador++;
    }
    formato_codis+=")";



    let sql="select codi,pcus from prd0101 where codi in ";
    let sp_sql=sql+=formato_codis;
    console.log(sp_sql);
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            console.log(err)
            reject("update correlativo error");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                res.status(200).send("creado satisfactoriamente");
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
                Object.assign(respuesta2,respuesta);
                console.log(respuesta2);
                // res.status(200).json(respuesta2);
            resolve("formato de busuqeda correcto");
            }
        }
    })
    // consulta.addParameter('correlativo',TYPES.VarChar,correlativo);
    conexion.execSql(consulta);
}

// let bd_c_query = (res,ruc)=>{
//     let sp_sql="select GETDATE()";
//     // let sp_sql="GrabaMstCotFac";
//     let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
//         if(err){
//             /////validar la respuesta en de error de servidor
//             conexion.close();
//             res.status(500).send("error interno");
//         }
//         else{
//             conexion.close();
//             if(rows.length==0){
//                 /////validar la respuesta en caso de no encontrar nada
//                 res.status(200).send("creado satisfactoriamente");
//             }
//             else{
//                 let respuesta=[];
//                 let respuesta2={};
//                 let contador=0;
//                 rows.forEach(fila=>{
//                     let tmp={};
//                     fila.map(data=>{
//                         if(contador>=fila.length) contador=0;
//                         typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
//                         contador++;
//                     })
//                     respuesta.push(tmp);
//                 });
//                 Object.assign(respuesta2,respuesta);
//                 res.status(200).json(respuesta2);
//             }
//         }
//     })
//     // consulta.addParameter('prdid',TYPES.VarChar,ruc);
//     conexion.execSql(consulta);
//     // conexion.callProcedure(consulta);
// }
module.exports={cotizacion_crear_llamar}