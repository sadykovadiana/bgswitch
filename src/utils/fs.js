const fs = require('fs');
const util = require('util');

const writeFileAsync = util.promisify(fs.writeFile);
const unlinkFileAsync = util.promisify(fs.unlink);

module.exports = {
  writeFile: async (path, content) => {
    await writeFileAsync(path, content, { encoding: 'utf-8' });
  },

  removeFile: async (path) => {
    try {
      await unlinkFileAsync(path);
    } catch (err) {
      console.log(`removeFile error: file ${path} doesn't exist...`);
    }
  },

};
/*
fs.readFile(img, function(err, content) {
  if (err) {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>No such image</h1>");
  } else {
    //specify the content type in the response will be an image
    res.writeHead(200, { "Content-type": "image/jpg" });
    res.end(content);
  }
});*/