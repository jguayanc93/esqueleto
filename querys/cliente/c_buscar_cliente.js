require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

// let observador = (req,res,next) => objevacio(req.signedCookies) ? res.status(401).send("logeate") : next();

let bcli_ruc = (req,res,next) => {
    //////////LA LONGUITUD DE LA CADENA SOLO PUEDE SER DE 11
    // let valid_coki = req.signedCookies;
    // let {c_ruc} = req.body;
    let c_ruc=req.params.id;
    // console.log(req.body)
    console.log(req.params)
    console.log(req.params.id)
    console.log(typeof req.params.id)

    console.log(req.query)
    /////validar el tipo de ruc con otra funcion
    // typeof vendedor_data=='string' ? bd_conexion(res,sugerencia) : res.status(401).send(vendedor_data);

    typeof c_ruc=='string' ? bd_conexion(res,c_ruc): res.status(401).send("falla en el ruc");

}

let bd_conexion=(res,ruc)=>{
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
        }
        else{
            bd_c_query(res,ruc);
        }
    });
}

let bd_c_query = (res,ruc)=>{
    // let caracter="%"+sugerencia+"%";
    // let sp_sql="select top 4 codcli,nomcli from mst01cli where estado=1 and nomcli like @pista";
    // let sp_sql="select ruccli,nomcli,codcdv,tipocl,codcat,Usr_001 from mst01cli where ruccli=@c_ruc";
    let sp_sql="select ruccli,nomcli,codcdv,tipocl from mst01cli where ruccli=@c_ruc";
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
                console.log(respuesta);
                Object.assign(respuesta2,respuesta);
                // let cadenitajson=JSON.stringify(respuesta2);
                // res.status(200).json(cadenitajson);
                res.status(200).json(respuesta2);
            }
        }
    })
    consulta.addParameter('c_ruc',TYPES.VarChar,ruc);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bcli_ruc}