const express = require("express");
const router = express.Router();
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


module.exports = router;

