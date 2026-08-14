///lista de paths de rutas
const autenticacion = require('../entry/token');
const producto=require('../producto/producto');
const cliente=require('../cliente/cliente');
const tipo_cambio=require('../tipocambio/tipo_cambio');
const promos=require('../promociones/promocion');
const cotizacion=require('../cotizacion/cotizacion');

module.exports={autenticacion,producto,cliente,tipo_cambio,promos,cotizacion}