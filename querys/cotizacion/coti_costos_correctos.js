const {Connection,Request,TYPES} = require('../../conexion/cadena')
const {coti_objbody_structure} = require('../../funciones/coti_detallado_addparam_obj')

function query_costos(resolve,reject,req,conexion,correlativo,fecha){
    let valores_parseados2=coti_objbody_structure(req.body["detallado"],correlativo,fecha);
    let codis=[];
    for(const indice in valores_parseados2){
        if(Object.keys(valores_parseados2[indice]).includes("codi")){
            codis.push(valores_parseados2[indice]["codi"][1]);
        }
    }
    ////conseguir este formato ('0506-015125','0506-015126')
    let contador=1;
    let formato_codis="(";
    for(const ide of codis){
        formato_codis+="'"+ide+"'";
        if(codis.length>contador){ formato_codis+=","; }
        contador++;
    }
    formato_codis+=")";

    let sql="select codi,pcus from prd0101 where codi in ";
    let sp_sql=sql+=formato_codis;
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            console.log(err)
            reject("update correlativo error");
        }
        else{
            conexion.close();
            if(rows.length==0){
                /////validar la respuesta en caso de no encontrar nada
                reject("codis no validos");
                // res.status(200).send("codis no existen");
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
                // console.log(respuesta2);
                resolve(respuesta2);
                // res.status(200).json(respuesta2);
            }
        }
    })
    // consulta.addParameter('correlativo',TYPES.VarChar,correlativo);
    conexion.execSql(consulta);
}

module.exports={query_costos}