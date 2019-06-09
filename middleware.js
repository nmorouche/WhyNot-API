const {JWT_KEY} = require('./config');
const {jwt} = require('./config');

function verifyToken(req, res, next) {
    var token = req.get('x-access-token');
    jwt.verify(token, JWT_KEY, async (err, data) => {
        if (err) {
            res.status(401).send({ error: 'Utilisateur non connecté' });
        } else {
            req.token = data;
            next();
        }
    });
}

function verifyTokenAdmin(req, res, next) {
    var token = req.get('x-access-token');
    jwt.verify(token, JWT_KEY, async (err, data) => {
        if (err) {
            res.status(401).send({ error: 'Utilisateur non connecté' });
        } else {
            console.log(data);
            if(data.admin !== undefined){
                req.token = data;
                next();
            } else {
                res.status(403).send({ error: 'Vous n\'êtes pas administrateur'});
            }
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAdmin
};


