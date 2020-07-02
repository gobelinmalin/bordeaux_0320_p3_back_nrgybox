const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.NODE_ENV_USER,
    pass: process.env.NODE_ENV_PASS,
  }
});

transporter.verify((err, _) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server is ready to take messages');
  }
});
 
// POST SEND
router.post('/', (req, res, next) => {
  const {name, email, comment} = req.body;
    
  let content = `name: ${name}
  \n email: ${email}
  \n comment: ${comment}`;

  let mail = {
    from: name,
    to: 'bengrand.pro@gmail.com',  // Change to email address that you want to receive messages on
    subject: "New Message from NRGYBox's contact page",
    text: content,
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