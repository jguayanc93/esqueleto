const {Request,TYPES} = require('../../conexion/cadena')
const {coti_objpromo_addparametros} = require('../../funciones/coti_detallado_addparam_obj')

function recorrer_promdetallado(resolve,reject,req,conexion){

    let corregido=coti_objpromo_addparametros(req.promos_validos,Object.keys(req.productos).length+1);
    let indices=Object.keys(req.promos_validos);
    let contador=0;
    // let contador=Object.keys(req.productos).length;
    query_llamada_promocion_detallado(resolve,reject,conexion,corregido,indices,contador);
}

function query_llamada_promocion_detallado(resolve,reject,conexion,corregido,indices,contador){
    ////corregir la longuitud y el numero que le toca
    if(indices.length<=contador){
        conexion.close();
        resolve("recursion de promos completada");
    }
    else{
        let sp_sql="GrabaDtlCotFac";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                console.log(err);
                reject("sin exito de consulta en detallado")
            }
            else{
                query_llamada_promocion_detallado(resolve,reject,conexion,corregido,indices,contador+1);
            }
        })        
        for(const [key,value] of Object.entries(corregido[Object.keys(corregido)[contador]])){
            consulta.addParameter(key,value[0],value[1]);
        }
        conexion.callProcedure(consulta);
    }
}

module.exports={recorrer_promdetallado}