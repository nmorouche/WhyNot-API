var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../config');
const {MONGODB_URI} = require('../../config');
const {dbName} = require('../../config');
const {dateNow} = require('../../config');
const {verifyTokenAdmin} = require('../../middleware.js');
const {verifyToken} = require('../../middleware.js');
const {ObjectId} = require('../../config');

router.post('/create', verifyToken, async function (req, res, next) {
    console.log(req.body.description,req.body.idReported,req.body.type,req.token._id);
    
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colReport = db.collection('report');
        const colUser = db.collection('users');
        //INSERT ONE DOCUMENT
        await colReport.insertOne({
            type: req.body.type,
            description: req.body.description,
            idReporter: req.token._id,
            idReported: req.body.idReported,
            createdAt: dateNow()
        });
        await colUser.updateOne({_id:ObjectId(req.body.idReported)},{$set: {reported:true}})
        res.send({
            status: 200,
            error:null,
        });
    } catch (err) {
        res.send({error:err});
    }
    client.close();
});

router.get('/', verifyTokenAdmin, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colUser = db.collection('users');
        let data = await colUser.find({reported:true}).toArray();
        res.send({
            users: data,
            error: null
        });
    } catch (err) {
        res.send({error:err});
    }
    client.close();
});

router.get('/:idReported', verifyTokenAdmin, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colReport = db.collection('report');
        let data = await colReport.find({idReported:req.params.idReported}).toArray();
        res.send({
            users: data,
            error: null
        });
    } catch (err) {
        res.send({error:err});
    }
    client.close();
});

router.post('/ban', verifyTokenAdmin, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colUser = db.collection('users');
        //INSERT ONE DOCUMENT
        await colUser.updateOne({_id:ObjectId( req.body.idReported)},{$set: {banned:true,reported:false}})

        console.log(req.token);
        res.send({
            status: 200,
            error:null
        });
    } catch (err) {
        res.send({error:err});
    }
    client.close();
});

router.get('/register', async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('register');
        var result = await col.find({}).toArray();
        res.send({
            result
        })
    } catch (err) {
        res.send({error: err});
    }
});

module.exports = router;