const {TYPES} = require('../conexion/cadena')

const cuerpo_keys=["fecha","cdocu","ndocu","codcli","tcam","mone","moneitm","aigv","item","codi","codf","marc","umed","descr","cant","preu","tota","dsct","totn","AnulaDetalle","codalm","cost","msto"];

const keys_valores_defecto={}
keys_valores_defecto.fecha='2025-07-21';
keys_valores_defecto.cdocu='31';
keys_valores_defecto.ndocu='009-0000000';///este se insertara de otra manera
keys_valores_defecto.moneitm='D';
keys_valores_defecto.aigv='S';
keys_valores_defecto.item=1;
keys_valores_defecto.umed='UND';
keys_valores_defecto.AnulaDetalle='';
keys_valores_defecto.codalm='01';
keys_valores_defecto.cost=50.26;
keys_valores_defecto.mst='S';
/////////terminar esta funcion para mañana
function coti_objbody_structure(paramsbody,ndocu,fecha){
    console.log("esta es la fecha pasada",fecha);
    let contador=0;
    let ordenado={};
    let enviados=Object.keys(paramsbody);
    let defecto=Object.keys(keys_valores_defecto);///ya no serviria porq es por cada uno de su interior

    // generar espacios e indices con la cantidad de items
    for(const index of enviados){
        ordenado[index]={};
    }
    //////////////////////
    for(const indice in paramsbody){//////por cada item se recorrera su valores

        for(const parametro of cuerpo_keys){
            if(Object.keys(paramsbody[indice]).includes(parametro)){
                if(typeof paramsbody[indice][parametro]==='string'){
                    ordenado[indice][parametro]=[TYPES.Char,paramsbody[indice][parametro]];
                }
                else if(typeof paramsbody[indice][parametro]==='number'){
                    ordenado[indice][parametro]=[TYPES.Float,paramsbody[indice][parametro]];
                }                
            }
            else if(defecto.includes(parametro)){
                if(parametro==='fecha'){ ordenado[indice][parametro]=[TYPES.DateTime,fecha["0"]]; }
                else if(parametro==='ndocu'){ ordenado[indice][parametro]=[TYPES.Char,ndocu]}
                else if(parametro==='item'){ ordenado[indice][parametro]=[TYPES.Float,parseInt(indice)+1]}
                else{
                    if(typeof keys_valores_defecto[parametro]==='string'){
                        if(keys_valores_defecto[parametro].length<1){
                            ordenado[indice][parametro]=[TYPES.Char,''];
                        }
                        else{ ordenado[indice][parametro]=[TYPES.Char,keys_valores_defecto[parametro]]; }
                    }
                    else if(typeof keys_valores_defecto[parametro]==='number'){
                        ordenado[indice][parametro]=[TYPES.Float,keys_valores_defecto[parametro]];
                    }
                }
            }
        }
    }

    return ordenado;
}

function coti_objbody_addparametros(paramsproductos){
    let contador=0;
    let numero_item=1;
    let construido_esquema={};
    let enviados=Object.keys(paramsproductos);

    for(const index of enviados) construido_esquema[index]={};
    ///////////////////////////////
    for(const indice of enviados){
        for(const parametro of Object.values(paramsproductos[indice])){
            
            if(typeof parametro==='string'){
                if(cuerpo_keys[contador]==='item'){
                    construido_esquema[indice][cuerpo_keys[contador]]=[TYPES.Float,numero_item];
                    numero_item++;
                }
                else{ construido_esquema[indice][cuerpo_keys[contador]]=[TYPES.Char,paramsproductos[indice][contador]]; }
            }
            else if(typeof parametro==='number'){
                construido_esquema[indice][cuerpo_keys[contador]]=[TYPES.Float,paramsproductos[indice][contador]];
            }
            contador++;
        }
        contador=0;
    }
    
    return construido_esquema;
}

function coti_objpromo_addparametros(paramsproductos,item_num){
    let contador=0;
    let numero_item=item_num;
    let construido_esquema={};
    let enviados=Object.keys(paramsproductos);

    for(const index of enviados) construido_esquema[index]={};
    ///////////////////////////////
    for(const indice of enviados){
        for(const parametro of Object.values(paramsproductos[indice])){
            
            if(typeof parametro==='string'){
                if(cuerpo_keys[contador]==='item'){
                    construido_esquema[indice][cuerpo_keys[contador]]=[TYPES.Float,numero_item];
                    numero_item++;
                }
                else{ construido_esquema[indice][cuerpo_keys[contador]]=[TYPES.Char,paramsproductos[indice][contador]]; }
            }
            else if(typeof parametro==='number'){
                construido_esquema[indice][cuerpo_keys[contador]]=[TYPES.Float,paramsproductos[indice][contador]];
            }
            contador++;
        }
        contador=0;
    }
    
    return construido_esquema;
}

module.exports={coti_objbody_structure,coti_objbody_addparametros,coti_objpromo_addparametros}
