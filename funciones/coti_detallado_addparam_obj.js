
const cuerpo_keys=["fecha","cdocu","ndocu","codcli","tcam","mone","moneitm","aigv","item","codi","codf","marc","umed","descr","cant","preu","tota","dsct","totn","AnulaDetalle","codalm","cost","msto"];

const keys_valores_defecto={}
keys_valores_defecto.fecha='2025-07-21';
keys_valores_defecto.cdocu='31';
keys_valores_defecto.cdocu='009-0000000';///este se insertara de otra manera
keys_valores_defecto.nrefe='';
keys_valores_defecto.requ='';
keys_valores_defecto.codven='';
keys_valores_defecto.cond='';
keys_valores_defecto.dura=10;
keys_valores_defecto.estado='1';
keys_valores_defecto.obsere='';
keys_valores_defecto.word='';
/////////terminar esta funcion para mañana
function coti_objbody_structure(paramsbody){
    let contador=0;
    let ordenado={};
    let enviados=Object.keys(paramsbody);
    let defecto=Object.keys(keys_valores_defecto);

    for(const parametro of cuerpo_keys){
        ///hasta aqui es correcto
        for(const item in paramsbody[contador]){
            
            if(Object.keys(paramsbody[contador]).includes(parametro)){

                if(typeof paramsbody[contador][item]==='string'){
                    if(paramsbody[contador][item].length>2){
                        ordenado[contador][item]=['VarChar',paramsbody[contador][item]];
                    }
                    else{ ordenado[contador][item]=['Char',paramsbody[contador][item]]; }
                }
                else if(typeof paramsbody[contador][item]==='number'){
                    if(Number.isInteger(paramsbody[contador][item])){}
                    else{}
                }
            }
            else if(defecto.includes(parametro)){}
        }
    }
}

module.exports={coti_objbody_structure}
