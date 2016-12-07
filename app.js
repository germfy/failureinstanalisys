/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var routes = require('./routes/servicios.js')
var express = require('express');
var cfenv = require('cfenv');

var appEnv = cfenv.getAppEnv();
var app = express();
//var watson = require('watson-developer-cloud');

// If no API Key is provided here, the watson-developer-cloud@2.x.x library will check for an ALCHEMY_LANGUAGE_API_KEY environment property and then fall back to the VCAP_SERVICES property provided by Bluemix.
//var alchemyLanguage = new watson.AlchemyLanguageV1({
// api_key: '<api-key>'
//});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.bodyParser());
/*
app.post('/api/:method', function(req, res, next) {
  var method = req.params.method;
  if (typeof alchemyLanguage[method] === 'function') {
    alchemyLanguage[method](req.body, function(err, response) {
      if (err) {
        return next(err);
      }
      return res.json(response);
    });
  } else {
    next({code: 404, error: 'Unknown method: ' + method });
  }
});
*/

app.use(function(err, req, res, next) {
	var error = {
		      code: err.code || 500,
		      error: err.error || err.message
		    };
	console.log('error:', error);
	res.status(error.code).json(error);
});

app.use('/', routes);

app.use(function(req, res, next) {
  console.log(req);
  var err = new Error('No encontrado');
  err.status = 404;
  next(err);
});

var server = app.listen(appEnv.port, appEnv.bind, function(){
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
