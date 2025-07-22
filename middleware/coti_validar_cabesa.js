
const key_revisar=["codcli","nomcli","ruccli","atte","mone","tcam","tota","toti","totn","codcdv","fven","dura","obser"];

const validar_cabesera = (req,res,next) =>{

    let estado=false;
    let contador=0;
    let array_afirmacion=[];
    let keys_entregadas=Object.keys(req.body["cabecera"]);

    /////MEDIR EL TAMAÑO DE LOS PARAMETROS
    if(key_revisar.length===keys_entregadas.length){
        
        for(const key in req.body["cabecera"]){
            
            if(key===key_revisar[contador]){
                array_afirmacion.push(1);
            }
            contador++;
        }
        if(array_afirmacion.length===key_revisar.length){ estado=true }
        console.log(estado);

        estado ? next() : next('route');
    }
    else{
        next('route');
    }

}

module.exports={validar_cabesera}