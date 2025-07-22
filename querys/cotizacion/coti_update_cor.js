const {Connection,Request,TYPES} = require('../../conexion/cadena')

function query_update_correlativo(resolve,reject,conexion,correlativo){
    let sp_sql="update tbl01cor set nroini=@correlativo where cdocu='31'";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("update correlativo error");
        }
        else{
            conexion.close();
            resolve("correlativo actualisado con exito");
        }
    })
    consulta.addParameter('correlativo',TYPES.VarChar,correlativo);
    conexion.execSql(consulta);
}

module.exports={query_update_correlativo}