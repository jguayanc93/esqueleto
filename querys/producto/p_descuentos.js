require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {objepropiedades,multobjevacios} = require('../../funciones/objvacio')
const {query_validador,objeto_verificador_mejorado,objeto_verificador_mejorado_permitidos} = require('../../funciones/param_verificador')

let bprd_dscto = (req,res,next) => {
    //////extraer primero los parametros que sean correctos
    //////luego los querys que sean correctos
    console.log("param",req.params);
    console.log("query",req.query);
    ////validamos que no este vacio los 2 objetos
    if(multobjevacios(req.params,req.query)){
        // let param=objepropiedades(req.params);
        // let qs=objepropiedades(req.params);
        //////////primero validamos que los parametros pedidos sean los correctos
        if(objeto_verificador_mejorado_permitidos(req.params,0)){
            if(objeto_verificador_mejorado_permitidos(req.query,1)){
                bd_conexion(res,req.params.id,req.query.tipo,req.query.dsct);
            }
            else{
                res.status(400).send("parametro invalido");
            }
            // /////mal armado en esta parte
            // falta aun validar el contenido aun cuando los parametros sean correctos
        }
        else{
            res.status(400).send("parametros invalido");
        }
    }
    else{
        res.status(400).send("parametros invalido");
    }
}



let bd_conexion=(res,id,tipo,dsct)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,id,tipo,dsct);
        }
    });
}

let bd_c_query = (res,id,tipo,dsct)=>{
    
    let sp_sql="select a.codi,b.dscto_default from prd0101 a inner join dtl_dscto_marca_tc b on (b.codmar=a.codmar) where a.codi=@ide AND b.codtcl=@letra";
    if(dsct==="max") sp_sql="select a.codi,b.dscto_maxven from prd0101 a inner join dtl_dscto_marca_tc b on (b.codmar=a.codmar) where a.codi=@ide AND b.codtcl=@letra";
    
        
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
    consulta.addParameter('ide',TYPES.VarChar,id);
    consulta.addParameter('letra',TYPES.VarChar,tipo);
    conexion.execSql(consulta);
}

module.exports={bprd_dscto}