var express = require("express");
var router = express.Router();

const { BASEAPPURL } = require("../../config");

router.get("/", async (req, res, next) => {
  try {
    let musicList = [
      {
        title: "La vie qu'on mène",
        artist: "Ninho",
        preview:
          "https://cdns-preview-6.dzcdn.net/stream/c-6c9e8655cb83ae2b5f08ff03ba36a4f2-5.mp3",
      },
      {
        title: "Clarinet Quintet in A Major, K. 581: II. Larghetto",
        artist: "Mozart",
        preview:
          "https://cdns-preview-f.dzcdn.net/stream/c-fd79f95a1e0fa4e44381a6504affcd1f-2.mp3",
      },
      {
        title: "Cassage de nuques, pt. 3",
        artist: "JUJUJUJUL",
        preview:
          "https://cdns-preview-1.dzcdn.net/stream/c-17b598dd082a95bf266fbae928dd65f5-5.mp3",
      },
      {
        title: "CC'est mort",
        artist: "PLK",
        preview:
          "https://cdns-preview-6.dzcdn.net/stream/c-642aeb13e2c03dedd38cad0bf94c56df-3.mp3",
      },
      {
        title: "PUFF PUFF PUFF",
        artist: "Gambi",
        preview:
          "https://cdns-preview-3.dzcdn.net/stream/c-3ca6ee5af1e6cb101b5f062b21831361-4.mp3",
      },
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
