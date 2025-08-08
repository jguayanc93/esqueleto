
function query_calculo_cabecera(resolve,reject,req){
    let tota_header=0;
    let totn_header=0;
    
    for(const item of Object.keys(req.productos)){
        // console.log("valor de tota",typeof req.productos[item][16],req.productos[item][16])
        tota_header+=parseFloat(req.productos[item][16]);
        totn_header+=parseFloat(req.productos[item][18]);
    }
    /////////pasar las variables a sus campos
    req.cabecera["tota"]=parseFloat((tota_header).toFixed(2));
    req.cabecera["toti"]=parseFloat((tota_header*0.18).toFixed(2));
    // req.cabecera["totn"]=(tota_header*1.18).toFixed(2);
    req.cabecera["totn"]=totn_header;
    ///////
    resolve(req.cabecera);
}

module.exports={query_calculo_cabecera}