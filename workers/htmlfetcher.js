// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

archive.readListOfUrlsAsync()
  .then( urls => archive.downloadUrlsAsync(urls))
  .catch( err => { console.error(err); });