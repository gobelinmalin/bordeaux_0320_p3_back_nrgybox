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

// Create user
router.post("/", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const formData = {
    email: req.body.email,
    password: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }; 
  connection.query("INSERT INTO user SET ?", [formData], (err, result) => {
    if (err) {
      res.status(500).send('Erreur lors de l\'insertion d\'un utilisateur');
    } else {
      res.sendStatus(200);
    }
  });
});

//delete one user
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('DELETE FROM user WHERE id= ?', userId, err => {
    if (err) {
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
        jwt.sign({ user }, process.env.DOKKU_SECRET_KEY, (err, token) => {
          if(err){
            res.status(500).send('Token non crée');
          }
          else{
            res.json({ token, idUser: user[0].id, email: user[0].email , lastname: user[0].lastname, firstname: user[0].firstname});
          }
        })
      }
     }
  });
});

router.get("/:id/postal", (req, res) => {
  const idPostal = req.params.id;
  // connection à la base de données, et recuperation resultat
  connection.query('SELECT * FROM postal AS p JOIN user AS u ON p.id = u.postal_id WHERE u.id = ? ', [idPostal], (err, results) => {
    if (err ) {
      res.status(404).json({error: "Utilisateur introuvable"});
    }
    else {
      res.json({data: results.shift() });
    }
  });
});

// Token verify
router.post('/profile', verifyToken, (req,res) => {
  jwt.verify(req.token, process.env.DOKKU_SECRET_KEY, (err, dataUser) => {    //Secret key is environment var > add in .env
    if(err) {
      res.status(401).send('token non valide')    //Use for expiration
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

// PUT /api/USERS/id
router.put('/:id', (req, res) => {
  const idUser = req.params.id;
  const formData = req.body;
  // connect to database and insert user
  connection.query('UPDATE user SET ? WHERE id = ?', [formData, idUser], err => {
    if (err) {
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

