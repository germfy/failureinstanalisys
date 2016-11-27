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

var cldntUsername = cloudantService.credentials.username;
var cldntPassword = cloudantService.credentials.password;
var clndtHost = cloudantService.credentials.host;
var clndtPost = cloudantService.credentials.port;
var cldntUrl = cloudantService.credentials.url;

var cloudant = Cloudant(cldntUrl);
var db = cloudant.db.use("failureinstitute");

router.get('/', function(req, res, next){
  var StringJson = {textos : []};
  getRecords(function(StringJson){
    console.log("Resultados enviados");
    res.json(StringJson.textos);
  });
});

function getRecords(callback){
  var resultados = {resultados :[]};
  db.list({include_docs : true}, function(err, datos){
    datos.rows.forEach(function(row){
        resultados.equipos.push({ estado : row.doc.estado,
                                  respuesta : row.doc.respuesta});
    });
    callback(resultados);
  });
};
