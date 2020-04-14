// content of server.js
/*const http = require('http')
const port = 4040
// Basic setup for Inbound VGS
const inboundRequest = require('request');

inboundRequest({
    url: 'https://tntatslcyfg.SANDBOX.verygoodproxy.com/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'cc' : '1234567890123456','exp' : '12/21','cvv' : '123'})
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log('Status:', response.statusCode);
      console.log(JSON.parse(body));
    }
});

const server = http.createServer(inboundRequest)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
*/
// Basic setup for Outbound VGS
const fs = require('fs');
const request = require('request');
const tunnel = require('tunnel');

/**
 * NODE_TLS_REJECT_UNAUTHORIZED used to allow self signed certificate
 * setting it to 0 on live environments is insecure
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const tunnelingAgent = tunnel.httpsOverHttp({
    ca: [ fs.readFileSync('cert.pem')],
    proxy: {
        host: 'tntatslcyfg.sandbox.verygoodproxy.com',
        port: 8080,
        proxyAuth: 'USdjgs2AizRawx7NFqYXyJaM:e39f343f-c9f4-4db0-9085-0c6478c8865d'
    }
});

request({
    url: 'https://echo.apps.verygood.systems/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    agent: tunnelingAgent,
    body: JSON.stringify({'secret' : 'ALIAS'})
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log('Status:', response.statusCode);
      console.log(JSON.parse(body));
    }
});
  
  
/*
//Using express
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('https://tntatslcyfg.SANDBOX.verygoodproxy.com/post', function(req, res) {
  res.send('You sent the name "' + req.body.name + '".');
});

app.listen(4040, function() {
  console.log('Server running at http://127.0.0.1:4040/');
});
*/