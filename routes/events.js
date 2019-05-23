var express = require('express');
var router = express.Router();

const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');
const {verifyToken} = require('../middleware.js');

router.get('/', verifyToken, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        let result = await col.find({}).toArray();
        console.log(req.token);
        res.send({
            users: result
        });
    } catch (err) {
        res.send(err);
    }
    client.close();
});


module.exports = router;