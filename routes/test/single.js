var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');

const {verifyTokenAdmin} = require('../../middleware.js');
const {verifyToken} = require('../../middleware.js');
const {ObjectId} = require('../../config.js');
const {dateNow} = require('../../config');
const {upload} = require('../../config');


router.patch('/viewers', verifyToken, async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        let insertResult = await col.updateOne(
            {_id: ObjectId(req.params.id)},
            {
                $set: {
                    viewers: "gloglo"
                }
            });
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

module.exports = router;
