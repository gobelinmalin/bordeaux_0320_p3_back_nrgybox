const express = require("express");
const router = express.Router();
const connection = require("../config");

// get the dates in a special format in programs table
router.get('/', (req, res) => {
  connection.query('SELECT DATE_FORMAT(date_start, "%H:%i") AS date_start, DATE_FORMAT(date_end, "%H:%i") AS date_end FROM program', (err, results) => {
    if(err){
      res.status(500).json({
        error: err.message,
        sql: err.sql
      });
    }
    else{
      res.status(200).json(results);
    }
  });
});

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

// Post a spotlight
router.post('/spotlight', (req, res) => {
  const formBody = req.body;
  connection.query('INSERT INTO program SET ?', [formBody], (err, results) => {
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

// Post a forecast lighting
router.post("/forecast", (req, res) => {
  const formBody = req.body;
  connection.query('INSERT INTO forecast_lighting SET ?', [formBody], (err, results) => {
    if(err){
      res.status(500).json({
        error: err.message,
        sql: err.sql
      });
    }
    else{
      res.sendStatus(200);
    }  
  });
});

// Get the forecast lighting of a spotlight
router.get('/:idProgram/forecast/:idForecast/spotlight/:idSpotlight', (req, res) => {
  const idProgram = req.params.idProgram;
  const idForecast = req.params.idForecast;
  const idSpotlight = req.params.idSpotlight;
  connection.query("SELECT * FROM program AS p JOIN program_forecast_lighting AS pfl ON pfl.program_id = p.id JOIN forecast_lighting AS fl ON fl.id = pfl.forecast_lighting_id JOIN spot_light AS s ON s.id = p.spot_light_id WHERE p.id = ? AND fl.id = ? AND s.id = ?", [idProgram, idForecast, idSpotlight], (err, results) => {
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

// Update a forecast lighting
router.put("/:idProgram/forecasts/:idForecast", (req, res) => {
  const data = req.body;
  const idProgram = req.params.idProgram;
  const idForecast = req.params.idForecast;
  connection.query('UPDATE program AS p JOIN program_forecast_lighting AS pfl ON pfl.program_id = p.id JOIN forecast_lighting AS fl ON fl.id = pfl.forecast_lighting_id SET ? WHERE p.id = ? AND fl.id = ?', [data, idProgram, idForecast], (err, results) => {
    if(err){
      res.status(500).json({
        error: err.message,
        sql: err.sql
      });
    }
    else{
      res.sendStatus(200);
    }
  });
});

// Delete a forecast lighting
router.delete('/:idProgram/forecasts/:idForecast', (req, res) => {
  const idProgram = req.params.idProgram;
  const idForecast = req.params.idForecast;
  connection.query('DELETE FROM program_forecast_lighting WHERE id = ?', [idProgram, idForecast], (err, results) => {
    if(err){
      res.json({
        error: err.message,
        sql: err.sql
      });
    }
    else{
      res.status(200).send('La prévision lumineuse a bien été supprimé');
    }
  })
});

module.exports = router;
