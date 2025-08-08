require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

const {prom_info} = require('../../id_nombres/lista')
const asignador_identificadores= require('../../funciones/asignador_indice_nombre')


async function prom_search(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const paso1= await obtenerpromesa_consulta1(req,primera_llamada);
        const paso2= asignador_identificadores(paso1,prom_info,1)
        res.status(200).json(paso2);
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

function obtenerpromesa_consulta1(req,conexion){return new Promise((resolve,reject)=>query_promo_info(resolve,reject,req,conexion))}

// let prom_search = (req,res,next) => {
//     console.log("param",req.params);
//     console.log("query",req.query);
    
//     let codi=req.params.id;
//     let cliente=req.query.cliente;

//     bd_conexion(res,codi,cliente);
// }

let query_promo_info = (res,conexion)=>{

    let codi=req.params.codi;
    let idprom=req.query.idprom;

    let sp_sql="select idprom,codi,monto,dbo.promocion_info_api(codi,idprom),(CASE dbo.promocion_info_api(codi,idprom) WHEN 'DESCUENTO' THEN dsct WHEN 'REGALO' THEN boncodf END) from dtl_promocion_progra where idprom=@id AND codi=@codi";
        
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            res.status(500).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                res.status(500).send("sin resultados?");
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
            }
        }
    })
    consulta.addParameter('id',TYPES.VarChar,idprom);
    consulta.addParameter('codi',TYPES.VarChar,codi);
    conexion.execSql(consulta);
}

module.exports={prom_search}