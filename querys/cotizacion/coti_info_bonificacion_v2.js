const {Request,TYPES} = require('../../conexion/cadena')

function promocion_informacion_regalo(resolve,reject,req,conexion){
    
    let indice=0;
    query_info_regalos_extraer(resolve,reject,req,conexion,indice);
}

function query_info_regalos_extraer(resolve,reject,req,conexion,indice){
    if(Object.keys(req.body.coti.promociones).length<=indice){
        conexion.close();
        resolve(req.promos);
    }
    else{
        let sp_sql="select codi,codf,marc,umed,pcus from prd0101 where codi=@codi";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error request");
            }
            else{
                // conexion.close();
                if(rows.length==0){
                    query_info_regalos_extraer(resolve,reject,req,conexion,indice+1);
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

                    if(req.promos[indice][9]!=='0303-010001' && req.promos[indice][9]!=='ELIMINAR'){
                        req.promos[indice][9]=respuesta[0][0];
                        req.promos[indice][10]=respuesta[0][1];
                        req.promos[indice][11]=respuesta[0][2];
                        req.promos[indice][12]=respuesta[0][3];
                        req.promos[indice][16]=0;
                        req.promos[indice][17]=0;
                        req.promos[indice][18]=0;
                        req.promos[indice][21]=respuesta[0][4];
                        req.promos[indice][22]="S";
                    }

                    
                    query_info_regalos_extraer(resolve,reject,req,conexion,indice+1);
                }
            }
        })
        consulta.addParameter('codi',TYPES.Char,req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]);
        conexion.execSql(consulta);
    }
}

module.exports={promocion_informacion_regalo}