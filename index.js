//let's load node modules we need to create a server
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8125;
const ip = '127.0.0.1';

//this function create a server object which we can start listening on port 8125
http
  .createServer((request, response) => {
    let filePath = `.${request.url}`;

    //fix the req URL if it does not specify a file
    if (filePath == './') {
      filePath = './index.html';
    }

    let extname = String(path.extname(filePath)).toLowerCase();

    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.svg': 'application/image/svg+xml'
    };
    /**
     * look for the extension of the file being requested and see if it matches with one of our MIME types. If no matches are found, we use the application/octet-stream as the default type
     */
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    //let's respond to the client with the file information...
    fs.readFile(filePath, (error, content) => {
      //let's check for errors
      if (error) {
        //if there is one and it is ENOENT we send back a 404 page
        if (error.code == 'ENOENT') {
          fs.readFile('./404.html', (error, content) => {
            response.writeHead(404, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
          });
        } else {
          //if the error is not ENOENT we send back a message to contact the site admin
          response.writeHead(500);
          response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
          response.end();
        }
      } else {
        //if there are no errors, we send the requested file
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  })
  .listen(port);

console.log(`Server running on PORT: ${port}`);
