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

async function listado_impacto_productos(req,res,next) {
    try{
        // const segunda_llamada= await obtenerpromesa_consulta1(primera_llamada);
        const inicial_llamada= await api_generar_token();
        /////la lista ya esta disponible solo falta el envio y el resultado esperado
        const tercera_llamada= await api_subir_nuevos_productos(inicial_llamada)
        // const cuarta_llamada= await obtenerpromesa_consulta2(tercera_llamada);
        
        // const primera_llamada= await obtenerpromesa_conexion();
        // ///conexion,total de productos,productos en array de objetos
        // const segunda_llamada= await obtenerpromesa_consulta1(primera_llamada,cuarta_llamada[0],cuarta_llamada[1]);//cantidad
        // ////RECUERDA QUE EN SEGUNDA_LLAMADA.retirar son los productos que deberias actualisar para dejarlo par
        // ///si es necesario crea una funcion extra para mandarlo a actualisar en su tienda
        // // const quinta_llamada= await 

        // res.status(200).json(segunda_llamada);
        res.status(200).json(tercera_llamada);
        
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function obtenerpromesa_consulta1(conexion,cantidad,productos){
    return new Promise((resolve,reject)=>bucle_listado(resolve,reject,conexion,cantidad,productos))
}
function obtenerpromesa_consulta2(msj){
    return new Promise((resolve,reject)=>reaccionar_a_mensaje(resolve,reject,msj))
}

function reaccionar_a_mensaje(resolve,reject,msj){
    ///ahora veremos que hacemos con la respuesta de los productos de nosotros en su tienda
    const mostrador_online=msj["total_productos"];///para ver el numero que tiene    
    const productos=msj["productos"]//el listado de productos en un array
    ///podria comparar el precio y el stock del listado con el que tengo en este momento en la BD
    ///primero voi a pasar un filtro para kitar los que no son codi
    const validos=[];
    productos.forEach((item)=>{
        if(typeof item["code_external"]==='string'){
            if(item["code_external"].length==11){
                validos.push(item)
                //podriamos tambien guardar tambien el indice que corresponde para ubicar mejor su posicion
            }
        }        
    })
    ////ahora lo q tendremos que hacer es comparar precios y stock del momento
    resolve([mostrador_online,validos])
}


async function api_subir_nuevos_productos(token){
    try {
        // const api_impacto= "https://backimpacto.impacto.com.pe/ecommerce/products-test/list_products_by_store_dolares/?store=4"
        const api_impacto= "https://backimpacto.impacto.com.pe/ecommerce/products/list_products_by_store_dolares/?store=4"

        const configuracion = {
            "method":"GET",
            "headers":{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        const api_call= await fetch(api_impacto,configuracion)

        if(!api_call.ok) {
            throw new Error(`llamada estado ${api_call.status}`)
        }

        const respuesta = await api_call.json();

        return respuesta;
        
    } catch (error) {
        // res.status(400).send(error);
        return error;
    }
}

let bucle_listado = (resolve,reject,conexion,cantidad,productos)=>{
    let contador=0;
    const revision={};
    const retirar={};
    // for(let indice in productos){}
    query_prd_lista(resolve,reject,conexion,productos,productos.length,contador,revision,retirar)
}

let query_prd_lista = (resolve,reject,conexion,productos,longuitud,contadorr,revision,retirar)=>{
    if(longuitud<=contadorr){
        conexion.close();
        const analisado={
            "retirar":retirar,
            "revisar":revision
        }
        resolve(analisado);///los item q an cambiado el precio/los items ya desfasados con la BD
    }else{
        let sp_sql="select Usr_001,codi as 'code_external', descr as 'name_store' ,isnull(cast((a.pvus-(a.pvus*b.dscto_maxven/100)) as decimal(10,3)),0) as 'price_sale', stoc as 'stock','4' as 'store' from prd0101 a  left join Dtl_Dscto_Marca_Tc b on  a.codmar=b.codmar and b.codtcl='F' where a.estado ='1' and left(a.codi,2) in ('10','01','09','02','11','12','06','04','05') and (stoc-svta-pedi)>3 and pvus>0 AND a.codi=@codid";

        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                /////validar la respuesta en de error de servidor
                conexion.close();reject("error request");
            }
            else{
                if(rows.length==0){
                    ///cuidado porqe si podria dar 0 resultados
                    retirar[productos[contadorr]["code_external"]]={
                        "id":productos[contadorr]["id"],
                        "code_external":productos[contadorr]["code_external"],
                        "name_store":productos[contadorr]["name_store"],
                        "stock_tienda":productos[contadorr]["stock"],
                        "stock_ahora":0,
                        "part_code":productos[contadorr]["part_code"],
                        "precio_tienda":productos[contadorr]["price_sale"],
                        "precio_ahora":productos[contadorr]["price_sale"]
                    }
                    query_prd_lista(resolve,reject,conexion,productos,longuitud,contadorr+1,revision,retirar)
                }
                else{
                    let respuesta=[];
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
                    ///aqui es donde tendremos que revisar y contruir el objeto si no concuerda
                    ////primero lo mas facil el precio
                    console.log("lo que busco",respuesta[0][3])
                    console.log("lo que tenia",productos[contadorr]["price_sale"])
                    if(Number(respuesta[0][3].toFixed(2)) != productos[contadorr]["price_sale"]){
                        revision[productos[contadorr]["code_external"]]={
                            "id":productos[contadorr]["id"],
                            "code_external":productos[contadorr]["code_external"],
                            "name_store":productos[contadorr]["name_store"],
                            "stock_tienda":productos[contadorr]["stock"],
                            "stock_ahora":respuesta[0][4],
                            "part_code":productos[contadorr]["part_code"],
                            "precio_tienda":productos[contadorr]["price_sale"],
                            "precio_ahora": respuesta[0][3]
                        }
                    }
                    query_prd_lista(resolve,reject,conexion,productos,longuitud,contadorr+1,revision,retirar)
                }
            }
        })
        consulta.addParameter('codid',TYPES.Char,productos[contadorr]["code_external"]);
        conexion.execSql(consulta);
    }    
}

module.exports={listado_impacto_productos}