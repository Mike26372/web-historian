var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var Promise = require('bluebird');
var rp = require('request-promise');
var writeFileAsync = require('fs-writefile-promise');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      callback(err);
    } else {
      var dataArr = data.split('\n');
      callback(null, dataArr);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(err, urls) {
    if (err) {
      callback(err);
    } else {
      callback(null, _.contains(urls, url.replace(/\n/g, '')));
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  var filePath = path.normalize(exports.paths.archivedSites + '/' + url);
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.error(err);
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
};

exports.downloadUrls = function(arr) {
  arr.forEach(function(url) {
    exports.isUrlArchived(url, (err, exists) => {
      if (!exists) {
        request(`http://${url}`, (error, response, html) => {
          if (error) {
            console.error(error);
          } else {
            var filePath = path.normalize(`${exports.paths.archivedSites}/${url}`);
            fs.writeFile(filePath, html, function(err) {
              if (err) {
                console.error(err);
              } else {
                console.log(`${url} archived!`);
              }
            });
          }
        });
      }
    });
  });
};

var readFileAsync = Promise.promisify(fs.readFile);
var appendFileAsync = Promise.promisify(fs.appendFile);


exports.readListOfUrlsAsync = function() {
  return readFileAsync(exports.paths.list, 'utf8')
    .then( data => data.split('\n') )
    .catch( err => { console.error(err); });
};

exports.isUrlInListAsync = function(url) {
  return readListOfUrlsAsync()
    .then( dataArr => _.contains(dataArr, url.replace(/\n/g, '')))
    .catch( err => { console.error(err); });
};

exports.addUrlToListAsync = function(url) {
  return appendFileAsync(exports.paths.list, `${url}\n`)
    .catch( err => { console.error(err); });
};

exports.isUrlArchivedAsync = function(url) {
  var filePath = path.normalize(exports.paths.archivedSites + '/' + url);
  return readFileAsync(filePath, 'utf8')
    .then( data => true )
    .catch( err => false );
};

exports.downloadUrlsAsync = function(arr) {
  arr.forEach( url => {
    var filePath = path.normalize(`${exports.paths.archivedSites}/${url}`);
    exports.isUrlArchivedAsync(url)
      .then( exists => !exists ? rp(`http://${url}`) : rp(''))
      .then( html => writeFileAsync(filePath, html))
      .catch( err => { });
  });
};
