
const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ"
    ,"mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura",
    "cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];

function cabecera_estructura(resolve,reject,req){
    /////CREAR EL FORMATO PARA LA CABECERA
    //////TENGO QUE HACER UNA BUSQUEDA COMPLETA PARA SACAR EL RESTO DEL PROPIO CLIENTE
    req.cabecera={};
    req.cabecera["fecha"]="hoy dia";
    req.cabecera["cdocu"]="31";
    req.cabecera["ndocu"]="documento";
    req.cabecera["codcli"]=req.body.coti.codcli;
    req.cabecera["nomcli"]="nombre";
    req.cabecera["ruccli"]="ruc";
    req.cabecera["atte"]=req.body.coti.atencion;
    req.cabecera["nrefe"]="";
    req.cabecera["requ"]="";
    req.cabecera["mone"]=req.body.coti.moneda;
    req.cabecera["tcam"]=req.body.coti.tcam;
    req.cabecera["tota"]="tota";
    req.cabecera["toti"]="toti";
    req.cabecera["totn"]="totn";
    req.cabecera["flag"]="0";
    req.cabecera["codven"]="V0000";
    req.cabecera["codcdv"]="tipo de pago";
    req.cabecera["cond"]="";
    req.cabecera["fven"]="fecha vencida";
    req.cabecera["dura"]=10;
    req.cabecera["cOperacion"]="Nuevo";
    req.cabecera["obser"]="";
    req.cabecera["estado"]="";
    req.cabecera["obsere"]="solicitud ya fue atendida por el BOT";
    req.cabecera["word"]=0;
    req.cabecera["obser2"]="";
    req.cabecera["dirent"]="";
    req.cabecera["codscc"]="00";
    ///////
    resolve(req.cabecera);
}

module.exports={cabecera_estructura}