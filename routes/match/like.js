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
        const col = db.collection('like');
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
        const col = db.collection('like');
        let result = await col.find({
            liked: req.token._id,
            liker: req.query._id
        }).toArray();
        if (result.length === 0) {
            await col.insertOne({
                liker: req.token._id,
                liked: req.query._id,
                date: dateNow()
            });
            res.send({
                match: false,
                error: null
            });
        } else {
            const match = db.collection('match');
            await match.insertOne({
                user1: req.token._id,
                user2: req.query._id,
                date: dateNow()
            });
            res.send({
                match: true,
                error: null
            })
        }
    } catch (err) {
        res.send({
            error: err
        });
    }
});

module.exports = router;