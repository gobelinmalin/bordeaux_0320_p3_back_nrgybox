const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../config");

// GET ALL USER
router.get("/", (req, res) => {
  connection.query("SELECT * from user", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
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
// Route to protect
router.post("/profile", verifyToken, (req, res) => {
  // when you want to access send header value for
  // Autorization Bearer {token}
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).send(err);
    } else {
      res.json({
        message: "WELCOME",
        authData
      });
    }
  });
  res.status(403).send("Error connection");
});

// POST API/USERS/
router.post('/', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);

  const formData = {
    email: req.body.email,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    password: hash
  };
  // connexion à la base de données, et insertion de l'user
  connection.query('INSERT INTO user SET ?', formData, (err, results) => {

    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Route to create token
router.post("/login", (req, res) => {
  const formData = {
    email: req.body.email,
    password: req.body.password
  };
  connection.query("SELECT * FROM user WHERE email = ?", [formData.email], (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const isSame = bcrypt.compareSync(formData.password, user[0].password);
      if (!isSame) {
        res.status(500).send("Error Password");
      } else {
        jwt.sign({ user }, "secretkey", (err, token) => {
          // save the token in localstorage
          res.json({
            token
          });
        });
      }
    }
  });
});
// Verify token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  //Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // split
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // forbidden
    res.sendStatus(500);
  }
}

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
  });
});

module.exports = router;
