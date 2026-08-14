require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
///talves sean utiles estos valores
const {familias} = require('../../id_nombres/lista')
const asignador_identificadores= require('../../funciones/asignador_indice_nombre')
const {api_generar_token} = require('./p_buscar_token')
/////////////////////////////
const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {parametro_validador} = require('../../funciones/param_verificador')

async function sincronizar_nuevos_productos(req,res,next) {
    try{
        const inicial_llamada= await api_generar_token();
        const primera_llamada= await obtenerpromesa_conexion();
        const segunda_llamada= await obtenerpromesa_consulta1(primera_llamada);
        ///la lista ya esta disponible solo falta el envio y el resultado esperado
        const tercera_llamada= await api_subir_nuevos_productos(inicial_llamada,segunda_llamada)
        // const cuarta_llamada= await obtenerpromesa_consulta2(tercera_llamada);
        res.status(200).json(tercera_llamada);

        // if(Array.isArray(cuarta_llamada)){
        //     res.status(200).json({
        //         "creados":cuarta_llamada[0],
        //         "fallados":cuarta_llamada[1]
        //     })
        // }else{ res.status(200).json(cuarta_llamada); }
        
    }
    catch(err){ 
        console.log(err);
        res.status(400).send(err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtenerpromesa_consulta1(conexion){
    return new Promise((resolve,reject)=>query_prd_lista(resolve,reject,conexion))
}
function obtenerpromesa_consulta2(msj){
    return new Promise((resolve,reject)=>reaccionar_a_mensaje(resolve,reject,msj))
}

function reaccionar_a_mensaje(resolve,reject,msj){
    // console.log("revisar el error de sincronizacion",msj);
    ///ahora si veremos como diseccionar el mensaje cuando tiene variaciones
    const posibles_codigos=[];
    if(msj["detalle_errores"].length>0){
        /////tiene un defecto la sincronizacion de los productos
        msj["detalle_errores"].forEach((item)=>{
            let temp=item.split(":");
            let codigo_ensi=temp[0].split(" ");
            posibles_codigos.push(codigo_ensi[1]);
        })
        ////el primer resultado es para los creados exitodos
        ////el segundo para ver los codigos que no arrojaron error
        resolve([msj["creados"],posibles_codigos]);

    }
    if(msj["detalle_errores"].length==0){
        ////todos los codigos fueron aceptados,entonces solo retornamos la cantidad de regresados
        const resumen={
            "mensaje":msj["mensaje"],
            "creados":msj["creados"]
        }
        // resolve(msj)
        resolve(resumen)
    }
}

async function api_subir_nuevos_productos(token,listado){
    try {
        // const api_impacto= "https://backimpacto.impacto.com.pe/ecommerce/products/sync_external_products/"
        const api_impacto= "https://backimpacto.impacto.com.pe/ecommerce/products/sync_external_products/"

        let de_prueba=listado

        const configuracion = {
            "method":"POST",
            "headers":{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            "body": JSON.stringify(de_prueba)
        }

        const api_call= await fetch(api_impacto,configuracion)

        if(!api_call.ok) {
            throw new Error(`llamada estado ${api_call.status}`)
        }

        const respuesta = await api_call.json();

        return respuesta;
        // res.status(200).json(respuesta)
        
    } catch (error) {
        // res.status(400).send(error);
        return error;
    }
}


let query_prd_lista = (resolve,reject,conexion)=>{
    
    let sp_sql="select a.Usr_001,a.codi AS part_code,a.descr AS name,ISNULL(CAST((a.pvus-(a.pvus*b.dscto_maxven/100.0)) AS DECIMAL(10,4)),0) AS price_sale,a.stoc AS stock,'4' AS store FROM prd0101 a left join ListaHp3 c on a.codi=c.codi LEFT JOIN Dtl_Dscto_Marca_Tc b ON a.codmar=b.codmar AND b.codtcl='F' WHERE a.Usr_001<>'' AND a.estado='1' AND LEFT(a.codi,2) IN ('10','01','09','02','11','12','06','04','05') AND (a.stoc-a.svta-a.pedi)>3 AND a.pvus>0 AND ISNULL(c.tipo,'') NOT IN ('08','01')";
    ///con esta consulta regulas cuantos productos quieres subir
    // let sp_sql="select a.Usr_001,a.codi AS part_code,a.descr AS name,ISNULL(CAST((a.pvus-(a.pvus*b.dscto_maxven/100.0)) AS DECIMAL(10,4)),0) AS price_sale,a.stoc AS stock,'4' AS store FROM prd0101 a left join ListaHp3 c on a.codi=c.codi LEFT JOIN Dtl_Dscto_Marca_Tc b ON a.codmar=b.codmar AND b.codtcl='F' WHERE a.Usr_001<>'' AND a.estado='1' AND LEFT(a.codi,2) IN ('10','01','09','02','11','12','06','04','05') AND (a.stoc-a.svta-a.pedi)>3 AND a.pvus>0 AND ISNULL(c.tipo,'') NOT IN ('08','01') ORDER BY LEFT(a.codi,4) asc OFFSET 125 ROWS FETCH NEXT 125 ROWS ONLY";
    
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            reject("error request");
        }
        else{
            // const cavecera=["part_code","name","price_sale","stock","store"];
            const cavecera=["part_code","code_external","name_store","price_sale","stock","store"];
            conexion.close();
            if(rows.length==0){
                // res.status(201).send("sin resultados?");
                reject("no registro");
            }
            else{
                let respuesta=[];
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        // typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        typeof data.value=='string' ? tmp[cavecera[contador]]=data.value.trim() : tmp[cavecera[contador]]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                // Object.assign(respuesta2,respuesta);
                resolve(respuesta);
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={sincronizar_nuevos_productos}