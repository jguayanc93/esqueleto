const {Request,TYPES} = require('../../conexion/cadena')

function query_numero_documento(resolve,reject,req,conexion){
    let sp_sql="select top 1 RIGHT(ndocu,8) as nroactual from mst01cot where LEFT(ndocu,3)='009' order by RIGHT(ndocu,8) desc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error en la consulta de pedir el numero de coti actual")
            // res.status(401).send("error interno");
        }
        else{
            conexion.close();

            let comodin="009-00";
            let n_actual = parseInt(rows[0][0]["value"]);
            let n_calcular=n_actual+1;
            let formato=comodin+n_calcular.toString();

            req.cabecera["ndocu"]=formato;

            for(const item of Object.keys(req.productos)){
                req.productos[item][2]=formato;
            }

            resolve(formato);
        }
    })
    conexion.execSql(consulta);
}

module.exports={query_numero_documento}