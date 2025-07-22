const {TYPES} = require('../conexion/cadena')

const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ","mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura","cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];
const keys_valores_defecto={}
keys_valores_defecto.fecha='2025-07-21';
keys_valores_defecto.cdocu='31';
keys_valores_defecto.ndocu='009-0000000';///este se insertara de otra manera
keys_valores_defecto.nrefe='';
keys_valores_defecto.requ='';
keys_valores_defecto.flag='0';
keys_valores_defecto.codven='V0000';
keys_valores_defecto.cond='';
keys_valores_defecto.dura=10;
keys_valores_defecto.cOperacion='Nuevo';
keys_valores_defecto.estado='0';
keys_valores_defecto.obsere='Solicitud ya fue atendido por el BOT';
keys_valores_defecto.word=0;
keys_valores_defecto.obser2='';
keys_valores_defecto.dirent='';
keys_valores_defecto.codscc='00';
/////solo serviria creo para la creacion de la cabesera para nada mas
////pero se debe hacer dinamico tambien para el cuerpo
function coti_objheader_structure(paramsheader,ndocu,hoy){
    let ordenado={};
    let enviados=Object.keys(paramsheader);
    let defecto=Object.keys(keys_valores_defecto);
    ////aqui es donde fusiono los objetos para completarlos con sus respectivos valores
    for(const parametro of cabesera_keys){
        if(enviados.includes(parametro)){
            
            if(typeof paramsheader[parametro]=='string'){
                // if(paramsheader[parametro].length>2){
                //     ordenado[parametro]=['VarChar',paramsheader[parametro]];
                // }
                // else{ ordenado[parametro]=['Char',paramsheader[parametro]]; }
                // ordenado[parametro]=['Char',paramsheader[parametro]];
                ordenado[parametro]=[TYPES.Char,paramsheader[parametro]];
            }
            else if(typeof paramsheader[parametro]=='number'){
                // if(Number.isInteger(paramsheader[parametro])){ ordenado[parametro]=['Int',paramsheader[parametro]] } 
                // else{ ordenado[parametro]=['Float',paramsheader[parametro]] }
                ordenado[parametro]=[TYPES.Float,paramsheader[parametro]];
            }
        }
        else if(defecto.includes(parametro)){
            ////aqui inyectamos el correlativo
            if(parametro==='ndocu'){ ordenado[parametro]=[TYPES.Char,ndocu]; }
            else if(parametro==='fecha'){ ordenado[parametro]=[TYPES.DateTime,hoy[0]]; }
            else{
                if(typeof keys_valores_defecto[parametro]=='string'){
                    
                    if(keys_valores_defecto[parametro].length<1){
                        // ordenado[parametro]=['VarChar',keys_valores_defecto[parametro]];
                        ordenado[parametro]=[TYPES.Char,''];
                    }
                    else{ ordenado[parametro]=[TYPES.Char,keys_valores_defecto[parametro]]; }
                    // ordenado[parametro]=['Char',keys_valores_defecto[parametro]];
                }
                else if(typeof keys_valores_defecto[parametro]=='number'){
                    if(Number.isInteger(keys_valores_defecto[parametro])) ordenado[parametro]=[TYPES.Int,keys_valores_defecto[parametro]]
                    else{ ordenado[parametro]=[TYPES.Float,keys_valores_defecto[parametro]] }
                }
            }            
        }
    }
    ///////////////////
    return ordenado;
}

module.exports={coti_objheader_structure}