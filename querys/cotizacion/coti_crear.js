require('dotenv').config();
// const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
// const {coti_objheader_structure} = require('../../funciones/coti_header_addparam_obj')
const {coti_objbody_structure} = require('../../funciones/coti_detallado_addparam_obj')
const {query_numero_documento} = require('../../querys/cotizacion/coti_correlativo')
const {query_update_correlativo} = require('../../querys/cotizacion/coti_update_cor')
const {query_costos} = require('../../querys/cotizacion/coti_costos_correctos')
const {query_llamada} = require('../../querys/cotizacion/coti_generar_cabecera')
const {recorrer_detallado} = require('../../querys/cotizacion/coti_generar_detallado')
//////////////////////
const {productos_bucle} = require('../../querys/cotizacion/coti_detallado_info_v2')
const {query_calculo_totalisados} = require('../../querys/cotizacion/coti_totalisados_v2')
const {query_calculo_cabecera} = require('../../querys/cotizacion/coti_cabecera_totalisado_v2')

////////////////VALIDAR LOS VALORES ENTREGADOS
/* podria usar estos valores ya estan definidos y son todos los necesarios */
const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ","mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura","cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];
const cuerpo_keys=["fecha","cdocu","ndocu","codcli","tcam","mone","moneitm","aigv","item","codi","codf","marc","umed","descr","cant","preu","tota","dsct","totn","AnulaDetalle","codalm","cost","msto"];
// tengo que ver la manera de pasar los parametros para el query en un objeto dinamico
async function llamar_crear(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const paso2= await consulta1(req,primera_llamada);
        const paso3= await consulta2(req);
        const segunda_llamada= await obtenerpromesa_conexion();
        const paso4= await consulta3(req,segunda_llamada);
        res.status(200).json(paso4);
    }
    catch(err){
        console.log(err)
        res.status(400).send(err);
    }
}

async function cotizacion_crear_llamar(req,res,next){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        const segunda_llamada=await obtenerpromesa_consulta1(primera_llamada);//ndocu
        const tercera_llamada=await obtenerpromesa_conexion();
        const cuarta_llamada=await obtenerpromesa_consulta2(tercera_llamada,segunda_llamada);//update correlativo
        const doceava_llamada=await obtenerpromesa_conexion();
        const treceava_llamada=await obtenerpromesa_consulta7(doceava_llamada);///sacar fecha
        const novena_llamada=await obtenerpromesa_conexion();
        const decima_llamada=await obtenerpromesa_consulta5(req,novena_llamada,segunda_llamada,treceava_llamada);//costos
        //actualisando costos de paso actualiso la fecha correcta y tengo el detallado completo
        const onceava_llamada=await obtenerpromesa_consulta6(req,decima_llamada,segunda_llamada,treceava_llamada);
        const quinta_llamada=await obtenerpromesa_conexion();
        const sexta_llamada=await obtenerpromesa_consulta3(req,res,quinta_llamada,segunda_llamada,treceava_llamada);//coti cabecera
        const setima_llamada=await obtenerpromesa_conexion();
        const octava_llamada=await obtenerpromesa_consulta4(req,res,setima_llamada,onceava_llamada);//coti detalle
        //////faltaria solo retornar el numero generado y listo
        // res.status(200).send(segunda_llamada);
        res.status(200).json({
            "msg":"creado con exito",
            "doc":segunda_llamada
        });
    }
    catch(err){
        console.log(err);
        res.status(400).send("parametros invalido");
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }
///// nuevos metodos
function consulta1(req,conexion){ return new Promise((resolve,reject)=>productos_bucle(resolve,reject,req,conexion)) }

function consulta2(req){ return new Promise((resolve,reject)=>query_calculo_totalisados(resolve,reject,req)) }

function consulta3(req,conexion){ return new Promise((resolve,reject)=>(resolve,reject,req,conexion)) }

function consulta4(req){ return new Promise((resolve,reject)=>query_calculo_cabecera(resolve,reject,req))}

function obtenerpromesa_consulta1(conexion){
    return new Promise((resolve,reject)=>query_numero_documento(resolve,reject,conexion))
}

function obtenerpromesa_consulta2(conexion,correlativo){
    return new Promise((resolve,reject)=>query_update_correlativo(resolve,reject,conexion,correlativo))
}

function obtenerpromesa_consulta3(req,res,conexion,ndocu,fecha){
    return new Promise((resolve,reject)=>query_llamada(resolve,reject,req,res,conexion,ndocu,fecha))
}

function obtenerpromesa_consulta4(req,res,conexion,corregido){
    return new Promise((resolve,reject)=>recorrer_detallado(resolve,reject,req,res,conexion,corregido))
}

function obtenerpromesa_consulta5(req,conexion,correlativo,fecha){
    return new Promise((resolve,reject)=>query_costos(resolve,reject,req,conexion,correlativo,fecha))
}

function obtenerpromesa_consulta6(req,costos,correlativo,fecha){
    return new Promise((resolve,reject)=>corregir_costos(resolve,reject,req,costos,correlativo,fecha))
}

function obtenerpromesa_consulta7(conexion){
    return new Promise((resolve,reject)=>buscar_fecha(resolve,reject,conexion))
}
// para la consulta de contactos
// select * from Dtl01Con where Codn='C08953'
function buscar_fecha(resolve,reject,conexion){
    let sp_sql="select CONVERT(date, GETDATE(),111)";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error en el request");
        }
        else{
            conexion.close();
            if(rows.length==0){
                reject("fecha no encontrada");
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
                resolve(respuesta2[0]);
            }
        }
    })
    conexion.execSql(consulta);
}

function corregir_costos(resolve,reject,req,costos,correlativo,fecha){
    let valores_parseados=coti_objbody_structure(req.body["detallado"],correlativo,fecha);
    
    for(const item in valores_parseados){
        for(const parametro of Object.keys(valores_parseados[item])){
            if(parametro==='codi'){
                for(const item in costos){
                    if(Object.values(costos[item])[0]===valores_parseados[item][parametro][1]){
                        if(valores_parseados[item]["cost"]!==undefined){ valores_parseados[item]["cost"][1]=costos[item][1]; }
                    }
                }
            }
        }
    }
    // console.log("deberia estar corregido",valores_parseados);
    resolve(valores_parseados)
}




module.exports={llamar_crear,cotizacion_crear_llamar}