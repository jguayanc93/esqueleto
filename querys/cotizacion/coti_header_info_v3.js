const {Request,TYPES} = require('../../conexion/cadena')


function query_info_cabecera(resolve,reject,req,conexion){
    let codcli=req.body.coti.codcli;
       
        // let sp_sql="select CONVERT(char,GETDATE(),105),* from mst01cli where codcli=@id";
        let sp_sql="select CONVERT(char,GETDATE(),111),codcli,nomcli,ruccli,codven,codcdv,CONVERT(char,DATEADD(DAY,1,GETDATE()),111) from mst01cli where estado=1 AND codcli=@id";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error request");
            }
            else{
                conexion.close();
                if(rows.length==0){
                    reject("no registro");
                    // cuidado poruqe puede no ser un codigo valido el que se este pasando
                    // query_info_productos(resolve,reject,req,conexion,indice+1);
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
                    req.cabecera["fecha"]=respuesta[0][0];
                    req.cabecera["codcli"]=respuesta[0][1];
                    req.cabecera["nomcli"]=respuesta[0][2];
                    req.cabecera["ruccli"]=respuesta[0][3];
                    req.cabecera["codven"]=respuesta[0][4];
                    req.cabecera["codcdv"]=respuesta[0][5];
                    req.cabecera["fven"]=respuesta[0][6];
                    
                    resolve(req.cabecera);
                }
            }
        })
        consulta.addParameter('id',TYPES.Char,codcli);
        conexion.execSql(consulta);
}

module.exports={query_info_cabecera}