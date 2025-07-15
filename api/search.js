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

app.get('/characters', async (req, res) => {
    const timestamp = Date.now().toString(); // ensure it's a string
    const publicKey = process.env.PUBLIC_ID;
    const privateKey = process.env.PRIVATE_ID;

    
    const hash = crypto
        .createHash('md5')
        .update(timestamp + privateKey + publicKey)
        .digest('hex');

    const params = new URLSearchParams({
        ts: timestamp,
        apikey: publicKey,
        hash: hash
    });

    const url = `https://gateway.marvel.com/v1/public/characters?${params.toString()}`;
    console.log('🔍 Requesting:', url);

    try {
        const apiResponse = await fetch(url);
        const json = await apiResponse.json();

        console.log('✅ Response received:', JSON.stringify(json, null, 2));
        res.setHeader('Content-Type', 'application/json');
        res.send(json);
    } catch (e) {
        console.error('❌ Error fetching Marvel API:', e);
        res.status(500).send({ error: 'Failed to fetch Marvel data' });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getString() {
    return 'Welcome, Miles!';
}