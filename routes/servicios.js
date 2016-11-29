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



  getRecords(function(StringJson){
    var strAnalisis = {analisis : []};
    crearJson(StringJson, function(strAnalisis){
      console.log("Resultados de datos", StringJson.textos);
      res.json(strAnalisis.analisis);
    });
    //console.log("Analisis del texto", stringAnalisis.analisis);

  });
});

  /*
  getRecords(function(StringJson, callback){
    var stringAnalisis = {analisis : []};
    console.log("Resultados enviados");
    //res.json(StringJson);
    StringJson.textos.forEach(function(rows){
      analizartexto(rows.respuesta, function(RespuestaJson){
        //console.log(RespuestaJson);
        //stringAnalisis += RespuestaJson;
        stringAnalisis.analisis.push(RespuestaJson.docSentiment);
        console.log("Dentro de for each " + stringAnalisis.analisis);
      });
    });
    callback(stringAnalisis);
    console.log("Dentro de getRecord" + stringAnalisis);

    /*console.log(StringJson.texto);
    analizartexto(StringJson.texto, function(RespuestaJson){
      console.log(RespuestaJson);
      res.json(RespuestaJson);
    });*

  });
  res.json(stringAnalisis);*/


function analizartexto(texto, callback){
  var resultados = {};
  var alchemy_language = watson.alchemy_language({
    //api_key : alchmyApiKey
    api_key : "05685348fec9c4ff8cc85a35303499ec178ad0ae"
  });
  var parameters = {
    text : texto,
    max_items : 150,
    linked_data : 0,
    emotion : 1,
    sentiment : 1
  };
  alchemy_language.sentiment(parameters, function(err, response){
    if(!err){
      callback(response);
      //console.log(response);
    } else {
      console.log(err);
    };
  });
};

function getRecords(callback){
  var resultados = { textos: [] };
  db.list({sort: "estado", limit : 2, include_docs : true, selector : {estado: "Aguscalientes"}}, function(err, datos){
    var textocompleto = "";
    datos.rows.forEach(function(row){
        //textocompleto += row.doc.respuesta;
        resultados.textos.push({respuesta : row.doc.respuesta});
    });
    //resultados = {"texto": textocompleto};
    callback(resultados);
  });
};

function crearJson(registros, callback){
  var stringAnalisis = {analisis : []};
  var RespuestaJson = {};
  registros.textos.forEach(function(renglones){
    analizartexto(renglones.respuesta, function(RespuestaJson){
      stringAnalisis.analisis.push({texto: renglones.respuesta, sentimiento : RespuestaJson.docSentiment});
      //console.log("Dentro de analizar texto" + JSON.stringify(RespuestaJson));

    });
  });
  console.log("Analisis del texto", stringAnalisis.analisis);
  callback(stringAnalisis);
};

module.exports = router;
