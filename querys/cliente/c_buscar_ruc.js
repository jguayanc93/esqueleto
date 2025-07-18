require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

// let observador = (req,res,next) => objevacio(req.signedCookies) ? res.status(401).send("logeate") : next();

let bcli_ruc = (req,res,next) => {
    //////////LA LONGUITUD DE LA CADENA SOLO PUEDE SER DE 11
    // let valid_coki = req.signedCookies;
    let ruc=req.params.id;
    /////validar el tipo de ruc con otra funcion
    bd_conexion(res,ruc);
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
    // let sp_sql="select codcli,ruccli,nomcli,codcdv,tipocl from mst01cli where estado=1 AND codcli=@codcli";
    let sp_sql="select codcli,ruccli,nomcli from mst01cli where estado=1 AND ruccli=@ruc";
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
                res.status(400).send("no registrado");
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
    consulta.addParameter('ruc',TYPES.VarChar,ruc);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_ruc}