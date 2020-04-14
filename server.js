// content of server.js

// Basic setup for Inbound VGS
const http = require('http')
const port = 4040
const inboundRequest = require('request');

inboundRequest({
    url: 'https://tntatslcyfg.SANDBOX.verygoodproxy.com/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'cc' : '1234567890123456','exp' : '01/21','cvv' : '123'})
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

// Basic setup for Outbound VGS
const fs = require('fs');
const outboundRequest = require('request');
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

outboundRequest({
    url: 'https://echo.apps.verygood.systems/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    agent: tunnelingAgent,
    body: JSON.stringify({'cc' : '1234567890123456','exp' : '01/21','cvv' : '123'})
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log('Status:', response.statusCode);
      console.log(JSON.parse(body));
    }
});