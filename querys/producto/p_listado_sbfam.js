require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {parametros_todos_validador,query_validador} = require('../../funciones/param_verificador')

let bprd_list = (req,res,next) => {
    console.log("query",req.query);
    
    /////////NUEVO METODO FUNCIONAL
    if(!objevacio(req.query)){
        let parametros=objepropiedades(req.query);////VALIDO HASTA AQUI
        let validados=parametros_todos_validador(req.query,parametros);
        /////////solo debolver los correctos y constatados
        if(validados==="validos"){

            let verificacion=query_validador(req.query,parametros)

            if(Array.isArray(verificacion)){
                bd_conexion(res,...verificacion);
            }
            else{
                res.status(400).send("parametros invalido");
            }
        }
        else{
            res.status(400).send("parametros invalido");
        }
    }
    /////////////revisar el listado completo aunqe no deberia arrojar nada
    else{
        res.status(400).send("parametros invalido");
    }
}

let bd_conexion=(res,fam,sbfid,stoc)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,fam,sbfid,stoc);
        }
    });
}

let bd_c_query = (res,fam,sbfid,stoc)=>{
    console.log("este es el stock",stoc);
    console.log(stoc===true);
    let grupo=fam+sbfid;
    let sp_sql="select codi,codf,descr,marc,(CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))as'stoc',vvus,Usr_001,codmar,Usr_016 from prd0101 where estado=1 AND LEFT(codi,4)=@listgrp";
    if(stoc){
        sp_sql+=" AND (CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))>@stok";
    }
    else{ sp_sql+=" AND (CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int)))<=@stok"; }
    
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
    consulta.addParameter('listgrp',TYPES.VarChar,grupo);
    consulta.addParameter('stok',TYPES.Int,stoc);
    conexion.execSql(consulta);
}

module.exports={bprd_list}