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

  

router.delete('/:id/forecast', (req, res) => {
    const forecastLightingId = req.params.id;
    connection.query('DELETE FROM forecast_lighting WHERE id = ?', [forecastLightingId], err => {
        if(err) {
            console.log(err);
            res.status.send(err);
        }else {
            res.sendStatus(200);
        }
    });
});

//permet à l'adminsitrateur de modifier le forecast dans un programme

router.put('/:id/forecasts/:id', (req, res) => {
  const idForecast= req.params.idForecast;
  const idProgram = req.params.idProgram;
  const formData= req.body;
  connection.query(' UPDATE program AS p JOIN program_forecast_lighting AS p_f_l ON p.id = p_f_l.id  SET ? WHERE idProgram = ? AND idForecast = ?', [idForecast, idProgram, formData], err => {
    if(err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification du programme");
    } else {
      res.sendStatus(200);
    }
  });
});
  
  module.exports = router;