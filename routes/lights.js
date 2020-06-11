const express = require("express");
const router = express.Router();
const connection = require("../config");

router.get("/geolocation/:id", (req, res) => {
  const idArea = req.params.id
    connection.query("SELECT * from spot_light_geolocation WHERE id = ?", [idArea], (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  });
module.exports = router;