var express = require('express');
var router = express.Router();

const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {JWT_KEY} = require('../config');
const {dbName} = require('../config');
const {jwt} = require('../config');
const {isUsernameValid} = require('../config');
const {md5} = require('../config');

router.get('/', async function (req, res, next) {
    var token = req.get('x-access-token');
    jwt.verify(token, JWT_KEY, async (err, data) => {
        if (err) {
            res.status(401).send({ error: 'Utilisateur non connecté' });
        } else {
            const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
            try {
                await client.connect();
                const db = client.db(dbName);
                const col = db.collection('users');
                let result = await col.find({}).toArray();
                console.log(result);
                res.send({
                    users: result
                });
            } catch (err) {
                res.send(err);
            }
            client.close();
        }
    });
});


module.exports = router;