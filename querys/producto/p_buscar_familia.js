require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {parametro_validador} = require('../../funciones/param_verificador')

let bprd_fam = (req,res,next) => {
    ////VALIDAR SI LA PETICION TIENE PARAMETROS
    if(!objevacio(req.params)){
        /////////NUEVA RESPUESTA
        let parametros=objepropiedades(req.params);
        let verificacion=parametro_validador(req,parametros,"catID")
        if(verificacion==="next"){
            bd_conexion(res,req.params["catID"]);
        }
        else{
            res.status(400).send("parametro invalido");
        }
    }
    ////VALIDAR SI LA PETICION NO TIENE PARAMETROS
    else{
        bd_conexion(res);
    }
}

let bd_conexion=(res,fam="nada")=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            if(fam!=="nada"){bd_c_query2(res,fam);}
            else{
                bd_c_query(res,fam);
            }
        }
    });
}

let bd_c_query = (res,fam)=>{
    let sp_sql="select codfam,nomfam from tbl01fam where codfam in ('01','02','04','05','06','09','10','11','12') order by codfam";
    
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
                // console.log(respuesta);
                Object.assign(respuesta2,respuesta);
                res.status(200).json(respuesta2);
            }
        }
    })
    conexion.execSql(consulta);    
}

let bd_c_query2 = (res,fam)=>{

    let sp_sql="select codfam,nomfam from tbl01fam where codfam=@famid";
    
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
    consulta.addParameter('famid',TYPES.VarChar,fam);
    conexion.execSql(consulta);
}

module.exports={bprd_fam}