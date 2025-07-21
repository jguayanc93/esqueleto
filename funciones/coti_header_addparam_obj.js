
const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ","mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura","cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];
const keys_valores_defecto={}
keys_valores_defecto.fecha='2025-07-21';
keys_valores_defecto.cdocu='31';
keys_valores_defecto.cdocu='009-0000000';///este se insertara de otra manera
keys_valores_defecto.nrefe='';
keys_valores_defecto.requ='';
keys_valores_defecto.codven='';
keys_valores_defecto.cond='';
keys_valores_defecto.dura=10;
keys_valores_defecto.cOperacion='Nuevo';
keys_valores_defecto.estado='1';
keys_valores_defecto.obsere='';
keys_valores_defecto.word='';
keys_valores_defecto.obser2='';
keys_valores_defecto.dirent='';
keys_valores_defecto.codscc='00';
/////solo serviria creo para la creacion de la cabesera para nada mas
////pero se debe hacer dinamico tambien para el cuerpo
function coti_objheader_structure(paramsheader){
    let ordenado={};
    let enviados=Object.keys(paramsheader);
    let defecto=Object.keys(keys_valores_defecto);
    ////aqui es donde fusiono los objetos para completarlos con sus respectivos valores
    for(const parametro of cabesera_keys){
        if(enviados.includes(parametro)){
            
            if(typeof paramsheader[parametro]=='string'){
                if(paramsheader[parametro].length>2){
                    ordenado[parametro]=['VarChar',paramsheader[parametro]];
                }
                else{ ordenado[parametro]=['Char',paramsheader[parametro]]; }
            }
            else if(typeof paramsheader[parametro]=='number'){
                if(Number.isInteger(paramsheader[parametro])){ ordenado[parametro]=['Int',paramsheader[parametro]] } 
                else{ ordenado[parametro]=['Float',paramsheader[parametro]] }
            }
        }
        else if(defecto.includes(parametro)){
            if(typeof keys_valores_defecto[parametro]=='string'){
                if(keys_valores_defecto[parametro].length>2){
                    ordenado[parametro]=['VarChar',keys_valores_defecto[parametro]];
                }
                else{ ordenado[parametro]=['Char',keys_valores_defecto[parametro]]; }
            }
            else if(typeof keys_valores_defecto[parametro]=='number'){
                if(Number.isInteger(keys_valores_defecto[parametro])) ordenado[key]=['Int',keys_valores_defecto[parametro]]
                else{ ordenado[parametro]=['Float',keys_valores_defecto[parametro]] }
            }
        }
    }
    ///////////////////
    /* for(const [key,value] of Object.entries(paramsheader)){
        if(typeof value=='string'){
            if(value.length>2){
                ordenado[key]=['VarChar',value];
            }
            else{ ordenado[key]=['Char',value]; }
        }
        else if(typeof value=='number'){
            if(Number.isInteger(value)) ordenado[key]=['Int',value]
            else{ ordenado[key]=['Float',value] }
        }
        else{
            ordenado[key]=['DateTime','2025-07-21'];
        }
    } */
    return ordenado;
}

module.exports={coti_objheader_structure}