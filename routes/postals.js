const express = require("express");
const router = express.Router();
const connection = require("../config");

// GET POSTAL
router.get("/", (req, res) => {
  const idPostal = req.params.id;
  // connection à la base de données, et recuperation resultat
  connection.query('SELECT * FROM postal WHERE id = ?', [idPostal], (err, results) => {
    if (err || results.length === 0) {
      res.status(404).json({error: "Utilisateur introuvable"});
    }
    else {
      res.json({data: results.shift() });
    }
  });
});
module.exports = router;