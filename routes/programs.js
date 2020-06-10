const express = require("express");
const router = express.Router();
const connection = require("../config");

router.post('/forecast', (req, res) => {
  const formData = req.body;

  connection.query('INSERT INTO forecast_lighting SET ?', [formData], err => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      res.sendStatus(200);
    }
  });
});

  module.exports = router;