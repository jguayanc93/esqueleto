
const key_revisar=["codcli","nomcli","ruccli","atte","mone","tcam","tota","toti","totn","flag","codcdv","fven","dura","obser"];

const validar_cabesera = (req,res,next) =>{

    let estado=true;
    let keys_entregadas=Object.keys(req.body);

    /////MEDIR EL TAMAÑO DE LOS PARAMETROS
    if(key_revisar.length===keys_entregadas.length){
        
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

module.exports={validar_cabesera}