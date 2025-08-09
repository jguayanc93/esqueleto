const {Request,TYPES} = require('../../conexion/cadena')

function promocion_bucle(resolve,reject,req,conexion){
    req.promos={}
    let indice=0;
    query_info_promociones(resolve,reject,req,conexion,indice);
}

function query_info_promociones(resolve,reject,req,conexion,indice){
    if(Object.keys(req.body.coti.promociones).length<=indice){
        conexion.close();
        resolve(req.promos);
    }
    else{
        let sp_sql="select CONVERT(char,GETDATE(),105),'31','documento','cliente','cambio','moneda','monedaitm',aigv,'numero',codi,codf,marc,'','DSCTO/PROM:',1,vvus,'tota',0.00,'totn','','01','pcus','N' from prd0101 where codi='0303-010001'";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error request");
            }
            else{
                // conexion.close();
                if(rows.length==0){
                    // cuidado poruqe puede no ser un codigo valido el que se este pasando
                    // query_info_productos(resolve,reject,req,conexion,indice+1);
                    query_info_promociones(resolve,reject,req,conexion,indice+1);
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
                    req.promos[indice]=respuesta[0];
                    query_info_promociones(resolve,reject,req,conexion,indice+1);
                }
            }
        })
        // consulta.addParameter('codi',TYPES.Char,Object.keys(req.body.coti.productos)[indice]);
        conexion.execSql(consulta);
    }
}

module.exports={promocion_bucle}