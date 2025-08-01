require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')

//////////ESTO ES EN PARA ACORTAR EL CAMINO PORQUE YA SE VALIDO CON LOS MIDDLEWARE ANTERIORES LOS PARAMETROS
async function bcli_personal(req,res,next){
    try{
        const primera_llamada=await obtener_conexion();
        const segunda_llamada=await obtener_consulta1(req,primera_llamada);
        // console.log(segunda_llamada);
        res.status(200).json(segunda_llamada)
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

function obtener_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtener_consulta1(req,conexion){
    return new Promise((resolve,reject)=>query_cliente_atencion(resolve,reject,req,conexion))
}

let query_cliente_atencion = (resolve,reject,req,conexion)=>{
    let cliente=req.query.personal;
    // let sp_sql="select codcli,ruccli,nomcli from mst01cli where estado=1 AND ruccli=@ruc";
    let sp_sql="select Nomcon from dtl01con where Codn=@codcli";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            reject("error request");
            // res.status(500).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                reject("no registros");
                // res.status(400).send("sin resultados?");
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
                /////mover los valores en un objeto

                let disponibles=[];

                for(const personas in respuesta){ disponibles.push(respuesta[personas][0]) }
                Object.assign(respuesta2,disponibles);
                // console.log(respuesta2);
                resolve(respuesta2)
                // res.status(200).json(respuesta2);
            }
        }
    })
    consulta.addParameter('codcli',TYPES.VarChar,cliente);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_personal}