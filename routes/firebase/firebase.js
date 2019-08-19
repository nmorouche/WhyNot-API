//TEST PROD

var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');
const {ObjectId} = require('../../config');
const {verifyToken} = require('../../middleware');
const {dateNow} = require('../../config');

router.get('/', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('firebase');
    let result = await col.find({userID: req.query._id}).toArray();
    res.send({
        firebaseToken: result[0].firebaseToken
    });
});

router.post('/registrate', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('firebase');
    let data = await col.find({userID: req.token._id}).toArray();
    if (data.length !== 0) {
        await col.updateOne(
            {userID: req.token._id},
            {
                $set: {
                    firebaseToken: req.body.token,
                    date: dateNow()
                }
            });
    } else {
        await col.insertOne({
            userID: req.token._id,
            firebaseToken: req.body.token,
            date: dateNow()
        });
    }
    res.send({
        error: null
    });
});

module.exports = router;