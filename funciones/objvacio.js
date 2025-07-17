const objevacio=(objecuerpo)=>{
    for(let propiedad in objecuerpo){
        if(Object.hasOwn(objecuerpo,propiedad)){ return false; }
    }
    return true;
}
///////////NECESARIO PARA SACAR LAS PROPIEDAD A LAS PETICIONES
const objepropiedades=(objecuerpo)=>{
    let propiedades=[];
    for(let propiedad in objecuerpo){
        if(Object.hasOwn(objecuerpo,propiedad)){ propiedades.push(propiedad); }
    }
    return propiedades;
}
//////////EN PRUEVA PARA SACAR MULTIPLES OBJETOS
const multobjevacios=(objparam,objqs)=>{
    let rellenos=true;

    let obligatorios=objevacio(objparam);
    let filtros=objevacio(objqs);

    if(obligatorios) rellenos=false;
    if(filtros) rellenos=false;

    return rellenos;
}

module.exports={objevacio,objepropiedades,multobjevacios}