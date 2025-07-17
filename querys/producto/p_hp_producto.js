require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

const {objeto_verificador_mejorado,objeto_verificador_mejorado_permitidos} = require('../../funciones/param_verificador')

let bprd_hp_cliente = (req,res,next) => {
    
    let codi=req.params.id;
    bd_conexion(res,codi);
}



let bd_conexion=(res,codi)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,codi);
        }
    });
}

let bd_c_query = (res,codi)=>{
    let sp_sql="select codi,(CASE tipo when '08' then 'suministros' when '01' then 'plotter' end)as'tipo' from listaHp3 where codi=@ide";
        
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
                res.status(200).send("producto libre");
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
    conexion.execSql(consulta);
}

module.exports={bprd_hp_cliente}