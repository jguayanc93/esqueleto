
const ruc_largo = (req,res,next) => {
    let ruc=req.params.id;
    if(!isNaN(ruc)){//////PRIMERO VERIFIQUEMOS QUE SEA EFECTIVAMENTE SEA SOLO UN NUMERO
        /////DIFERENCIAMOS LA CANTIDAD Y EL COMIENSO DE LA CADENA
        if(ruc.length===11){
            next();
        }
        else if(ruc.length===8){
            next();
        }
        else{
            //////mejorar esto
            // res.set('Content-Type', 'text/html')
            // res.send(Buffer.from('<p>some html</p>'))
            res.status(400).send("parametro invalido");
        }
    }
    else{
        next('route');
    }    
    
}

module.exports={ruc_largo}