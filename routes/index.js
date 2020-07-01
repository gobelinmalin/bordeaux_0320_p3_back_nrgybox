const express = require("express");
const users = require("./users");
const lights = require("./lights");
const send = require("./send");
const programs = require('./programs');
const geolocations = require('./geolocations');
const router = express.Router();



router.use("/users", users);
router.use("/programs", programs);
router.use("/lights", lights);
router.use("/send", send);
router.use("/geolocations", geolocations);


module.exports = router;
