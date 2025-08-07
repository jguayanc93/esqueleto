
function query_calculo_cabecera(resolve,reject,req){
    let tota_header=0;
    let totn_header=0;
    
    for(const item of Object.keys(req.productos)){
        tota_header+=req.productos[item][16];
        tota_header+=req.productos[item][18];
    }
    /////////pasar las variables a sus campos
    req.cabecera["tota"]=tota_header;
    req.cabecera["toti"]=(tota_header*0.18).toFixed(2);
    // req.cabecera["totn"]=(tota_header*1.18).toFixed(2);
    req.cabecera["totn"]=totn_header;
    ///////
    resolve(req.cabecera);
}

module.exports={query_calculo_cabecera}