const {Request,TYPES} = require('../../conexion/cadena')


function query_info_cabecera(resolve,reject,req,conexion,indice){
    let codcli=req.body.coti.codcli;
    // let sp_sql="select CONVERT(char,GETDATE(),105),'31','documento','cliente','cambio','moneda','monedaitm',aigv,'numero',codi,codf,marc,umed,descr,'cantidad',vvus,'tota','descuento','totn','','01',pcus,'S' from prd0101 where codi=@codi";
        let sp_sql="select CONVERT(char,GETDATE(),105),* from mst01cli where codcli=@id";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error request");
            }
            else{
                conexion.close();
                if(rows.length==0){
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
                    console.log(respuesta);
                    // req.productos[respuesta[0][9]]=respuesta[0];
                    req.cabecera["fecha"]=respuesta[0][0];
                    req.cabecera["fecha"]=respuesta[0][0];
                    req.cabecera["fecha"]=respuesta[0][0];
                    req.cabecera["fecha"]=respuesta[0][0];
                    req.cabecera["fecha"]=respuesta[0][0];
                    req.cabecera["fecha"]=respuesta[0][0];
                    
                    resolve(req.cabecera);
                }
            }
        })
        consulta.addParameter('id',TYPES.Char,codcli);
        conexion.execSql(consulta);
}

module.exports={query_info_cabecera}