

const value_revisar=["cdocu","codcli","tcam","mone","codi","codf","marc","descr","cant","preu","tota","dsct","totn","cost"];

const validar_body = (req,res,next) =>{

    let estado=true;
    let valores_entregados=Object.values(req.body);

    /////MEDIR EL TAMAÑO DE LOS PARAMETROS
    if(value_revisar.length===valores_entregados.length){
        
        for(const key in req.body){
            if(!key_revisar.includes(key)){
                estado=false;
            }
        }

        if(estado){
            next();
        }
        else{
            next('route')
        }

    }
    else{
        next('route');
    }

}

module.exports={validar_body}