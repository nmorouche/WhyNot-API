var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');
const {verifyTokenAdmin} = require('../../middleware.js');
const {verifyToken} = require('../../middleware.js');
const {ObjectId} = require('../../config.js');
const {dateNow} = require('../../config');

router.get('/', verifyToken, async function (req, res, next) {
    let result;
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('events');
        switch(req.query.sub_only){
            case "true": result = await col.find({sub_only: true}).toArray();
                break;
            case "false": result = await col.find({sub_only: false}).toArray();
                break;
            default: result = await col.find({}).toArray();
                break;
        }
        res.send({
            events: result,
            error: null
        });
    } catch (err) {
        res.send(err);
    }
    client.close();
});

router.get('/:id', verifyToken, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('events');
        let result = await col.find({_id: ObjectId(req.params.id)}).toArray();
        res.send({
            event: result,
            error: null
        });
    } catch (err) {
        res.send(err);
    }
    client.close();
});

router.put('/', verifyTokenAdmin, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('events');
        await col.insertOne({
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            date: req.body.date,
            imageURL: req.body.imageURL,
            price: req.body.price,
            sub_only: req.body.sub_only,
            createdBy: req.token._id,
            createdAt: dateNow(),
            updatedAt: null
        });
        res.send({
            error: null
        });
    } catch (err) {
        res.send(err);
    }
    client.close();
});

module.exports = router;