const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const crypto = require('crypto');
require('dotenv').config()

const md5 = crypto.createHash('md5');

app.use(cors())

app.get('/', (req, res) => {
    const string = getString();
    res.send(string);
})

app.get('/comics', async(req, res) => {
    const timestamp = Date.now();
    const publicKey = process.env.PUBLIC_API_KEY;
    const privateKey = process.env.PRIVATE_API_KEY;

    const params = new URLSearchParams({
        ts: timestamp,
        apikey: publicKey,
        hash: md5.update(timestamp + privateKey + publicKey).digest('hex')
    });

    try {
        const apiResponse = await fetch(`https://gateway.marvel.com/v1/public/comics?${params}`);
        const json = await apiResponse.json();

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(json));    
    } catch(e) {
        console.log(e);
    }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getString() {
    return 'Hello Code KY!';
}