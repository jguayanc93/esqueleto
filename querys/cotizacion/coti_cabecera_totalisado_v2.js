
function query_calculo_cabecera(resolve,reject,req){
    let tota_header=0;
    
    for(const item of Object.keys(req.productos)){
        tota_header+=req.productos[item][16];
    }
    ///////
    resolve(req.productos);
}

module.exports={query_calculo_cabecera}