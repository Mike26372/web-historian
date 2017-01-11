var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');

exports.handleRequest = function (req, res) {
  
  httpHelpers.serveAssets(res, req.url, function(err, data) {
    if (err) {
      res.writeHead(404, httpHelpers.headers);
    } else {
      res.writeHead(200, httpHelpers.headers);
      res.end(data);
    }
    res.end();
  });
  // res.end(archive.paths.list);
};
