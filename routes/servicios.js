var watson = require('watson-developer-cloud');
var express = require('express');
var router = express.Router();
var cfenv = require('cfenv');
var Cloudant = require('cloudant');
var appEnv = cfenv.getAppEnv();
var alchmyService = appEnv.getService("AlchemyAPI-7v");

var alchmyUrl = alchmyService.credentials.url;
var alchmyApiKey = alchmyService.credentials.apikey;

var cldntService = appEnv.getService("gfycloudantjs-cloudantNoSQLDB");

var cldntUsername = cldntService.credentials.username;
var cldntPassword = cldntService.credentials.password;
var clndtHost = cldntService.credentials.host;
var clndtPost = cldntService.credentials.port;
var cldntUrl = cldntService.credentials.url;

var cloudant = Cloudant(cldntUrl);
var db = cloudant.db.use("failureinstitute");

router.get('/resultados', function(req, res, next){
  var StringJson = {textos : []};
  var RespuestaJson = {};
  getRecords(function(StringJson){
    console.log("Resultados enviados");
    //res.json(StringJson);
    analizartexto(StringJson.texto, function(RespuestaJson){
      res.json(RespuestaJson);
    });
  });
});
function analizartexto(texto, callback){
  var resultados = {};
  var alchemy_language = watson.alchemy_language({
    api_key : alchmyApiKey
  })
  var parameters = {
    text : texto,
    knowledgeGraph : 1,
    linkedData : 0
  }
  alchemy_language.concepts(parameters, function(err, response){
    if(!err){
      resultados = response;
    };
  });
  callback(resultados);
};
function getRecords(callback){
  var resultados = {};
  db.list({sort: "estado",include_docs : true}, function(err, datos){
    var textocompleto = "";
    datos.rows.forEach(function(row){
        textocompleto += row.doc.respuesta;
        //resultados.textos.push({ estado : row.doc.estado,
        //                          respuesta : row.doc.respuesta});
    });
    resultados = {"texto": textocompleto};
    callback(resultados);
  });
};

module.exports = router;
