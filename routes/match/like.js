//TEST PROD

var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');
const {verifyToken} = require('../../middleware');
const {dateNow} = require('../../config');
const {axiosFirebase} = require('../../config');

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
            const firebase = db.collection('firebase');
            let result = await firebase.find({userID: req.query._id}).toArray();
            await axiosFirebase.post('', {
                "to": result[0].firebaseToken,
                "notification": {
                    "title": "Bonne nouvelle !",
                    "body": "Tu as un nouveau match"
                }
            });
            res.send({
                match: true,
                error: null
            });
        }
    } catch (err) {
        res.send({
            error: err
        });
    }
});

module.exports = router;