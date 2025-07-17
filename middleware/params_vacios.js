
////////////// OBJETO VACIO PERO MIDDLEWARE
const middleware_objevacio_param=(req,res,next)=>{
    let obligatorios=[];
    // let parametros=Object.keys(req.params);

    for(let propiedad in req.params){
        if(Object.hasOwn(req.params,propiedad)){
            obligatorios.push(propiedad)
        }
    }

    if(obligatorios.length>0){
        next();
    }
    else{
        next('route');
    }
}

module.exports={middleware_objevacio_param}