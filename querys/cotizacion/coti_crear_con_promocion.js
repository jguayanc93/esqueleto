require('dotenv').config();
// const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
// const {coti_objheader_structure} = require('../../funciones/coti_header_addparam_obj')
const {coti_objbody_structure} = require('../../funciones/coti_detallado_addparam_obj')
const {query_numero_documento} = require('../../querys/cotizacion/coti_correlativo')
const {query_update_correlativo} = require('../../querys/cotizacion/coti_update_cor')
const {query_costos} = require('../../querys/cotizacion/coti_costos_correctos')
const {query_llamada,query_llamada2} = require('../../querys/cotizacion/coti_generar_cabecera')
const {recorrer_detallado} = require('../../querys/cotizacion/coti_generar_detallado')
//////////////////////
const {productos_bucle} = require('../../querys/cotizacion/coti_detallado_info_v2')
const {query_calculo_totalisados} = require('../../querys/cotizacion/coti_totalisados_v2')
const {query_calculo_cabecera} = require('../../querys/cotizacion/coti_cabecera_totalisado_v2')
const {cabecera_estructura} = require('../../querys/cotizacion/coti_header_info_v2')
const {query_info_cabecera} = require('../../querys/cotizacion/coti_header_info_v3')
const {promocion_bucle} = require('../../querys/cotizacion/coti_promocion_info_v2')
const {promocion_informacion_bucle} = require('../../querys/cotizacion/coti_saber_promocion_v2')
const {promocion_informacion_regalo} = require('../../querys/cotizacion/coti_info_bonificacion_v2')
const {promocion_eliminados} = require('../../querys/cotizacion/coti_promos_rechazadas')
const {query_recalculo_totalisados} = require('../../querys/cotizacion/coti_recalculo_promocion')
const {recorrer_promdetallado} = require('../../querys/cotizacion/coti_generar_promdetallado')

/* podria usar estos valores ya estan definidos y son todos los necesarios */
// const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ","mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura","cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];
// const cuerpo_keys=["fecha","cdocu","ndocu","codcli","tcam","mone","moneitm","aigv","item","codi","codf","marc","umed","descr","cant","preu","tota","dsct","totn","AnulaDetalle","codalm","cost","msto"];

async function llamar_crear_promocion(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const paso2= await consulta1(req,primera_llamada);
        const paso3= await consulta2(req);
        const paso4= await consulta3(req);
        const paso5= await consulta4(req);
        const segunda_llamada= await obtenerpromesa_conexion();
        const paso6= await consulta5(req,segunda_llamada);
        const tercera_llamada= await obtenerpromesa_conexion();
        const paso7= await consulta6(req,tercera_llamada);///extraigo el ndocu
        const cuarta_llamada= await obtenerpromesa_conexion();
        const paso8= await consulta7(cuarta_llamada,paso7)///update el correlativo

        const quinta_llamada= await obtenerpromesa_conexion();
        const paso9= await consulta10(req,quinta_llamada)///buscar el formato de la promocion
        const sexta_llamada= await obtenerpromesa_conexion();
        const paso10= await consulta11(req,sexta_llamada)///buscar la comparacion de la promo
        const setima_llamada= await obtenerpromesa_conexion();
        const paso11=await consulta12(req,setima_llamada)////corregir las bonificaciones
        // console.log("revisar lo que esta enviando",paso11)
        const paso12= await consulta13(req)//////eliminar los que no llegaron a la cantidad
        const paso13= await consulta14(req)

        const octava_llamada= await obtenerpromesa_conexion();///cabecera SUPUESTO CORRECTO
        const paso14= await consulta8(req,octava_llamada);
        const novena_llamada= await obtenerpromesa_conexion();////detallado FALTA LA OTRA PARTE
        const paso15= await consulta9(req,novena_llamada);
        ////agregar las promos al detallado
        const decima_llamada= await obtenerpromesa_conexion();
        const paso16= await consulta15(req,decima_llamada);
        ////COMIENSO CON LA CREACION
        // res.status(200).json(paso16);
        res.status(200).json({
            "msg":`cotizacion creada con exito: ${paso7}`
        });
    }
    catch(err){
        console.log(err)
        res.status(400).send(err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }
///// nuevos metodos
function consulta1(req,conexion){ return new Promise((resolve,reject)=>{productos_bucle(resolve,reject,req,conexion)}) }

function consulta2(req){ return new Promise((resolve,reject)=>query_calculo_totalisados(resolve,reject,req)) }
///no le puse nombre ala funcion??
function consulta3(req,conexion){ return new Promise((resolve,reject)=>cabecera_estructura(resolve,reject,req,conexion)) }

function consulta4(req){ return new Promise((resolve,reject)=>query_calculo_cabecera(resolve,reject,req))}

function consulta5(req,conexion){ return new Promise((resolve,reject)=>query_info_cabecera(resolve,reject,req,conexion))}

function consulta6(req,conexion){ return new Promise((resolve,reject)=>query_numero_documento(resolve,reject,req,conexion))}

function consulta7(conexion,correlativo){ return new Promise((resolve,reject)=>query_update_correlativo(resolve,reject,conexion,correlativo))}

function consulta8(req,conexion){ return new Promise((resolve,reject)=>query_llamada2(resolve,reject,req,conexion))}

function consulta9(req,conexion){ return new Promise((resolve,reject)=>recorrer_detallado(resolve,reject,req,conexion))}

function consulta10(req,conexion){ return new Promise((resolve,reject)=>promocion_bucle(resolve,reject,req,conexion))}

function consulta11(req,conexion){ return new Promise((resolve,reject)=>promocion_informacion_bucle(resolve,reject,req,conexion))}

function consulta12(req,conexion){ return new Promise((resolve,reject)=>promocion_informacion_regalo(resolve,reject,req,conexion))}

function consulta13(req){ return new Promise((resolve,reject)=>promocion_eliminados(resolve,reject,req))}

function consulta14(req){ return new Promise((resolve,reject)=>query_recalculo_totalisados(resolve,reject,req))}

function consulta15(req,conexion){ return new Promise((resolve,reject)=>recorrer_promdetallado(resolve,reject,req,conexion))}

// function obtenerpromesa_consulta1(conexion){
//     return new Promise((resolve,reject)=>query_numero_documento(resolve,reject,conexion))
// }

// function obtenerpromesa_consulta2(conexion,correlativo){
//     return new Promise((resolve,reject)=>query_update_correlativo(resolve,reject,conexion,correlativo))
// }

// function obtenerpromesa_consulta3(req,res,conexion,ndocu,fecha){
//     return new Promise((resolve,reject)=>query_llamada(resolve,reject,req,res,conexion,ndocu,fecha))
// }

// function obtenerpromesa_consulta4(req,res,conexion,corregido){
//     return new Promise((resolve,reject)=>recorrer_detallado(resolve,reject,req,res,conexion,corregido))
// }

// function obtenerpromesa_consulta5(req,conexion,correlativo,fecha){
//     return new Promise((resolve,reject)=>query_costos(resolve,reject,req,conexion,correlativo,fecha))
// }

// function obtenerpromesa_consulta6(req,costos,correlativo,fecha){
//     return new Promise((resolve,reject)=>corregir_costos(resolve,reject,req,costos,correlativo,fecha))
// }

// function obtenerpromesa_consulta7(conexion){
//     return new Promise((resolve,reject)=>buscar_fecha(resolve,reject,conexion))
// }



module.exports={llamar_crear_promocion}