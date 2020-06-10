const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../config");


// get back all users


router.get("/", (req, res) => {
  connection.query("SELECT * from user", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});


//delete one user

router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('DELETE FROM user WHERE id= ?', userId, err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la supression d'un utilisateur");
     } else {
      res.sendStatus(200);
    }
  });
});


// GET ONE USER
router.get("/:id", (req, res) => {
  const idUser = req.params.id
  
  connection.query("SELECT * from user WHERE id = ?",[idUser], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});


router.get("/:id/postal", (req, res) => {
  const idPostal = req.params.id;

  // connection à la base de données, et recuperation resultat
  connection.query('SELECT * FROM postal AS p JOIN user AS u ON p.id = u.postal_id WHERE u.id = ? ', [idPostal], (err, results) => {
    if (err ) {
      console.log(err);
      res.status(404).json({error: "Utilisateur introuvable", data: {}});
    }
    else {
      res.json({data: results.shift() });
    }
  });
});

//RESET PASSWORD TEST


// router.post('/:id/forget', (req, res) => {
//   const userId = req.params.id;
//   const formData = req.body;
//   connection.query('UPDATE user SET ? WHERE id = ?', [formData, userId], err => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Erreur lors de la modification de l'utilisateur");
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });


// PUT /api/USERS/id
router.put('/:id', (req, res) => {

  const idUser = req.params.id;
  const formData = req.body;

  // connection à la base de données, et insertion de modification d'un user
  connection.query('UPDATE user SET ? WHERE id = ?', [formData, idUser], err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un utilisateur");
    } else {
      res.sendStatus(200);
    }
  })
  
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

