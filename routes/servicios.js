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
      db.find({"selector" : {"estado": estado}}, function(err, datos){
        if(err){
          console.log(err);
          reject(err);
        };
        var textocompleto = "";
        console.log(datos);
        datos.docs.forEach(function(row){
          resultados.textos.push({respuesta : row.respuesta});
        });
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
    db = Cloudant.db.use("resultadosfailinstitute");
    db.insert({estado:req.query.estado, tipo: "SentimentAnalisys", resultados : strAnalisis}, req.query.estado, function(err, body){
        if (err){
          console.log(err);
        }else{
          console.log(body);
        }
    });
    res.json(strAnalisis);
  }).catch(function(err){
    console.log(err);
  })
});
module.exports = router;
