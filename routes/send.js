const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
var htmlToText = require('nodemailer-html-to-text').htmlToText;

let transporter = nodemailer.createTransport({
  host: "ssl0.ovh.net",
  port: 587,
  secure: false,
  auth: {
    type: 'OAuth2',
    user: process.env.NODE_ENV_USER, // compte expéditeur
    pass: process.env.NODE_ENV_PASS // mot de passe du compte expéditeur
  },
  tls:{
    ciphers:'SSLv3',
  },
});

transporter.verify((err, _) => {
  if (err) {
    console.log('Erreur lors de la récupération des données');
  } else {
    console.log('Server is ready to take messages');
  }
});
 
// POST SEND
router.post('/', (req, res, next) => {
  const {name, email, comment} = req.body;
    
  let content = `
  <strong>Nom de l'expéditeur :</strong> ${name}
  <br />
  <strong>Adresse email de l'expéditeur :</strong> ${email}
  <br />
  <strong>Sujet :</strong> ${comment}
  <br />`;
  
  transporter.use('compile', htmlToText());

  let mail = {
    from: email,
    to: process.env.NODE_ENV_USER,  // Change to email address that you want to receive messages on
    subject: "Nouveau message depuis le site NrgyBox",
    text: content,
    html: content,
  }

  transporter.sendMail(mail, (err, _) => {
    if(err){
      res.status(404).json({
        status: 'fail'
      })
    }
    else{
      res.status(200).json({
        status: 'success'
      })
    }
  });
});

module.exports = router;