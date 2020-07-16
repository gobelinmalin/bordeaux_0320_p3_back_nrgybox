const express = require("express");
const router = express.Router();
const connection = require("../config");

router.get("/:id/geolocations/:id", (req, res) => {
    const idParams = req.params.id
  connection.query("SELECT * FROM user_geolocation WHERE id = ?", idParams,  (err, results) => {
    if (err) {
      res.status(500).send('Impossible de récupérer cette adresse');
    } else {
      res.sendStatus(200);
    }
});
});

  module.exports = router;