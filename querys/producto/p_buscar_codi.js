require('dotenv').config();
const {config,Connection,Request,TYPES} = require('../../conexion/cadena')

let bprd_codi = (req,res,next) => {
    //////////LA LONGUITUD DE LA CADENA SOLO PUEDE SER DE 11
    // let valid_coki = req.signedCookies;
    // let {c_ruc} = req.body;
    let c_ruc=req.params.id;
    // console.log(req.body)
    console.log(req.params)
    console.log(req.params.id)

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
    // let sp_sql="select codi,codf,descr,marc,stoc,vvus,Usr_001,codmar,Usr_016 from prd0101 where codi=@prdid";
    let sp_sql="select codi,codf,descr,marc,(CAST(stoc as int)-(CAST(svta as int)+CAST(pedi as int))),vvus,Usr_001,codmar,Usr_016 from prd0101 where codi=@prdid";
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
    consulta.addParameter('prdid',TYPES.VarChar,ruc);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

module.exports={bprd_codi}