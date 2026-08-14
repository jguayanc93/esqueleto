require('dotenv').config();

const {config,Connection,Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
///talves sean utiles estos valores
const {familias} = require('../../id_nombres/lista')
const asignador_identificadores= require('../../funciones/asignador_indice_nombre')
/////////////////////////////
const {objevacio,objepropiedades} = require('../../funciones/objvacio')
const {parametro_validador} = require('../../funciones/param_verificador')

async function coordinar_stock_productos(req,res,next) {
    try{
        const primera_llamada= await obtenerpromesa_conexion();
        const segunda_llamada= await obtenerpromesa_consulta1(primera_llamada);
        /////la lista ya esta disponible solo falta el envio y el resultado esperado
        const tercera_llamada= await api_subir_nuevos_productos(segunda_llamada)
        ///falta hacer con respecto ala refrescada de stock de nuestros productos
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


async function api_subir_nuevos_productos(listado){
    try {
        const api_impacto= "https://backimpacto.impacto.com.pe/ecommerce/products-test/update_stock_external_products/"
        
        // const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg1MzYxNDA1LCJpYXQiOjE3ODQ3NTY2MDUsImp0aSI6IjRkMDQzZWY2YWY3NTRlNmM5YjEwZThlNDAwNDVhOGM4IiwidXNlcl9pZCI6NH0.NsJ69wvFXxcHZS3EIyiVIEOqXjT476564cHbvWDd8vk";
        const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg1NTEzNjQzLCJpYXQiOjE3ODQ5MDg4NDMsImp0aSI6IjFkODc3ZTRhOTI5NzQwYmViZTczY2M4ZjVkMzUwNjA0IiwidXNlcl9pZCI6NH0.KA8ibTRn08A5waPV_puh-kyzYVvCkSbRZC4SSR0PdA0"

        let de_prueba=listado

        const configuracion = {
            "method":"PUT",
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
    // let sp_sql="select top 1 Usr_001,codi as'part_code', descr as 'name' , isnull(cast((a.pvus-(a.pvus*b.dscto_maxven/100)) as decimal(10,4)),0) as 'price_sale', stoc as 'stock','2' as 'store' from prd0101 a  left join Dtl_Dscto_Marca_Tc b on  a.codmar=b.codmar and b.codtcl='F' where a.estado ='1' and left(a.codi,2) in ('10','01','09','02','11','12','06','04','05') and  (stoc-svta-pedi)>3 and pvus>0";
    let sp_sql="select top 3 Usr_001 as 'part_code' , stoc as 'stock','4' as 'store' from prd0101 a  left join Dtl_Dscto_Marca_Tc b on  a.codmar=b.codmar and b.codtcl='F' where a.estado ='1' and left(a.codi,2) in ('10','01','09','02','11','12','06','04','05') and (stoc-svta-pedi)>3 and pvus>0";
    
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            /////validar la respuesta en de error de servidor
            conexion.close();
            reject("error request");
        }
        else{
            // const cavecera=["part_code","name","price_sale","stock","store"];
            const cavecera=["part_code","stock","store"];
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
                console.log(respuesta)
                resolve(respuesta);
            }
        }
    })
    conexion.execSql(consulta);
}


module.exports={coordinar_stock_productos}