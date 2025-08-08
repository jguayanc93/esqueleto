const {Request,TYPES} = require('../../conexion/cadena')
const {coti_objbody_addparametros} = require('../../funciones/coti_detallado_addparam_obj')

function recorrer_detallado(resolve,reject,req,conexion){

    let corregido=coti_objbody_addparametros(req.productos);
    let indices=Object.keys(req.productos);
    let contador=0;
    query_llamada_detallado(resolve,reject,conexion,corregido,indices,contador);
}

function query_llamada_detallado(resolve,reject,conexion,corregido,indices,contador){
    
    if(indices.length<=contador){
        conexion.close();
        resolve("recursion completada");
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
                query_llamada_detallado(resolve,reject,conexion,corregido,indices,contador+1);
            }
        })        
        for(const [key,value] of Object.entries(corregido[Object.keys(corregido)[contador]])){
            consulta.addParameter(key,value[0],value[1]);
        }
        conexion.callProcedure(consulta);
    }
}

module.exports={recorrer_detallado}