const express = require("express");
const router = express.Router();
const connection = require("../config");

const getProgramFormat = `SELECT city_name,
area_name,
p.id AS program_id,
DATE_FORMAT(p.date, "%Y-%m-%d") AS date,
date_start AS full_date_start,
date_end AS full_date_end,
DATE_FORMAT(date_start, "%H:%i") AS date_start,
DATE_FORMAT(date_end, "%H:%i") AS date_end,
latitude,
longitude,
light_is_active
FROM program AS p
JOIN city AS c ON c.id = p.city_id
JOIN area AS a ON a.id = c.area_id
JOIN street AS s ON s.id = a.street_id
JOIN geolocation AS g ON g.id = a.gps_id
JOIN spot_light AS spt ON spt.id = p.spot_light_id `;

// get the dates in a special format in programs table and filtering by city name passed in the route
router.get('/', (req, res) => {
  const { city } = req.query;
  const whereProgram = 'WHERE p.date BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND DATE_ADD(NOW(), INTERVAL 7 DAY)';

  if(city){
    connection.query(getProgramFormat + whereProgram + ' AND city_name LIKE ?',[city], (err, results) => {
      if(err){
        res.status(500).json({
          error: err.message,
          sql: err.sql
        });
      }
      else if(results.length === 0){
        res.status(404).send('Aucun programme ne correspond à votre ville');
      }
      else{
        res.status(200).json(results);
      }
    });
  }
});

// update and get the new dates in the program
router.put('/:id', (req, res) => {
  const dataUser = req.body;
  const idParams = req.params.id;
  const whereProgram = 'WHERE p.id = ?';
  connection.query('UPDATE program SET ? WHERE id = ?', [dataUser ,idParams], (err, _) => {
    if(err){
      return res.status(500).send('Impossible de mettre à jour le programme');
    }
    else{
      connection.query(getProgramFormat + whereProgram, [idParams], (err2, results) => {
        if(err2){
          res.status(500).send('Erreur lors de la récupération des données');
        }
        else{
          return res.status(200).json(results);
        }
      })
    }
  })
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

// Get all program for one spot light
router.get("/spotlights/:id", (req, res) => {
  const idSpot = req.params.id;

  connection.query("SELECT * FROM program WHERE spot_light_id = ?", [idSpot], (err, results) => {
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
