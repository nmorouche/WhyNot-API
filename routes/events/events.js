var express = require("express");
var router = express.Router();

const { MongoClient } = require("../../config");
const { MONGODB_URI } = require("../../config");
const { dbName } = require("../../config");

const { verifyTokenAdmin } = require("../../middleware.js");
const { verifyToken } = require("../../middleware.js");
const { ObjectId } = require("../../config.js");
const { dateNow } = require("../../config");
const { upload } = require("../../config");

// get all
router.get("/", /*verifyToken,*/ async (req, res, next) => {
  let result;

  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("events");
    switch (req.query.sub_only) {
      case "true":
        result = await col.find({ sub_only: true }).toArray();
        break;
      case "false":
        result = await col.find({ sub_only: false }).toArray();
        break;
      default:
        result = await col.find({}).toArray();
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
router.get("/register", verifyToken, async (req, res, next) => {
  console.log("test");
  
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("register");
    result = await col.find({ }).toArray();
    console.log(result);
    
    res.send({
      error: result
    })
  } catch (err) {
    res.send({ error: err });
  }
});

//get one
router.get("/:id", verifyToken, async (req, res, next) => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("events");
    let result = await col.find({ _id: ObjectId(req.params.id) }).toArray();
    res.send({
      event: result,
      error: null
    });
  } catch (err) {
    res.send(err);
  }
  client.close();
});
//ajout
router.put(
  "/",
  verifyTokenAdmin,
  upload.single("image"),
  async (req, res, next) => {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection("events");
      await col.insertOne({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        date: req.body.date,
        imageURL: "http://localhost:3000/" + req.file.path,
        price: parseInt(req.body.price),
        sub_only: JSON.parse(req.body.sub_only),
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
  }
);

//modification
router.patch("/:id", verifyTokenAdmin, async (req, res, next) => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("events");

    const name = req.body.name;
    const description = req.body.description;
    const address = req.body.address;
    const date = req.body.date;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const sub_only = req.body.sub_only;
    const updatedAt = dateNow();
    let eventResult = await col.find().toArray();
    let resultForEach = 0;
    let event;

    eventResult.forEach(resForEach => {
      if (resForEach._id.equals(req.params.id)) {
        resultForEach = 1;
        event = resForEach;
      }
    });
    if (resultForEach === 0) {
      res.status(404).send({ error: "L'event n'existe pas" });
    } else {
      let insertResult = await col.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            name,
            description,
            address,
            date,
            imageURL,
            price,
            sub_only,
            updatedAt
          }
        }
      );
      let newEvent = await col.find({ _id: ObjectId(req.params.id) }).toArray();
      res.send({
        newEvent,
        error: null
      });
    }
  } catch (err) {
    res.send({ error: err });
  }
});
//supression
router.delete("/:id", verifyTokenAdmin, async (req, res, next) => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("events");
    let eventResult = await col.find().toArray();
    let resultForEach = 0;
    let event;
    eventResult.forEach(resForEach => {
      if (resForEach._id.equals(req.params.id)) {
        resultForEach = 1;
        event = resForEach;
      }
    });
    if (resultForEach === 0) {
      res.status(404).send({ error: "L'event n'existe pas" });
    } else {
      await col.deleteOne({ _id: event._id });
      res.send({
        error: null
      });
    }
  } catch (err) {
    res.send({ error: err });
  }
});

//inscription
router.post("/register", /*verifyToken,*/ async (req, res, next) => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("register");
    console.log(req.body.userId,req.body.eventId);
    
    let result = await col.find({userId: req.body.userId,eventId:req.body.eventId}).toArray();
    console.log("yo",result[0]);
    
    if (!result[0]) {
      console.log("test");
      await col.insertOne({
        userId: req.body.userId,
        eventId: req.body.eventId,
        createdAt: dateNow()
      });
      let fin = await col.find({}).toArray();
      console.log(fin);
      
      res.send({
        error: null
      })
    }else{
      res.status(403).send({
        error:"vous etes deja inscrit a cet event "
      });
    }
    
  } catch (err) {
    res.send({ error: err });
  }
});



module.exports = router;
