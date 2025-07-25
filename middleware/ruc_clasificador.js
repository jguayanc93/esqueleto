
const ruc_diferenciador = (req,res,next) => {
    let ruc=req.params.id;
    if(ruc.length===11){
        next();
    }
    else if(ruc.length===8){
        next('route');
    }
}

const dni_diferenciador = (req,res,next) => {
    let ruc=req.params.id;
    if(ruc.length===11){
        next('route');
    }
    else if(ruc.length===8){
        next();
    }
}

module.exports={ruc_diferenciador,dni_diferenciador}