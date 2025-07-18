
const ruc_largo = (req,res,next) => {
    let ruc=req.params.id;
    let longuitud=ruc.length;
    //////PRIMERO VERIFIQUEMOS QUE SEA EFECTIVAMENTE SEA SOLO UN NUMERO
    if(!isNaN(ruc)){
        /////DIFERENCIAMOS LA CANTIDAD Y EL COMIENSO DE LA CADENA
        if(longuitud===11){
            console.log("es un ruc valido");
            next();
        }
        else if(longuitud===8){
            console.log("puede ser un dni");
            next();
        }
        else{
            console.log("numero fuera de rango");
            res.status(400).send("parametro invalido");
        }
    }
    else{
        next('route');
    }    
    
}

module.exports={ruc_largo}