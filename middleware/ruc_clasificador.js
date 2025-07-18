
const ruc_diferenciador = (req,res,next) => {
    let ruc=req.params.id;
    let longuitud=ruc.length;
    //////PRIMERO VERIFIQUEMOS QUE SEA EFECTIVAMENTE SEA SOLO UN NUMERO
    if(longuitud===11){
        console.log("es un RUC de empresa");
        next();
    }
    else if(longuitud===8){
        console.log("es un DNI");
        next('route');
    }
}

const dni_diferenciador = (req,res,next) => {
    let ruc=req.params.id;
    let longuitud=ruc.length;
    //////PRIMERO VERIFIQUEMOS QUE SEA EFECTIVAMENTE SEA SOLO UN NUMERO
    if(longuitud===11){
        console.log("es un RUC de empresa");
        next('route');
    }
    else if(longuitud===8){
        console.log("es un DNI");
        next();
    }
}

module.exports={ruc_diferenciador,dni_diferenciador}