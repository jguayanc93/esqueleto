require('dotenv').config();

async function api_generar_token(){
    try {
        const api_impacto="https://backimpacto.impacto.com.pe/login/";
        ///credenciales de prueva
        // const de_prueba={ "username":"compudiskett",
        //     "password":"Compudiskett1!"
        // }
        ///credenciales de produccion
        const de_prueba={
            "username":"compudiskett",
            "password":"Avm56GLFS65qn#ZMwRH!%p"
        }
        const configuracion = {
            "method":"POST",
            "headers":{
                "Content-Type":"application/json"
            },
            "body": JSON.stringify(de_prueba)
        }
        const api_call= await fetch(api_impacto,configuracion)

        if(!api_call.ok) {
            throw new Error(`llamada estado ${api_call.status}`)
        }
        const respuesta = await api_call.json();
        ///retornaremos solo la propiedad token por ahora
        return respuesta["token"];
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

module.exports={api_generar_token}