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
        let result1 = await col.find({
            user1: {$nin: [req.token._id]}
        }).toArray();
        let result2 = await col.find({
            user2: {$nin: [req.token._id]}
        }).toArray();
        if (result1 !== 0) {
            for (let x = 0; x < result1.length; x++) {
                let finalUsersTab = await userCol.find({_id: ObjectId(result1[x].user2)}).toArray();
                if (finalUsersTab.length !== 0) {
                    result.push(finalUsersTab[0]);
                }
            }
        }
        if (result2 !== 0) {
            for (let x = 0; x < result2.length; x++) {
                let finalUsersTab = await userCol.find({_id: ObjectId(result2[x].user2)}).toArray();
                if (finalUsersTab.length !== 0) {
                    result.push(finalUsersTab[0]);
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

module.exports = router;