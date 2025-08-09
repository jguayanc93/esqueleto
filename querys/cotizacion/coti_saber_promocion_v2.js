const {Request,TYPES} = require('../../conexion/cadena')

function promocion_informacion_bucle(resolve,reject,req,conexion){
    // console.log("compara cn este",req.productos)
    // req.promos={}
    let indice=0;
    query_info_promociones_extraer(resolve,reject,req,conexion,indice);
}

function query_info_promociones_extraer(resolve,reject,req,conexion,indice){
    if(Object.keys(req.body.coti.promociones).length<=indice){
        conexion.close();
        resolve(req.promos);
    }
    else{
        let sp_sql="select a.idprom,a.nomprom,a.tipdsct,b.monto,(CASE a.tipdsct WHEN 1 THEN CAST(b.dsct as varchar) WHEN 3 THEN (select codi from prd0101 where codf like b.boncodf+'%') END) from mst_promocion a inner join dtl_promocion_progra b on (b.idprom=a.idprom) where a.idprom=@id AND b.codi=@codi";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error request");
            }
            else{
                // conexion.close();
                if(rows.length==0){
                    query_info_promociones_extraer(resolve,reject,req,conexion,indice+1);
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
                    if(respuesta[0][2]===1){
                        if(req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][14]>=respuesta[0][3]){
                            req.promos[indice][13]+=(respuesta[0][1]).trim();
                            if(req.promos[indice][13].length>80){ req.promos[indice][13]=(req.promos[indice][13]).substring(0,80); }
                        /////////SINO ALCANSA LA CANTIDAD NECESARIA NO DEBERIA CREAR NADA
                        let cantidad_llevada=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][14];         
                        let cantidad_a_llevar=Math.floor(cantidad_llevada/respuesta[0][3]);
                        let descuento_obtenido=cantidad_a_llevar*parseFloat(respuesta[0][4]);
                        let descuento_parseado=parseFloat(descuento_obtenido.toFixed(2));
                        req.promos[indice][14]=cantidad_a_llevar;
                        req.promos[indice][18]=descuento_parseado*-1;
                        req.promos[indice][16]=parseFloat((descuento_parseado/1.18).toFixed(2))*-1 ;
                        req.promos[indice][21]=((descuento_parseado)/1.18)*-1;/////AQUI
                        ////////////////
                        req.promos[indice][2]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][2];
                        req.promos[indice][3]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][3];
                        req.promos[indice][4]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][4];
                        req.promos[indice][5]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][5];
                        req.promos[indice][6]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][6];
                        }
                        else{
                            req.promos[indice][9]="ELIMINAR";
                        }
                    }
                    else{
                        if(req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][14]>=parseInt(respuesta[0][3])){
                                                       
                            req.promos[indice][13]="GRATIS/PROM:(P#"+(respuesta[0][0])+(respuesta[0][1]).trim();
                            if(req.promos[indice][13].length>80){ req.promos[indice][13]=(req.promos[indice][13]).substring(0,80); }
                        /////////SINO ALCANSA LA CANTIDAD NECESARIA NO DEBERIA CREAR NADA
                        let cantidad_llevada=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][14];         
                        let cantidad_a_llevar=Math.floor(cantidad_llevada/respuesta[0][3]);
                        req.promos[indice][14]=cantidad_a_llevar;
                        //////////COMPLEMENTOS                    
                        req.promos[indice][2]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][2];
                        req.promos[indice][3]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][3];
                        req.promos[indice][4]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][4];
                        req.promos[indice][5]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][5];
                        req.promos[indice][6]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][6];                        
                        /////////
                        req.promos[indice][9]=req.productos[req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]][9];
                        }
                        else{                            
                            req.promos[indice][9]="ELIMINAR";
                        }
                    }
                    // req.promos[indice]=respuesta[0];
                    query_info_promociones_extraer(resolve,reject,req,conexion,indice+1);
                }
            }
        })
        consulta.addParameter('id',TYPES.Char,Object.keys(req.body.coti.promociones)[indice]);
        consulta.addParameter('codi',TYPES.Char,req.body.coti.promociones[Object.keys(req.body.coti.promociones)[indice]]);
        conexion.execSql(consulta);
    }
}

module.exports={promocion_informacion_bucle}