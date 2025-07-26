
////profundidad si es 1 es un objeto de 1 dimension si es 2 tiene mas objetos dentro
let asignador_identificadores = (respuesta,indices,profundidad) =>{
    let numero_indice=0;
    let mejorado={};
    if(profundidad===1){

        for(const valor of Object.values(respuesta)){
            mejorado[indices[numero_indice]]=valor;
            numero_indice++;
        }
        numero_indice=0;
    }
    else if(profundidad===2){}

    //////////////ASIGNAR UN MENSAJE CON CODIGO DE STATUS Y REFERENCIA DE CUERPO CON SU CONTENIDO
    //////////////ENVIAR LA ESTRUCTURA DE LAS CABECERAS EN LAS RESPUESTAS
    let mensaje_acondicionado={};
    mensaje_acondicionado.status="OK";
    mensaje_acondicionado.codigo=1;
    mensaje_acondicionado.msg=mejorado;
    
    // return mejorado;
    return mensaje_acondicionado;
}

module.exports=asignador_identificadores;