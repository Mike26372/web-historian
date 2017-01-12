var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var filePath;
  if (asset === '/') {
    asset = '/index.html';
    filePath = path.normalize(archive.paths.siteAssets + asset);
  } else {
    filePath = path.normalize(archive.paths.archivedSites + asset);
  }


  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

exports.postAssets = function(res, req, callback) {
  var filePath = path.normalize(archive.paths.list);

  req.on('error', function(err, data) {
    callback(err);
  });

  var data = '';
  req.on('data', function(chunk) {
    data += chunk.toString();
  });

  req.on('end', function() {
    var urlToAppend = data.replace(/\"/g, '').slice(4) + '\n';
    archive.isUrlInList(urlToAppend, (err, exists) => {
      if (!exists) {
        fs.appendFile(filePath, urlToAppend, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      }
    });
  });
};


// As you progress, keep thinking about what helper functions you can put here!
