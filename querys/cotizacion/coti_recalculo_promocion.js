const {Request,TYPES} = require('../../conexion/cadena')


function query_recalculo_totalisados(resolve,reject,req){

    if(req.body.coti.moneda==="S"){

        let tota_header=0;
        let totn_header=0;

        for(const item of Object.keys(req.promos_validos)){
            // console.log("valor de tota",typeof req.productos[item][16],req.productos[item][16])
            tota_header+=parseFloat(req.productos[item][16]);
            totn_header+=parseFloat(req.productos[item][18]);
        }
        /////////pasar las variables a sus campos
         req.cabecera["tota"]=req.cabecera["tota"]-parseFloat((tota_header).toFixed(2));
        req.cabecera["toti"]=req.cabecera["toti"]-parseFloat((tota_header*0.18).toFixed(2));
        // req.cabecera["totn"]=(tota_header*1.18).toFixed(2);
        req.cabecera["totn"]=req.cabecera["totn"]-totn_header;
    }
    else{

        let tota_header=0;
        let totn_header=0;
        for(const item of Object.keys(req.promos_validos)){            
            console.log("valor de tota",typeof req.promos_validos[item][16],req.promos_validos[item][16])
            tota_header+=parseFloat(req.promos_validos[item][16]);
            totn_header+=parseFloat(req.promos_validos[item][18]);
        }
        /////////pasar las variables a sus campos
        console.log("valor a tota",req.cabecera["tota"],parseFloat((tota_header).toFixed(2)))
        req.cabecera["tota"]=req.cabecera["tota"]+parseFloat((tota_header).toFixed(2));
        req.cabecera["toti"]=req.cabecera["toti"]+parseFloat((tota_header*0.18).toFixed(2));
        // req.cabecera["totn"]=(tota_header*1.18).toFixed(2);
        req.cabecera["totn"]=req.cabecera["totn"]+totn_header;
    }

    ///////
    resolve(req.productos);

}

module.exports={query_recalculo_totalisados}