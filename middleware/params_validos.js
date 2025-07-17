
let prd_hp_codi=["id"];

let qs_productos_permitidos=["tipo","dsct"];

let hp_productos_permitidos=["08","11"];

let conjunto_permitidos=[prd_hp_codi,qs_productos_permitidos,hp_productos_permitidos];

const objeto_verificador_mejorado_permitidos = (req,res,next) => {
    let obligatorios=[];
    for(let param of Object.keys(req.params)){
        if(conjunto_permitidos[0].includes(param)){
            obligatorios.push(param)
        }
    }

    if(conjunto_permitidos[0].length===obligatorios.length){
        console.log("lansado este",obligatorios)
        next();
    }
    else{
        console.log("lansado este no",obligatorios)
        next('route');
    }
}

module.exports={objeto_verificador_mejorado_permitidos}