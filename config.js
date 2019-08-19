const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whynotDB';
const JWT_KEY = process.env.JWT_KEY || 'why-not';
const PORT = process.env.PORT || 3000;
const dbName = process.env.DBNAME || 'whynotDB';
const BASEAPPURL = process.env.BASEAPPURL || 'http://localhost:3000/';
const FIREBASE_KEY = process.env.FIREBASE_KEY || 'AAAA8K6g49g:APA91bGHaaI_zphN6lm_sqVkUVtx5xG4iYvCLwGiM-bboH5xkluU3pUUF3a7V3CWfbtPuD4gau0Lh_xuIAaC_w-tmA_cquuAii7CWc6Iwc7x3h8Y2-RSY4of0uAV15Tj3OAcvKp4rtcB';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        let date = Date.now() + '.' + file.originalname.substr(file.originalname.length - 3);
        file.originalname = date;
        cb(null, date);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('yes'), false);
    }
};

const upload = multer({storage, fileFilter});
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const validator = require("email-validator");
const axiosFirebase = require('axios');
axiosFirebase.defaults.baseURL = "https://fcm.googleapis.com/fcm/send";
axiosFirebase.defaults.headers.common['Authorization'] = 'key=' + FIREBASE_KEY;

function dateNow() {
    var dateNow = new Date();
    var day = dateNow.getDate();
    var month = dateNow.getMonth();
    var year = dateNow.getFullYear();
    var hour = dateNow.getHours();
    var minutes = dateNow.getMinutes();
    var seconds = dateNow.getSeconds();
    month += 1;
    return formatDigits(day) + '/' + formatDigits(month) + '/' + year + ' ' + formatDigits(hour) + ':' + formatDigits(minutes) + ':' + formatDigits(seconds);
}

function formatDigits(number) {
    if (number < 10) {
        number = ('0' + number);
    }
    return number;
}

function isUsernameValid(str) {
    if (typeof (str) !== 'string') {
        return false;
    }
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 122 || str.charCodeAt(i) < 65) {
            if (str.charCodeAt(i) < 97 || str.charCodeAt(i) > 90) {
                return false;
            }
        }
    }
    return true;
}

module.exports = {
    ObjectId,
    MongoClient,
    MONGODB_URI,
    BASEAPPURL,
    dbName,
    JWT_KEY,
    PORT,
    jwt,
    md5,
    isUsernameValid,
    dateNow,
    validator,
    upload,
    FIREBASE_KEY,
    axiosFirebase
};