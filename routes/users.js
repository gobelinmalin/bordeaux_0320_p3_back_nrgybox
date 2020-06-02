const express = require("express");
const router = express.Router();
const connection = require("../config");

// Test
router.get("/", (req, res) => {
  connection.query("SELECT * from user", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
// ! test
module.exports = router;