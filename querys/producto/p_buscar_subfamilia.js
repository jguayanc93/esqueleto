require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

const {subfamilias} = require('../../id_nombres/lista')
const asignador_identificadores= require('../../funciones/asignador_indice_nombre')

const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {parametro_validador} = require('../../funciones/param_verificador')

async function bprd_subfam(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const segunda_llamada= await obtenerpromesa_consulta1(primera_llamada,req);
        const tercera_llamada= asignador_identificadores(segunda_llamada,subfamilias,2,"subfamilia");
        res.status(200).json(tercera_llamada)
    }
    catch(err){
        console.log(err)
        res.status(400).send(err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtenerpromesa_consulta1(conexion,req){
    return new Promise((resolve,reject)=>query_prd_subfamilia(resolve,reject,conexion,req))
}

// let bprd_subfam = (req,res,next) => {
//     console.log(req.params);
//     /////////NUEVO METODO FUNCIONAL
//     if(!objevacio(req.params)){
//         let parametros=objepropiedades(req.params);
//         let verificacion=parametro_validador(req,parametros,"catID")
//         if(verificacion==="next"){
//             ////PASO CORRECTAMENTE EL PRIMER PARAMETRO VERIFICADOR
//             //////FALTA VALIDAR LOS PARAMETROS PASADOS

//             let verificacion2=parametro_validador(req,parametros,"sbfamID")
//             if(verificacion2==='next'){
//                 bd_conexion(res,req.params["catID"],req.params["sbfamID"]);
//             }
//             else{
//                 ///como podrias saber si es valido si no ves la ruta
//                 // res.status(400).send("parametro invalido");
//                 bd_conexion(res,req.params["catID"]);
//             }
//         }
//         else{
//             res.status(400).send("parametro invalido");
//         }
//     }
//     else{
//         res.status(400).send("parametros invalido");
//     }
// }

// let bd_conexion=(res,fam,sbfid="nada")=>{
//     conexion = new Connection(config);
//     conexion.connect();
//     conexion.on('connect',(err)=>{
//         if(err){
//             console.log("ERROR: ",err);
//         }
//         else{
//             if(sbfid!=="nada"){
//                 bd_c_query(res,fam,sbfid);
//             }
//             else{
//                 bd_c_query2(res,fam);
//             }            
//         }
//     });
// }

// let query_prd_subfamilia = (res,fam,sbfid)=>{
//     // let sp_sql="select codsub,nomsub,codfam from tbl01sbf where codfam in ('01','02','04','05','06','09','10','11','12') order by codfam";
//     // let sp_sql="select RIGHT(codsub,2),nomsub from tbl01sbf where codfam=@sbfcod";
//     let sp_sql="select codsub,nomsub from tbl01sbf where codsub=(@famid+'-'+@sbfcod)";
//     let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
//         if(err){
//             /////validar la respuesta en de error de servidor
//             conexion.close();
//             res.status(401).send("error interno");
//         }
//         else{
//             conexion.close();
//             if(rows.length==0){
//                 /////validar la respuesta en caso de no encontrar nada
//                 res.status(201).send("sin resultados?");
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
//     consulta.addParameter('famid',TYPES.VarChar,fam);
//     consulta.addParameter('sbfcod',TYPES.VarChar,sbfid);
//     conexion.execSql(consulta);
// }


let query_prd_subfamilia = (resolve,reject,conexion,req)=>{
    let fam=req.params["catID"];
    // let sp_sql="select codsub,nomsub,codfam from tbl01sbf where codfam in ('01','02','04','05','06','09','10','11','12') order by codfam";
    let sp_sql="select RIGHT(codsub,2),nomsub from tbl01sbf where codfam=@famid";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            // res.status(401).send("error interno");
            reject("error request");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                // res.status(201).send("sin resultados?");
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
    consulta.addParameter('famid',TYPES.VarChar,fam);
    conexion.execSql(consulta);
}

module.exports={bprd_subfam}