var express = require('express');
var router = express.Router();

const {MongoClient} = require('../../../config');
const {MONGODB_URI} = require('../../../config');
const {JWT_KEY} = require('../../../config');
const {dbName} = require('../../../config');
const {jwt} = require('../../../config');
const {isUsernameValid} = require('../../../config');
const {md5} = require('../../../config');
const {dateNow} = require('../../../config');
const {validator} = require('../../../config');

router.get('/login', async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('admin');
        let result = await col.find({}).toArray();
        res.send({
            adminUsers: result,
            error: null
        });
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

/* SIGN IN */
router.post('/login', async function (req, res) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('admin');
        if (req.body.password.length <= 4) {
            res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
        } else if (!validator.validate(req.body.email)) {
            res.status(400).send({error: 'Email invalide'});
        } else {
            var result = await col.find({email: req.body.email, password: md5(req.body.password)}).toArray();
            if (result.length) {
                jwt.sign({
                    _id: result[0]._id,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    admin: true
                }, JWT_KEY, {expiresIn: '24h'}, (err, token) => {
                    if (err) {
                        res.send({message: 'error'});
                    } else {
                        res.send({
                            token,
                            error: null
                        });
                    }
                });
            } else {
                res.status(403).send({
                    error: 'Identifiant ou mot de passe inconnu'
                });
            }
        }
    } catch (err) {
        res.send({
            error: err
        })
    }
    client.close();
});

/* POST users listing. */
router.post('/signup', async function (req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('admin');
    //INSERT ONE DOCUMENT
    let data = await col.find({}).toArray();
    if (!validator.validate(req.body.email)) {
        res.status(400).send({error: 'Email invalide'});
    } else if (req.body.password.length < 5) {
        res.status(400).send({error: 'Le mot de passe doit contenir au moins 5 caractères'});
    } else if (!isUsernameValid(req.body.firstname) || !isUsernameValid(req.body.lastname)) {
        res.status(400).send({error: 'Votre nom et prénom ne doivent contenir que des lettres non accentué'});
    } else if (data.some(data => data.email === req.body.email)) {
        res.status(400).send({error: 'Cet email est déjà associé à un compte'});
    } else {
        //INSERT ONE DOCUMENT
        await col.insertOne({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: md5(req.body.password),
            createdAt: dateNow(),
            updatedAt: null
        });
        let result = await col.find({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: md5(req.body.password)
        }).toArray();
        jwt.sign({
            _id: result[0]._id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            admin: true
        }, JWT_KEY, {expiresIn: '24h'}, (err, token) => {
            if (err) {
                res.send({message: 'error'});
            } else {
                res.send({
                    token,
                    error: null
                });
            }
        });
    }
    client.close();
});

module.exports = router;