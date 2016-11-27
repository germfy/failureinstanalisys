var watson = require('watson-developer-cloud');
var express = require('express');
var router = express.Router();
var cfenv = require('cfenv');
var Cloudant = require('cloudant');

router.get('/', function(req, res, next){
  var appEnv = cfenv.getAppEnv();
	var alchmyService = appEnv.getService("AlchemyAPI-7v");

	var alchmyUrl = appService.credentials.url;
  var alchmyApiKey = appService.credentials.apikey;

  var cldntService = appEnv.getService("gfycloudantjs-cloudantNoSQLDB");

  var cldntUsername = cloudantService.credentials.username;
  var cldntPassword = cloudantService.credentials.password;
  var clndtHost = cloudantService.credentials.host;
  var clndtPost = cloudantService.credentials.port;
  var cldntUrl = cloudantService.credentials.url;

  var cloudant = Cloudant(cldntUrl);
  var db = cloudant.db.use("failureinstitute");

  db.list(function(err,body){
    if(!err){
      body.rows.forEach(function(doc){
        console.log(doc);
      });
    });
  });
});
