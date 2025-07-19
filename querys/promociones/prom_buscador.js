require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

let prom_search = (req,res,next) => {
    console.log("param",req.params);
    console.log("query",req.query);
    
    let codi=req.params.id;
    let cliente=req.query.cliente;

    bd_conexion(res,codi,cliente);
}


let bd_conexion=(res,codi,cliente)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,codi,cliente);
        }
    });
}

let bd_c_query = (res,codi,cliente)=>{
    // let sp_sql="select codcli,ruccli,nomcli,ISNULL((CASE WHEN codcat='08' THEN 'SUMINISTROS HABILITADO' WHEN codcat<>'08' THEN 'NO HABILITADO' END),'NO HABILITADO'),ISNULL((CASE Usr_001 WHEN '1' THEN 'PLOTTER HABILITADO' END),'NO HABILITADO') from mst01cli where codcli=@cli";
    let sp_sql="";
        
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
                res.status(500).send("sin resultados?");
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
    consulta.addParameter('ide',TYPES.VarChar,codi);
    consulta.addParameter('cli',TYPES.VarChar,cliente);
    conexion.execSql(consulta);
}

module.exports={prom_search}