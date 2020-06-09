const express = require("express");
const router = express.Router();
const connection = require("../config");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

// Create user
router.post("/", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);

  const formData = {
    email: req.body.email,
    password: hash
    // had all info about the user (firstname, lastname etc.)
  };
  
  connection.query("INSERT INTO user SET ?", [formData], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

//Login user - Creation token
 router.post('/login', (req, res) => {
  const formData = {
    email: req.body.email,
    password: req.body.password
  };

  connection.query('SELECT * FROM user WHERE email = ?', [formData.email], (err, user) => {
    if(err){
      res.status(500).send('Erreur mauvais utilisateur'); // no user found with this email
    }
    else{
      const isSamePass = bcrypt.compareSync(formData.password, user[0].password);

      if(!isSamePass){
        res.status(500).send('Mot de passe incorrect');
      }
      else{
        // 'secretKey' will be in .env file => here, process.env.TOKEN_SECRET_KEY
        jwt.sign({ user }, 'secretKey', (err, token) => {
          if(err){
            res.status(500).send('Token non crée');
          }
          else{
            res.json({ token });
          }
        })
      }
    }
  });
});

// Token verify
router.post('/profile', verifyToken, (req,res) => {
  jwt.verify(req.token, 'secretKey', (err, dataUser) => {    //Secret key est une variable d'envoronnement > à ajouter dans .env
    if(err) {
      res.status(401).send('token non valide')    //utilisé pour l'expiration
    } else {
      res.json(dataUser);
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(500).send("votre token n'existe pas");
  }
};

module.exports = router;