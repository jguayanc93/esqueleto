
////profundidad si es 1 es un objeto de 1 dimension si es 2 tiene mas objetos dentro
let asignador_identificadores = (respuesta,indices,profundidad) =>{
    let numero_indice=0;
    let mejorado={};
    if(profundidad===1){

        for(const valor of Object.values(respuesta)){
            mejorado[indices[numero_indice]]=valor;
            numero_indice++;
        }
    }
    
    return mejorado;
}

module.exports=asignador_identificadores;