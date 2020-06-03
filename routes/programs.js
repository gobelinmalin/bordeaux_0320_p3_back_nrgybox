const express = require("express");
const router = express.Router();
const connection = require("../config");

// route post de program lié à spotlight
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

// Test Johanna route post : '/programms/forecast'
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

// route post de la table de jointure program_forecast_lighting (liaison id program + id forecast)
// router.post('/:idProgram/forecast/:idForecast', (req, res) => {
//   const idProgram = req.params.idProgram;
//   const idForecast = req.params.idForecast;

//   connection.query('INSERT INTO program_forecast_lighting SET program.id = ? AND forecast_lighting.id = ?', [idProgram, idForecast], (err, results) => {
//     if(err){
//       res.status(500).json({
//         error: err.message,
//         sql: err.sql
//       });
//     }
//     else{
//       res.sendStatus(200);
//     }
//   })
// });

// test 
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

module.exports = router;