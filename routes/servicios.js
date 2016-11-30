var watson = require('watson-developer-cloud');
var express = require('express');
var router = express.Router();
var cfenv = require('cfenv');
var Cloudant = require('cloudant');
var Promise = require('promise');
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

  function getRecords(estado){
    return new Promise(function(resolve, reject){
      var resultados = { textos: [] };
      console.log("estdo", estado);
      db.find({"limit" : 3, "selector" : {"estado": estado}}, function(err, datos){
        if(err){
          console.log(err);
          reject(err);
        };
        var textocompleto = "";
        datos.rows.forEach(function(row){
        //textocompleto += row.doc.respuesta;
          resultados.textos.push({respuesta : row.doc.respuesta});
        });
        //resultados = {"texto": textocompleto};
        //console.log("Resultados de DB ", resultados);
        resolve(resultados);
      });
    })
  };

function analizartexto(texto){
  return new Promise(function(resolve, reject){
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
        console.log("Analisis de sentimiento ", response);
        resolve(response);
        //console.log(response);
      } else {
        console.log(err);
        reject(err);
      };
    });
  });
};

router.get('/resultados', function(req, res, next){
  var StringJson = {textos : []};
  var seqAnalisis = Promise.resolve();
  var strAnalisis = {analisis : []};

  getRecords(req.query.estado).then(function(datos){
    return datos.textos.reduce(function(seqAnalisis, texto){
      return seqAnalisis.then(function(){
        return analizartexto(texto.respuesta);
      }).then(function(analisis){
        strAnalisis.analisis.push({texto: texto.respuesta, sentimiento : analisis.docSentiment});
      });
    }, Promise.resolve());
  }).then(function(){
    res.json(strAnalisis);
  }).catch(function(err){
    console.log(err);
  })
});
  /*getRecords(StringJson).then(
    function(StringJson){
      console.log(StringJson);
    }//crearJson(StringJson)
  ).then(
    res.json(strAnalisis.analisis)
  );
});*/

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
  res.json(stringAnalisis);*






function crearJson(registros){
  return new Promise(function(resolve, reject){
    var stringAnalisis = {analisis : []};
    var RespuestaJson = {};
    console.log("Textos", registros.textos);

    registros.textos.forEach(function(texto){
        analizartexto(texto.respuesta).then(
          stringAnalisis.analisis.push({texto: texto.respuesta, sentimiento : RespuestaJson.docSentiment}));
      });
    });
    console.log("Analisis de textos ", stringAnalisis);
    resolve(stringAnalisis);
};*/

module.exports = router;
