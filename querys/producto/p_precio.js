require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

const {prdcodi} = require('../../id_nombres/lista')
const asignador_identificadores = require('../../funciones/asignador_indice_nombre')

const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {query_validador,objeto_verificador_mejorado} = require('../../funciones/param_verificador')

async function bprd_id(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const segunda_llamada= await obtenerpromesa_consulta1(req,primera_llamada);
        const tercera_llamada= asignador_identificadores(segunda_llamada[0],prdcodi,"unico")
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

function obtenerpromesa_consulta1(req,conexion){
    return new Promise((resolve,reject)=>query_prd(resolve,reject,req,conexion))
}

// let bprd_id = (req,res,next) => {
//     console.log("param",req.params);
//     console.log("query",req.query);
    
//     /////////NUEVO METODO FUNCIONAL
//     if(!objevacio(req.params)){
//         let parametros=objepropiedades(req.params);////VALIDO HASTA AQUI
//         let validados=objeto_verificador_mejorado(req.params,parametros,1,"id");
//         if(validados==="valido"){
//             /////validar la longuitud tambien del parametro pasado
//             if(req.params["id"].length===11){
//                 bd_conexion(res,req.params.id);
//             }
//             else{
//                 res.status(400).send("parametro invalido");
//             }
//         }
//         else{
//             res.status(400).send("parametro invalido");
//         }
//     }
//     else{
//         res.status(400).send("parametro invalido");
//     }
// }


let query_prd = (resolve,reject,req,conexion)=>{
    let cli='C00904';
    let id=req.params.id;
    let letra='F';    
    // let sp_sql="select a.codi,a.codf,a.descr,a.marc,(CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int))),a.Usr_001,a.codmar,a.Usr_016,a.vvus,b.dscto_default,b.dscto_maxven from prd0101 a inner join dtl_dscto_marca_tc b on (b.codmar=a.codmar AND b.codtcl=@letra) where a.codi=@ide";
    // let sp_sql="select a.codi,a.codf,a.descr,a.marc,(CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int))),a.Usr_001,a.codmar,a.Usr_016,a.vvus,('min:'+CAST(b.dscto_default as varchar)+' '+'max:'+CAST(b.dscto_maxven as varchar)) from prd0101 a inner join dtl_dscto_marca_tc b on (b.codmar=a.codmar AND b.codtcl=@letra) where a.codi=@ide";
    // let sp_sql="select a.codi,a.codf,a.descr,a.marc,(CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int))),a.Usr_001,a.codmar,a.Usr_016,(CASE WHEN ISNULL(c.codi,'LIBRE')='LIBRE' THEN 'LIBERADO' WHEN ISNULL(c.codi,'LIBRE')<>'LIBRE' THEN 'RESTRINGUIDO' END),a.vvus,('min:'+CAST(b.dscto_default as varchar)+'%'+' '+'max:'+CAST(b.dscto_maxven as varchar)+'%') from prd0101 a inner join dtl_dscto_marca_tc b on (b.codmar=a.codmar AND b.codtcl=@letra) left join ListaHp3 c on (c.codi=a.codi) where a.codi=@ide";
    let sp_sql="select a.codi,a.codf,a.descr,a.marc,(CAST(a.stoc as int)-(CAST(a.svta as int)+CAST(a.pedi as int))),a.Usr_001,a.codmar,a.Usr_016,dbo.producto_hp_api(a.codi,@cliente),a.vvus,('min:'+CAST(b.dscto_default as varchar)+'%'+' '+'max:'+CAST(b.dscto_maxven as varchar)+'%'),dbo.promocion_producto_api(a.codi) from prd0101 a inner join dtl_dscto_marca_tc b on (b.codmar=a.codmar AND b.codtcl=@letra) where a.codi=@ide";
        
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
    consulta.addParameter('cliente',TYPES.VarChar,cli);
    consulta.addParameter('letra',TYPES.VarChar,letra);
    consulta.addParameter('ide',TYPES.VarChar,id);
    conexion.execSql(consulta);
}

module.exports={bprd_id}