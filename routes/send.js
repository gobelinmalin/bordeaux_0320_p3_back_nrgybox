const express = require("express");
const router = express.Router();
const connection = require("../config");

// POST SEND
router.post('/', (req, res) => {
    const formData = req.body;
    // connexion à la base de données, et insertion de l'user
    connection.query('INSERT INTO user SET ?', formData, (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la sauvegarde d'un utilisateur");
      } else {
        res.sendStatus(200);
      }
    });
  });
  
module.exports = router;