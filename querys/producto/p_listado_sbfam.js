require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

const {producto} = require('../../id_nombres/lista')
const asignador_identificadores = require('../../funciones/asignador_indice_nombre')

const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {parametros_todos_validador,query_validador} = require('../../funciones/param_verificador')

async function bprd_list(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const segunda_llamada= await obtenerpromesa_consulta1(req,primera_llamada);
        const tercera_llamada= asignador_identificadores(segunda_llamada,producto,2,"listado")
        res.status(200).json(tercera_llamada);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtenerpromesa_consulta1(req,conexion){
    return new Promise((resolve,reject)=>query_prd_listado(resolve,reject,req,conexion))
}

// let bprd_list = (req,res,next) => {
//     console.log("query",req.query);
    
//     /////////NUEVO METODO FUNCIONAL
//     if(!objevacio(req.query)){
//         let parametros=objepropiedades(req.query);////VALIDO HASTA AQUI
//         let validados=parametros_todos_validador(req.query,parametros);
//         /////////solo debolver los correctos y constatados
//         if(validados==="validos"){

//             let verificacion=query_validador(req.query,parametros)

//             if(Array.isArray(verificacion)){
//                 bd_conexion(res,...verificacion);
//             }
//             else{
//                 res.status(400).send("parametros invalido");
//             }
//         }
//         else{
//             res.status(400).send("parametros invalido");
//         }
//     }
//     /////////////revisar el listado completo aunqe no deberia arrojar nada
//     else{
//         res.status(400).send("parametros invalido");
//     }
// }

let query_prd_listado = (resolve,reject,req,conexion)=>{
    // console.log(stoc===true);
    console.log(req.query);
    let fam=req.query.fam;
    let sbfid=req.query.sbfam;
    let stoc=req.query.stoc;

    let grupo=fam+sbfid;
    // let sp_sql="select codi,codf,descr,marc,(CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))as'stoc',Usr_001,codmar,Usr_016 from prd0101 where estado=1 AND LEFT(codi,4)=@listgrp";
    // if(stoc){
    //     sp_sql+=" AND (CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))>@stok";
    // }
    // else{ sp_sql+=" AND (CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))<=@stok"; }

    let sp_sql="select a.codi,a.codf,a.descr,a.marc,(CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int)))as'stoc',a.Usr_001,a.codmar,a.Usr_016,(CASE WHEN ISNULL(b.codi,'LIBERADO')='LIBERADO' THEN 'LIBERADO' WHEN ISNULL(b.codi,'LIBRE')<>'LIBRE' THEN 'RESTRINGUIDO' END) from prd0101 a left join ListaHp3 b on (b.codi=a.codi) where a.estado=1 AND LEFT(a.codi,4)=@listgrp";
    if(stoc=='01'){
        sp_sql+=" AND (CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int)))>1";
    }
    else{ sp_sql+=" AND (CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int)))<=1"; }
    
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
                // res.status(500).send("sin resultados?");
                reject("no registro");
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
    consulta.addParameter('listgrp',TYPES.VarChar,grupo);
    // consulta.addParameter('stok',TYPES.Int,stoc);
    conexion.execSql(consulta);
}

module.exports={bprd_list}