require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

////////////////VALIDAR LOS VALORES ENTREGADOS
const cabesera_keys=["fecha","cdocu","ndocu","codcli","nomcli","ruccli","atte","nrefe","requ","mone","tcam","tota","toti","totn","flag","codven","codcdv","cond","fven","dura","cOperacion","obser","estado","obsere","word","obser2","dirent","codscc"];
const cuerpo_keys=["fecha","cdocu","ndocu","codcli","tcam","mone","moneitm","aigv","item","codi","codf","marc","umed","descr","cant","preu","tota","dsct","totn","AnulaDetalle","codalm","cost","msto"];

async function cotizacion_crear_llamar(req,res,next){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        const segunda_llamada=await obtenerpromesa_consulta1(req,res,primera_llamada);
        const tercera_llamada=await obtenerpromesa_conexion();
        const cuarta_llamada=await obtenerpromesa_consulta3(req,res,tercera_llamada,segunda_llamada);
        console.log(segunda_llamada);
    }
    catch(err){
        console.log(err);
        res.status(400).send("parametros invalido");
    }
}

function obtenerpromesa_conexion(){
    return new Promise((resolve,reject)=>conn_llamada(resolve,reject))
}

function conn_llamada(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{ resolve(conexion); }
    })
}

function obtenerpromesa_consulta1(req,res,conexion,ndocu){
    return new Promise((resolve,reject)=>query_numero_documento(resolve,reject,req,res,conexion))
}

// function obtenerpromesa_consulta2(req,res,conexion){
//     return new Promise((resolve,reject)=>query_llamada(resolve,reject,req,res,conexion))
// }

function obtenerpromesa_consulta3(req,res,conexion,ndocu){
    return new Promise((resolve,reject)=>query_llamada(resolve,reject,req,res,conexion,ndocu))
}

function query_numero_documento(resolve,reject,req,res,conexion){
    let sp_sql="select top 1 RIGHT(ndocu,8) as nroactual from mst01cot where LEFT(ndocu,3)='009' order by RIGHT(ndocu,8) desc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error en la consulta de pedir el numero de coti actual")
            // res.status(401).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                res.status(400).send("sin resultados? en la busqueda del ndocu");
            }
            else{
                let comodin="009-00";
                let n_actual = parseInt(rows[0][0]["value"]);
                let n_calcular=n_actual+1;
                let formato=comodin+n_calcular.toString();
                // res.status(400).json({"ndocu":formato});
                resolve(formato);
            }
        }
    })
    conexion.execSql(consulta);
}

function query_llamada(resolve,reject,req,res,conexion,ndocu){
    let valores_a_pasar=Object.values(req.body);
    
    let sp_sql="GrabaMstCotFac";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            res.status(500).send("error interno");
            reject("sin exito de consulta")
        }
        else{
            conexion.close();
            res.status(200).send("creado con exito");
            resolve("exito el regreso");
        }
    })
    consulta.addParameter(cabesera_keys[0],TYPES.DateTime,'2025-07-18');
    consulta.addParameter(cabesera_keys[1],TYPES.Char,'31');
    consulta.addParameter(cabesera_keys[2],TYPES.Char,ndocu);
    consulta.addParameter(cabesera_keys[3],TYPES.Char,req.body.codcli);
    consulta.addParameter(cabesera_keys[4],TYPES.Char,req.body.nomcli);
    consulta.addParameter(cabesera_keys[5],TYPES.Char,req.body.ruccli);
    consulta.addParameter(cabesera_keys[6],TYPES.Char,req.body.atte);
    consulta.addParameter(cabesera_keys[7],TYPES.Char,'');
    consulta.addParameter(cabesera_keys[8],TYPES.Char,'');
    consulta.addParameter(cabesera_keys[9],TYPES.Char,req.body.mone);
    consulta.addParameter(cabesera_keys[10],TYPES.Float,req.body.tcam);
    consulta.addParameter(cabesera_keys[11],TYPES.Float,req.body.tota);
    consulta.addParameter(cabesera_keys[12],TYPES.Float,req.body.toti);
    consulta.addParameter(cabesera_keys[13],TYPES.Float,req.body.totn);
    consulta.addParameter(cabesera_keys[14],TYPES.Char,req.body.flag);
    consulta.addParameter(cabesera_keys[15],TYPES.VarChar,'V0261');
    consulta.addParameter(cabesera_keys[16],TYPES.VarChar,req.body.codcdv);
    consulta.addParameter(cabesera_keys[17],TYPES.Char,'');
    consulta.addParameter(cabesera_keys[18],TYPES.VarChar,'2025-07-19');///cuidado con este
    consulta.addParameter(cabesera_keys[19],TYPES.Float,10);
    consulta.addParameter(cabesera_keys[20],TYPES.Char,'Nuevo');
    consulta.addParameter(cabesera_keys[21],TYPES.Char,'');///observacion opcional del cliente
    consulta.addParameter(cabesera_keys[22],TYPES.Char,'0');
    consulta.addParameter(cabesera_keys[23],TYPES.Char,'');
    consulta.addParameter(cabesera_keys[24],TYPES.Int,0);
    consulta.addParameter(cabesera_keys[25],TYPES.Char,'');
    consulta.addParameter(cabesera_keys[26],TYPES.VarChar,'');
    consulta.addParameter(cabesera_keys[27],TYPES.Char,'00');
    conexion.callProcedure(consulta);
    // conexion.execSql(consulta);
}



let coti_crear = (req,res,next) => {
    // let valid_coki = req.signedCookies;    
    console.log(req.body)
    res.json(req.body)

    // bd_conexion(res,req.body)
}

let bd_conexion=(res,ruc)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,ruc);
        }
    });
}

let bd_c_query = (res,ruc)=>{
    let sp_sql="select GETDATE()";
    // let sp_sql="GrabaMstCotFac";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            res.status(500).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                res.status(200).send("creado satisfactoriamente");
            }
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                Object.assign(respuesta2,respuesta);
                res.status(200).json(respuesta2);
            }
        }
    })
    // consulta.addParameter('prdid',TYPES.VarChar,ruc);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={coti_crear,cotizacion_crear_llamar}