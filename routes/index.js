const express = require("express");
const users = require("./users");
const lights = require("./lights");
const send = require("./send");
const programs = require('./programs');
const router = express.Router();


router.use("/users", users);
router.use("/programs", programs);
router.use("/lights", lights);
router.use("/send", send);


module.exports = router;
