const {Request,TYPES} = require('../../conexion/cadena')
const {coti_objbody_structure} = require('../../funciones/coti_detallado_addparam_obj')

function recorrer_detallado(resolve,reject,req,res,conexion,correlativo){
    let valores_parseados2=coti_objbody_structure(req.body["detallado"],correlativo);
    let indices=Object.keys(valores_parseados2);
    let contador=0;
    query_llamada_detallado(resolve,reject,conexion,correlativo,indices,contador,valores_parseados2);
}

function query_llamada_detallado(resolve,reject,conexion,correlativo,indices,contador,valores_parseados2){
    // let valores_parseados2=coti_objbody_structure(req.body["detallado"],correlativo);
    if(indices.length<=contador){
        conexion.close();
        resolve("recursion completada");
        // res.status(200).send("detallado insertado");
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
                query_llamada_detallado(resolve,reject,conexion,correlativo,indices,contador+1,valores_parseados2);
            }
        })
        for(const input in valores_parseados2[contador]){
            console.log(input,valores_parseados2[contador][input][1]);
            consulta.addParameter(input,valores_parseados2[contador][input][0],valores_parseados2[contador][input][1]);
        }
        conexion.callProcedure(consulta);
    }
}

module.exports={recorrer_detallado}