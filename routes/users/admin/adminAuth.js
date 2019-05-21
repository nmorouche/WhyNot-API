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

router.get('/login', async function(req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('admin');
        let result = await col.find({}).toArray();
        res.send({
            users: result
        });
    } catch (err) {
        res.send({
            error: err
        });
    }
    client.close();
});

/* SIGN IN */
router.post('/login', async function(req, res) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('admin');
        if(req.body.password.length <= 3) {
            res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
        } else if(!isUsernameValid(req.body.username)) {
            res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
        } else if(req.body.username.length < 2 || req.body.username.length > 20) {
            res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'});
        } else {
            var result = await col.find({username: req.body.username, password: md5(req.body.password)}).toArray();
            if(result.length){
                jwt.sign({
                    _id: result[0]._id,
                    email: result[0].email,
                    username: result[0].username,
                }, JWT_KEY, { expiresIn: '24h' },(err, token) => {
                    if(err) {
                        res.send({message: 'error'});
                    }
                    else {
                        res.send({
                            token
                        });
                    }
                });
            } else {
                res.status(403).send({
                    error: 'Cet identifiant est inconnu'
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
router.post('/signup', async function(req, res, next) {
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('admin');
    //INSERT ONE DOCUMENT
    let data = await col.find({}).toArray();
    if (req.body.password.length <= 3) {
        res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
    } else if (!isUsernameValid(req.body.username)) {
        res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
    } else if (req.body.username.length < 2 || req.body.username.length > 20) {
        res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'});
    } else if (data.some(data => data.username === req.body.username) || data.some(data => data.email === req.body.email)) {
        res.status(400).send({error: 'Cet identifiant est déjà associé à un compte'});
    } else {
        //INSERT ONE DOCUMENT
        await col.insertOne({
            email: req.body.email,
            username: req.body.username,
            password: md5(req.body.password),
            createdAt: dateNow(),
            updatedAt: null
        });
        let result = await col.find({email: req.body.email, username: req.body.username, password: md5(req.body.password)}).toArray();
        jwt.sign({
            _id: result[0]._id,
            username: result[0].username
        }, JWT_KEY, { expiresIn: '24h' },(err, token) => {
            if(err) {
                res.send({message: 'error'});
            }
            else {
                res.send({
                    token
                });
            }
        });
    }
});

module.exports = router;