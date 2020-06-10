const express = require("express");
const router = express.Router();
const connection = require("../config");

// Get all program
router.get("/", (req, res) => {

    connection.query("SELECT * FROM program",  (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
});

// Get one programme by ID
router.get("/:id", (req, res) => {
const idProgramm = req.params.id
  connection.query("SELECT * FROM program WHERE id = ?", [idProgramm],  (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get forecast ID link to one program ID

/*router.get("/:id/forecast/:id", (req, res) => {
  const idForecasts = req.params.id
    connection.query("SELECT * FROM program_forecast_lighting AS p_f_l JOIN program AS p ON p_f_l.id = p.id WHERE p.id = ?", [idForecasts],  (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({data: results.shift()});
      }
    });
  }); */

module.exports = router;