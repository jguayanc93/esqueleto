

const middleware_objevacio_qs=(req,res,next)=>{
    let obligatorios=[];
    // let qs=Object.keys(req.query);

    for(let propiedad in req.query){
        if(Object.hasOwn(req.query,propiedad)){
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

module.exports={middleware_objevacio_qs}