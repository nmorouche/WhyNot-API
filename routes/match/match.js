//TEST PROD

var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {JWT_KEY} = require('../../config');
const {dbName} = require('../../config');
const {BASEAPPURL} = require('../../config');
const {jwt} = require('../../config');
const {ObjectId} = require('../../config');
const {verifyToken} = require('../../middleware');
const {isUsernameValid} = require('../../config');
const {md5} = require('../../config');
const {dateNow} = require('../../config');
const {validator} = require('../../config');
const {upload} = require('../../config');

router.get('/', async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('match');
        let result = await col.find().toArray();
        res.send(result);
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

router.put('/', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('match');
        let result = await col.find().toArray();
        res.send(result);
    } catch (err) {
        res.send({
            error: err
        });
    }
});

module.exports = router;