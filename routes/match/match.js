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

router.get('/', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('match');
        const userCol = db.collection('users');
        let result1 = await col.find({
            $not: {
                user1: req.token._id
            }
        }).toArray();
        let result2 = await col.find({
            $not: {
                user2: req.token._id
            }
        }).toArray();
        if (result1 != 0) {
            result1.forEach(async user => {
                result = await userCol.find({_id: user._id}).toArray();
            });
        }
        if (result2 != 0) {
            result2.forEach(async user => {
                result = await userCol.find({_id: user._id}).toArray();
            });
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