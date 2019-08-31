var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');
const {ObjectId} = require('../../config');
const {verifyToken} = require('../../middleware');

router.put('/', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('chat');
        await col.insertOne({
            user1: req.token._id,
            user2: req.body.user2,
            message: req.body.message
        });
        res.send({error: false});
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

router.get('/', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('chat');
        let result = await col.find().toArray();
        var finalresultTab = [];
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                if ((result[i].user1 === req.token._id && result[i].user2 === req.query._id)
                    ||
                    (result[i].user1 === req.query._id && result[i].user2 === req.token._id)) {
                    finalresultTab.push(result[i]);
                }
            }
        }
        res.send(finalresultTab);
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

module.exports = router;