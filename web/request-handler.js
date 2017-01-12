var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var _ = require('underscore');


exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    httpHelpers.serveAssets(res, req.url, function(err, data) {
      if (err) {
        res.writeHead(404, httpHelpers.headers);
        res.end();
      } else {
        res.writeHead(200, httpHelpers.headers);
        res.end(data);
      }
    });
  } else if (req.method === 'POST') {
    httpHelpers.postAssets(res, req, function(err, url) {
      if (err) {
        res.writeHead(404, httpHelpers.headers);
      } else {
        var tempHeaders = _.extend({Location: url}, httpHelpers.headers);
        res.writeHead(302, tempHeaders);
      }
      res.end();
    });
  }
};
