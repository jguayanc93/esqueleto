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

module.exports={objevacio,objepropiedades}