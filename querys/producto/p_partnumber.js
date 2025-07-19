require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

let bprd_partnumber = (req,res,next) => {

    console.log(req.query)
    let sugerencia=req.query.prtnb;
    /////validar la sugerencia con otra funcion
    
    bd_conexion(res,sugerencia);
}

let bd_conexion=(res,sugerencia)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,sugerencia);
        }
    });
}

let bd_c_query = (res,sugerencia)=>{
    let caracter="%"+sugerencia+"%";
    let sp_sql="select codi,descr,marc,(CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))as'stoc',Usr_001,codmar,Usr_016 from prd0101 where estado=1 AND Usr_001 like @pista";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            res.status(401).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                res.status(201).send("sin resultados?");
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
    consulta.addParameter('pista',TYPES.VarChar,caracter);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bprd_partnumber}