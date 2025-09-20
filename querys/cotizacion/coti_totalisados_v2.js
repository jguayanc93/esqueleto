const {Request,TYPES} = require('../../conexion/cadena')


function query_calculo_totalisados(resolve,reject,req){

    if(req.body.coti.moneda==="S"){

        for(const item of Object.keys(req.productos)){
        ////PRIMERO PASEMOS SUS CANTIDADES
        req.productos[item][14]=req.body.coti.productos[item].cantidad;
        ////DESPUES PASEMOS SUS DESCUENTOS PARA EL TOTALISADO
        req.productos[item][17]=req.body.coti.productos[item].descuento;
        ////AHORA CALCULEMOS SUS TOTALISADOS        
        let descuento_pedido=req.body.coti.productos[item].descuento/100;
        // let descuento_convertido=descuento_pedido*parseFloat(req.body.coti.tcam);//quiza este mal
        ////TRANSFORMAR LA MONEDA ///REVISAR EN EL TRABAJO
        let conversion=req.productos[item][15]*parseFloat(req.body.coti.tcam);
        ////////////////////////
        let descuento=conversion*descuento_pedido;
        let residuo=conversion-descuento;
        let tota=parseFloat(residuo.toFixed(2))*req.productos[item][14];
        let tota_corregido=(tota).toFixed(2);
        req.productos[item][16]=tota_corregido
        let totn=parseFloat(tota_corregido)*1.18
        let totn_corregido=(totn).toFixed(2);
        req.productos[item][18]=totn_corregido;
        ////////POR ULTIMO PASEMOS VALORES REPETIDOS
        req.productos[item][3]=req.body.coti.codcli;///codcli
        req.productos[item][4]=req.body.coti.tcam;//tipo de cambio
        req.productos[item][5]=req.body.coti.moneda;//moneda
        req.productos[item][6]=req.body.coti.moneda;//moneda
        }
    }
    else{
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
            req.productos[item][3]=req.body.coti.codcli;///codcli
            req.productos[item][4]=req.body.coti.tcam;//tipo de cambio
            req.productos[item][5]=req.body.coti.moneda;//moneda
            req.productos[item][6]=req.body.coti.moneda;//moneda
        }
    }

    ///////
    resolve(req.productos);

}

module.exports={query_calculo_totalisados}