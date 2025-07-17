require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {query_validador,objeto_verificador_mejorado,objeto_verificador_mejorado_permitidos} = require('../../funciones/param_verificador')

let bprd_hp = (req,res,next) => {
    console.log("param",req.params);
    console.log("query",req.query);
    
    /////////NUEVO METODO FUNCIONAL
    if(!objevacio(req.params)){

        if(!objevacio(req.query)){
            if(objeto_verificador_mejorado_permitidos(req.params,0)){}
            else{
                res.status(400).send("parametro invalido");
            }
        }
        else{
            if(objeto_verificador_mejorado_permitidos(req.params,0)){
                bd_conexion(res,req.params.id);
            }
            else{
                res.status(400).send("parametro invalido");
            }
        }
    }
    else{
        res.status(400).send("parametros invalido");
    }
}



let bd_conexion=(res,id)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,id);
        }
    });
}

let bd_c_query = (res,id)=>{
    let sp_sql="select codi,descr,marc,(CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int))),vvus,Usr_001,codmar,Usr_016 from prd0101 where codi=@ide";
        
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
    conexion.execSql(consulta);
}

module.exports={bprd_hp}