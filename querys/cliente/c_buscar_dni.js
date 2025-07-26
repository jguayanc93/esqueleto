require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

// let observador = (req,res,next) => objevacio(req.signedCookies) ? res.status(401).send("logeate") : next();

let bcli_dni = (req,res,next) => {
    
    
    let dni=req.params.id;
    /////validar el tipo de ruc con otra funcion
    let ruc_completado="DNI"+dni;
    console.log("esto estoi pasando a buscar",ruc_completado);
    bd_conexion(res,ruc_completado);
}

let bd_conexion=(res,dni)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,dni);
        }
    });
}

let bd_c_query = (res,dni)=>{
    // let sp_sql="select codcli,ruccli,nomcli,codcdv,tipocl from mst01cli where estado=1 AND codcli=@codcli";
    let sp_sql="select codcli,ruccli,nomcli from mst01cli where estado=1 AND ruccli=@dni";
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
    consulta.addParameter('dni',TYPES.VarChar,dni);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_dni}