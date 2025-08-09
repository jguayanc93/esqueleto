const {Request,TYPES} = require('../../conexion/cadena')

function promocion_eliminados(resolve,reject,req){
    req.promos_validos={}
    let indice=0;
    
    for(const invalidos of Object.keys(req.promos)){
        if(req.promos[invalidos][9]!=="ELIMINAR"){
            req.promos_validos[indice]=req.promos[invalidos];
        }
        indice++;
    }
    // console.log("esto es separado",req.promos_validos)
    
    resolve(req.promos_validos);
}



module.exports={promocion_eliminados}