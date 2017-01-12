var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');

exports.handleRequest = function (req, res) {

  if (req.method === 'GET') {
    httpHelpers.serveAssets(res, req.url, function(err, data) {
      if (err) {
        res.writeHead(404, httpHelpers.headers);
      } else {
        res.writeHead(200, httpHelpers.headers);
        res.end(data);
      }
      res.end();
    });
  } else if (req.method === 'POST') {
    httpHelpers.postAssets(res, req, function(err, data) {
      if (err) {
        res.writeHead(404, httpHelpers.headers);
      } else {
        res.writeHead(302, httpHelpers.headers);
      }
      res.end();
    });
  }
  // res.end(archive.paths.list);
};
