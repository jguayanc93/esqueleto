const {Request,TYPES} = require('../../conexion/cadena')


function query_calculo_totalisados(resolve,reject,req){

    
    for(const item of Object.keys(req.productos)){
        ////PRIMERO PASEMOS SUS CANTIDADES
        req.productos[item][14]=req.body.coti.productos[item].cantidad;
        ////DESPUES PASEMOS SUS DESCUENTOS PARA EL TOTALISADO
        req.productos[item][17]=req.body.coti.productos[item].descuento;
        ////AHORA CALCULEMOS SUS TOTALISADOS
        let descuento_pedido=req.body.coti.productos[item].descuento/100;
        let descuento=req.productos[item][15]*descuento_pedido;
        let residuo=req.productos[item][15]-descuento;
        let tota=parseFloat(residuo.toFixed(2))*req.productos[item][14];
        let tota_corregido=(tota).toFixed(2);
        req.productos[item][16]=tota_corregido
        let totn=parseFloat(tota_corregido)*1.18
        let totn_corregido=(totn).toFixed(2);
        req.productos[item][18]=totn_corregido;
        ////////POR ULTIMO PASEMOS VALORES REPETIDOS
        req.productos[item][3]=req.body.coti.codcli;
        req.productos[item][4]=req.body.coti.tcam;
        req.productos[item][5]=req.body.coti.moneda;
        req.productos[item][6]=req.body.coti.moneda;
    }
    ///////
    resolve(req.productos);

    // let sp_sql="select CONVERT(char,GETDATE(),105),'31','documento','cliente','cambio','moneda','monedaitm',aigv,'numero',codi,codf,marc,umed,descr,'cantidad',vvus,'tota','descuento','totn','','01',pcus,'S' from prd0101 where codi=@codi";
    // let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
    //     if(err){
    //         conexion.close();
    //         reject("error request");
    //     }
    //     else{
    //         conexion.close();
    //         if(rows.length==0){
    //             reject("no registros")
    //             // cuidado poruqe puede no ser un codigo valido el que se este pasando
    //             // query_info_productos(resolve,reject,req,conexion,indice+1);
    //         }
    //         else{
    //             let respuesta=[];
    //             let contador=0;
    //             rows.forEach(fila=>{
    //                 let tmp={};
    //                 fila.map(data=>{
    //                     if(contador>=fila.length) contador=0;
    //                     typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
    //                     contador++;
    //                 })
    //                 respuesta.push(tmp);
    //             });
    //             console.log(respuesta);
    //             req.productos[respuesta[0][9]]=respuesta[0];
    //         }
    //     }
    // })
    // consulta.addParameter('codi',TYPES.Char,Object.keys(req.body.coti.productos)[indice]);
    // conexion.execSql(consulta);
}

module.exports={query_calculo_totalisados}