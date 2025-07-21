
// const value_revisar=["cdocu","codcli","tcam","mone","codi","codf","marc","descr","cant","preu","tota","dsct","totn","cost"];
const value_revisar=["codcli","tcam","mone","codi","codf","marc","descr","cant","preu","tota","dsct","totn"];

const validar_body = (req,res,next) =>{

    let estado=false;
    let contador=0;
    let array_afirmacion=[];
    let array_interior=[];
    let keys_entregadas=Object.keys(req.body["detallado"]);    

    /////MEDIR EL TAMAÑO DE LOS PARAMETROS
    for(const index of keys_entregadas){
        ///todo bien hasta aqui
        if(Object.keys(req.body["detallado"][index]).length===value_revisar.length){

            for(const key in req.body["detallado"][index]){
                console.log("valor llave",key);
                console.log("valor comparado",value_revisar[contador]);
                if(key===value_revisar[contador]){
                    array_interior.push(1);
                }
                contador++;
            }
        }
        if(array_interior.length===value_revisar.length){
            array_afirmacion.push(1)
            array_interior=[];
        }
        contador=0;
    }
    /////falta comparar que dentro del array interior todos sean 1
    if(array_afirmacion.length===keys_entregadas.length){ estado=true; }

    estado ? next() : next('route');

}

module.exports={validar_body}