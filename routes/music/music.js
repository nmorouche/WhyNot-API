var express = require("express");
var router = express.Router();

const { BASEAPPURL } = require("../../config");

router.get("/", async (req, res, next) => {
  try {
    let musicList = [
      BASEAPPURL + "public/music/6ix9ine-gooba.mp3",
      BASEAPPURL + "public/music/dababy-bop.mp3",
      BASEAPPURL + "public/music/roddy-ricch-the-box.mp3",
    ];

    res.status(200).json({
      data: musicList,
    });
  } catch (err) {
    res.send({
      error: err,
    });
  }
});

module.exports = router;
