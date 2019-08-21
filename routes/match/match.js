//TEST PROD

var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');
const {ObjectId} = require('../../config');
const {verifyToken} = require('../../middleware');

router.get('/', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('match');
        const userCol = db.collection('users');
        let result = [];
        let result1 = await col.find({}).toArray();
        if (result1 !== 0) {
            for (let x = 0; x < result1.length; x++) {
                if (result1[x].user1 === req.token._id) {
                    let finalUsersTab = await userCol.find({_id: ObjectId(result1[x].user2)}).toArray();
                    if (finalUsersTab.length !== 0) {
                        result.push(finalUsersTab[0]);
                    }
                } else if (result1[x].user2 === req.token._id) {
                    let finalUsersTab = await userCol.find({_id: ObjectId(result1[x].user1)}).toArray();
                    if (finalUsersTab.length !== 0) {
                        result.push(finalUsersTab[0]);
                    }
                }
            }
        }
        res.send(result);
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

router.get('/roomName', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('match');
        let result = await col.find({}).toArray();
        for (let i = 0; i < result.length; i++) {
            if ((result[i].user1 === req.token._id && result[i].user2 === req.query._id) || (result[i].user2 === req.token._id && result[i].user1 === req.query._id)) {
                res.send({
                    roomName: result[i].roomName,
                    error: null
                });
            }
        }
        res.send({
            error: true
        });
    } catch (err) {

    }
    client.close();
});

module.exports = router;