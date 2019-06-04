var express = require('express');
var router = express.Router();

const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {JWT_KEY} = require('../config');
const {dbName} = require('../config');
const {jwt} = require('../config');
const {isUsernameValid} = require('../config');
const {md5} = require('../config');
const {dateNow} = require('../config');
const {validator} = require('../config');
const {verifyToken} = require('../middleware.js');

router.post('/create', verifyToken, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colReport = db.collection('report');
        const colUser = db.collection('user');
        //INSERT ONE DOCUMENT
        await colReport.insertOne({
            type: req.body.type,
            description: req.body.description,
            idReporter: token._id,
            idReported: req.body.idReported,
            createdAt: dateNow(),
            updatedAt: null
        });
        await colUser.updateOne({_id:req.body.idReported},{reported:true})

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

router.get('/getReportedUser', verifyToken, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colUser = db.collection('user');
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

router.get('/getUserReport', verifyToken, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colReport = db.collection('report');
        let data = await colReport.find({idReported:req.body.idReported}).toArray();
        res.send({
            users: data,
            error: null
        });
    } catch (err) {
        res.send({error:err});
    }
    client.close();
});

router.post('/ban', verifyToken, async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const colUser = db.collection('user');
        //INSERT ONE DOCUMENT
        await colUser.updateOne({"_id":req.body.idReported},{banned:true,reported:false})

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