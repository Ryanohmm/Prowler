require('dotenv').config();
const http = require('http');
const httpProxy = require('http-proxy');
const fetch = require('node-fetch');
const md5 = require('blueimp-md5'); // Install this if needed

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

const proxy = httpProxy.createProxyServer({});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err.message);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Bad Gateway: Proxy server error.');
});

http.createServer(async (req, res) => {
  const urlParams = new URLSearchParams(req.url.replace('/', ''));
  const query = urlParams.get('query') || 'spider';

  const ts = Date.now();
  const hash = md5(ts + privateKey + publicKey);
  const marvelUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  try {
    const response = await fetch(marvelUrl);
    const data = await response.json();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error fetching from Marvel API');
  }
}).listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
