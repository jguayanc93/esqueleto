require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

const {prom_info} = require('../../id_nombres/lista')
const asignador_identificadores= require('../../funciones/asignador_indice_nombre')


async function prom_search(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const paso1= await consulta1(req,primera_llamada);
        const paso2= asignador_identificadores(paso1[0],prom_info,1,"Promocion")
        if(paso2.msg.tipo==="REGALO"){
            const segunda_llamada= await obtenerpromesa_conexion();
            const paso3= await consulta2(paso2,segunda_llamada);
            res.status(200).json(paso2);
        }
        else{
            res.status(200).json(paso2);
        }
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

function consulta1(req,conexion){return new Promise((resolve,reject)=>query_promo_info(resolve,reject,req,conexion))}

function consulta2(objformato,conexion){return new Promise((resolve,reject)=>query_promo_regalo(resolve,reject,objformato,conexion))}


let query_promo_info = (resolve,reject,req,conexion)=>{

    let codi=req.params.codi;
    let idprom=req.query.idprom;

    // let sp_sql="select idprom,codi,monto,dbo.promocion_info_api(codi,idprom),(CASE dbo.promocion_info_api(codi,idprom) WHEN 'DESCUENTO' THEN CAST(dsct as varchar) WHEN 'REGALO' THEN boncodf END) from dtl_promocion_progra where idprom=@id AND codi=@codi";
    let sp_sql="select idprom,codi,monto,dbo.promocion_info_api(codi,idprom,1),dbo.promocion_info_api(codi,idprom,2) from dtl_promocion_progra where idprom=@id AND codi=@codi";
        
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            reject("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                // res.status(500).send("no registro");
                reject("no registro");
            }
            else{
                let respuesta=[];                
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
                resolve(respuesta);
            }
        }
    })
    consulta.addParameter('id',TYPES.VarChar,idprom);
    consulta.addParameter('codi',TYPES.VarChar,codi);
    conexion.execSql(consulta);
}

let query_promo_regalo = (resolve,reject,objformato,conexion)=>{

    // let idprom=objformato.msg.idprom;
    // let codi=objformato.msg.codi;
    let codf=(objformato.msg.otorgar).trim();
    let codfcomodin=codf+'%';

    let sp_sql="select codi,descr from prd0101 where codf like @codf";
        
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            reject("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                // res.status(500).send("no registro");
                reject("no registro");
            }
            else{
                let respuesta=[];                
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
                // console.log(respuesta);
                objformato.msg.otorgar={"codi":respuesta[0][0],"producto":respuesta[0][1]}
                resolve(objformato);
            }
        }
    })
    consulta.addParameter('codf',TYPES.VarChar,codfcomodin);
    // consulta.addParameter('codi',TYPES.VarChar,codi);
    conexion.execSql(consulta);
}

module.exports={prom_search}