
let permitidos=["01","02","04","05","06","09","10","11","12"];

let querypermitidos=["fam","sbfam","stoc"];

const parametro_validador = (req,parametros,param) => {
    if(parametros.includes(param)){
        if(req.params[param].length!==2){
            return "invalido";
        }
        else{
            if(isNaN(req.params[param])){
                // res.status(400).send("parametro debe ser un codigo valido");
                return "invalido";
            }
            else{
                ///////////aqui hay un bug de busqueda porque solo funciona con la familia no con el resto
                // if(permitidos.includes(req.params[param])){
                //     return "next";
                // }
                // else{ return "invalido"; }
                ///////////////////////////////////////
                //ESTO SERIA PARA SUBSANAR ESE BUG
                if(param==="catID"){
                    if(permitidos.includes(req.params[param])){
                        return "next";
                    }
                    else{ return "invalido"; }
                }
                else{
                    return "next";
                }
            }
        }
    }
    else{
        return "invalido";
    }
}

const qs_validador = (req,parametros,qs) => {
    if(parametros.includes(qs)){
        if(req[qs].length!==2){///////aqui dice que este es el problema
            return "invalido";
        }
        else{
            if(isNaN(req[qs])){
                return "invalido";
            }
            else{
                if(qs==="fam"){
                    if(permitidos.includes(req[qs])){
                        ////aplicar conexion o pasar al next
                        return "next";
                    }
                    else{
                        // res.status(400).send("parametro invalido");
                        return "invalido";
                    }
                }
                else{
                    //////////aQUIE ESTA LA DUDA
                    ///SOLUCION TEMPORAL REVISAR LUEGO PORQUE PUEDE TENER VARIOS NUMEROS
                    return "next";
                }
            }
        }
    }
}

const parametros_todos_validador = (queryobj,parametros) => {
    let observados=[];

    for(const qs of parametros){
        observados.push(qs_validador(queryobj,parametros,qs));
    }

    if(observados.includes("invalido")){
        return "invalidos";
    }
    else{
        return "validos";
    }

}

const query_validador = (queryobj,parametros) => {

    ////////////////NECESITO UN FOR PARA EXTRAER TODOS Y VERIFICAR LOS QUETRYS VALIDOS
    let querys_filtrados=[];
    /////podria de frende saber los valores en lugar de recorrerlos
    for(let qs of parametros){
        if(querypermitidos.includes(qs)){
            if(qs==="stoc"){
                let stoc_numero = queryobj[qs]==='01' ? 1 : 0;
                querys_filtrados.push(stoc_numero)
            }
            else{
                querys_filtrados.push(queryobj[qs])
            }            
        }
    }

    if(querypermitidos.length===querys_filtrados.length){
        return querys_filtrados;
    }
    else{
        return "incompleto";
    }
}

module.exports={parametro_validador,qs_validador,parametros_todos_validador,query_validador}