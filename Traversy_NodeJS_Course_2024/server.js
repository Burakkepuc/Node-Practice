import http from 'http'; // it is a module so we don't need .js extension.
import fs from 'fs/promises';
import url from 'url';;
import path from 'path';

// Get current path
// console.log(import.meta.url);
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename, __dirname);

const PORT = process.env.PORT;
const server = http.createServer(async (req, res) => {
  // res.setHeader('Content-Type', 'text/html')
  // res.statusCode = 404;
  // console.log(req.url); /,/about,/reference
  // console.log(req.method); GET,POST,PUT,PATCH,DELETE
  console.log(req.method);
  try {
    // check if GET request
    if (req.method === 'GET') {
      let filePath;
      if (req.url === '/') {
        // res.writeHead(200, { 'Content-Type': 'text/html' })
        // res.end('<h1>Homepage</h1>');
        filePath = path.join(__dirname, 'public', 'index.html')
      } else if (req.url === '/about') {
        // res.writeHead(200, { 'Content-Type': 'text/html' })
        // res.end('<h1>About</h1>');
        filePath = path.join(__dirname, 'public', 'about.html')
      } else {
        // res.writeHead(404, { 'Content-Type': 'text/html' })
        // res.end('<h1>Not Found</h1>');
        throw new Error('Not Found')
      }

      const data = await fs.readFile(filePath)
      res.setHeader('Content-Type', 'text/html')
      res.write(data);
      res.end

    }
    else {
      throw new Error('Method not allowed')
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Server Error');
  }




})


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})