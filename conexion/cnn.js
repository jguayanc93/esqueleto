const {config} = require('./cadena')
var Connection=require('tedious').Connection;

function conn(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{ resolve(conexion); }
    })
}

module.exports={conn}
// module.exports={Connection}