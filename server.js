var http  = require('http');
var fs    = require('fs');
var path  = require('path');
var mime  = require('mime');

var cache = {};

function send404(res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  res.write('Error 404: Not Found');
  res.end();
}

function sendFile(res, filePath, fileConents) {
  res.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  });
  res.end(fileConents);
}

function serveStatic(res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(res);
          } else {
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  };
}

var server = http.createServer(function(req, res) {
  var filePath = filePath;

  req.url === '/'
    ? filePath = 'public/index.html'
    : filePath = 'public' + req.url;

  var absPath = './' + filePath;
  serveStatic(res, cache, absPath);
});

server.listen(3000, function() {
  console.log('Server listening on port 3000.');
});