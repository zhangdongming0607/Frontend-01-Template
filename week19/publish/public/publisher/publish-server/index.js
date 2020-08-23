const http = require('http');
const fs = require('fs')
const unzip = require('unzipper')

// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  const writeStream = unzip.Extract({path: './week19/publisher/packages'})
  req.pipe(writeStream)
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  })
});

server.listen(8081)