const express = require("express");
const router = express.Router();
const connection = require("../config");

// Get all user
router.get("/", (req, res) => {
  connection.query("SELECT * from user", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get the geolocation of a user
router.get('/:idUser/geolocations/:idGeoloc', (req, res) => {
  const idUser = req.params.idUser;
  const idGeoloc = req.params.idGeoloc;

  connection.query('SELECT * FROM user_geolocation AS ug JOIN user AS u ON ug.user_id = u.id JOIN geolocation AS g ON ug.gps_id = g.id WHERE u.id = ? AND g.id = ?', [idUser, idGeoloc], (err, results) => {
    if(err){
      res.status(500).json({
        error: err.message,
        sql: err.sql
      });
    }
    else{
      res.sendStatus(200);
    }
  })
});

module.exports = router;
