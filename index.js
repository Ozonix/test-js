const express = require("express");
const exec = require('executive');
const bodyParser = require("body-parser");
const async = require("async");
const path = require("path");
const http = require('http');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(`${__dirname}`))

app.post('/proxy/', function (client_req, client_res) {

  var client = client_req.body;

  const postData = querystring.stringify(client.data);
  const headers = client.headers || {}

  var options = {
    hostname: client.host,
    port: 80,
    path: client.path,
    method: client.method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      ...headers
    }
  };

  let data = ``

  const req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      data += `${chunk}`
    });

    res.on('end', () => {
    })
  });


  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(postData);

  client_req.pipe(req, {
    end: true
  });
});

app.listen(10101, ()=> {
  console.log('Доступно на http://localhost:10101')
});
