const http = require('http');

const SECOND = 1000;

const port = process.env.PORT || 9090;
const env = process.env.ENV || '???';
const version = 'v1';
let ready = false;

console.log('getting ready');
setTimeout(() => {
  ready = true;
  console.log('ready to serve requests');
}, 10 * SECOND);

http.createServer((req, res) => {
  const { method, url } = req;
  if (ready) {
    if (method === 'GET') {
      if (url === '/') {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
          env,
          version,
        }));
      } else if (url === '/healthz') {
        res.write('OK');
      } else {
        res.statusCode = 404;
        res.write('404 Not Found');
      }
    } else {
      res.statusCode = 405;
      res.write('504 Method Not Allowed');
    }
  } else {
    res.statusCode = 500;
    res.write('500 Internal Server Error');
  }
  res.end();
}).listen(port, () => console.log(`listening on port ${port}`));

function sigHandler(signal) {
  console.log(`got signal ${signal}`);
  if (signal === 'SIGINT') {
    process.exit();
  } else { // SIGTERM
    console.log('doing some clean-up work');
    setTimeout(() => process.exit(), 15 * SECOND);
  }
}

process.on('SIGINT', sigHandler);
process.on('SIGTERM', sigHandler);
